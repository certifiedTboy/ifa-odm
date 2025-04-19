import express from "express";
const app = express();
import { connectDb } from "./dbConfig";
import user from "./model";

app.use(express.json());

const PORT = 3000;

app.post("/users", async (req, res) => {
  const { firstName, lastName, age, isGraduated, email } = req.body;
  const userData = {
    firstName,
    lastName,
    age,
    isGraduated,
    email,
  };
  try {
    const result = await user.create(userData);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await user.find();
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await user.findOneById(id);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;

  const { firstName, lastName, age, isGraduated, email } = req.body;
  const userData = {
    firstName,
    lastName,
    age,
    isGraduated,
    email,
  };

  try {
    const result = await user.updateOneById(id, userData);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await user.removeOneById(id);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
});

async function startServer() {
  await connectDb();
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

startServer();
