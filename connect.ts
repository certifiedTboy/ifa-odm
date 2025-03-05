import { MongoClient } from "mongodb";
import {
  getCollectionProps,
  getRequiredFields,
  getUniqueProps,
} from "./helpers";
import { CustomError } from "./lib/errors/CustomError";

export class Ifa {
  connectionString: string;
  dbName?: string;
  client: MongoClient;
  constructor(connectionString: string, dbName?: string) {
    this.connectionString = dbName
      ? `${connectionString}${dbName}`
      : connectionString;
    this.dbName = dbName;
    this.client = new MongoClient(this.connectionString);

    (globalThis as any).dbData = {
      connectionString: this.connectionString,
      dbName: this.dbName,
      client: this.client,
    };
  }

  async connect() {
    try {
      if (this.dbName) {
        await this.client.connect();
      } else {
        await this.client.connect();
        const db = this.client.db().databaseName;

        if (db) {
          this.dbName = db;
        }
      }
    } catch (error) {
      throw new CustomError(
        "DatabaseConnectionError",
        "database connection failed"
      );
    }
  }

  static async createCollection(
    collectionName?: string,
    collectionProps?: any
  ) {
    try {
      const globalData = (globalThis as any).dbData;
      const { dbName, client } = globalData;

      const validationSchema = {
        $jsonSchema: {
          bsonType: "object",
          required: getRequiredFields(collectionProps.options),
          properties: getCollectionProps(collectionProps.options),
        },
      };
      const existingCollections = await client
        .db(dbName)
        .listCollections()
        .toArray();
      if (
        existingCollections?.length > 0 &&
        existingCollections.some(
          (collection: any) => collection.name === collectionName
        )
      ) {
        await client.db(dbName).command({
          collMod: collectionName,
          validator: validationSchema,
          validationLevel: "strict",
        });
        const uniqueProps = getUniqueProps(collectionProps.options);
        for (let data in uniqueProps) {
          await client
            .db(dbName)
            .collection(collectionName)
            .createIndex({ [data]: 1 }, { unique: true });
        }
        return;
      }
      await client.db(dbName).createCollection(collectionName);
      await client.db(dbName).command({
        collMod: collectionName,
        validator: validationSchema,
        validationLevel: "strict",
      });
      const uniqueProps = getUniqueProps(collectionProps.options);
      for (let data in uniqueProps) {
        await client
          .db(dbName)
          .collection(collectionName)
          .createIndex({ [data]: 1 }, { unique: true });
      }
    } catch (error) {
      console.log(error);
      throw new CustomError(
        "DatabaseCollectionError",
        "collection creation failed"
      );
    }
  }
}
