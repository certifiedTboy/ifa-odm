import { MongoClient } from "mongodb";
import { CustomError } from "./lib/errors/CustomError";

export class Schema {
  options: any;
  colelctionName: string;
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

    this.colelctionName = collectionName;
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

    const dbData = (globalThis as any).dbData;

    const { client, dbName } = dbData;

    const result = await client
      .db(dbName)
      .collection(this.colelctionName)
      .insertOne(options);

    return result;
  }

  async find(option?: any) {
    const dbData = (globalThis as any).dbData;

    const { client, dbName } = dbData;
    const result = await client
      .db(dbName)
      .collection(this.colelctionName)
      .find(option)
      .toArray();

    return result;
  }

  async findOne(options: any) {
    const dbData = (globalThis as any).dbData;

    const { client, dbName } = dbData;
    const result = await client
      .db(dbName)
      .collection(this.colelctionName)
      .findOne(options);

    return result;
  }
}
