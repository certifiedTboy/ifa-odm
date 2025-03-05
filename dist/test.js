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
const _1 = require("./");
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ifa = new _1.Ifa("mongodb://localhost:27017/", "ifa-db");
        yield ifa.connect();
        // ifa.getGlobalData();
        console.log("connection successfull");
        const userSchema = new _1.Schema("users", {
            username: { type: "string", required: true, unique: true },
            age: { type: "number", required: true },
            dob: { type: "date", required: false },
        }, { timestamps: true });
        _1.Ifa.createCollection("users", userSchema);
        // await Ifa.createCollection("users", userSchema);
        // await userSchema.create({
        //   username: "John Doe",
        //   age: 25,
        //   dob: new Date(),
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // });
        // const result = await userSchema.find();
        // console.log(result);
    }
    catch (error) {
        console.log(error);
    }
});
connectDb();
