import { CustomError } from "../errors/CustomError";

// @GetCollectionParams
export class Schema {
  options: any;
  collectionName: string;
  timestamps?: { timestamps: boolean };
  constructor(
    collectionName: string,
    options: any,
    timestamps?: { timestamps: boolean }
  ) {
    console.log("initialize instance of Schema");
    this.options = timestamps?.timestamps
      ? {
          ...options,
          createAt: { type: "date" },
          updatedAt: { type: "date" },
        }
      : options;
    this.collectionName = collectionName;

    (global as any).dbData = {
      collectionName: this.collectionName,
      options: this.options,
      timestamps: timestamps ? timestamps : null,
    };
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
