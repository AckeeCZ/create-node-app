"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeConfig = void 0;
const configuru_1 = require("configuru");
const loader = (0, configuru_1.createLoader)({
    defaultConfigPath: '.env.jsonc',
});
const configSchema = {
    logger: {
        defaultLevel: loader.custom(x => x)('LOGGER_DEFAULT_LEVEL'),
        pretty: loader.bool('LOGGER_PRETTY'),
    },
};
exports.default = (0, configuru_1.values)(configSchema);
exports.safeConfig = (0, configuru_1.safeValues)(configSchema);
//# sourceMappingURL=config.js.map