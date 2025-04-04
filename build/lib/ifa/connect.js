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
exports.createCollection = exports.connect = void 0;
const CustomError_1 = require("../errors/CustomError");
const schema_1 = require("../../helpers/schema");
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dbData = global.dbData;
            const { client } = dbData;
            yield client.connect();
        }
        catch (error) {
            throw new CustomError_1.CustomError("DatabaseConnectionError", "database connection failed");
        }
    });
}
exports.connect = connect;
function createCollection(client, dbName, collectionName, collectionProps) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const validationSchema = {
                $jsonSchema: {
                    bsonType: "object",
                    required: schema_1.SchemaHelper.getRequiredFields(collectionProps),
                    properties: schema_1.SchemaHelper.getCollectionProps(collectionProps),
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
                const uniqueProps = schema_1.SchemaHelper.getUniqueProps(collectionProps);
                for (let data in uniqueProps) {
                    yield client
                        .db(dbName)
                        .collection(collectionName)
                        .createIndex({ [data]: 1 }, { unique: true });
                }
            }
            else {
                yield client.db(dbName).createCollection(collectionName);
                yield client.db(dbName).command({
                    collMod: collectionName,
                    validator: validationSchema,
                    validationLevel: "strict",
                });
                const uniqueProps = schema_1.SchemaHelper.getUniqueProps(collectionProps);
                for (let data in uniqueProps) {
                    yield client
                        .db(dbName)
                        .collection(collectionName)
                        .createIndex({ [data]: 1 }, { unique: true });
                }
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw new CustomError_1.CustomError("DatabaseCollectionError", error.message);
            }
        }
    });
}
exports.createCollection = createCollection;
