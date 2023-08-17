const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gypdktl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const userCollection = client.db("oruphonesDB").collection("users");

    app.post('/users', async (req, res) => {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
    })

    app.get('/users', async (req,res) => {
        const email = req.query.email;
        const users = await userCollection.find({}).toArray();
        const filteredResult = users.filter(user => user.email !== email)

        res.send(filteredResult);
    })

    app.get('/users/user', async (req, res) => {
        const email = req.query.email;
        const result = await userCollection.findOne({email: email})
        res.send(result);
    })

    app.put('/users/user/:id', async (req, res) => {
        const id = req.params.id;
        const body = req.body;
        const query = { _id: new ObjectId(id) };
        const user = await userCollection.findOne(query);
        const connections = user.connections
        
        const updateDoc = {
          $set: {
            connections: [...connections, body.id]
          },
        };
        const result = await userCollection.updateOne(user, updateDoc);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Oru phones is running!");
});

app.listen(port, () => {
    console.log(`Oru phones is listening to port: ${port}`);
});

