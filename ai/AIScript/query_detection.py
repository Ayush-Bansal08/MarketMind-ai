##✔ takes user queries from DB / request
##✔ generates embeddings
##✔ clusters queries
##✔ uses LLM to summarize trends
##✔ returns structured trends

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import numpy as np
import os
import json
import re
from collections import Counter

from langchain_google_genai import ChatGoogleGenerativeAI

app = FastAPI(title="Query Trend Engine")

# 🔥 LLM
gemini_key = os.getenv("GEMINI_API_KEY", "")
llm = None

if gemini_key:
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.3,
        google_api_key=gemini_key,
    )


# -----------------------------
# 📦 INPUT MODEL
# -----------------------------
class QueryData(BaseModel):
    query: str
    embedding: List[float]


class TrendRequest(BaseModel):
    queries: List[QueryData]
    num_clusters: int = 5


# -----------------------------
# 🧠 CLUSTERING
# -----------------------------
from sklearn.cluster import AgglomerativeClustering

def cluster_queries(embeddings, num_clusters=5):
    if not embeddings:
        return {}

    n_samples = len(embeddings)

    if n_samples == 1:
        return {0: [0]}

    X = np.array(embeddings)

    # Use num_clusters as an actual target cluster count.
    # Keep at least 2 clusters for n>=2 and cap to sample count.
    k = max(2, min(int(num_clusters or 2), n_samples))

    clustering = AgglomerativeClustering(
        n_clusters=k
    )

    labels = clustering.fit_predict(X)

    clusters = {}

    for i, label in enumerate(labels):
        clusters.setdefault(int(label), []).append(int(i))

    return clusters


# -----------------------------
# 🧠 CLEAN LLM OUTPUT
# -----------------------------
def clean_json(text):
    text = re.sub(r"```json|```", "", text).strip()
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except:
            return None
    return None


STOP_WORDS = {
    "the", "and", "for", "are", "with", "from", "that", "this", "what", "which",
    "have", "has", "about", "into", "your", "you", "best", "more", "like", "some",
    "companies", "company", "invest", "investment", "to", "in", "of", "on", "a", "an",
    "is", "it", "as", "at", "or", "by", "be", "who", "how", "do", "does", "can",
}


def summarize_without_llm(cluster_queries):
    words = []
    for q in cluster_queries:
        words.extend(re.findall(r"[a-zA-Z]{3,}", q.lower()))

    filtered = [w for w in words if w not in STOP_WORDS]
    counts = Counter(filtered)
    top = [w for w, _ in counts.most_common(3)]

    if not top:
        topic = "general market interest"
    else:
        topic = ", ".join(top)

    return {
        "trend": topic.title(),
        "description": f"Cluster of user interest around: {topic}.",
        "confidence": "medium" if len(cluster_queries) >= 5 else "low"
    }


# -----------------------------
# 🤖 LLM SUMMARIZER
# -----------------------------
def summarize_cluster(cluster_queries):
    if not llm:
        return summarize_without_llm(cluster_queries)

    prompt = f"""
Users asked these queries:
{cluster_queries}

Identify:
- Trend name
- Description
- Confidence (high/medium/low)

Return ONLY JSON:
{{
  "trend": "...",
  "description": "...",
  "confidence": "..."
}}
"""

    try:
        res = llm.invoke(prompt)
        parsed = clean_json(res.content)

        if parsed and parsed.get("trend"):
            return parsed

        return summarize_without_llm(cluster_queries)

    except Exception:
        return summarize_without_llm(cluster_queries)


# -----------------------------
# 🚀 MAIN API
# -----------------------------
@app.post("/detect-query-trends")
def detect_trends(req: TrendRequest):

    if not req.queries:
        return {"status": "no data"}

    queries = [q.query for q in req.queries]
    embeddings = [q.embedding for q in req.queries]

    clusters = cluster_queries(embeddings, req.num_clusters)

    trends = []

    for cluster_id, indices in clusters.items():
        cluster_qs = [queries[i] for i in indices]

        summary = summarize_cluster(cluster_qs)

        trends.append({
             "cluster_id": int(cluster_id),
            "queries": cluster_qs,
            "size": len(cluster_qs),
            "trend": summary
        })

    trends.sort(key=lambda x: x["size"], reverse=True)


    return {
        "status": "success",
        "total_queries": len(queries),
        "trends": trends
    }