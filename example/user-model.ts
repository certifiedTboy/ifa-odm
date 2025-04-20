import { Schema } from "../src/lib/ifa/schema";

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
        minItems: 1,
        maxItems: 5,
      },
    ],
    address: {
      street: { type: "string" },
      city: { type: "string" },
      state: { type: "string" },
      zipCode: { type: "string" },
      zip: [{ type: "string" }],
    },
    hobbies: [{ type: "string", minItems: 1, maxItems: 5 }],
  },
  { timestamps: true }
);

export default user;
