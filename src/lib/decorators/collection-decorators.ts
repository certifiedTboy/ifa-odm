import { createCollection } from "../ifa/connect";

export function GetCollectionParams<
  T extends {
    new (...args: any[]): {
      collectionName: string;
      options: any;
    };
  }
>(originalConstructor: T) {
  return class extends originalConstructor {
    constructor(...args: any[]) {
      super(...args);

      console.log("creating collection");
      const dbData = (global as any).dbData;

      (async (collectionName: string, options: any) => {
        await createCollection(
          dbData.client,
          dbData.dbName,
          collectionName,
          options
        );
      })(this.collectionName, this.options);
    }
  };
}
