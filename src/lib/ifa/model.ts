import { MongoClient } from "mongodb";
import { Schema } from "./schema";

export class Ifa extends Schema {
  constructor(
    connectString: string,
    dbName: string,
    options?: any,
    collectionName?: string
  ) {
    super(collectionName || "", options);
    console.log("initialize instance of Ifa");
    (global as any).dbData = {
      connectString: dbName ? `${connectString}${dbName}` : connectString,
      dbName: dbName,
      client: new MongoClient(connectString),
    };
  }
}
