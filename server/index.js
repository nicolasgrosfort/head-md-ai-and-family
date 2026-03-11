const express = require("express");
const cors = require("cors");
const os = require("os");

const hostname = os.hostname();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.json({
    status: "ok",
    time: new Date(),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at:`);
  console.log(`http://${hostname}.local:${PORT}`);
});
