import "dotenv/config";
import express from "express";
import { createDecartClient } from "@decartai/sdk";

const app = express();
const apiKey = process.env.DECART_API_KEY;
if (!apiKey) console.warn("⚠  DECART_API_KEY is not set (copy .env.example to .env)");

// Permanent key stays here. The browser only gets a short-lived client token.
app.post("/api/tokens", async (_req, res) => {
  try {
    const client = createDecartClient({ apiKey });
    res.json(await client.tokens.create());
  } catch (e) {
    console.error("Token error:", e);
    res.status(500).json({ error: "Failed to create token" });
  }
});

app.listen(8787, () => console.log("Token server on http://localhost:8787"));
