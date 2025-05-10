import { Schema } from "../src/lib/ifa/schema";

const rating = new Schema(
  "rating",
  {
    rating: { type: "number", required: true },
    user: { type: "ref", ref: "users", refField: "_id", required: true },
  },
  { timestamps: true }
);

export default rating;
