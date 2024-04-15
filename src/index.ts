import express from "express";
import "dotenv/config";
import { debugApi } from "./config/constants";

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    debugApi(`Server is running on port ${port}.`);    
});
