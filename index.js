/**
 * Project Name: Toy Town
 * Author: Mahamudul Hasan
 *  Date: 21 May 2023
 * ----------------------------------------------------------------
 * Description: This is a toy car website! Explore a world of thrilling fun and imagination with our wide range of toy cars. From remote-controlled speedsters to miniature models, we have something for every young car enthusiast. Browse our collection, discover the latest trends, and experience the joy of playtime with our high-quality toy cars. Start your adventure today!
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 4040;

// middleware
app.use(cors());
app.use(express.json());

// server starting index
app.get("/", (req, res) => {
  res.send("Toy Town Still Running");
});

// mongodb uri
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.beeiwwt.mongodb.net/?retryWrites=true&w=majority`;

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
    client.connect();
    //---------------------------------------------------
    // create database
    const toyTownDB = client.db("toyTownDB");
    // create toy collection
    const toyCollection = toyTownDB.collection("toys");
    const blogCollection = toyTownDB.collection("blogs");
    //---------------------------------------------------
    // create index
    //---------------------------------------------------
    const indexKeys = { name: 1, category: 1 };
    const indexOptions = { name: "nameAndCategory" };
    toyCollection.createIndex(indexKeys, indexOptions);
    //---------------------------------------------------

    // post toys on db
    app.post("/toys", async (req, res) => {
      const toyDetails = req.body;
      toyDetails.price = parseFloat(toyDetails.price);
      const result = await toyCollection.insertOne(toyDetails);
      console.log(toyDetails);
      res.send(result);
    });

    // get all toys from db
    app.get("/toys", async (req, res) => {
      const allToys = await toyCollection.find().limit(20).toArray();
      res.send(allToys);
    });

    // get all toys by search value
    app.get("/toys/:searchValue", async (req, res) => {
      const searchValue = req?.params?.searchValue;
      const query = {
        $or: [
          { name: { $regex: searchValue, $options: "i" } },
          { category: { $regex: searchValue, $options: "i" } },
        ],
      };
      const toyBySearchValues = await toyCollection.find(query).toArray();
      res.send(toyBySearchValues);
    });
    // get single toy by id
    app.get("/toy-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const toyDetails = await toyCollection.findOne(query);
      res.send(toyDetails);
    });

    // get all toys by seller
    app.get("/my-toys/:uid", async (req, res) => {
      const uid = req.params?.uid;
      const sortby = req.query.sortBy;
      const query = { sellerUid: uid };
      if (sortby === "ascending") {
        return res.send(
          await toyCollection.find(query).sort({ price: 1 }).toArray()
        );
      } else if (sortby === "descending") {
        return res.send(
          await toyCollection.find(query).sort({ price: -1 }).toArray()
        );
      }
      const toyBySeller = await toyCollection.find(query).toArray();
      res.send(toyBySeller);
    });

    // get data by category
    app.get("/categories/:category", async (req, res) => {
      const category = req.params?.category;
      const query = { category: category };
      const toyByCategory = await toyCollection.find(query).limit(3).toArray();
      res.send(toyByCategory);
    });

    // ==================================================
    // update toy info
    app.patch("/update-toy-details/:toyId", async (req, res) => {
      const toyId = req.params?.toyId;
      const updatedInfo = req.body;
      const filter = { _id: new ObjectId(toyId) };
      const options = { upsert: true };
      const updatedToy = {
        $set: {
          name: updatedInfo.name,
          image1: updatedInfo.image1,
          category: updatedInfo.category,
          quantity: updatedInfo.quantity,
          price: parseFloat(updatedInfo.price),
          description: updatedInfo.description,
        },
      };
      const result = await toyCollection.updateOne(filter, updatedToy, options);
      res.send(result);
    });

    // delete toy by id
    app.delete("/delete-toy/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(filter);
      res.send(result);
    });

    // get blog data
    app.get("/blogs", async (req, res) => {
      const blogs = await blogCollection.find().toArray();
      res.send(blogs);
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
