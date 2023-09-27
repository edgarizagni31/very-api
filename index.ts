import express from "express";
import morgan from "morgan";
import coors from "cors";
import * as dotenv from "dotenv";

import { searchStore } from "./middlewares/searchStore";
import { getProducts } from "./controllers/ProductController";
import { getCategories } from "./controllers/CategoryController";

const app = express();

dotenv.config();

app.use(coors());
app.use(morgan("dev"));
app.set("subdomain offset", 1);
app.set("port", process.env.PORT || "8080");
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello very-api");
});
app.get("/productos", searchStore, getProducts);
app.get("/categorias", searchStore, getCategories);

app.listen(app.get("port"), () => {
  console.log(`server on port http://localhost:${app.get("port")}`);
});
