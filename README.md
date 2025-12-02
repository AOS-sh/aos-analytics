# AOS Analytics

Companion tool for the AOS Protocol: A simple Node.js server for logging agent usage via the `telemetry_webhook` field.

## Setup
1. Clone: `git clone https://github.com/AOS-sh/aos-analytics.git`
2. Install: `cd aos-analytics && npm install`
3. Run: `node analytics.js`
4. Test: Use curl or Postman to POST to http://localhost:3000/log with header `x-auth-key: your-secret-key-here` and JSON body like `{ "action": "search", "timestamp": "2025-12-02T12:00:00Z" }`.

## Usage
- Set your agent.json `telemetry_webhook` to your hosted URL (e.g., after deploying to Vercel).
- Agents POST anonymized data voluntarily.
- Logs saved to `logs.json` for now—expand to dashboard later.

Link to main protocol: [AOS Protocol](https://github.com/AOS-sh/aos-protocol)