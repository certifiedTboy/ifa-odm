import { MongoClient } from "mongodb";

/**
 * @class Ifa
 * @description A class that provides a connection to MongoDB and related operations.
 * @param {string} connectString - The connection string for MongoDB.
 * @param {string} dbName - The name of the database.
 */
export class Ifa {
  constructor(connectString: string, dbName: string) {
    const dbData = (global as any).dbData;
    (global as any).dbData = {
      ...dbData,
      connectString: dbName ? `${connectString}${dbName}` : connectString,
      dbName: dbName,
      client: new MongoClient(connectString),
    };
  }
}
