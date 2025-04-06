import { MongoClient } from "mongodb";

// export class Ifa {
//   constructor(connectString: string, dbName: string) {
//     console.log("initialize instance of Ifa");
//     (global as any).dbData = {
//       connectString: dbName ? `${connectString}${dbName}` : connectString,
//       dbName: dbName,
//       client: new MongoClient(connectString),
//     };
//   }
// }

export const initializeIfa = (connectString: string, dbName: string) => {
  console.log("initialize instance of Ifa");
  (global as any).dbData = {
    connectString: dbName ? `${connectString}${dbName}` : connectString,
    dbName: dbName,
    client: new MongoClient(connectString),
  };
};
