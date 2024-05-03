const express = require("express");
import {
    getDatabases,
    selectTable,
} from "./connection";
import * as fs from "fs";
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const router = express.Router();

router.get("/api/hello", (req, res, next) => {
    res.json("SingleStore");
});

router.post("/setup", bodyParser.json(), async (req, res, next) => {
    const host = req.body.hostname;
    const password = req.body.password;

    try {
        fs.writeFileSync(".env", `HOST="${host}"\nPASSWORD="${password}"`);
    } catch (err) {
        console.error(err);
    }

    try {
        const data = fs.readFileSync(".env", "utf-8");
        console.log({ data });
    } catch (err) {
        console.error(err);
    }

    dotenv.config();

    res.json("/SETUP!");
});

router.get("/api/database", async (req, res) => {
    const sqlRes = await getDatabases();
    res.json(sqlRes);
});

router.get("/api/database/:text", async (req, res) => {
    const text = await req.params.text;
    console.log(text);

    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });

    try {
        const openai = new OpenAIApi(configuration);
        const response = await openai.createEmbedding({
            model: "text-embedding-3-small",
            input: text,
        });
        const embedding = response.data.data[0].embedding;
        console.log(response);
    } catch (error) {
        console.error(error);
    }
});

export default router;
