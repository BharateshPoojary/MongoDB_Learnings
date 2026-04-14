import express from "express";
import cors from "cors";
import { getCustomerAccounts } from "./controllers/accounts.controller";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/getcustomeraccount", getCustomerAccounts);
export default app;
