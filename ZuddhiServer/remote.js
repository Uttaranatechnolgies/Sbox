const fs = require("fs");
const https = require("https");
const app = require("./src/app.js");

// Certificate
const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/api.sbox.uttarana.com/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/api.sbox.uttarana.com/cert.pem",
  "utf8"
);
const ca = fs.readFileSync(
  "/etc/letsencrypt/live/api.sbox.uttarana.com/chain.pem",
  "utf8"
);

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

app.use((req, res) => {
  res.send(
    "Hi, This is https://api.sbox.uttarana.com and I can be reached both on http and https!"
  );
});

// Starting both http & https servers
//const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

//httpServer.listen(80, () => {
//console.log("HTTP Server running on port 80");
//});

httpsServer.listen(443, () => {
  console.log("HTTPS Server running on port 443");
});
