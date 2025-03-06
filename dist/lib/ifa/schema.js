"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const connect_1 = require("./connect");
const CustomError_1 = require("../errors/CustomError");
function GetCollectionParams(originalConstructor) {
    return class extends originalConstructor {
        constructor(...args) {
            super(...args);
            const dbData = global.dbData;
            (0, connect_1.createCollection)(dbData.client, dbData.dbName, this.collectionName, this.options);
        }
    };
}
let Schema = class Schema {
    constructor(collectionName, options, timestamps) {
        this.options = (timestamps === null || timestamps === void 0 ? void 0 : timestamps.timestamps)
            ? Object.assign(Object.assign({}, options), { createAt: { type: "date" }, updatedAt: { type: "date" } }) : options;
        this.collectionName = collectionName;
    }
    create(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Object.keys(this.options).every((key) => typeof options[key] !== this.options[key].type)) {
                throw new CustomError_1.CustomError("SchemaValidationError", "Schema validation failed");
            }
            const dbData = global.dbData;
            const { client, dbName } = dbData;
            const result = yield client
                .db(dbName)
                .collection(this.collectionName)
                .insertOne(options);
            return result;
        });
    }
    find(option) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbData = global.dbData;
            const { client, dbName } = dbData;
            const result = yield client
                .db(dbName)
                .collection(this.collectionName)
                .find(option)
                .toArray();
            return result;
        });
    }
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbData = global.dbData;
            const { client, dbName } = dbData;
            const result = yield client
                .db(dbName)
                .collection(this.collectionName)
                .findOne(options);
            return result;
        });
    }
};
exports.Schema = Schema;
exports.Schema = Schema = __decorate([
    GetCollectionParams
], Schema);
