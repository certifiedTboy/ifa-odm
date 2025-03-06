"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ifa = exports.Schema = exports.connect = void 0;
const connect_1 = require("./lib/ifa/connect");
Object.defineProperty(exports, "connect", { enumerable: true, get: function () { return connect_1.connect; } });
const schema_1 = require("./lib/ifa/schema");
Object.defineProperty(exports, "Schema", { enumerable: true, get: function () { return schema_1.Schema; } });
const model_1 = require("./lib/ifa/model");
Object.defineProperty(exports, "Ifa", { enumerable: true, get: function () { return model_1.Ifa; } });
