import crypto from "crypto";
import fs from "fs";
import path from "path";

// Secret key for signature verification (must match the sender's secret)
const WEBHOOK_SECRET = "your_secret_key"; 

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    // Step 1: Get Signature from Headers
    const signature = req.headers["x-webhook-signature"];
    if (!signature) {
      return res.status(401).json({ success: false, message: "Missing signature" });
    }

    // Step 2: Read Request Body
    const rawBody = JSON.stringify(req.body);

    // Step 3: Verify Signature
    const expectedSignature = crypto.createHmac("sha256", WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(403).json({ success: false, message: "Invalid signature" });
    }

    // Step 4: Process and Store Data
    const { eventType, data } = req.body;
    const dbPath = path.join(process.cwd(), "db.json");

    // Read existing data or create new file if not exists
    let dbContent = { events: [] };
    if (fs.existsSync(dbPath)) {
      dbContent = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    }

    // Append new event
    dbContent.events.push({ eventType, data, receivedAt: new Date().toISOString() });

    // Write to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbContent, null, 2));

    // Step 5: Send Response
    return res.status(200).json({ success: true, message: "Received" });

  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
