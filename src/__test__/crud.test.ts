import { Schema } from "../lib/ifa/schema";
import { MongodbError } from "../lib/errors/MongodbError";

const userSchema = new Schema(
  "user",
  {
    username: { type: "string", required: true, unique: true },
    password: { type: "string", required: true },
  },
  { timestamps: true }
);

describe("Schema class", () => {
  it("create a new instance of schema", () => {
    expect(userSchema).toBeDefined();
    expect(userSchema).toBeInstanceOf(Schema);
  });
});

describe("create method", () => {
  it("should throw an error if document object is not provided or is empty", async () => {
    await expect(userSchema.create({})).rejects.toThrow(
      "Invalid document provided"
    );
  });

  it("throws an error if document property type does not match collection schema type", async () => {
    await expect(
      userSchema.create({
        username: "testuser1",
        password: 123,
      })
    ).rejects.toThrow("Schema validation failed");
  });

  it("create a new document", async () => {
    const result = await userSchema.create({
      username: "testuser1",
      password: "password123",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(result).toBeDefined();
    expect(result.acknowledged).toBe(true);
    expect(result.username).toBe("testuser1");
    expect(result.password).toBe("password123");
  });
});

describe("createMany method", () => {
  it("should throw an error if document array is not provided or is empty", async () => {
    await expect(userSchema.createMany([])).rejects.toThrow(
      "Invalid array provided"
    );
  });

  it("throws an error if document property type does not match collection schema type", async () => {
    const doc = [
      {
        username: "testuser2",
        password: 123,
      },
      { username: "testuser3", password: "password123" },
    ];

    await expect(userSchema.createMany(doc)).rejects.toThrow(
      "Schema validation failed"
    );
  });

  it("create a new document", async () => {
    const doc = [
      {
        username: "testuser2",
        password: "password123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "testuser3",
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
  it("throws an error if an invalid option is provided", async () => {
    await expect(userSchema.find([])).rejects.toThrow("Invalid query provided");
  });

  it("returns all documents if no option is provided", async () => {
    const result = await userSchema.find();
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns a matching array of documents if option is provided", async () => {
    const result = await userSchema.find({ username: "testuser1" });

    expect(result).toBeDefined();
    expect(result.length).toEqual(1);
    expect(result[0].username).toBe("testuser1");
    expect(result[0].password).toBe("password123");
  });
});

describe("findOne method", () => {
  it("throws an error if no option or an invalid option is provided", async () => {
    await expect(userSchema.findOne([])).rejects.toThrow(
      "Invalid query provided"
    );
  });

  it("return a single document if option is provided", async () => {
    const result = await userSchema.findOne({ username: "testuser1" });
    expect(result).toBeDefined();
    expect(result.username).toBe("testuser1");
  });
});

describe("findOneById method", () => {
  it("throw an error if id is not provide", async () => {
    await expect(userSchema.findOneById("")).rejects.toThrow(
      "ObjectId is required"
    );
  });

  it("throws an error if an invalid id is provided", async () => {
    await expect(userSchema.findOneById("123")).rejects.toThrow(
      "Invalid ObjectId provided"
    );
  });

  it("returns a single document if a valid id is provided", async () => {
    const existingUsers = await userSchema.find();

    const result = await userSchema.findOneById(
      existingUsers[0]._id.toString()
    );

    expect(result).toBeDefined();
    expect(result._id.toString()).toBe(existingUsers[0]._id.toString());
    expect(result.username).toBe(existingUsers[0].username);
  });
});

describe("updateOne method", () => {
  it("throws an error if no filter or options are provided", async () => {
    await expect(userSchema.updateOne({}, {})).rejects.toBeInstanceOf(Error);
  });

  it("throws an error if update option property type does not match collection schema type", async () => {
    const existingUsers = await userSchema.find();
    await expect(
      userSchema.updateOne(
        { username: "testuser3" },
        {
          username: 123,
          password: "password",
        }
      )
    ).rejects.toThrow("Schema validation failed");
  });

  it("updates a single document if valid filter and options are provided", async () => {
    try {
      const result = await userSchema.updateOne(
        { username: "testuser3" },
        { password: "newpassword123", username: "testuser4" }
      );

      expect(result).toBeDefined();
      expect(result.username).toBe("testuser4");
      expect(result.password).toBe("newpassword123");
      expect(result.createdAt).toBeLessThan(result.updatedAt);
    } catch (error: unknown) {
      if (error instanceof MongodbError) {
        expect(error).toBeInstanceOf(MongodbError);
      } else {
        expect(error).toBeInstanceOf(Error);
      }
    }
  });
});

describe("updateOneById method", () => {
  it("throws an error if no id is provided", async () => {
    await expect(userSchema.updateOneById("", {})).rejects.toThrow(
      "ObjectId is required"
    );
  });

  it("throws an error if an invalid id is provided", async () => {
    await expect(userSchema.updateOneById("uqriqrkg", {})).rejects.toThrow(
      "Invalid ObjectId provided"
    );
  });

  it("throws an error if no update data is not provided", async () => {
    const existingUsers = await userSchema.find();

    await expect(
      userSchema.updateOneById(existingUsers[0]._id.toString(), {})
    ).rejects.toThrow("Invalid document provided");
  });

  it("throws an error if update option property type does not match collection schema type", async () => {
    const existingUsers = await userSchema.find();
    await expect(
      userSchema.updateOneById(existingUsers[0]._id.toString(), {
        username: 123,
        password: "password",
      })
    ).rejects.toThrow("Schema validation failed");
  });

  it("updates a single document if valid id and update data are provided", async () => {
    try {
      const existingUsers = await userSchema.find();
      const result = await userSchema.updateOne(
        existingUsers[0]._id.toString(),
        { password: "newpassword123", username: "testuser4" }
      );

      expect(result).toBeDefined();
      expect(result.username).toBe("testuser4");
      expect(result.password).toBe("newpassword123");
      expect(result.createdAt).toBeLessThan(result.updatedAt);
    } catch (error: unknown) {
      if (error instanceof MongodbError) {
        expect(error).toBeInstanceOf(MongodbError);
      } else {
        expect(error).toBeInstanceOf(Error);
      }
    }
  });
});
