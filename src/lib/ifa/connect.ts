import { MongoClient } from "mongodb";
import { CustomError } from "../errors/CustomError";
import { SchemaHelper } from "../../helpers/schema";

/**
 * @method connect
 * @description Connect to the database using the connection string provided in the global dbData object.
 */
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

/**
 * @method createCollection
 * @description Creates a new collection in the database with the specified properties and validation schema.
 * If the collection already exists, it modifies the existing collection with the new properties.
 * @param {MongoClient} client - The MongoDB client instance.
 * @param {string} dbName - The name of the database.
 * @param {string} collectionName - The name of the collection to be created.
 * @param {any} collectionProps - The properties of the collection to be created.
 * @returns {Promise<void>} - A promise that resolves when the collection is created successfully.
 */
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
        required: SchemaHelper.getRequiredFields(collectionProps),
        properties: SchemaHelper.getCollectionProps(collectionProps),
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

      const uniqueProps = SchemaHelper.getUniqueProps(collectionProps);

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
      const uniqueProps = SchemaHelper.getUniqueProps(collectionProps);
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
