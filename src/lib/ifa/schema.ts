import { ObjectId } from "mongodb";
import { CustomError } from "../errors/CustomError";
import { Validator } from "../../helpers/validators";
import { SchemaHelper } from "../../helpers/schema";
import { MongodbError } from "../errors/MongodbError";

export class Schema {
  private collectionName: string;
  private options: any;
  private timestamps?: { timestamps: boolean };
  private _query: any;
  private _sort: any = null;
  private _limit: number | null = null;
  private _populate: any = null;
  constructor(
    collectionName: string,
    options: any,
    timestamps?: { timestamps: boolean }
  ) {
    this.options = timestamps?.timestamps
      ? { ...options, createdAt: { type: "date" }, updatedAt: { type: "date" } }
      : options;
    this.collectionName = collectionName;

    const dbData = (global as any).dbData;
    (global as any).dbData = {
      ...dbData,
      collectionName: this.collectionName,
      options: this.options,
    };
  }

  create(options: any) {
    try {
      Validator.validateDoc(options);
      const { client, dbName } = (global as any).dbData;

      const doc =
        this.options.createdAt && this.options.updatedAt
          ? SchemaHelper.updateDocTimestamps(options)
          : options;

      return client
        .db(dbName)
        .collection(this.collectionName)
        .insertOne(doc)
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

  createMany(options: any[]) {
    try {
      Validator.validateArrayDoc(options);
      options.forEach((doc) => Validator.validateDoc(doc));

      const { client, dbName } = (global as any).dbData;
      const docs =
        this.options.createdAt && this.options.updatedAt
          ? SchemaHelper.updateArrayDocTimestamps(options)
          : options;

      return client.db(dbName).collection(this.collectionName).insertMany(docs);
    } catch (error: unknown) {
      return Promise.reject(this.handleError(error));
    }
  }

  find(query: any = {}) {
    this._query = { ...query, struct: "many" };

    return this;
  }

  sort(sort: any) {
    this._sort = sort;
    return this;
  }

  limit(limit: number) {
    this._limit = limit;
    return this;
  }

  findOne(options: any) {
    this._query = { ...options, struct: "single" };
    return this;
  }

  findOneById(id: string) {
    try {
      if (!id) throw new CustomError("InvalidQuery", "ObjectId is required");
      Validator.validateObjectId(id);

      const { client, dbName } = (global as any).dbData;
      return client
        .db(dbName)
        .collection(this.collectionName)
        .findOne({ _id: new ObjectId(id) });
    } catch (error: unknown) {
      return Promise.reject(this.handleError(error));
    }
  }

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

  populate() {
    console.log("Populate method is not implemented yet.");
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
          return client
            .db(dbName)
            .collection(this.collectionName)
            .findOne(query);
        }

        return client
          .db(dbName)
          .collection(this.collectionName)
          .findOne(this._query);
      } else {
        delete this._query.struct; // remove struct prop from query
        let cursor = client
          .db(dbName)
          .collection(this.collectionName)
          .find(this._query);

        if (this._sort) cursor = cursor.sort(this._sort);
        if (this._limit !== null) cursor = cursor.limit(this._limit);

        return cursor.toArray();
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
  }
}
