const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
const cors = require("cors");
app.use(cors());
app.use(express.json());

// MongoDB starts

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k7baavr.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    client.connect();
    // create database and collection starts
    const toyCollection = client.db("toyDB").collection("alltoys");
    // create database and collection end

    // toys CREATE api to receive data from client side starts
    app.post("/alltoys", async (req, res) => {
      const newToy = req.body;
      console.log(newToy);
      // insert or add data to the mongodb database
      const result = await toyCollection.insertOne(newToy);
      // send result to the client
      res.send(result);
    });
    // toys CREATE api to receive data from client side end

    // READ starts
    app.get("/alltoys", async (req, res) => {
      const cursor = toyCollection.find().limit(20);
      const result = await cursor.toArray();
      res.send(result);
    });
    // READ end

    // toy details READ start
    app.get("/alltoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });
    // toy details READ end

    // my toys READ starts
    app.get("/mytoys", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const cursor = toyCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // my toys READ end

    // my toys DELETE starts
    app.delete("/mytoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    });
    // my toys DELETE end

    // my toys UPDATE starts
    app.get("/mytoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });
    // To get current information from client side
    app.put("/mytoys/:id", async (req, res) => {
      const id = req.params.id;
      //after getting data from client side, now have to send data to mongodb
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const toy = req.body;
      const updatedtoy = {
        $set: {
          price: toy.price,
          quantity: toy.quantity,
          description: toy.description,
        },
      };
      const result = await toyCollection.updateOne(filter, updatedtoy, options);
      res.send(result);
    });
    // my toys UPDATE end

    // category toys READ starts
    app.get("/subcategory", async (req, res) => {
      console.log(req.query.subCategory);
      let query = {};
      if (req.query?.subCategory) {
        query = { subCategory: req.query.subCategory };
      }
      const cursor = toyCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // category toys READ end

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

// MongoDB end

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

app.get("/", (req, res) => {
  res.send("Edukids server is running");
});
app.listen(port, () => {
  console.log(`Edukids server is running on port:${port}`);
});
