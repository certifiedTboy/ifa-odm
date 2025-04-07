import { CustomError } from "../errors/CustomError";
import { createCollection } from "./collection";

/**
 * @method connect
 * @description Connect to the database using the connection string provided in the global dbData object.
 */
export async function connect() {
  try {
    const dbData = (global as any).dbData;
    const { client, dbName, collectionName, options, timestamps } = dbData;
    await createCollection(client, dbName, collectionName, options);
    await client.connect();
  } catch (error) {
    throw new CustomError(
      "DatabaseConnectionError",
      "database connection failed"
    );
  }
}
