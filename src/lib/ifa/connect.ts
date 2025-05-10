import { CustomError } from "../errors/CustomError";

/**
 * @method connect
 * @description Connect to the database using the connection string provided in the global dbData object.
 */
export async function connect() {
  try {
    const dbData = (global as any).dbData;
    const { client } = dbData;

    const response = await client.connect();

    return response.options.dbName;
  } catch (error) {
    throw new CustomError(
      "DatabaseConnectionError",
      "database connection failed"
    );
  }
}
