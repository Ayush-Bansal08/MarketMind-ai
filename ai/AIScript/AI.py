from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings

# Load env variables
load_dotenv()  ## this will load the .env file from the parent directory of the current file

# Initialize FastAPI
app = FastAPI()

# Initialize embedding model
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
# Request schema
class EmbedRequest(BaseModel):  
    text: str


# 🔥 Embedding Endpoint
@app.post("/embed") ## when request comes at /embed, this function will be called
def generate_embedding(req: EmbedRequest):
    try:
        if not req.text:
            raise HTTPException(status_code=400, detail="Text is required")

        # Generate embedding
        vector = embeddings.embed_query(req.text) ## this will generate embedding for the input text
        if not vector:
            raise HTTPException(status_code=500, detail="Failed to generate embedding")
        return {
            "embedding": vector
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))