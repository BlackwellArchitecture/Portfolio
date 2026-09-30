export default async function handler(req, res) {
  // Set CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let payload = req.body;

    // Handle stringified body or form url-encoded body
    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        const params = new URLSearchParams(payload);
        if (params.has("data")) {
          payload = JSON.parse(params.get("data"));
        }
      }
    }

    // Ko-fi nests its webhook payload under `data` field
    if (payload && payload.data) {
      if (typeof payload.data === "string") {
        payload = JSON.parse(payload.data);
      } else {
        payload = payload.data;
      }
    }

    if (!payload) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const expectedToken = process.env.KOFI_VERIFICATION_TOKEN;
    if (expectedToken && payload.verification_token !== expectedToken) {
      console.warn("Unauthorized webhook attempt: token mismatch");
      return res.status(401).json({ error: "Unauthorized: invalid verification token" });
    }

    const amount = parseFloat(payload.amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(200).json({ message: "Ignored zero or invalid amount" });
    }

    const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    if (redisUrl && redisToken) {
      // Atomically increment the total funds
      await fetch(`${redisUrl}/incrbyfloat/kofi_funds_total/${amount}`, {
        headers: { Authorization: `Bearer ${redisToken}` }
      });

      // Record latest supporter if available
      const supporterName = payload.from_name || (payload.is_public ? "Generous Supporter" : "Anonymous");
      const currency = payload.currency || "USD";
      const recentText = `${supporterName} (${amount.toFixed(2)} ${currency})`;

      await fetch(`${redisUrl}/set/kofi_recent_supporter`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(recentText)
      });
    }

    return res.status(200).json({ success: true, processedAmount: amount });
  } catch (error) {
    console.error("Error processing Ko-fi webhook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
