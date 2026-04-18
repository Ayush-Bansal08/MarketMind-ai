import axios from "axios";
import companyModel from "../models/company.model.js";
import Query from "../models/query.model.js";
import Trend from "../models/trend.model.js";
import dotenv from "dotenv";
dotenv.config();
import { inngest } from "../inngest/client.js";

const AI_QUERY_URL ="http://localhost:5001/query";
const AI_EMBED_URL ="http://localhost:5000/embed";
const AI_EXTRACT_URL = "http://localhost:5002/extract";


// const NEWS_API_KEY = process.env.NEWS_API_KEY;

// export const fetchCompanyNews = async (companyName) => {
//     try {
//         const url = `https://newsapi.org/v2/everything?q=${companyName}&pageSize=3&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;

//         const res = await axios.get(url);

//         if (!res.data.articles || res.data.articles.length === 0) {
//             return "";
//         }

//         // take top 3 news headlines + descriptions
//         const newsText = res.data.articles.map(article => {
//            const title = article.title || "";
//            const desc = article.description || "";
//            return `${title}. ${desc}`;
// }).join(" ");

//         return newsText;

//     } catch (error) {
//         console.error("❌ News fetch failed:", error.message);
//         return "";
//     }
// };


export const askQuery = async (req, res) => {
    const requestId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    console.log(`\n========== [askQuery:${requestId}] New Request (pid=${process.pid}) ==========`);
    console.log("[STEP 1] Raw payload received", {
        hasCompanyName: !!req.body?.companyName,
        hasQuery: !!req.body?.query,
        bodyKeys: Object.keys(req.body || {}),
    });

    const { companyName, query } = req.body;

    if (!companyName || !query) {
        console.log("[STEP 1A] Validation failed: companyName/query missing");
        return res.status(400).json({
            error: "companyName and query are required",
        });
    }

    try {
        const normalizedName = companyName.toLowerCase().trim();
        console.log("[STEP 2] Inputs normalized", {
            normalizedName,
            queryLength: query.length,
        });

        let company = await companyModel
            .findOne({ name: normalizedName })
            .select("name description embedding industry tag")
            .lean();

        console.log("[STEP 3] Company lookup complete", {
            foundInDb: !!company,
            companyName: company?.name || null,
            hasEmbedding: !!company?.embedding?.length,
        });

        if (!company) {
            console.log("🔎 Company not found, fetching from Wikipedia...");
            console.log("[STEP 4] Calling Wikipedia summary API", {
                wikipediaTarget: normalizedName,
            });
            // const newsText = await fetchCompanyNews(normalizedName);

            let description = "";
            try {
                const wikiRes = await axios.get(
                    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(normalizedName)}`,
                    {
                        timeout: 12000,
                        headers: {
                            "User-Agent": "MarketMind/1.0 (query-service)",
                            Accept: "application/json",
                        },
                    }
                );

                description = wikiRes.data?.extract || "";
                // If this is a disambiguation page or too short, try wiki search then summary by best title.
                if (!description || description.length < 60 || /may refer to/i.test(description)) {
                    const searchRes = await axios.get(
                        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(normalizedName)}&format=json&srlimit=1`,
                        {
                            timeout: 12000,
                            headers: {
                                "User-Agent": "MarketMind/1.0 (query-service)",
                                Accept: "application/json",
                            },
                        }
                    );

                    const bestTitle = searchRes.data?.query?.search?.[0]?.title;
                    if (bestTitle) {
                        const bestSummaryRes = await axios.get(
                            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestTitle)}`,
                            {
                                timeout: 12000,
                                headers: {
                                    "User-Agent": "MarketMind/1.0 (query-service)",
                                    Accept: "application/json",
                                },
                            }
                        );
                        description = bestSummaryRes.data?.extract || description;
                    }
                }
                // description = `Wikipedia:${wikidescription}, Latest news: ${newsText}`;
            } catch (wikiError) {
                console.log("⚠️ Wikipedia fetch failed, using fallback description");
                console.log("[STEP 4A] Wikipedia error", {
                    message: wikiError.message,
                    status: wikiError.response?.status || null,
                });
                description = `${normalizedName} is a company. ${query}`;
            }

            console.log("[STEP 5] Wikipedia response received", {
                hasDescription: !!description,
                descriptionLength: description?.length || 0,
            });

            if (!description) {
                console.log("[STEP 5A] Wikipedia did not provide description");
                description = `${normalizedName} is a company. ${query}`;
                console.log("[STEP 5B] Applied fallback description because external API returned empty text");
            }

            let industry = "unknown";
            let tag = ["general"];

            try {
                console.log("[STEP 6] Calling AI extract endpoint", {
                    url: AI_EXTRACT_URL,
                });
                const extractRes = await axios.post(AI_EXTRACT_URL, {
                    text: description,
                });

                industry = extractRes.data?.industry || "unknown";
                tag = extractRes.data?.tags || extractRes.data?.tag || ["general"];
                console.log("[STEP 6A] Extraction complete", {
                    industry,
                    rawExtractKeys: Object.keys(extractRes.data || {}),
                    tagCount: Array.isArray(tag) ? tag.length : 0,
                });
            } catch (err) {
                console.log("⚠️ Extraction failed, using fallback");
                console.log("[STEP 6B] Extraction error", {
                    message: err.message,
                });
                 industry = "unknown";
                 tag = ["general"];
            
            }

            console.log("[STEP 7] Calling AI embed endpoint", {
                url: AI_EMBED_URL,
            });
            const embedRes = await axios.post(AI_EMBED_URL, {
                text: description,
            });

            const embedding = embedRes.data.embedding;
            console.log("[STEP 7A] Embedding generated", {
                embeddingLength: embedding?.length || 0,
            });

            if (!embedding?.length) {
                console.log("[STEP 7B] Embedding generation failed (empty vector)");
                throw new Error("Embedding generation failed");
            }

            console.log("[STEP 8] Re-checking DB before insert to avoid duplicates");
            const existing = await companyModel.findOne({
                name: normalizedName,
            });

            if (existing) {
                company = existing;
                console.log("[STEP 8A] Company appeared in DB during processing", {
                    companyName: company.name,
                });
            } else {
                console.log("[STEP 8B] Creating new company in DB");
                company = await companyModel.create({
                    name: normalizedName,
                    description,
                    industry,
                    tag,
                    embedding,
                });
            }

            console.log("✅ Company stored:", company.name);
        }

        console.log("[STEP 9] Fetching all companies with embeddings for similarity search");
        const companies = await companyModel
            .find({ embedding: { $exists: true, $ne: [] } })
            .select("name description embedding industry tag")
            .lean();

        console.log("[STEP 9A] Candidate companies fetched", {
            candidateCount: companies.length,
        });

        console.log("[STEP 10] Sending payload to AI query endpoint", {
            url: AI_QUERY_URL,
            companyName: normalizedName,
            hasCompanyObject: !!company,
        });

        const response = await axios.post(AI_QUERY_URL, {
            companyName: normalizedName,
            query,
            company,
            companies,
        });

        console.log("[STEP 11] Saving query history in Query collection");
        // create vector embeddings for the query and store in the database along with the query and the response from the ai model
        const queryEmbedding = await axios.post(AI_EMBED_URL, {
            text: query,
        });
        console.log("[STEP 11A] Query embedding generated", {
            embeddingLength: queryEmbedding.data.embedding?.length || 0,
        }); 
        
        // added the embeddings of the query in the database along with the query and the response from the ai model
        await Query.create({
            companyName: normalizedName,
            queryData: query,
            UserId: req.user?.id || null,
            aiResponse: response.data?.ai_response?.answer || "",
            status: "success",
            embeddings: queryEmbedding.data.embedding || [],
        });

        console.log("[STEP 10A] AI response received", {
            status: response.status,
            hasData: !!response.data,
            responseKeys: Object.keys(response.data || {}),
        });
        console.log(`========== [askQuery:${requestId}] Request Completed ==========`);

        return res.status(200).json(response.data);

    } catch (error) {
        console.error("❌ Error:", error.message);
        console.error("[askQuery] Failure context", {
            requestId,
            aiQueryUrl: AI_QUERY_URL,
            stack: error.stack,
        });

        try {
            await Query.create({
                companyName: req.body?.companyName?.toLowerCase?.().trim?.() || "",
                queryData: req.body?.query || "",
                UserId: req.user?.id || null,
                aiResponse: "",
                status: "failed",
                embeddings: [],
            });
            console.log("[STEP 11A] Failed query history saved");
        } catch (historyError) {
            console.log("[STEP 11B] Failed to save query history", {
                message: historyError.message,
            });
        }

        return res.status(500).json({
            error: "Failed to process query",
            details: error.message,
        });
    }
}

// this is optional to trigger trend detection manually from the frontend, we will also have a scheduled trigger for this in inngest
export const getQueryTrend = async(req,res)=>{
    try{
    await inngest.send({
        name: "query/trend-detection",
})
    console.log("✅ Trend detection triggered via Inngest");
    res.status(200).json({message: "Trend detection triggered"});
    }
    catch(error){
        console.error("❌ Trend detection trigger failed", error.message);
        return res.status(500).json({error: "Failed to trigger trend detection"});
    }
}

export const getTrendsJustification = async (req, res) => {
    try {
        const toArray = (value) => (Array.isArray(value) ? value : []);
        const normalizeText = (value) => String(value || "").toLowerCase().trim();

        const formatTrendForResponse = (item, status) => {
            const uniqueQueries = [...new Set(toArray(item?.queries).filter(Boolean))];
            const queriesCount = Number.isFinite(item?.size)
                ? item.size
                : uniqueQueries.length;

            const simpleDescription = item?.trendDescription
                || (status === "gone"
                    ? "This topic was active before but not in the latest snapshot."
                    : "People are asking similar questions in this topic.");

            return {
                topic: item?.trendName || "General Topic",
                status,
                confidence: item?.trendConfidence || "unknown",
                queriesCount,
                whatItMeans: simpleDescription,
                exampleQuestions: uniqueQueries.slice(0, 3),
            };
        };

        const snapshots = await Trend.find()
            .sort({ createdAt: -1 })
            .limit(2)
            .lean();

        const latest = snapshots[0] || null;
        const previous = snapshots[1] || null;

        if (!latest) {
            return res.status(200).json({
                message: "No trend data found",
                snapshot: null,
                Rising: [],
                Stable: [],
                Falling: [],
            });
        }

        if (!previous) {
            return res.status(200).json({
                message: "Not enough data to compare trends",
                snapshot: {
                    latest: latest.createdAt,
                    previous: null,
                    totalLatest: Array.isArray(latest.trends) ? latest.trends.length : 0,
                    totalPrevious: 0,
                },
                Rising: [],
                Stable: [],
                Falling: [],
            });
        }

        const normalizeQueries = (queries) => {
            const arr = toArray(queries)
                .map((q) => normalizeText(q))
                .filter(Boolean);

            // Preserve stable identity while avoiding duplicate-noise.
            return [...new Set(arr)].sort();
        };

        const queryFingerprint = (queries) => normalizeQueries(queries).join("||");

        const jaccardSimilarity = (a, b) => {
            const setA = new Set(a);
            const setB = new Set(b);

            if (!setA.size && !setB.size) return 1;
            if (!setA.size || !setB.size) return 0;

            let intersection = 0;
            for (const item of setA) {
                if (setB.has(item)) intersection += 1;
            }

            const union = setA.size + setB.size - intersection;
            return union ? intersection / union : 0;
        };

        const normalizeTrendItem = (item) => {
            const trendField = item?.trend;
            const trendName = typeof trendField === "string"
                ? trendField
                : trendField?.trend || "unknown";

            const trendDescription = typeof trendField === "object"
                ? trendField?.description || ""
                : "";

            const trendConfidence = typeof trendField === "object"
                ? trendField?.confidence || "unknown"
                : "unknown";

            const normalizedQueries = normalizeQueries(item?.queries);
            const trendKey = queryFingerprint(normalizedQueries);

            return {
                ...item,
                trendName,
                trendDescription,
                trendConfidence,
                normalizedQueries,
                trendKey,
            };
        };

        const latestTrends = toArray(latest.trends).map(normalizeTrendItem);
        const prevTrends = toArray(previous.trends).map(normalizeTrendItem);

        const rising = [];
        const stable = [];
        const falling = [];

        const matchedPrevIndexes = new Set();

        for (const latestItem of latestTrends) {
            let matchedIndex = prevTrends.findIndex((p) => p.trendKey === latestItem.trendKey);

            // Fallback for minor query-set drift between snapshots.
            if (matchedIndex === -1) {
                let bestScore = 0;
                let bestIndex = -1;

                prevTrends.forEach((prevItem, idx) => {
                    if (matchedPrevIndexes.has(idx)) return;
                    const score = jaccardSimilarity(latestItem.normalizedQueries, prevItem.normalizedQueries);
                    if (score > bestScore) {
                        bestScore = score;
                        bestIndex = idx;
                    }
                });

                if (bestScore >= 0.6) {
                    matchedIndex = bestIndex;
                }
            }

            if (matchedIndex !== -1) {
                matchedPrevIndexes.add(matchedIndex);
                stable.push(formatTrendForResponse(latestItem, "stable"));
            } else {
                rising.push(formatTrendForResponse(latestItem, "new"));
            }
        }

        prevTrends.forEach((prevItem, idx) => {
            if (!matchedPrevIndexes.has(idx)) {
                falling.push(formatTrendForResponse(prevItem, "gone"));
            }
        });

        return res.status(200).json({
            summary: {
                latest: latest.createdAt,
                previous: previous.createdAt,
                totalTopicsNow: latestTrends.length,
                totalTopicsBefore: prevTrends.length,
                newTopics: rising.length,
                stableTopics: stable.length,
                droppedTopics: falling.length,
            },
            Rising: rising,
            Stable: stable,
            Falling: falling,
        });

    } catch (error) {
        console.error("❌ Fetching trends failed", {
            message: error.message,
            stack: error.stack,
        });
        return res.status(500).json({ error: "Failed to fetch trends" });
    }
};



