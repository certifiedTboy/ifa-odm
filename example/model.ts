import { Schema } from "../src/lib/ifa/schema";

const user = new Schema(
  "users",
  {
    firstName: { type: "string", required: true },
    lastName: { type: "string", required: true },
    age: { type: "number", required: true },
    email: { type: "string", unique: true },
    isGraduated: { type: "bool", required: true },
  },
  { timestamps: true }
);

export default user;
