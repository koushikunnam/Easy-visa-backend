const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://mrrakeshk1704:Rakeshk2003@cluster0.h5n5y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db("EasyVisa");
const userCollection = database.collection("users");
const visaCollection = database.collection("visas");
const applicationCollection = database.collection("applications");
async function run() {
  try {
    // Routes
    app.get("/", (req, res) => {
      res.send(`
    <h1>Welcome to the EasyVisa API!</h1>
    <p>Use the following routes to interact with the EasyVisa API:</p>

    <h2>User Management</h2>
    <ul>
      <li><strong>POST /Users</strong>: Create a new user</li>
      <li><strong>GET /Users</strong>: Get all users</li>
    </ul>

    <h2>Visa Management</h2>
    <ul>
      <li><strong>POST /Visa</strong>: Add a new visa</li>
      <li><strong>GET /Visa</strong>: Get all visas</li>
      <li><strong>GET /Visa/:id</strong>: Get visa details by ID</li>
      <li><strong>PUT /Visa/:id</strong>: Update visa details</li>
      <li><strong>DELETE /Visa/:id</strong>: Delete a visa by ID</li>
    </ul>

    <h2>Application Management</h2>
    <ul>
      <li><strong>POST /Applications</strong>: Submit a new application</li>
      <li><strong>GET /Applications</strong>: Get all applications</li>
      <li><strong>GET /Applications/:id</strong>: Get application details by ID</li>
      <li><strong>DELETE /Applications/:id</strong>: Cancel an application</li>
    </ul>

    <h2>Errors</h2>
    <ul>
      <li><strong>400 Bad Request</strong>: Missing or invalid data</li>
      <li><strong>404 Not Found</strong>: Resource not found</li>
      <li><strong>500 Internal Server Error</strong>: Server issue</li>
    </ul>
  `);
    });

    // Users
    app.post("/Users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.get("/Users", async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    });
    // Visas
    app.post("/Visa", async (req, res) => {
      const visa = req.body;
      const result = await visaCollection.insertOne(visa);
      res.send(result);
    });
    app.get("/Visa", async (req, res) => {
      const cursor = visaCollection.find();
      const visas = await cursor.toArray();
      res.send(visas);
    });
    app.get("/Visa/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const visa = await visaCollection.findOne(query);
      res.send(visa);
    });
    app.put("/Visa/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const visa = req.body;
      console.log(visa);
      const update = { $set: visa };
      const result = await visaCollection.updateOne(query, update);
      res.send(result);
    });
    app.delete("/Visa/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visaCollection.deleteOne(query);
      res.send(result);
    });
    // Applications
    app.post("/Applications", async (req, res) => {
      const application = req.body;
      const existingApplication = await applicationCollection.findOne({
        visaId: application.visaId,
        email: application.email,
      });
      // If an application already exists, return an error
      if (existingApplication) {
        console.log("Application already exists.");
        return res.status(400).send({ message: "Application already exists." });
      }
      const result = await applicationCollection.insertOne(application);
      res.send(result);
    });
    app.get("/Applications", async (req, res) => {
      const cursor = applicationCollection.find();
      const applications = await cursor.toArray();
      res.send(applications);
    });
    app.get("/Applications/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const application = await applicationCollection.findOne(query);
      res.send(application);
    });
    app.delete("/Applications/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await applicationCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
