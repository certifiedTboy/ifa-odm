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
    // expect(result.username).toBe("testuser");
    // expect(result.password).toBe("password123");
  });
});
