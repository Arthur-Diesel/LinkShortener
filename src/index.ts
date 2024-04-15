import express from "express";
import "dotenv/config";
import { debugApi } from "./config/constants";
import router from "./routes";

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use("/api", router);

app.listen(port, () => {
  debugApi(`Server is running on port ${port}.`);
});
