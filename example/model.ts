import { Schema } from "../schema";
import { Ifa } from "../connect";

const user = new Schema(
  "users",
  {
    firstName: { type: "string", required: true },
    lastName: { type: "string", required: true },
    age: { type: "number", required: true },
    email: { type: "string", unique: true },
    isGraduated: { type: "boolean", required: true },
  },
  { timestamps: true }
);

// Ifa.createCollection("users", user);

// user.getGlobalData();

export default user;
