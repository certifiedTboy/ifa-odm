import { Ifa } from "../src/lib/ifa/model";

let dbUri = "mongodb://localhost:27017/";
let dbName = "testing-new4";

const ifa = new Ifa(dbUri, dbName);

export const connectDb = async () => {
  try {
    await ifa.connect();

    console.log("connection successfull");
  } catch (error) {
    console.log(error);
  }
};
