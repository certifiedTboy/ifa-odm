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
exports.Schema = void 0;
const CustomError_1 = require("./lib/errors/CustomError");
class Schema {
    constructor(collectionName, options, timestamps) {
        this.options = (timestamps === null || timestamps === void 0 ? void 0 : timestamps.timestamps)
            ? Object.assign(Object.assign({}, options), { createAt: { type: "date" }, updatedAt: { type: "date" } }) : options;
        this.colelctionName = collectionName;
    }
    create(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Object.keys(this.options).every((key) => typeof options[key] !== this.options[key].type)) {
                throw new CustomError_1.CustomError("SchemaValidationError", "Schema validation failed");
            }
            const dbData = globalThis.dbData;
            const { client, dbName } = dbData;
            const result = yield client
                .db(dbName)
                .collection(this.colelctionName)
                .insertOne(options);
            return result;
        });
    }
    find(option) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbData = globalThis.dbData;
            const { client, dbName } = dbData;
            const result = yield client
                .db(dbName)
                .collection(this.colelctionName)
                .find(option)
                .toArray();
            return result;
        });
    }
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbData = globalThis.dbData;
            const { client, dbName } = dbData;
            const result = yield client
                .db(dbName)
                .collection(this.colelctionName)
                .findOne(options);
            return result;
        });
    }
}
exports.Schema = Schema;
