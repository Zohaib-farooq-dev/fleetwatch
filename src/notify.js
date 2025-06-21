const DISPATCH_URL = process.env.DISPATCH_WEBHOOK_URL;

async function pushAlert(alert) {
  if (!DISPATCH_URL) return false;
  const r = await fetch(DISPATCH_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(alert) });
  return r.ok;
}

module.exports = { pushAlert };
