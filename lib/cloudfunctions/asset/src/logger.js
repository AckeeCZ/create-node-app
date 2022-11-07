"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cosmas_1 = __importDefault(require("cosmas"));
const config_1 = __importDefault(require("./config"));
exports.default = (0, cosmas_1.default)(config_1.default.logger);
//# sourceMappingURL=logger.js.map