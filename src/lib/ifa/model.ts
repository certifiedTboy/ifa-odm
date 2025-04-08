import { MongoClient } from "mongodb";

export class Ifa {
  constructor(connectString: string, dbName: string) {
    console.log("initialize instance of Ifa");
    const dbData = (global as any).dbData;
    (global as any).dbData = {
      ...dbData,
      connectString: dbName ? `${connectString}${dbName}` : connectString,
      dbName: dbName,
      client: new MongoClient(connectString),
    };
  }
}
