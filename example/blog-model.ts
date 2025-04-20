import { Schema } from "../src/lib/ifa/schema";

const blog = new Schema(
  "blog",
  {
    title: { type: "string" },
    desc: { type: "string" },

    user: { type: "ref", ref: "user", refField: "_id", required: true },
  },

  { timestamps: true }
);

export default blog;
