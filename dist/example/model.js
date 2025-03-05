"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../schema");
const connect_1 = require("../connect");
const user = new schema_1.Schema("users", {
    firstName: { type: "string", required: true },
    lastName: { type: "string", required: true },
    age: { type: "number", required: true },
    email: { type: "string", unique: true },
    isGraduated: { type: "boolean", required: true },
}, { timestamps: true });
connect_1.Ifa.createCollection("users", user);
// user.getGlobalData();
exports.default = user;
