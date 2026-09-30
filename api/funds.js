export default async function handler(req, res) {
  // CORS & caching headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  const goalAmount = parseFloat(process.env.GOAL_AMOUNT || "100");
  const currencySymbol = process.env.CURRENCY_SYMBOL || "$";

  let totalFunds = 0;
  let recentSupporter = null;

  if (redisUrl && redisToken) {
    try {
      // Fetch total funds
      const totalRes = await fetch(`${redisUrl}/get/kofi_funds_total`, {
        headers: { Authorization: `Bearer ${redisToken}` }
      });
      if (totalRes.ok) {
        const totalData = await totalRes.json();
        totalFunds = parseFloat(totalData.result) || 0;
      }

      // Fetch latest supporter
      const recentRes = await fetch(`${redisUrl}/get/kofi_recent_supporter`, {
        headers: { Authorization: `Bearer ${redisToken}` }
      });
      if (recentRes.ok) {
        const recentData = await recentRes.json();
        recentSupporter = recentData.result || null;
      }
    } catch (error) {
      console.error("Error reading from Redis:", error);
    }
  }

  return res.status(200).json({
    total: totalFunds,
    goal: goalAmount,
    currencySymbol: currencySymbol,
    recentSupporter: recentSupporter,
    configured: Boolean(redisUrl && redisToken)
  });
}
