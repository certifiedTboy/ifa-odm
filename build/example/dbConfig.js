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
exports.connectDb = void 0;
const model_1 = require("../lib/ifa/model");
const connect_1 = require("../lib/ifa/connect");
let dbUri = "mongodb://localhost:27017/";
let dbName = "new-db2";
new model_1.Ifa(dbUri, dbName);
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_1.connect)();
        console.log("connection successfull");
    }
    catch (error) {
        console.log(error);
    }
});
exports.connectDb = connectDb;
