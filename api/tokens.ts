import { createDecartClient } from "@decartai/sdk";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.DECART_API_KEY;

  if (!apiKey) {
    console.warn("⚠ DECART_API_KEY is not set");
    return res.status(500).json({ error: "DECART_API_KEY is not set" });
  }

  try {
    const client = createDecartClient({ apiKey });
    const token = await client.tokens.create();
    res.status(200).json(token);
  } catch (e) {
    console.error("Token error:", e);
    res.status(500).json({ error: "Failed to create token" });
  }
}
