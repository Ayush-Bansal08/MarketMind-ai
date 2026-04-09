AI Market Intelligence & Comparable Discovery System – Workflow

1. User Interaction

* User enters a company name in the frontend (React UI)
* Frontend sends request to backend API

2. Backend Request Handling

* Backend (Node.js/Express) receives the company name
* Checks if company exists in database (MongoDB)

3. Data Retrieval

* If company exists:

  * Fetch stored data (name, description, embedding)
* If company does NOT exist:

  * Fetch data from external sources (news APIs, GitHub, startup APIs)
  * Clean and structure the data

4. Data Processing

* Normalize and preprocess company description
* Prepare text for embedding generation

5. Embedding Generation (NLP Step)

* Convert company description into vector using Hugging Face/OpenAI embeddings

6. Data Storage

* Store company data in MongoDB (metadata + description)
* Store embedding in FAISS (vector database)

7. Semantic Search (Core Logic)

* Convert input company into embedding
* Use FAISS to compare with all stored embeddings
* Retrieve top similar companies (comparables)

8. Fetch Comparable Details

* Retrieve metadata of similar companies from MongoDB

9. Insight Generation (LLM Layer)

* Send company + comparables to LLM
* Generate:

  * Explanation of similarity
  * Industry insights
  * Market trends

10. Trend Detection (Optional Enhancement)

* Analyze clusters of similar companies
* Identify emerging sectors based on frequency/patterns

11. Response Generation

* Backend compiles final response:

  * Input company
  * Similar companies
  * Explanation
  * Trends

12. Frontend Display

* Display results in UI:

  * Comparable companies
  * Insights
  * Trend summary

13. Real-Time Ingestion (On-Demand)

* If new company is searched:

  * Automatically processed and added to MongoDB + FAISS

14. Automated Updates (Background Jobs)

* Scheduled cron jobs periodically:

  * Fetch new companies from APIs
  * Process and generate embeddings
  * Update MongoDB and FAISS
  * Refresh trends

Final Outcome:

* System continuously learns new data
* Provides real-time comparable company analysis
* Generates automated market intelligence reports
