// One-time: connect the organiser Google account (e.g. reachus@drisyon.com) and print a refresh token.
//
//   1. Put GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local (OAuth client of type "Web application"
//      with redirect URI http://localhost:53682/callback — see README "Google Calendar").
//   2. node scripts/google-auth.mjs
//   3. Sign in with the organiser account, approve, then copy GOOGLE_REFRESH_TOKEN into your env.
import http from "node:http";
import { readFileSync, existsSync } from "node:fs";

for (const f of [".env.local", ".env"]) {
  if (!existsSync(f)) continue;
  for (const line of readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const { GOOGLE_CLIENT_ID: id, GOOGLE_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) {
  console.error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local first.");
  process.exit(1);
}

const PORT = 53682;
const redirect = `http://localhost:${PORT}/callback`;
const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
auth.search = new URLSearchParams({
  client_id: id,
  redirect_uri: redirect,
  response_type: "code",
  scope: "https://www.googleapis.com/auth/calendar",
  access_type: "offline",
  prompt: "consent",
}).toString();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, redirect);
  if (url.pathname !== "/callback") return res.end();
  const code = url.searchParams.get("code");
  if (!code) {
    res.end("No code received: " + (url.searchParams.get("error") || "unknown error"));
    return server.close();
  }
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: id, client_secret: secret, redirect_uri: redirect, grant_type: "authorization_code" }),
  });
  const data = await r.json();
  if (!data.refresh_token) {
    res.end("Google did not return a refresh token. Check the terminal.");
    console.error(data);
  } else {
    res.end("Connected. You can close this tab and return to the terminal.");
    console.log("\nAdd this to your environment variables (keep it secret):\n");
    console.log(`GOOGLE_REFRESH_TOKEN=${data.refresh_token}\n`);
  }
  server.close();
});

server.listen(PORT, () => {
  console.log("Open this URL and sign in with the account whose calendar should receive bookings:\n");
  console.log(auth.toString() + "\n");
});
