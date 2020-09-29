const app = require("./src/app.js");
const port = process.env.PORT || 4000;
let hostIp = "localhost";
hostIp = "192.168.0.151";

app.use((req, res) => {
  res.send(
    `Hi, This is https://${hostIp}:${port} and I can be reached both on http and https!`
  );
});

// Server
app.listen(port, hostIp, () => {
  console.log(`Listening on: http://${hostIp}:${port}`);
});
