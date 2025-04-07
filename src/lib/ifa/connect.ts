import { CustomError } from "../errors/CustomError";
import { createCollection } from "./collection";

/**
 * @method connect
 * @description Connect to the database using the connection string provided in the global dbData object.
 */
export async function connect() {
  console.log("connecting to database");
  try {
    const dbData = (global as any).dbData;
    const { client, dbName, collectionName, options } = dbData;

    await client.connect();

    await createCollection(client, dbName, collectionName, options);
  } catch (error) {
    throw new CustomError(
      "DatabaseConnectionError",
      "database connection failed"
    );
  }
}
