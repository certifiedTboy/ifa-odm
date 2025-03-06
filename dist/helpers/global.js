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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobalData = exports.setGlobalData = void 0;
const node_sqlite_1 = __importDefault(require("node:sqlite"));
const database = new node_sqlite_1.default.DatabaseSync(":memory:");
database.exec(`
    CREATE TABLE data(
      key INTEGER PRIMARY KEY,
      dbName TEXT,
      connectionString TEXT
    ) STRICT
  `);
const setGlobalData = (dbData) => __awaiter(void 0, void 0, void 0, function* () {
    const insert = database.prepare("INSERT INTO data (key, dbName, connectionString) VALUES (?, ?, ?)");
    insert.run(1, dbData.dbName, dbData.connectionString);
});
exports.setGlobalData = setGlobalData;
const getGlobalData = () => {
    const query = database.prepare("SELECT * FROM data");
    // Execute the prepared statement and log the result set.
    console.log(query.all());
};
exports.getGlobalData = getGlobalData;
