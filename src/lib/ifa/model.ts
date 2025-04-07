import { MongoClient } from "mongodb";
const Kareem = require("kareem");

export class Ifa {
  private static _hooks = new Kareem();
  constructor(connectString: string, dbName: string) {
    console.log("initialize instance of Ifa");
    (global as any).dbData = {
      connectString: dbName ? `${connectString}${dbName}` : connectString,
      dbName: dbName,
      client: new MongoClient(connectString),
    };
  }
}
