const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();

const port = process.env.port || 5000;
// middleware
app.use(cors());
app.use(express.json());

/* ********************************************************** */

const uri = `mongodb+srv://hotel:FW80pXT7L3w6E65L@cluster0.fe8tu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("hotel").collection("service");

    /*  create user post  */
    app.post("/service", async (req, res) => {
      const query = req.body;
      const createAdd = await serviceCollection.insertOne(query);
      console.log(createAdd);
      res.send(createAdd);
    });
    /* ... */

    /* read get user */
    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      //   console.log(result);
      res.send(result);
    });

    /* delete user */
    app.delete("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    /* read a get method api id single user loaded database then client side  */
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await serviceCollection.findOne(query);
      console.log(cursor);
      res.send(cursor);
    });

    //   update put database and client
    app.put("/service/:id", async (req, res) => {
      const id = req.params.id;
      const displayUser = req.body;
      console.log(displayUser);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: displayUser.name,
          img: displayUser.img,
          email: displayUser.email,
          description: displayUser.description,
          price: displayUser.price,
          quantity: displayUser.quantity,
        },
      };
      /* ... */
      const result = await serviceCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result);
      res.send(result);
    });
    /* ... */
  } finally {
    // client.connect()
  }
}
run().catch(console.dir);

/* ********************************************************** */

app.get("/", (req, res) => {
  res.send("node and express server is running");
});

app.listen(port, () => {
  console.log("server is running port", port);
});
