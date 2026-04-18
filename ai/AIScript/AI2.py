import math
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings
from pydantic import BaseModel, Field

load_dotenv()

app = FastAPI(title="MarketMindAI — Investor Engine")

# -----------------------------
# 📦 MODELS
# -----------------------------
class CompanyData(BaseModel):
    name: str
    description: str = ""
    embedding: list[float] = Field(default_factory=list)
    industry: str | None = None
    tags: list[str] = Field(default_factory=list)
    market_cap: str | None = None
    geography: str | None = None


class QueryRequest(BaseModel):
    companyName: str
    query: str
    company: CompanyData | None = None
    companies: list[CompanyData] = Field(default_factory=list)
    top_k: int = 5


# -----------------------------
# 💀 STRONG INDUSTRY CLUSTERS
# -----------------------------
INDUSTRY_CLUSTERS = {
    "it_services": ["it services", "technology consulting", "software services"],
    "banking": ["banking", "financial services"],
    "fintech": ["fintech", "payments"],
    "ecommerce": ["ecommerce", "online retail"],
    "food_tech": ["food delivery", "foodtech"],
    "big_tech": ["technology", "search", "cloud", "ai"],
}

def norm(x):
    return (x or "").strip().lower()

def get_cluster(industry, tags):
    tokens = [norm(industry)] + [norm(t) for t in tags]
    for key, values in INDUSTRY_CLUSTERS.items():
        for token in tokens:
            for v in values:
                if v in token or token in v:
                    return key
    return None

def same_cluster(a, b):
    if not a or not b:
        return False  # 💀 STRICT
    return a == b


# -----------------------------
# 🧮 SIMILARITY
# -----------------------------
def cosine(a, b):
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x*y for x,y in zip(a,b))
    na = math.sqrt(sum(x*x for x in a))
    nb = math.sqrt(sum(x*x for x in b))
    return dot/(na*nb) if na and nb else 0.0


# -----------------------------
# 🔥 SCORING
# -----------------------------
def score(query_emb, target, candidate):

    if not candidate.embedding:
        return None

    t_cluster = get_cluster(target.industry, target.tags)
    c_cluster = get_cluster(candidate.industry, candidate.tags)

    # 💀 HARD FILTER
   # 💀 STRICT PEER FILTER
    if t_cluster != c_cluster:
     return None

    q = cosine(query_emb, candidate.embedding)
    c = cosine(target.embedding, candidate.embedding)

    industry_score = 1 if norm(target.industry) == norm(candidate.industry) else 0

    score = (
        0.4 * q +
        0.3 * c +
        0.3 * industry_score   # 🔥 BOOSTED
    )

    return round(score, 4)


# -----------------------------
# 🔍 FIND MATCHES
# -----------------------------
def find_matches(query_emb, target, pool, top_k):

    results = []

    for c in pool:
        if norm(c.name) == norm(target.name):
            continue

        s = score(query_emb, target, c)
        if s is None or s < 0.2:
            continue

        results.append({
            "name": c.name,
            "industry": c.industry,
            "similarity_score": s
        })

    results.sort(key=lambda x: x["similarity_score"], reverse=True)
    return results[:top_k]


# -----------------------------
# 🤖 LLM
# -----------------------------
embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

_llm = None
if os.getenv("GEMINI_API_KEY"):
    _llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.4,
        google_api_key=os.getenv("GEMINI_API_KEY"),
    )


def generate_ai(prompt, fallback):
    if not _llm:
        return fallback
    try:
        res = _llm.invoke(prompt)
        text = (res.content or "").strip()
        if len(text) < 40:
            return fallback
        return text
    except:
        return fallback


# -----------------------------
# 🧠 SHORT INVESTOR PROMPT
# -----------------------------
def build_prompt(target, matches, query):

    names = ", ".join([m["name"] for m in matches]) if matches else "No strong matches"

    return f"""
You are a sharp investment analyst.

Target: {target.name} ({target.industry})
Query: {query}
Peers: {names}

Answer in under 250 words:

- Why they are comparable
- Key differences
- Investment insight
- Recommendation

Be direct and opinionated. No fluff.
Focus on comparable business models, not adjacent enablers.
"""


# -----------------------------
# 🚀 API
# -----------------------------
@app.post("/query")
def query_handler(payload: QueryRequest):

    if not payload.company:
        raise HTTPException(status_code=400, detail="No company")

    target = payload.company

    if not target.embedding:
        raise HTTPException(status_code=400, detail="Missing embedding")

    query_emb = embedding_model.embed_query(payload.query)

    matches = find_matches(query_emb, target, payload.companies, payload.top_k)
    matches = [
    m for m in matches
    if m["similarity_score"] > 0.3
    ]

    prompt = build_prompt(target, matches, payload.query)

    fallback = f"{target.name} is comparable to {', '.join([m['name'] for m in matches])}"

    ai = generate_ai(prompt, fallback)

    return {
        "status": "success",
        "target": target.name,
        "cluster": get_cluster(target.industry, target.tags),
        "matches": matches,
        "ai_response": ai
    }