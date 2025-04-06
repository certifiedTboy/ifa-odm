import Kareem from "kareem";
import { createCollection } from "../ifa/collection";
import { Schema } from "../ifa/schema";

const hooks = new Kareem();

export function GetCollectionParams<
  T extends {
    new (...args: any[]): {
      collectionName: string;
      options: any;
      hooks: any;
    };
  }
>(originalConstructor: T) {
  return class extends originalConstructor {
    constructor(...args: any[]) {
      super(...args);

      const dbData = (global as any).dbData;

      hooks.post("init", async () => {
        (async (collectionName: string, options: any) => {
          await createCollection(
            dbData?.client,
            dbData?.dbName,
            collectionName,
            options
          );
        })(this.collectionName, this.options);
      });
    }
  };
}
