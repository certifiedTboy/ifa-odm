import { Ifa } from "../src/lib/ifa/model";
import { connect } from "../src/lib/ifa/connect";

let dbUri = "mongodb://localhost:27017/";
let dbName = "testing-new3";

new Ifa(dbUri, dbName);

export const connectDb = async () => {
  try {
    await connect();

    console.log("connection successfull");
  } catch (error) {
    console.log(error);
  }
};
