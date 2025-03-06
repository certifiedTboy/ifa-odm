import { MongoClient } from "mongodb";
import { CustomError } from "../errors/CustomError";
import {
  getUniqueProps,
  getCollectionProps,
  getRequiredFields,
} from "../../helpers";

export async function connect() {
  try {
    const dbData = (global as any).dbData;
    const { client } = dbData;
    await client.connect();
  } catch (error) {
    throw new CustomError(
      "DatabaseConnectionError",
      "database connection failed"
    );
  }
}

export async function createCollection(
  client: MongoClient,
  dbName: string,
  collectionName: string,
  collectionProps: any
) {
  try {
    const validationSchema = {
      $jsonSchema: {
        bsonType: "object",
        required: getRequiredFields(collectionProps),
        properties: getCollectionProps(collectionProps),
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

      const uniqueProps = getUniqueProps(collectionProps);

      for (let data in uniqueProps) {
        await client
          .db(dbName)
          .collection(collectionName)
          .createIndex({ [data]: 1 }, { unique: true });
      }
    } else {
      await client.db(dbName).createCollection(collectionName);

      await client.db(dbName).command({
        collMod: collectionName,
        validator: validationSchema,
        validationLevel: "strict",
      });
      const uniqueProps = getUniqueProps(collectionProps);
      for (let data in uniqueProps) {
        await client
          .db(dbName)
          .collection(collectionName)
          .createIndex({ [data]: 1 }, { unique: true });
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new CustomError("DatabaseCollectionError", error.message);
    }
  }
}
