import express from "express";
const app = express();
import { connectDb } from "./dbConfig";
import user from "./user-model";
import blog from "./blog-model";
import rating from "./rating-model";

app.use(express.json());

const PORT = 3000;

app.post("/users", async (req, res) => {
  // console.log(req.body);
  const {
    firstName,
    lastName,
    age,
    isGraduated,
    email,
    records,
    hobbies,
    address,
  } = req.body;

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
    const result = await user.find().exec();
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
    const result = await user.findOne({ _id: id }).exec();

    console.log(result);

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

app.post("/blogs", async (req, res) => {
  const { title, desc } = req.body;
  try {
    const users = await user.find().exec();

    const newBlog = await blog.createMany([
      {
        title,
        desc,
        user: users[0]._id,
      },
      {
        title,
        desc,
        user: users[0]._id,
      },
    ]);

    res.status(201).json(newBlog);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
});

app.get("/blogs", async (req, res) => {
  try {
    const blogs = await blog.find().populate("user").populate("ratings").exec();

    res.status(200).json(blogs);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
});

app.get("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const blogData = await blog
      .findOne({ _id: id })
      .populate("user", {})
      .populate("ratings", {})
      .exec();
    res.status(200).json(blogData);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
});

app.post("/ratings/:blogId", async (req, res) => {
  try {
    const { rating: ratingData } = req.body;
    const { blogId } = req.params;

    const users = await user.find().exec();
    const blogToAddRating = await blog.findOne({ _id: blogId }).exec();

    const newRating = await rating.create({
      rating: ratingData,
      user: users[0]._id,
    });

    if (newRating && blogToAddRating) {
      blogToAddRating.ratings.push(newRating._id);

      const result = await blog.persist(blogToAddRating);

      res.status(201).json(result);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
});

// app.post("/transaction", async (req, res) => {
//   try {
//     const users = await user.find().exec();
//     const blogData = {
//       title: "new blog",
//       desc: "new blog desc",
//       user: users[0]._id,
//     };
//     const transaction = new Transaction();

//     transaction.createTransactionSession();

//     await transaction.runWithTransaction(() => blog.create(blogData)).exec();
//   } catch (error: unknown) {
//     console.log(error);
//   }
// });

async function startServer() {
  await connectDb();
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

startServer();
