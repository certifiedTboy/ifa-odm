import { MongoClient } from "mongodb";
import { createCollection } from "../ifa/connect";

export function GetCollectionParams<
  T extends {
    new (...args: any[]): {
      collectionName: string;
      options: any;
      dbData: { dbName: string; client: MongoClient };
    };
  }
>(originalConstructor: T) {
  return class extends originalConstructor {
    constructor(...args: any[]) {
      super(...args);

      console.log(this.dbData);

      //   const dbData = (global as any).dbData;

      //   console.log(dbData);

      createCollection(
        this.dbData.client,
        this.dbData.dbName,
        this.collectionName,
        this.options
      );
    }
  };
}
