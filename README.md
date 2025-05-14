# ifa-odm

Ifa-odm is a [MongoDB](https://www.mongodb.org/) for basic basic mongo db crud operations and $Jsonschema Validation. ifa-odm supports [Node.js](https://nodejs.org/en/).

## Documentation

<!-- The official documentation website is [mongoosejs.com](http://mongoosejs.com/). -->

## Installation

First install [Node.js](http://nodejs.org/) and [MongoDB](https://www.mongodb.org/downloads). Then:

```sh
npm install ifa-odm
```

## Importing

```javascript
// Using Node.js `require()`
const { Ifa, connect } = require("ifa-odm");

// Using ES6 imports
import { Ifa, connect } from "ifa-odm";
```

```javascript
let dbUri = "mongodb://localhost:27017/";
let dbName = "testing";

const ifa = new Ifa(dbUri, dbName);

ifa.connect().then(() => console.log("database connected successfully"));
```

**Note:** _If the local connection fails then try using 127.0.0.1 instead of localhost. Sometimes issues may arise when the local hostname has been changed._

### Defining a Model

Models are defined through the `Schema` interface.

```javascript
// Using Node.js `require()`
const { Schema } = require("ifa-odm");

// Using ES6 imports
import { Schema } from "ifa-odm";

// A typical model and possible document structure with support for embedded associated data for both arrays, objects and nexted arrays and nexted objects
const user = new Schema(
  "user",
  {
    firstName: { type: "string", required: true },
    lastName: { type: "string", required: true },
    age: { type: "number", required: true },
    email: { type: "string", unique: true },
    isGraduated: { type: "bool", required: true },
    records: [
      {
        score: { type: "number" },
        cgpa: { type: "number" },
      },
    ],
    address: {
      street: { type: "string" },
      city: { type: "string" },
      state: { type: "string" },
      zipCode: { type: "string" },
      zip: [{ type: "string" }],
    },
    hobbies: [{ type: "string" }],
  },
  { timestamps: true }
);
```

## Crud operations with ifa-odm

```javascript
// a typical post request in an express application

-Create;

app.post("/users", async (req, res) => {
  const userData = {
    firstName: "John",
    lastName: "Doe",
    age: 32,
    isGraduated: false,
    email: "johndoe@gmail.com",
    records: [{ cgpa: 4, score: 70 }],
    address: {
      street: "Lagos",
      city: "Lagos",
      state: "Lagos",
      zip: ["100001"],
    },
    hobbies: ["reading", "cooking"],
  };

  try {
    const result = await user.create(userData);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

-Read;
app.get("/users", async (req, res) => {
  try {
    const result = await user.find().exec();
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await user.findOne({ _id: id }).exec();

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

-Update;
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
    res.status(400).json({ error: error.message });
  }
});

-Delete;
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await user.removeOneById(id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

## Data Association By Reference

ifa-odm supports data association by reference.
It support both object reference and array reference as shown in the code snippet below.

```Javascript

const blog = new Schema(
  "blog",
  {
    title: { type: "string" },
    desc: { type: "string" },

    user: { type: "ref", ref: "users", refField: "_id", required: true },
    // comments: [{ type: "ref", ref: "comments", refField: "_id" }],
  },

  { timestamps: true }
);

```

**NB** the "ref" key is the collection name which is being referenced, while "refField" is the field on the collection's object that is referenced, which in most use cases the "\_id" field.

## Add data to a referenced field

```javascript
app.post("/blogs", async (req, res) => {
  const { title, desc } = req.body;
  try {
    const users = await user.find().exec();

    const newBlog = await blog.createMany([
      {
        title: "new blog",
        desc: "new blog description",
        user: users[0]._id,
      },
      {
        title: "new blog 2",
        desc: "new blog description 2",
        user: users[0]._id,
      },
    ]);

    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

## Populating Associated Data

ifa-odm has supported for associated data population

```javascript
app.get("/blogs", async (req, res) => {
  try {
    const blogs = await blog.find().populate("user").exe();
    res.status(200).json(blogs);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
});

// ifa-odm also gives you control on which fields to be added to removed
app.get("/blogs", async (req, res) => {
  try {
    const blogs = await blog
      .find()
      .populate("user", { firstName: 1, lastName: 1, email: 0 })
      .exe();
    res.status(200).json(blogs);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
});
```
