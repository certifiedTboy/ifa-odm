import { CustomError } from "../errors/CustomError";
import { createCollection } from "./collection";

/**
 * @method connect
 * @description Connect to the database using the connection string provided in the global dbData object.
 */
export async function connect() {
  try {
    const dbData = (global as any).dbData;
    const { client, dbName, collectionName, options } = dbData;

    const response = await client.connect();

    if (collectionName && collectionName.trim().length > 0) {
      await createCollection(client, dbName, collectionName, options);
    }
    return response.options.dbName;
  } catch (error) {
    console.error(error);
    throw new CustomError(
      "DatabaseConnectionError",
      "database connection failed"
    );
  }
}
