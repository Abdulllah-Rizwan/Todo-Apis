import { MongoConnect } from "./db/mongo.js";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config({path: './env'});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await MongoConnect();
    app.listen(PORT,() => console.log(`Server is up and running on ${PORT}`));
}
startServer();