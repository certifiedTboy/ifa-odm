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
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const __1 = require("../");
const model_1 = __importDefault(require("./model"));
const PORT = 3000;
let dbUri = "mongodb://localhost:27017/";
let dbName = "new-db2";
function connectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ifa = new __1.Ifa(dbUri, dbName);
            yield ifa.connect();
            console.log("connection successfull");
        }
        catch (error) {
            console.log(error);
        }
    });
}
// Ifa.createCollection("users", user);
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {
        firstName: "John",
        lastName: "Doe",
        age: 25,
        isGraduated: true,
        email: "etosin70@gmail.com",
    };
    try {
        const result = yield model_1.default.create(userData);
        res.json(result);
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield model_1.default.find();
        res.json(result);
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield connectDb();
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    });
}
startServer();
