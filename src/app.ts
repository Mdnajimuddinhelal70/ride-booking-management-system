import express, { Request, Response } from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandller";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";

const app = express();
app.use(express.json());
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to ride booking system.",
  });
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
