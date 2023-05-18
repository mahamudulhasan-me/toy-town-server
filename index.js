const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4040;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Toy Town Still Running");
});

app.listen(port, () => {
  console.log(`Toy Town Listening on ${port}`);
});
