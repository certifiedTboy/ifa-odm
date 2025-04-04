import { MongoClient } from "mongodb";

export class Ifa {
  constructor(connectString: string, dbName: string) {
    (global as any).dbData = {
      connectString: dbName ? `${connectString}${dbName}` : connectString,
      dbName: dbName,
      client: new MongoClient(connectString),
    };
  }
}
