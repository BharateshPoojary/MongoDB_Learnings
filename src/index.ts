import express from "express";
import cors from "cors";
import {
  getCustomerAccounts,
  runAdminPipeline,
  updateAccountLimit,
} from "./controllers/accounts.controller";
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", getCustomerAccounts);
app.post("/set-limit", updateAccountLimit);
app.get("/runAdminPipeline", runAdminPipeline);
export default app;
