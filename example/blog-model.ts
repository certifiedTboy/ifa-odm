import { Schema } from "../src/lib/ifa/schema";

const blog = new Schema(
  "blog",
  {
    title: { type: "string" },
    desc: { type: "string" },

    user: { type: "ref", ref: "users", refField: "_id", required: true },
    ratings: [{ type: "ref", ref: "ratings", refField: "_id" }],
  },

  { timestamps: true }
);

export default blog;
