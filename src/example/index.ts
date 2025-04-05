import express from "express";
const app = express();
import { connectDb } from "./dbConfig";
// import user from "./model";

const PORT = 3000;

// Ifa.createCollection("users", user);

// app.post("/users", async (req, res) => {
//   const userData = {
//     firstName: "John",
//     lastName: "Doe",
//     age: 25,
//     isGraduated: true,
//     email: "etosin70@gmail.com",
//   };
//   try {
//     const result = await user.create(userData);
//     res.json(result);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

// app.get("/users", async (req, res) => {
//   try {
//     const result = await user.find();
//     res.json(result);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

async function startServer() {
  await connectDb();
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

startServer();
