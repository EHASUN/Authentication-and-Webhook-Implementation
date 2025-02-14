<!-- for Task 1 -->

Step 6: Testing the API

You can test your API using Postman or cURL.
1. Register a User

POST http://localhost:3000/api/users

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

2. Login and Get a Token

POST http://localhost:3000/api/auth/login

{
  "email": "john@example.com",
  "password": "password123"
}

3. Fetch All Users (Protected Route)

GET http://localhost:3000/api/users

Add Authorization header:

Bearer <your-token-here>


<!-- For Task 2 -->

Step 1: Install Dependencies

Run the following command in your Next.js project:

npm install crypto fs

    crypto: Used for signature verification.
    fs: Used to read and write to db.json.


Step 2: Sending a Test Webhook Request

To test the webhook, you can use cURL or Postman.
1. Generate a Test Signature

To send a valid request, generate a HMAC-SHA256 signature.

const crypto = require("crypto");

const secret = "your_secret_key"; 
const body = JSON.stringify({ eventType: "user_created", data: { id: 1, name: "John Doe" } });

const signature = crypto.createHmac("sha256", secret).update(body).digest("hex");

console.log(signature);

Copy the generated signature and use it in the next step.
2. Send a Test Webhook Request

Use cURL:

curl -X POST http://localhost:3000/api/webhook \
     -H "Content-Type: application/json" \
     -H "x-webhook-signature: your_generated_signature" \
     -d '{"eventType": "user_created", "data": {"id": 1, "name": "John Doe"}}'

Or use Postman:

    Method: POST
    URL: http://localhost:3000/api/webhook
    Headers:
        Content-Type: application/json
        x-webhook-signature: your_generated_signature
    Body (raw, JSON):

    {
      "eventType": "user_created",
      "data": {
        "id": 1,
        "name": "John Doe"
      }
    }

Step 3: Verify Stored Data

After sending the request, check db.json in your project root. It should look like:

{
  "events": [
    {
      "eventType": "user_created",
      "data": {
        "id": 1,
        "name": "John Doe"
      },
      "receivedAt": "2025-02-14T12:34:56.789Z"
    }
  ]
}

Conclusion

✅ Webhook endpoint created (/api/webhook).
✅ Signature verification added (HMAC-SHA256).
✅ Incoming data stored in db.json.
✅ Proper responses sent back.