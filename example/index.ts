import express from "express";
const app = express();
import { connectDb } from "./dbConfig";
import user from "./user-model";
import blog from "./blog-model";

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
    const result = await user.find().limit(1).exec();
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
    const result = await user.findOne({ _id: id });

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

// app.post("/blogs", async (req, res) => {
//   const { title, desc } = req.body;
//   try {
//     const users = await user.find();

//     const newBlog = await blog.create({
//       title,
//       desc,
//       user: users?.query[1]._id,
//     });

//     res.status(201).json(newBlog);
//   } catch (error) {
//     console.log(error);
//     if (error instanceof Error) {
//       res.status(400).json({ error: error.message });
//     }
//   }
// });

// app.get("/blogs", async (req, res) => {
//   try {
//     const blogs = await blog.find().populate();

//     res.status(200).json(blogs);
//   } catch (error) {
//     console.log(error);
//     if (error instanceof Error) {
//       res.status(400).json({ error: error.message });
//     }
//   }
// });

async function startServer() {
  await connectDb();
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

startServer();
