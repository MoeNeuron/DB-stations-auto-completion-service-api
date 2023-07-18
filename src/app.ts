import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import "reflect-metadata";
import { container } from "tsyringe";

import autoCompleteRoutesV1 from "./routes/v1/AutoCompleteRoutes";
import { AutoCompleteController } from "./controllers/v1/AutoCompleteController";
import {
  IAutoCompleteService,
  AutoCompleteService,
} from "./services/v1/AutoCompleteService";
import { NotFoundError } from "./errors";

const app = express();

dotenv.config();
// Middleware
app.use(cors());
app.use(express.json());

// Dependency Injection
container.register<IAutoCompleteService>("IAutoCompleteService", {
  useClass: AutoCompleteService,
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): any => {
  console.error("An unhandled error occurred:", err);
  res
    .status(500)
    .json({ error_code: "500", error_description: "Internal Server Error" });
});

// Routes
const autoCompleteController = container.resolve(AutoCompleteController);
app.use("/api/v1", autoCompleteRoutesV1(autoCompleteController));

app.use("/", (_, res) => {
  res.status(404).json(new NotFoundError().getErrorResponse());
});

export default app;
