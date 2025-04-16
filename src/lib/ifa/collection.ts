import { MongoClient } from "mongodb";
import { SchemaHelper } from "../../helpers/schema";
import { CustomError } from "../errors/CustomError";

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
): Promise<void> {
  // check if the collection name is pluralized
  // pluralize the collection name if it is not already pluralized
  collectionName =
    collectionName[collectionName.length - 1] === "s"
      ? collectionName
      : `${collectionName}s`;

  try {
    if (!dbName || dbName.trim().length === 0) {
      throw new CustomError("DatabaseNameError", "Database name is required.");
    }

    if (!collectionName || collectionName.trim().length === 0) {
      throw new CustomError(
        "CollectionNameError",
        "Collection name is required."
      );
    }

    if (!collectionProps || Object.keys(collectionProps).length === 0) {
      throw new CustomError(
        "CollectionPropsError",
        "Collection properties are required."
      );
    }

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
    // close mongodb client connection
    client.close();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new CustomError("DatabaseCollectionError", error.message);
    }
  }
}
