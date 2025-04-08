import { CustomError } from "../errors/CustomError";
import { createCollection } from "./collection";
import Kareem from "kareem";

// Create a kareem instance globally or per function flow
// const hooks = new Kareem();

/**
 * @method connect
 * @description Connect to the database using the connection string provided in the global dbData object.
 */
export async function connect() {
  console.log("connecting to database");
  try {
    const dbData = (global as any).dbData;
    const { client, dbName, collectionName, options } = dbData;

    console.log(dbName, collectionName);

    console.log(options);

    await client.connect();

    // await createCollection(client, dbName, collectionName, options);
  } catch (error) {
    console.error(error);
    throw new CustomError(
      "DatabaseConnectionError",
      "database connection failed"
    );
  }
}

// const createDatabaseCollections = async () => {
//   const dbData = (global as any).dbData;
//   const { client, dbName, collectionName, options } = dbData;

//   await createCollection(client, dbName, collectionName, options);
// };

// // @ts-ignore
// hooks.pre("save", function (next) {
//   console.log("Before saving...");
//   next();
// });

// // @ts-ignore
// hooks.post("save", function (res, next) {
//   console.log("After saving. Result:", res);
//   next();
// });

// // @ts-ignore
// hooks.execPre("save", null, function () {
//   const result = "User saved successfully!";

//   hooks.execPost("save", null, [result], function () {
//     console.log("All done!");
//   });
// });
