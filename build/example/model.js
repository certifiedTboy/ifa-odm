"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const user = new __1.Schema("users", {
    firstName: { type: "string", required: true },
    lastName: { type: "string", required: true },
    age: { type: "number", required: true },
    email: { type: "string", unique: true },
    isGraduated: { type: "bool", required: true },
}, { timestamps: true });
exports.default = user;
