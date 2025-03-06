import { createCollection } from "./connect";
import { CustomError } from "../errors/CustomError";

function GetCollectionParams<
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

      const dbData = (global as any).dbData;

      createCollection(
        dbData.client,
        dbData.dbName,
        this.collectionName,
        this.options
      );
    }
  };
}

@GetCollectionParams
export class Schema {
  options: any;
  collectionName: string;
  constructor(
    collectionName: string,
    options: any,
    timestamps?: { timestamps: boolean }
  ) {
    this.options = timestamps?.timestamps
      ? {
          ...options,
          createAt: { type: "date" },
          updatedAt: { type: "date" },
        }
      : options;
    this.collectionName = collectionName;
  }

  async create(options: any) {
    if (
      Object.keys(this.options).every(
        (key) => typeof options[key] !== this.options[key].type
      )
    ) {
      throw new CustomError(
        "SchemaValidationError",
        "Schema validation failed"
      );
    }

    const dbData = (global as any).dbData;

    const { client, dbName } = dbData;

    const result = await client
      .db(dbName)
      .collection(this.collectionName)
      .insertOne(options);

    return result;
  }

  async find(option?: any) {
    const dbData = (global as any).dbData;

    const { client, dbName } = dbData;
    const result = await client
      .db(dbName)
      .collection(this.collectionName)
      .find(option)
      .toArray();

    return result;
  }

  async findOne(options: any) {
    const dbData = (global as any).dbData;

    const { client, dbName } = dbData;
    const result = await client
      .db(dbName)
      .collection(this.collectionName)
      .findOne(options);

    return result;
  }
}
