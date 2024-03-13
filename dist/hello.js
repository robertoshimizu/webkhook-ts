"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addi_1 = __importDefault(require("./addi"));
// npx ts-node src/hello.ts
const message = 'Hello, TypeScript!';
const res = (0, addi_1.default)(1, 2);
console.log(message, res);
