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
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({ message: "hey" });
}));
app.post("/auth", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    console.log(code);
    console.log(process.env);
    try {
        const access_token_res = yield axios_1.default.post("https://github.com/login/oauth/access_token", {
            "client_id": process.env.CLIENT_ID ? process.env.CLIENT_ID : "",
            "client_secret": process.env.CLIENT_SECRET ? process.env.CLIENT_SECRET : "",
            "redirect_uri": process.env.REDIRECT_URI ? process.env.REDIRECT_URI : "",
            "code": code
        });
        // access_token=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&scope=user&token_type=bearer
        const access_reg = new RegExp(/=(.*)&scope/);
        const token_type_reg = new RegExp(/&token_type=(.*)/);
        const access_token = access_token_res === null || access_token_res === void 0 ? void 0 : access_token_res.data.match(access_reg)[1];
        const token_type = access_token_res === null || access_token_res === void 0 ? void 0 : access_token_res.data.match(token_type_reg)[1];
        console.log(process.env.REDIRECT_URL);
        // console.log(access_token_res)
        return res.status(200).send({
            access_token,
            token_type
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send("Bad request");
    }
}));
try {
    app.listen(port, () => {
        console.log(`⚡Listening on port ${port}`);
    });
}
catch (error) {
    // @ts-ignore
    console.error(`Error occured: ${error.message}`);
}
