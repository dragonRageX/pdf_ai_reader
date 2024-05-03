const express = require("express");
import {
    getDatabases,
    selectTable,
    readData
} from "./connection";
import * as fs from "fs";
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
import OpenAI from "openai";

const app = express();
const router = express.Router();

const database = 'reader_data';
const table = 'my_book';

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

    try {

        const openai = new OpenAI();

        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
        });

        const embedding = response.data[0].embedding;

        // console.log("Query Text Embedding:" + embedding);

        const sqlRes = await readData({ database: database, embedding: embedding });   //commpare the embeddings in database and user query embeddings generated; and get the most likely result
        console.log("Sql Response: ", sqlRes);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
