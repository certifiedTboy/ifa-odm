const mquery = require("mquery");
import { ObjectId } from "mongodb";
import { CustomError } from "../errors/CustomError";
import { Validator } from "../../helpers/validators";
import { MongodbError } from "../errors/MongodbError";

/**
 * @class Schema
 * @description A class that provides a schema for MongoDB collections and related model operations.
 * @param {string} collectionName - The name of the collection.
 * @param {object} options - The schema options for the collection.
 * @param {object} [timestamps] - Optional timestamps for the collection.
 * @static create - Creates a new document in the collection.
 * @static createMany - Creates multiple documents in the collection.
 * @static find - Finds documents in the collection based on the provided options.
 * @static findOne - Finds a single document in the collection based on the provided options.
 * @static findOneById - Finds a single document in the collection by its ObjectId.
 * @static updateOne - Updates a single document in the collection based on the provided property and options.
 * @static updateOneById - Updates a single document in the collection by its ObjectId and update data.
 * @static deleteOne - Deletes a single document in the collection based on the provided property.
 * @static deleteOneById - Deletes a single document in the collection by its ObjectId.
 * @static deleteMany - Deletes multiple documents in the collection based on the provided options.
 */
export class Schema {
  private options: any;
  private collectionName: string;
  private timestamps?: { timestamps: boolean };
  constructor(
    collectionName: string,
    options: any,
    timestamps?: { timestamps: boolean }
  ) {
    this.options = timestamps?.timestamps
      ? {
          ...options,
          createdAt: { type: "date" },
          updatedAt: { type: "date" },
        }
      : options;
    this.collectionName = collectionName;

    const dbData = (global as any).dbData;

    (global as any).dbData = {
      ...dbData,
      collectionName: this.collectionName,
      options: this.options,
      timestamps: timestamps ? timestamps : null,
    };
  }

  async create(options: any) {
    try {
      // validate if options is a valid object
      Validator.validateDoc(options);
      Validator.validateDocProps(this.options, options);

      const { client, dbName } = (global as any).dbData;

      const result = await client
        .db(dbName)
        .collection(this.collectionName)
        .insertOne(options);

      // query database for the created document
      const createdDoc = await client
        .db(dbName)
        .collection(this.collectionName)
        .findOne({ _id: result.insertedId });

      return { ...result, ...createdDoc };
    } catch (error: unknown) {
      if (error instanceof CustomError && error.type) {
        throw new CustomError(error.type, error.message);
      }

      if (error instanceof Error) {
        throw new MongodbError(error.message);
      }
    }
  }

  async createMany(options: any[]) {
    try {
      Validator.validateArrayDoc(options);

      for (let doc of options) {
        Validator.validateDoc(doc);
        Validator.validateDocProps(this.options, doc);
      }

      const { client, dbName } = (global as any).dbData;

      const result = await client
        .db(dbName)
        .collection(this.collectionName)
        .insertMany(options);

      return result;
    } catch (error: unknown) {
      if (error instanceof CustomError && error.type) {
        throw new CustomError(error.type, error.message);
      }

      if (error instanceof Error) {
        throw new MongodbError(error.message);
      }
    }
  }

  async find(options?: any) {
    try {
      const { client, dbName } = (global as any).dbData;

      if (options) {
        Validator.validateQueryDoc(options);

        const result = await client
          .db(dbName)
          .collection(this.collectionName)
          .find(options)
          .toArray();

        return result;
      }

      const result = await client
        .db(dbName)
        .collection(this.collectionName)
        .find({})
        .toArray();

      return result;
    } catch (error: unknown) {
      if (error instanceof CustomError && error.type) {
        throw new CustomError(error.type, error.message);
      }

      if (error instanceof Error) {
        throw new MongodbError(error.message);
      }
    }
  }

  async findOne(options: any) {
    try {
      const { client, dbName } = (global as any).dbData;

      if (!options) {
        throw new CustomError("InvalidQuery", "Invalid query provided");
      }

      if (Array.isArray(options)) {
        throw new CustomError("InvalidQuery", "Invalid query provided");
      }

      Validator.validateQueryDoc(options);

      const result = await client
        .db(dbName)
        .collection(this.collectionName)
        .findOne(options);

      return result;
    } catch (error: unknown) {
      if (error instanceof CustomError && error.type) {
        throw new CustomError(error.type, error.message);
      }

      if (error instanceof Error) {
        throw new MongodbError(error.message);
      }
    }
  }

  async findOneById(id: string) {
    try {
      if (!id) {
        throw new CustomError("InvalidQuery", "ObjectId is required");
      }

      Validator.validateObjectId(id);

      const { client, dbName } = (global as any).dbData;

      const result = await client
        .db(dbName)
        .collection(this.collectionName)
        .findOne({ _id: new ObjectId(id) });

      return result;
    } catch (error: unknown) {
      if (error instanceof CustomError && error.type) {
        throw new CustomError(error.type, error.message);
      }

      if (error instanceof Error) {
        throw new MongodbError(error.message);
      }
    }
  }

  async updateOne(filter: any, options: any) {
    try {
      if (!filter) {
        throw new CustomError("InvalidQuery", "filter prop is required");
      }

      if (ObjectId.isValid(filter?._id)) {
        throw new CustomError(
          "InvalidQuery",
          "ObjectId is not accepted user updateOneById instead"
        );
      }

      Validator.validateDoc(options);
      Validator.validateQueryDoc(filter);
      Validator.validateUpdateDocProps(this.options, options);

      const { client, dbName } = (global as any).dbData;

      const result = await client
        .db(dbName)
        .collection(this.collectionName)
        .findOneAndUpdate(
          { ...filter },
          { $set: { ...options, updatedAt: new Date() } },
          { returnDocument: "after" }
        );

      return result;
    } catch (error: unknown) {
      if (error instanceof CustomError && error.type) {
        throw new CustomError(error.type, error.message);
      }

      if (error instanceof Error) {
        throw new MongodbError(error.message);
      }
    }
  }

  async updateOneById(id: ObjectId | string, updateData: any) {
    try {
      const { client, dbName } = (global as any).dbData;

      const result = await client
        .db(dbName)
        .collection(this.collectionName)
        .findOneAndUpdate(
          { _id: id },
          { $set: updateData, updatedAt: new Date() },
          { returnDocument: "after" }
        );

      return result;
    } catch (error: unknown) {
      if (error instanceof CustomError && error.type) {
        throw new CustomError(error.type, error.message);
      }

      if (error instanceof Error) {
        throw new MongodbError(error.message);
      }
    }
  }
}
