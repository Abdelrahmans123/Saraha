import dotenv from "dotenv";
import path from "path";
import bootstrap from "./app.controller.js";
const configPath = path.join("./src/config/.env");
dotenv.config({  });
bootstrap();
