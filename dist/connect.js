"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ifa = void 0;
const mongodb_1 = require("mongodb");
const helpers_1 = require("./helpers");
const CustomError_1 = require("./lib/errors/CustomError");
class Ifa {
    constructor(connectionString, dbName) {
        this.connectionString = dbName
            ? `${connectionString}${dbName}`
            : connectionString;
        this.dbName = dbName;
        this.client = new mongodb_1.MongoClient(this.connectionString);
        globalThis.dbData = {
            connectionString: this.connectionString,
            dbName: this.dbName,
            client: this.client,
        };
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.dbName) {
                    yield this.client.connect();
                }
                else {
                    yield this.client.connect();
                    const db = this.client.db().databaseName;
                    if (db) {
                        this.dbName = db;
                    }
                }
            }
            catch (error) {
                throw new CustomError_1.CustomError("DatabaseConnectionError", "database connection failed");
            }
        });
    }
    static createCollection(collectionName, collectionProps) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const globalData = globalThis.dbData;
                const { dbName, client } = globalData;
                const validationSchema = {
                    $jsonSchema: {
                        bsonType: "object",
                        required: (0, helpers_1.getRequiredFields)(collectionProps.options),
                        properties: (0, helpers_1.getCollectionProps)(collectionProps.options),
                    },
                };
                const existingCollections = yield client
                    .db(dbName)
                    .listCollections()
                    .toArray();
                if ((existingCollections === null || existingCollections === void 0 ? void 0 : existingCollections.length) > 0 &&
                    existingCollections.some((collection) => collection.name === collectionName)) {
                    yield client.db(dbName).command({
                        collMod: collectionName,
                        validator: validationSchema,
                        validationLevel: "strict",
                    });
                    const uniqueProps = (0, helpers_1.getUniqueProps)(collectionProps.options);
                    for (let data in uniqueProps) {
                        yield client
                            .db(dbName)
                            .collection(collectionName)
                            .createIndex({ [data]: 1 }, { unique: true });
                    }
                    return;
                }
                yield client.db(dbName).createCollection(collectionName);
                yield client.db(dbName).command({
                    collMod: collectionName,
                    validator: validationSchema,
                    validationLevel: "strict",
                });
                const uniqueProps = (0, helpers_1.getUniqueProps)(collectionProps.options);
                for (let data in uniqueProps) {
                    yield client
                        .db(dbName)
                        .collection(collectionName)
                        .createIndex({ [data]: 1 }, { unique: true });
                }
            }
            catch (error) {
                console.log(error);
                throw new CustomError_1.CustomError("DatabaseCollectionError", "collection creation failed");
            }
        });
    }
}
exports.Ifa = Ifa;
