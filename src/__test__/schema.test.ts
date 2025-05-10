import { Schema } from "../lib/ifa/schema";

const userSchema = new Schema(
  "users",
  {
    username: { type: "string", required: true, unique: true },
    password: { type: "string", required: true },
  },
  { timestamps: true }
);

const productSchema = new Schema(
  "products",
  {
    name: { type: "string", required: true },
    price: { type: "number", required: true },
    user: { type: "ref", ref: "users", refField: "_id" },
  },
  { timestamps: true }
);

describe("Schema class", () => {
  it("create a new instance of schema", () => {
    expect(userSchema).toBeDefined();
    expect(userSchema).toBeInstanceOf(Schema);
    expect(productSchema).toBeDefined();
    expect(productSchema).toBeInstanceOf(Schema);
  });
});

describe("create method", () => {
  it("should throw an error if document object is not provided or is empty", async () => {
    await expect(userSchema.create({})).rejects.toThrow(
      "Invalid document provided"
    );
  });

  // it("throws an error if document property type does not match collection schema type", async () => {
  //   await expect(
  //     userSchema.create({
  //       username: 12215414,
  //       password: "1225262626",
  //     })
  //   ).rejects.toThrow("Schema validation failed");
  // });

  it("create a new document", async () => {
    const result = await userSchema.create({
      username: "testuser1",
      password: "password123",
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

  // it("throws an error if document property type does not match collection schema type", async () => {
  //   const doc = [
  //     {
  //       username: "testuser2",
  //       password: 123,
  //     },
  //     { username: "testuser3", password: "password123" },
  //   ];

  //   await expect(userSchema.createMany(doc)).rejects.toThrow(
  //     "Schema validation failed"
  //   );
  // });

  it("create a new document", async () => {
    const doc = [
      {
        username: "testuser2",
        password: "password123",
      },
      {
        username: "testuser3",
        password: "password123",
      },
    ];

    const result = await userSchema.createMany(doc);
    expect(result).toBeDefined();
    expect(result.acknowledged).toBe(true);
  });
});

describe("find method", () => {
  // it("throws an error if an invalid option is provided", async () => {
  //   await expect(userSchema.find([]).exec()).rejects.toThrow(
  //     "Query filter must be a plain object or ObjectId"
  //   );
  // });

  it("returns all documents if no option is provided", async () => {
    const result = await userSchema.find().exec();
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns a matching array of documents if option is provided", async () => {
    const result = await userSchema.find({ username: "testuser1" }).exec();

    expect(result).toBeDefined();
    expect(result.length).toEqual(1);
    expect(result[0].username).toBe("testuser1");
    expect(result[0].password).toBe("password123");
  });
});

describe("findOne method", () => {
  it("throws an error if no option or an invalid option is provided", async () => {
    await expect(userSchema.findOne([]).exec()).rejects.toThrow(
      "Invalid query provided"
    );
  });

  it("return a single document if option is provided", async () => {
    const result = await userSchema.findOne({ username: "testuser1" }).exec();
    expect(result).toBeDefined();
    expect(result.username).toBe("testuser1");
  });
});

describe("findOneById method", () => {
  it("throws an error if an invalid id is provided", async () => {
    await expect(userSchema.findOneById("123").exec()).rejects.toThrow(
      "Invalid ObjectId provided"
    );
  });

  it("returns a single document if a valid id is provided", async () => {
    const existingUsers = await userSchema.find().exec();

    const result = await userSchema
      .findOneById(existingUsers[0]._id.toString())
      .exec();

    expect(result).toBeDefined();
    expect(result._id.toString()).toBe(existingUsers[0]._id.toString());
    expect(result.username).toBe(existingUsers[0].username);
  });
});

describe("updateOne method", () => {
  it("throws an error if no update document is provided", async () => {
    await expect(
      userSchema.updateOne({ username: "testuser3" }, {})
    ).rejects.toThrow("Invalid document provided");
  });

  it("throws an error if no filter is provided", async () => {
    await expect(
      userSchema.updateOne({}, { username: "testuser4", password: "password" })
    ).rejects.toThrow("Invalid query provided");
  });

  // it("throws an error if update option property type does not match collection schema type", async () => {
  //   await expect(
  //     userSchema.updateOne(
  //       { username: "testuser3" },
  //       {
  //         username: 123,
  //         password: "password",
  //       }
  //     )
  //   ).rejects.toThrow("Schema validation failed");
  // });

  it("updates a single document if valid filter and options are provided", async () => {
    const result = await userSchema.updateOne(
      { username: "testuser3" },
      { password: "newpassword123", username: "testuser4" }
    );

    expect(result).toBeDefined();
    expect(result.username).toBe("testuser4");
    expect(result.password).toBe("newpassword123");
    expect(new Date(result.createdAt).getTime()).toBeLessThan(
      new Date(result.updatedAt).getTime()
    );
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
    const existingUsers = await userSchema.find().exec();

    await expect(
      userSchema.updateOneById(existingUsers[0]._id.toString(), {})
    ).rejects.toThrow("Invalid document provided");
  });

  // it("throws an error if update option property type does not match collection schema type", async () => {
  //   const existingUsers = await userSchema.find();
  //   await expect(
  //     userSchema.updateOneById(existingUsers[0]._id.toString(), {
  //       username: 123,
  //       password: "password",
  //     })
  //   ).rejects.toThrow("Schema validation failed");
  // });

  it("updates a single document if valid id and update data are provided", async () => {
    const existingUsers = await userSchema.find().exec();
    const result = await userSchema.updateOneById(
      existingUsers[0]._id.toString(),
      {
        username: "testuser4",
        password: "newpassword123",
      }
    );

    expect(result.username).toBe("testuser4");
    expect(result.password).toBe("newpassword123");
    expect(new Date(result.createdAt).getTime()).toBeLessThan(
      new Date(result.updatedAt).getTime()
    );
  });

  describe("updateMany method", () => {
    const createProducts = async () => {
      const products = [
        {
          name: "product1",
          price: 100,
        },
        {
          name: "product2",
          price: 200,
        },
        {
          name: "product3",
          price: 300,
        },
        {
          name: "product3",
          price: 300,
        },
      ];
      await productSchema.createMany(products);
    };

    const getProducts = async (name: string) => {
      return await productSchema.find({ name }).exec();
    };

    it("throws an error if no update document is provided", async () => {
      await createProducts();
      await expect(
        productSchema.updateMultiple({ name: "product3" }, {})
      ).rejects.toThrow("Invalid document provided");
    });

    it("throws an error if no filter is provided", async () => {
      await expect(
        productSchema.updateMultiple({}, { name: "product3", price: 200 })
      ).rejects.toThrow("Invalid query provided");
    });

    // it("throws an error if update option property type does not match collection schema type", async () => {
    //   await expect(
    //     productSchema.updateMultiple(
    //       { name: "product3" },
    //       {
    //         name: "product4",
    //         price: "200",
    //       }
    //     )
    //   ).rejects.toThrow("Schema validation failed");
    // });

    it("updates a multiple documents if valid filter and options are provided", async () => {
      await productSchema.updateMultiple(
        { name: "product3" },
        { name: "product4", price: 600 }
      );

      const updatedProducts = await getProducts("product4");

      expect(updatedProducts).toBeDefined();
      expect(updatedProducts.length).toBeGreaterThanOrEqual(2);
      expect(updatedProducts[0].price).toBe(600);
      expect(updatedProducts[0].name).toBe("product4");
      expect(new Date(updatedProducts[0].createdAt).getTime()).toBeLessThan(
        new Date(updatedProducts[0].updatedAt).getTime()
      );
      expect(updatedProducts[1].price).toBe(600);
      expect(updatedProducts[1].name).toBe("product4");
      expect(new Date(updatedProducts[1].createdAt).getTime()).toBeLessThan(
        new Date(updatedProducts[1].updatedAt).getTime()
      );
    });
  });
});

describe("removeOne method", () => {
  it("throws and error if no filter is provided", async () => {
    await expect(userSchema.removeOne({})).rejects.toThrow(
      "Invalid query provided"
    );
  });

  it("throws an error if an invalid object id is provided", async () => {
    await expect(userSchema.removeOne({ _id: "123" })).rejects.toThrow(
      "Invalid ObjectId provided"
    );
  });

  it("removes a single document if valid filter is provided", async () => {
    const result = await userSchema.removeOne({ username: "testuser4" });
    expect(result).toBeDefined();
    expect(result.deletedCount).toBe(1);
    expect(result.acknowledged).toBe(true);
  });
});

describe("removeOneById method", () => {
  it("throws an error if no id is provided", async () => {
    await expect(userSchema.removeOneById("")).rejects.toThrow(
      "ObjectId is required"
    );
  });

  it("throws and error if an invalid objectid is provided", async () => {
    await expect(userSchema.removeOneById("123")).rejects.toThrow(
      "Invalid ObjectId provided"
    );
  });

  it("removes a single document if valid id is provided", async () => {
    const existingUsers = await userSchema.find().exec();

    const result = await userSchema.removeOneById(
      existingUsers[0]._id.toString()
    );

    expect(result.deletedCount).toBe(1);
    expect(result.acknowledged).toBe(true);
  });
});

describe("removeMany method", () => {
  it("throws an error if no filter is provided", async () => {
    await expect(productSchema.removeMany({})).rejects.toThrow(
      "Invalid query provided"
    );
  });

  it("removes multiple documents if valid filter is provided", async () => {
    const result = await productSchema.removeMany({ name: "product4" });
    expect(result.deletedCount).toEqual(2);
    expect(result.acknowledged).toBe(true);
  });
});

describe("data association", () => {
  it("should create a new product with a reference to the user", async () => {
    const users = await userSchema.find().exec();

    const result = await productSchema.create({
      name: "product5",
      price: 100,
      user: users[0]._id,
    });
    expect(result).toBeDefined();
    expect(result.name).toBe("product5");
    expect(result.price).toBe(100);
    expect(result.user.toString()).toBe(users[0]._id.toString());
  });

  it("should populate the user field in the product document and should exclude password field form user object", async () => {
    const products = await productSchema
      .find()
      .populate("user", { password: 0 })
      .exec();
    expect(products).toBeDefined();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0].user.username).toBeDefined();
    expect(products[0].user.password).toBeUndefined();
  });

  it("should throw an error if the reference field is not found", async () => {
    await expect(
      productSchema.find().populate("nonexistentField").exec()
    ).rejects.toThrow("Cannot read properties of undefined (reading 'ref')");
  });
});
