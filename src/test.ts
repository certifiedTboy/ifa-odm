import { Ifa, Schema } from "./";

const connectDb = async () => {
  try {
    const ifa = new Ifa("mongodb://localhost:27017/", "ifa-db");

    await ifa.connect();

    console.log("connection successfull");

    const userSchema = new Schema(
      "users",
      {
        username: { type: "string", required: true, unique: true },
        age: { type: "number", required: true },
        dob: { type: "date", required: false },
      },
      { timestamps: true }
    );

    await ifa.createCollection("users", userSchema);

    await userSchema.create({
      username: "John Doe",
      age: 25,
      dob: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await userSchema.find();

    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

connectDb();
