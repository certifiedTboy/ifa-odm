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

      const onCreateCollection = async () => {
        await createCollection(
          dbData.client,
          dbData.dbName,
          this.collectionName,
          this.options
        );

        onCreateCollection();
      };
    }
  };
}
