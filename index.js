const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 4040;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Toy Town Still Running");
});

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.beeiwwt.mongodb.net/?retryWrites=true&w=majority`;
// DB_NAME = toyTown
// DB_PASSWORD = RNCNztz4CkGJY0gJ
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // create database
    const toyTownDB = client.db("toyTownDB");
    // create toy collection
    const toyCollection = toyTownDB.collection("toys");

    // post toys on db
    app.post("/toys", async (req, res) => {
      const toyDetails = req.body;
      //   const result = await toyCollection.insertOne();
      console.log(toyDetails);
      res.send(toyDetails);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Toy Town Listening on ${port}`);
});
