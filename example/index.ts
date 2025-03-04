import express from "express";
const app = express();
import { Ifa, Schema } from "../";

const PORT = 3000;

let dbUri = "mongodb://localhost:27017/";
let dbName = "new-db2";

async function connectDb() {
  try {
    const ifa = new Ifa(dbUri, dbName);

    await ifa.connect();

    console.log("connection successfull");
  } catch (error) {
    console.log(error);
  }
}

const user = new Schema(
  "users",
  {
    firstName: { type: "string", required: true },
    lastName: { type: "string", required: true },
    age: { type: "number", required: true },
    email: { type: "string", unique: true },
    isGraduated: { type: "boolean", required: true },
  },
  { timestamps: true }
);

app.post("/users", async (req, res) => {
  const userData = {
    firstName: "John",
    lastName: "Doe",
    age: 25,
    isGraduated: true,
    email: "etosin70@gmail.com",
  };
  try {
    const result = await user.create(userData);
    res.json(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await user.find();
    res.json(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

async function startServer() {
  await connectDb();
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

startServer();
