import { MongoClient } from "mongodb";
import { CustomError } from "../errors/CustomError";

/**
 * @class Ifa
 * @description A class that provides a connection to MongoDB and related operations.
 * @param {string} connectString - The connection string for MongoDB.
 * @param {string} dbName - The name of the database.
 */
export class Ifa {
  connectString: string;
  dbName: string;
  client: MongoClient;
  constructor(connectString: string, dbName: string) {
    this.connectString = connectString;
    this.dbName = dbName;
    this.client = new MongoClient(connectString);
    const dbData = (global as any).dbData;
    (global as any).dbData = {
      ...dbData,
      connectString: dbName ? `${connectString}${dbName}` : connectString,
      dbName: dbName,
      client: this.client,
    };
  }

  /**
   * @method connect
   * @description Connect to the database using the connection string provided in the global dbData object.
   */
  async connect() {
    try {
      const response = await this.client.connect();

      return response.options.dbName;
    } catch (error) {
      throw new CustomError(
        "DatabaseConnectionError",
        "database connection failed"
      );
    }
  }
}
