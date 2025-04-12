import { Schema } from "../lib/ifa/schema";

const userSchema = new Schema(
  "user",
  {
    username: { type: "string", required: true, unique: true },
    password: { type: "string", required: true },
  },
  { timestamps: true }
);

describe("Schema class", () => {
  it("should create a new instance of schema", () => {
    expect(userSchema).toBeDefined();
    expect(userSchema.collectionName).toBe("user");
    expect(userSchema.options).toEqual({
      username: { type: "string", required: true, unique: true },
      password: { type: "string", required: true },
      createdAt: { type: "date" },
      updatedAt: { type: "date" },
    });
  });
});

describe("create method", () => {
  it("should throw an error if document object is not provided or is empty", async () => {
    await expect(userSchema.create({})).rejects.toThrow(
      "Invalid document provided"
    );
  });

  it("should throw an error if document property type does not match collection schema type", async () => {
    await expect(
      userSchema.create({
        username: "testuser",
        password: 123,
      })
    ).rejects.toThrow("Schema validation failed");
  });

  it("should create a new document", async () => {
    const result = await userSchema.create({
      username: "testuser",
      password: "password123",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(result).toBeDefined();
    expect(result.acknowledged).toBe(true);
    expect(result.username).toBe("testuser");
    expect(result.password).toBe("password123");
  });
});

describe("createMany method", () => {
  it("should throw an error if document array is not provided or is empty", async () => {
    await expect(userSchema.createMany([])).rejects.toThrow(
      "Invalid array provided"
    );
  });

  it("should throw an error if document property type does not match collection schema type", async () => {
    const doc = [
      {
        username: "testuser",
        password: 123,
      },
      { username: "testuser2", password: "password123" },
    ];

    await expect(userSchema.createMany(doc)).rejects.toThrow(
      "Schema validation failed"
    );
  });

  it("should create a new document", async () => {
    const doc = [
      {
        username: "testuser",
        password: "password123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "testuser2",
        password: "password123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const result = await userSchema.createMany(doc);
    expect(result).toBeDefined();
    expect(result.acknowledged).toBe(true);
  });
});

describe("find method", () => {
  it("should throw an error if an invalid option is provided", async () => {
    await expect(userSchema.find([])).rejects.toThrow("Invalid query provided");
  });

  it("returns all documents if no option is provided", async () => {
    const result = await userSchema.find();
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it("should return a matching array of documents if option is provided", async () => {
    const result = await userSchema.find({ username: "testuser" });

    expect(result).toBeDefined();
    expect(result.length).toEqual(2);
    expect(result[0].username).toBe("testuser");
    expect(result[0].password).toBe("password123");
  });
});

describe("findOne method", () => {
  it("should throw an error if no option or an invalid option is provided", async () => {
    await expect(userSchema.findOne([])).rejects.toThrow(
      "Invalid query provided"
    );
  });

  it("should return a single document if option is provided", async () => {
    const result = await userSchema.findOne({ username: "testuser" });
    expect(result).toBeDefined();
    expect(result.username).toBe("testuser");
  });
});
