import { Schema } from "../lib/ifa/schema";

const userSchema = new Schema("user", {
  username: { type: "string", required: true, unique: true },
  password: { type: "string", required: true },
});

it("should create a new instance of schema", () => {
  expect(userSchema).toBeDefined();
  expect(userSchema.collectionName).toBe("user");
  expect(userSchema.options).toEqual({
    username: { type: "string", required: true, unique: true },
    password: { type: "string", required: true },
  });
});

it("should create a new document", async () => {
  const result = await userSchema.create({
    username: "testuser",
    password: "password123",
  });
  expect(result).toBeDefined();
  expect(result.acknowledged).toBe(true);
  expect(result.username).toBe("testuser");
  expect(result.password).toBe("password123");
});

it("should throw an error if document is not provided", async () => {
  await expect(userSchema.create({})).rejects.toThrow("Document is empty");
});
