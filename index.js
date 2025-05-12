const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Firebase Admin Setup
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-service-account.json"); // 🔑 Replace with your file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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

// 🔐 Middleware: Verify Firebase Token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.decodedEmail = decoded.email;
    next();
  } catch (error) {
    res.status(401).send({ message: "Unauthorized" });
  }
};

// 🔐 Middleware: Check Admin
const verifyAdmin = async (req, res, next) => {
  const email = req.decodedEmail;
  const user = await userCollection.findOne({ email });
  if (user?.role === "admin") {
    next();
  } else {
    res.status(403).send({ message: "Forbidden: Admins only" });
  }
};

async function run() {
  try {
    app.get("/", (req, res) => {
      res.send("🌍 Welcome to EasyVisa API");
    });

    // USERS
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

    // ✳️ VISA ROUTES

    // ✅ Admin-only: Add Visa
    app.post("/Visa", verifyToken, verifyAdmin, async (req, res) => {
      const visa = req.body;
      const result = await visaCollection.insertOne(visa);
      res.send(result);
    });

    // ✅ Anyone can view visas
    app.get("/Visa", async (req, res) => {
      const visas = await visaCollection.find().toArray();
      res.send(visas);
    });

    app.get("/Visa/:id", async (req, res) => {
      const id = req.params.id;
      const visa = await visaCollection.findOne({ _id: new ObjectId(id) });
      res.send(visa);
    });

    app.put("/Visa/:id", async (req, res) => {
      const id = req.params.id;
      const update = { $set: req.body };
      const result = await visaCollection.updateOne({ _id: new ObjectId(id) }, update);
      res.send(result);
    });

    // ✅ Admin-only: Delete Visa
    app.delete("/Visa/:id", verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const result = await visaCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // 📨 APPLICATION ROUTES
    app.post("/Applications", async (req, res) => {
      const application = req.body;
      const exists = await applicationCollection.findOne({
        visaId: application.visaId,
        email: application.email,
      });

      if (exists) {
        return res.status(400).send({ message: "Application already exists." });
      }

      const result = await applicationCollection.insertOne(application);
      res.send(result);
    });

    app.get("/Applications", async (req, res) => {
      const applications = await applicationCollection.find().toArray();
      res.send(applications);
    });

    app.get("/Applications/:id", async (req, res) => {
      const id = req.params.id;
      const result = await applicationCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.delete("/Applications/:id", async (req, res) => {
      const id = req.params.id;
      const result = await applicationCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
