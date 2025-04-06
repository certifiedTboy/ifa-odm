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

    Ifa._hooks.execPreSync("init", this);

    // Run post-init hooks
    Ifa._hooks.execPostSync("init", this);
  }

  static addHook(name: string, fn: Function) {
    Ifa._hooks.post(name, fn);
  }
}
