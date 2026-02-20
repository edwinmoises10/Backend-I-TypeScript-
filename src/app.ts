import express from "express";
import { productManager } from "./managers/ProductManager";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json("Main Workshop in TypeScript");
});

app.get("/api/products/", (req, res) => {
  const getProducts = productManager.getProducts();
  res.status(200).json(getProducts);
});

app.post("/api/products/create/", (req, res) => {
  try {
    const createProduct = productManager.addProduct(req.body);
    if ("properties" in createProduct || "error" in createProduct) {
      return res.status(400).json(createProduct);
    }

    res.status(201).json(createProduct);
    
  } catch (error) {
    res.status(500).json({ error: "Error Server" });
  }
});

app.listen(port, () =>
  console.log(`Connected at Port:${port}, Server Express Works`),
);
