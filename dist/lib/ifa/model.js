"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ifa = void 0;
const mongodb_1 = require("mongodb");
class Ifa {
    constructor(connectString, dbName) {
        globalThis.dbData = {
            connectString: dbName ? `${connectString}${dbName}` : connectString,
            dbName: dbName,
            client: new mongodb_1.MongoClient(connectString),
        };
    }
}
exports.Ifa = Ifa;
