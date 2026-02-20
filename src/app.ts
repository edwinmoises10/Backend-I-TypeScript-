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

app.get("/api/products/:pid", (req, res) => {
  const { pid } = req.params;

  try {
    const locateById = productManager.findProductById(pid);
    if ("error" in locateById) {
      return res.status(400).json(locateById);
    }

    res.status(200).json(locateById);
  } catch (e) {
    res.status(500).json({ error: `Error` });
  }
});

app.put("/api/products/:pid", (req, res) => {
  const { pid } = req.params;

  try {
    const updateProduct = productManager.editProduct(pid, req.body);

    if ("properties" in updateProduct || "error" in updateProduct) {
      return res.status(404).json(updateProduct);
    }

    res.status(201).json(updateProduct);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Internal Server Error: Database connectivity issue " });
  }
});

app.delete("/api/products/:pid", (req, res) => {
  const { pid } = req.params;

  try {
    const deletedProduct = productManager.deleteProduct(pid);

    if ("error" in deletedProduct) {
      return res.status(404).json(deletedProduct);
    }

    res.status(200).json(deletedProduct);
  } catch (e) {
    res.status(500).json({ error: `Internal Server Error` });
  }
});

app.listen(port, () => console.log(`Express Server running on port ${port}`));
