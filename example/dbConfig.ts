import { Ifa, connect } from "..";

let dbUri = "mongodb://localhost:27017/";
let dbName = "new-db2";

new Ifa(dbUri, dbName);

export const connectDb = async () => {
  try {
    await connect();

    console.log("connection successfull");
  } catch (error) {
    console.log(error);
  }
};
