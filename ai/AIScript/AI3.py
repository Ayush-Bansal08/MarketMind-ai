from fastapi import FastAPI, HTTPException
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from pydantic import BaseModel
import json
import re
import os

app = FastAPI()

load_dotenv()

# 🔑 Load API key
gemini_key = "AIzaSyAKhACWpCh-hmbCFjQ62r2COq77F5kXNG0"

_llm = None
_llm_error = None

try:
    if gemini_key:
        _llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.2,
            google_api_key=gemini_key,
        )
    else:
        _llm_error = "GEMINI_API_KEY not set"
except Exception as exc:
    _llm_error = str(exc)


# 📦 Request schema
class ExtractRequest(BaseModel):
    text: str


# 🧹 Clean JSON safely
def clean_json_response(text: str):
    try:
        text = re.sub(r"```json|```", "", text).strip()
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            parsed = json.loads(match.group())

            # Normalize output keys so backend can safely consume it.
            industry = parsed.get("industry") or "unknown"
            tags = parsed.get("tags") or parsed.get("tag") or ["general"]

            if isinstance(tags, str):
                tags = [t.strip() for t in tags.split(",") if t.strip()]

            if not isinstance(tags, list) or not tags:
                tags = ["general"]

            tags = [str(t).strip().lower() for t in tags if str(t).strip()][:5]
            if not tags:
                tags = ["general"]

            return {
                "industry": str(industry).strip().lower() or "unknown",
                "tag": tags,
                "tags": tags,
            }
        return None
    except Exception:
        return None


# 🤖 Generate text
def _generate_ai_text(prompt: str) -> str:
    if not _llm:
        return ""

    try:
        response = _llm.invoke(prompt)
        return response.content or ""
    except Exception as exc:
        # Avoid failing the whole API on quota/rate-limit/provider outages.
        print("⚠️ Gemini extract failed, using fallback:", str(exc))
        return ""


# 🚀 MAIN API
@app.post("/extract")
def extract_info(req: ExtractRequest):
    try:
        if not req.text:
            raise HTTPException(status_code=400, detail="Text is required")

        prompt = f"""
You are a strict JSON extractor.

Extract ONLY:
- industry (short phrase)
- tags (3-5 relevant keywords)

Rules:
- Return ONLY valid JSON
- No explanation
- No markdown
- Keep industry very short (1-4 words)
- Return lowercase values

Format:
{{
  "industry": "string",
    "tags": ["string", "string", "string"]
}}

Text:
{req.text}
"""

        raw_output = _generate_ai_text(prompt)

        parsed = clean_json_response(raw_output)

        # ✅ fallback (safe)
        if not parsed:
            return {
                "industry": "unknown",
                "tag": ["general"],
                "tags": ["general"],
            }

        return parsed

    except Exception as e:
        # Final guardrail: always return stable shape for backend pipeline.
        print("⚠️ /extract unexpected error, using fallback:", str(e))
        return {
            "industry": "unknown",
            "tag": ["general"],
            "tags": ["general"],
        }