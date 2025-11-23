"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorHandller_1 = require("./app/middlewares/globalErrorHandller");
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = require("./app/routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["https://ride-booking-management-system-fron.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to ride booking system.",
    });
});
app.use(globalErrorHandller_1.globalErrorHandler);
app.use(notFound_1.default);
exports.default = app;
