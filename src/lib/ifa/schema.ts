import { ObjectId } from "mongodb";
import { CustomError } from "../errors/CustomError";
import { Validator } from "../../helpers/validators";
import { SchemaHelper } from "../../helpers/schema";
import { createCollection } from "./collection";
import { MongodbError } from "../errors/MongodbError";

/**
 * @class Schema
 * @description This class is used to create a new schema for a collection in the database.
 * It provides methods to create, update, find, and delete documents in the collection.
 * It also provides methods to create and update collections in the database.
 * @param {string} collectionName - The name of the collection to be created.
 * @param {any} options - The properties of the collection to be created.
 * @param {object} timestamps - The timestamps object is used to create and update the createdAt and updatedAt fields in the collection.
 */
export class Schema {
  private collectionName: string;
  private options: any;
  private timestamps?: { timestamps: boolean };
  // private collectionInfo: any[] = [];
  private _query: any;
  private _sort: any = null;
  private _limit: number | null = null;
  private _populate: string[] = [];
  private _project: any = null;
  constructor(
    collectionName: string,
    options: any,
    timestamps?: { timestamps: boolean }
  ) {
    this.options = timestamps?.timestamps
      ? { ...options, createdAt: { type: "date" }, updatedAt: { type: "date" } }
      : options;
    this.collectionName =
      collectionName[collectionName.length - 1] === "s"
        ? collectionName
        : `${collectionName}s`;

    const dbData = (global as any).dbData;
    (global as any).dbData = {
      ...dbData,
      collectionName: this.collectionName,
      options: this.options,
    };
  }

  /**
   * @method create
   * @description This method creates a new document in the collection.
   * It validates the document before inserting it into the collection.
   * @param {object} options - The document to be created.
   */
  create(options: any) {
    try {
      Validator.validateDoc(options);
      const { client, dbName } = (global as any).dbData;

      /**
       * create and update collection if it or does not exist before inserting
       */
      const promise = new Promise((resolve: any, reject: any) => {
        try {
          resolve(
            createCollection(client, dbName, this.collectionName, this.options)
          );
        } catch (error: unknown) {
          reject(error);
        }
      });

      promise.then().catch((error: unknown) => console.log(error));

      const doc =
        this.options.createdAt && this.options.updatedAt
          ? SchemaHelper.updateDocTimestamps(options)
          : options;

      let newDoc = { ...this.options, ...doc };

      for (let key in newDoc) {
        if (Array.isArray(newDoc[key]) && !newDoc[key][0].required) {
          newDoc = { ...newDoc, [key]: [] };
        }
      }

      return client
        .db(dbName)
        .collection(this.collectionName)
        .insertOne(newDoc)
        .then((result: any) =>
          client
            .db(dbName)
            .collection(this.collectionName)
            .findOne({ _id: result.insertedId })
            .then((createdDoc: any) => ({ ...result, ...createdDoc }))
        );
    } catch (error: unknown) {
      return Promise.reject(this.handleError(error));
    }
  }

  /**
   * @method createMany
   * @description This method creates multiple documents in the collection.
   * It validates the documents before inserting them into the collection.
   * @param {array} options - The array of documents to be created.
   */
  createMany(options: any[]) {
    try {
      /**
       * validate options if it is an array
       * this is to prevent the user from passing an invalid document
       */
      Validator.validateArrayDoc(options);

      /**
       * validate each document in the array
       * this is to prevent the user from passing an invalid document
       */
      options.forEach((doc) => Validator.validateDoc(doc));

      const { client, dbName } = (global as any).dbData;

      /**
       * create and update collection if it or does not exist before inserting
       */
      const promise = new Promise((resolve: any, reject: any) => {
        try {
          resolve(
            createCollection(client, dbName, this.collectionName, this.options)
          );
        } catch (error: unknown) {
          reject(error);
        }
      });

      promise.then().catch((error: unknown) => console.log(error));

      const docs =
        this.options.createdAt && this.options.updatedAt
          ? SchemaHelper.updateArrayDocTimestamps(options)
          : options;

      return client.db(dbName).collection(this.collectionName).insertMany(docs);
    } catch (error: unknown) {
      return Promise.reject(this.handleError(error));
    }
  }

  /**
   * @method persist
   * @description This method updates a document in the collection.
   * @param {object} options - The document to be updated.
   */
  persist(options: any) {
    try {
      const { client, dbName } = (global as any).dbData;

      return client
        .db(dbName)
        .collection(this.collectionName)
        .findOneAndUpdate(
          { _id: new ObjectId(options._id.toString()) },
          { $set: { ...options } },
          { returnDocument: "after" }
        );
    } catch (error: unknown) {
      return Promise.reject(this.handleError(error));
    }
  }

  /**
   * @method find
   * @description This method finds a document in the collection.
   * It returns an array of documents if no query is provided.
   * It must be called with the exec method to execute the query.
   * @param {object} query - The query to be used to find the documents in the collection.
   */
  find(query: any = {}) {
    this._query = { ...query, struct: "many" };

    return this;
  }

  /**
   * @sort
   * @description This method sorts the documents in the collection.
   * It must be called with the exec method to execute the query.
   * @param {number} sort - Defines the sort order of the documents in the collection.
   * 1 for ascending order and -1 for descending order.
   */
  sort(sort: any) {
    this._sort = sort;
    return this;
  }

  /**
   * @method limit
   * @description This method limits the number of documents returned in the query.
   * It must be called with the exec method to execute the query.
   * @param {number} limit - The maximum number of documents to be returned in the query.
   */
  limit(limit: number) {
    this._limit = limit;
    return this;
  }

  /**
   * @method populate
   * @description This method populates the documents in the collection with data from a reference collection.
   * It must be called with the exec method to execute the query.
   * @param {string} field - The field to be populated in the documents.
   * @param {object} project - It provides which fields to include or exclude from the populated documents.
   */
  populate(field: string, project?: {}) {
    this._populate.push(field);
    this._project = project;
    return this;
  }

  /**
   * @method findOne
   * @description This method finds a single document in the collection.
   * It returns a single document if no query is provided.
   * It must be called with the exec method to execute the query.
   * @param {object} options - The query to be used to find the document in the collection.
   */
  findOne(options: any) {
    this._query = { ...options, struct: "single" };
    return this;
  }

  /**
   * @method findOneById
   * @description This method finds a single document in the collection by its id.
   * It returns a single document if no query is provided.
   * It must be called with the exec method to execute the query.
   * @param {string} id - The id of the document to be found in the collection.
   */
  findOneById(id: string) {
    if (!id) throw new CustomError("InvalidQuery", "ObjectId is required");

    this._query = { _id: id, struct: "single" };

    return this;
  }

  /**
   * @method updateOne
   * @description This method updates a single document in the collection.
   * It returns the updated document if no query is provided.
   * @param {object} filter - The query to be used to find the document in the collection.
   * @param {object} options - The document to be updated.
   */
  updateOne(filter: any, options: any) {
    try {
      if (!filter)
        throw new CustomError("InvalidQuery", "filter prop is required");

      Validator.validateDoc(options);
      Validator.validateQueryDoc(filter);

      const { client, dbName } = (global as any).dbData;
      const update = { $set: { ...options, updatedAt: new Date() } };

      const query = filter._id
        ? { _id: new ObjectId(filter._id) }
        : { ...filter };

      return client
        .db(dbName)
        .collection(this.collectionName)
        .findOneAndUpdate(query, update, { returnDocument: "after" });
    } catch (error: unknown) {
      return Promise.reject(this.handleError(error));
    }
  }

  /**
   * @method updateOneById
   * @description This method updates a single document in the collection by its id.
   * It returns the updated document if no query is provided.
   * @param {string} id - The id of the document to be updated in the collection.
   * @param {object} options - The document to be updated.
   */
  updateOneById(id: ObjectId | string, options: any) {
    try {
      if (!id) throw new CustomError("InvalidQuery", "ObjectId is required");

      Validator.validateObjectId(id);
      Validator.validateDoc(options);

      const { client, dbName } = (global as any).dbData;
      const update = { $set: { ...options, updatedAt: new Date() } };

      return client
        .db(dbName)
        .collection(this.collectionName)
        .findOneAndUpdate({ _id: new ObjectId(id) }, update, {
          returnDocument: "after",
        });
    } catch (error: unknown) {
      return Promise.reject(this.handleError(error));
    }
  }

  /**
   * @method updateMultiple
   * @description This method updates multiple documents in the collection.
   * It returns the updated documents if no query is provided.
   * @param {object} filter - The query to be used to find the documents in the collection.
   * @param {object} options - The array of documents to be updated.
   */
  updateMultiple(filter: any, options: any) {
    try {
      if (!filter)
        throw new CustomError("InvalidQuery", "filter prop is required");

      Validator.validateDoc(options);
      Validator.validateQueryDoc(filter);

      const { client, dbName } = (global as any).dbData;
      const update = { $set: { ...options, updatedAt: new Date() } };

      return client
        .db(dbName)
        .collection(this.collectionName)
        .updateMany(filter, update);
    } catch (error: unknown) {
      return Promise.reject(this.handleError(error));
    }
  }

  /**
   * @method removeOne
   * @description This method removes a single document from the collection.
   * It returns the deleted document if no query is provided.
   * @param {object} filter - The query to be used to find the document in the collection to be removed.
   */
  removeOne(filter: any) {
    try {
      Validator.validateQueryDoc(filter);
      const { client, dbName } = (global as any).dbData;

      if (filter._id) {
        Validator.validateObjectId(filter._id);
        return client
          .db(dbName)
          .collection(this.collectionName)
          .deleteOne(filter);
      } else {
        return client
          .db(dbName)
          .collection(this.collectionName)
          .deleteOne(filter);
      }
    } catch (error: unknown) {
      return Promise.reject(this.handleError(error));
    }
  }

  /**
   * @method removeOneById
   * @description This method removes a single document from the collection by its id.
   * @param {string | ObjectId} id - The id of the document to be removed from the collection.
   */
  removeOneById(id: ObjectId | string) {
    try {
      if (!id) throw new CustomError("InvalidQuery", "ObjectId is required");

      Validator.validateObjectId(id);
      const { client, dbName } = (global as any).dbData;

      return client
        .db(dbName)
        .collection(this.collectionName)
        .deleteOne({ _id: new ObjectId(id) });
    } catch (error: unknown) {
      return Promise.reject(this.handleError(error));
    }
  }

  /**
   * @method removeMany
   * @description This method removes multiple documents from the collection.
   * It returns the deleted documents if no query is provided.
   * @param {object} filter - The query to be used to find the documents in the collection to be removed.
   */
  removeMany(filter: any) {
    try {
      if (!filter)
        throw new CustomError("InvalidQuery", "filter prop is required");

      Validator.validateQueryDoc(filter);
      const { client, dbName } = (global as any).dbData;

      return client
        .db(dbName)
        .collection(this.collectionName)
        .deleteMany(filter);
    } catch (error: unknown) {
      return Promise.reject(this.handleError(error));
    }
  }

  private handleError(error: unknown) {
    if (error instanceof CustomError && error.type) {
      return new CustomError(error.type, error.message);
    }
    if (error instanceof Error) {
      return new MongodbError(error.message);
    }
    return error;
  }

  /**
   * @method exec
   * @description This method executes the query and returns the result.
   * It must be called after the find, findOne, findOneById, sort, populate, or limit methods to execute the query.
   *
   */
  exec(): Promise<any> {
    try {
      const { client, dbName } = (global as any).dbData;

      if (this._query.struct === "single") {
        delete this._query.struct; // remove struct prop from query

        /**
         * validate query doc if no query is provided
         * this is to prevent the user from passing an empty query object
         */
        if (Object.keys(this._query).length <= 0) {
          Validator.validateQueryDoc(this._query);
        }

        let query;

        if (this._query._id) {
          /**
           * validate objectId if _id is provided in the query
           * this is to prevent the user from passing an invalid objectId
           */
          Validator.validateObjectId(this._query._id);
          query = { _id: new ObjectId(this._query._id) };
        }

        query = { ...this._query, ...query };

        if (this._populate && this._populate.length > 0) {
          const cursor = client
            .db(dbName)
            .collection(this.collectionName)
            .aggregate(
              SchemaHelper.getRefDocs(
                this.options,
                this._populate,
                query,
                this._project
              )
            )
            .toArray();

          const promise = new Promise((resolve: any, reject: any) => {
            resolve(cursor);
          });

          return promise.then((data: any) => data[0]);
        } else {
          return client
            .db(dbName)
            .collection(this.collectionName)
            .findOne(query);
        }
      } else {
        delete this._query.struct; // remove struct prop from query

        if (this._populate && this._populate.length > 0) {
          return client
            .db(dbName)
            .collection(this.collectionName)
            .aggregate(
              SchemaHelper.getRefDocs(
                this.options,
                this._populate,
                {},
                this._project
              )
            )
            .toArray();
        } else {
          let cursor = client
            .db(dbName)
            .collection(this.collectionName)
            .find(this._query);

          if (this._sort) cursor = cursor.sort(this._sort);
          if (this._limit !== null) cursor = cursor.limit(this._limit);

          return cursor.toArray();
        }
      }
    } catch (error: unknown) {
      return Promise.reject(this.handleError(error));
    } finally {
      this._resetBuilderState(); // clean after execution
    }
  }

  private _resetBuilderState() {
    this._query = {};
    this._sort = null;
    this._limit = null;
    this._populate = [];
    this._project = null;
  }
}
