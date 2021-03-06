const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jhygh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        const portfolioCollection = client
            .db("my_portfolio")
            .collection("portfolios");

        // getting all portfolios data
        app.get("/portfolios", async (req, res) => {
            const portfolios = await portfolioCollection.find().toArray();
            res.send(portfolios);
        });

        app.get("/portfolio/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await portfolioCollection.findOne(query);
            res.send(result);
        });
    } finally {
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
