import { inngest } from "../client.js";
import axios from "axios";
import Query from "../../models/query.model.js";
import Trend from "../../models/trend.model.js";

const TREND_DETECTION_URL = "http://127.0.0.1:5003/detect-query-trends";

const runTrendDetection = async ({ step }) => {
  const runId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  try {
    console.log(`[detectTrends:${runId}] Started`);

    // ── STEP 1: Fetch queries ──────────────────────────────────────────────
    const queries = await step.run("fetch-queries", async () => {
      return await Query.find()
        .select("queryData embeddings")
        .lean();
    });

    console.log(`[detectTrends:${runId}] Fetched ${queries.length} queries`);

    if (!queries.length) {
      return { message: "No queries found" };
    }

    // ── STEP 2: Format payload ─────────────────────────────────────────────
    const formatted = queries
      .filter(q => Array.isArray(q.embeddings) && q.embeddings.length > 0)
      .map(q => ({
        query: q.queryData,
        embedding: q.embeddings,
      }));

    console.log(`[detectTrends:${runId}] Formatted: ${formatted.length} / Dropped: ${queries.length - formatted.length}`);

    if (!formatted.length) {
      return { message: "No queries with embeddings" };
    }

    // ── STEP 3: Call Python trend engine ───────────────────────────────────
    // ✅ FIX: return res.data (plain object) NOT the full axios response
    const trendsData = await step.run("detect-trends", async () => {
      console.log(`[detectTrends:${runId}] Calling Python API at ${TREND_DETECTION_URL}`);
      const res = await axios.post(
        TREND_DETECTION_URL,
        { queries: formatted, num_clusters: 5 },
        { timeout: 30000 }
      );
      // Only return the plain data — axios response objects are NOT serializable
      return res.data;
    });

    console.log(`[detectTrends:${runId}] Python response:`, {
      keys: Object.keys(trendsData || {}),
    });

    const trends = trendsData?.trends || [];

    console.log(`[detectTrends:${runId}] Trend count: ${trends.length}`);

    if (!trends.length) {
      console.warn(`[detectTrends:${runId}] Python returned 0 trends — check your Python service`);
      return { message: "Python returned no trends", totalQueries: formatted.length };
    }

    // ── STEP 4: Save to DB ─────────────────────────────────────────────────
    await step.run("save-trends", async () => {
      await Trend.create({
        trends,
        totalQueries: formatted.length,
        createdAt: new Date(),
      });
      console.log(`[detectTrends:${runId}] Saved ${trends.length} trends to DB`);
    });

    const result = {
      success: true,
      totalQueries: formatted.length,
      trendCount: trends.length,
    };

    console.log(`[detectTrends:${runId}] Completed`, result);
    return result;

  } catch (error) {
    console.error(`[detectTrends:${runId}] Failed`, {
      message: error.message,
      responseStatus: error.response?.status,
      responseData: error.response?.data,
    });
    throw error; // Inngest will retry automatically
  }
};

// ✅ FIX: triggers must be an ARRAY
export const detectTrends = inngest.createFunction(
  {
    id: "detect-query-trends-cron",
    triggers: [{ cron: "0 6 * * *" }],  // ← was object, now array
  },
  runTrendDetection
);

export const detectTrendsOnEvent = inngest.createFunction(
  {
    id: "detect-query-trends-event",
    triggers: [{ event: "query/trend-detection" }],  // ← was object, now array
  },
  runTrendDetection
);