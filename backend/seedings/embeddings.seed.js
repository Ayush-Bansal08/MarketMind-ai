// now in this file i will call the function that would take the comapnies information from the data set and it will generate embeddings and sotre it in the database
// backend/scripts/seed.js

import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Company from "../models/company.model.js";
import companies from "./data.seed.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const run = async () => {
  try {
    // Connect DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    for (const company of companies) {
      const normalizedName = company.name.toLowerCase().trim();

      // Check if already exists
      const exists = await Company.findOne({ name: normalizedName });

      if (exists) {
        console.log(`⏭️ Skipping ${company.name} — already exists`);
        continue;
      }

      // Step 1: Save basic company data
    const saved = await Company.create({
       name: normalizedName,
       description: company.description,
       industry: company.industry,
       tags: company.tags || [],
       embedding: [] // will update later
});

      console.log(`💾 Saved: ${company.name}`);

      try {
        // Step 2: Call Python embedding service
        const response = await axios.post("http://localhost:8000/embed", {
          text: company.description
        });

        const embedding = response.data.embedding;

        // Step 3: Store embedding in MongoDB
        await Company.updateOne(
          { _id: saved._id },
          { embedding }
        );

        console.log(`🧠 Embedded: ${company.name}`);

      } catch (err) {
        console.error(`❌ Embedding failed for ${company.name}: ${err.message}`);
      }

      // Small delay (avoid overload)
      await new Promise((r) => setTimeout(r, 300));
    }

    console.log("🎉 Seeding complete!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

run();