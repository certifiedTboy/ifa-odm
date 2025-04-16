const mquery = require("mquery");
import { ObjectId, Document } from "mongodb";
import { CustomError } from "../errors/CustomError";
import { Validator } from "../../helpers/validators";
import { MongodbError } from "../errors/MongodbError";

/**
 * @class Schema
 * @description A class that provides a schema for MongoDB collections and related model operations.
 * @param {string} collectionName - The name of the collection.
 * @param {object} options - The schema options for the collection.
 * @param {object} [timestamps] - Optional timestamps for the collection.
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

  /**
   * @method create
   * @description Creates a new document in the collection.
   * @param {object} options - The document to be created.
   * @returns {Promise<Document>} - The created document.
   * @throws {CustomError} - If the document is invalid or if there is an error during creation.
   * @throws {MongodbError} - If there is an error during the MongoDB operation.
   */
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

  /**
   * @method createMany
   * @description Creates multiple documents in the collection.
   * @param {Array<object>} options - The documents to be created.
   * @return {Promise<Document[]>} - The created documents.
   * @throws {CustomError} - If the documents are invalid or if there is an error during creation.
   * @throws {MongodbError} - If there is an error during the MongoDB operation.
   */
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

  /**
   * @method find
   * @description Finds documents in the collection based on the provided options.
   * @param {object} [options] - The query options to filter the documents.
   * @return {Promise<Document[]>} - The found documents.
   * @throws {CustomError} - If the query is invalid or if there is an error during the operation.
   * @throws {MongodbError} - If there is an error during the MongoDB operation.
   */
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

  /**
   * @method findOne
   * @description Finds a single document in the collection based on the provided options.
   * @param {object} options - The query options to filter the document.
   * @return {Promise<Document>} - The found document.
   * @throws {CustomError} - If the query is invalid or if there is an error during the operation.
   * @throws {MongodbError} - If there is an error during the MongoDB operation.
   */
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

  /**
   * @method findOneById
   * @description Finds a single document in the collection by its ObjectId.
   * @param id - The ObjectId of the document to be found.
   * @return {Promise<Document>} - The found document.
   * @throws {CustomError} - If the ObjectId is invalid or if there is an error during the operation.
   * @throws {MongodbError} - If there is an error during the MongoDB operation.
   */
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

  /**
   * @method updateOne
   * @description Updates a single document in the collection based on the provided filter and options.
   * @param {object} filter - The filter to find the document to be updated.
   * @param {object} options - The update options to be applied to the document.
   * @return {Promise<Document>} - The updated document.
   * @throws {CustomError} - If the filter or options are invalid or if there is an error during the operation.
   * @throws {MongodbError} - If there is an error during the MongoDB operation.
   */
  async updateOne(filter: any, options: any) {
    try {
      if (!filter) {
        throw new CustomError("InvalidQuery", "filter prop is required");
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

  /**
   * @method updateOneById
   * @description Updates a single document in the collection by its ObjectId.
   * @param {ObjectId | string} id - The ObjectId of the document to be updated.
   * @param {object} options - The update options to be applied to the document.
   * @returns {Promise<Document>} - The updated document.
   * @throws {CustomError} - If the ObjectId is invalid or if there is an error during the operation.
   * @throws {MongodbError} - If there is an error during the MongoDB operation.
   */
  async updateOneById(id: ObjectId | string, options: any) {
    try {
      const { client, dbName } = (global as any).dbData;

      if (!id) {
        throw new CustomError("InvalidQuery", "ObjectId is required");
      }

      Validator.validateObjectId(id);
      Validator.validateDoc(options);
      Validator.validateUpdateDocProps(this.options, options);

      const result = await client
        .db(dbName)
        .collection(this.collectionName)
        .findOneAndUpdate(
          { _id: id },
          { $set: options, updatedAt: new Date() },
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

  /**
   * @method updateMultiple
   * @description Updates multiple documents in the collection based on the provided filter and options.
   * @param {object} filter - The filter to find the documents to be updated.
   * @param {object} options - The update options to be applied to the documents.
   * @return {Promise<Document>} - The result of the update operation.
   * @throws {CustomError} - If the filter or options are invalid or if there is an error during the operation.
   * @throws {MongodbError} - If there is an error during the MongoDB operation.
   */
  async updateMultiple(filter: any, options: any) {
    try {
      if (!filter) {
        throw new CustomError("InvalidQuery", "filter prop is required");
      }

      Validator.validateDoc(options);
      Validator.validateQueryDoc(filter);
      Validator.validateUpdateDocProps(this.options, options);

      const { client, dbName } = (global as any).dbData;

      const result = await client
        .db(dbName)
        .collection(this.collectionName)
        .updateMany(
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

  /**
   * @method removeOne
   * @description Removes a single document from the collection based on the provided filter.
   * @param {object} filter - The filter to find the document to be removed.
   * @return {Promise<Document>} - The result of the remove operation.
   * @throws {CustomError} - If the filter is invalid or if there is an error during the operation.
   * @throws {MongodbError} - If there is an error during the MongoDB operation.
   */
  async removeOne(filter: any) {
    try {
      const { client, dbName } = (global as any).dbData;
      Validator.validateQueryDoc(filter);
      const result = await client
        .db(dbName)
        .collection(this.collectionName)
        .deleteOne({ ...filter });

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

  /**
   * @method removeOneById
   * @description Removes a single document from the collection by its ObjectId.
   * @param {ObjectId | string} id - The ObjectId of the document to be removed.
   * @return {Promise<Document>} - The result of the remove operation.
   * @throws {CustomError} - If the ObjectId is invalid or if there is an error during the operation.
   * @throws {MongodbError} - If there is an error during the MongoDB operation.
   */
  async removeOneById(id: ObjectId | string) {
    try {
      if (!id) {
        throw new CustomError("InvalidQuery", "ObjectId is required");
      }

      Validator.validateObjectId(id);

      const { client, dbName } = (global as any).dbData;
      const result = await client(dbName)
        .collection(this.collectionName)
        .deleteOne({ _id: id });

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

  /**
   * @method removeMany
   * @description Removes multiple documents from the collection based on the provided filter.
   * @param {object} filter - The filter to find the documents to be removed.
   * @return {Promise<Document>} - The result of the remove operation.
   * @throws {CustomError} - If the filter is invalid or if there is an error during the operation.
   * @throws {MongodbError} - If there is an error during the MongoDB operation.
   */
  async removeMany(filter: any) {
    try {
      const { client, dbName } = (global as any).dbData;

      if (!filter) {
        throw new CustomError("InvalidQuery", "filter prop is required");
      }

      Validator.validateQueryDoc(filter);
      const result = await client
        .db(dbName)
        .collection(this.collectionName)
        .deleteMany({ ...filter });

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
