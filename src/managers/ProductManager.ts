import { Product } from "../interfaces/Product.interface";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { ProductSchema } from "../schemas/product.schema";
import { z } from "zod";
import { de } from "zod/v4/locales";

class ProductManager {
  path: string;

  constructor(path: string) {
    this.path = path;

    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
  }

  getProducts = () => {
    if (fs.existsSync(this.path)) {
      return JSON.parse(fs.readFileSync(this.path, "utf-8"));
    }
  };

  addProduct = (body: Product) => {
    const dataProducts: Product[] = this.getProducts();

    const validateBodyParams = ProductSchema.safeParse(body);

    if (validateBodyParams.success === false)
      return z.treeifyError(validateBodyParams.error);

    const checkCodeAvailability = dataProducts.some(
      (p) => p.code === validateBodyParams.data.code,
    );
    if (checkCodeAvailability) {
      return { error: "Duplicate code detected" };
    }
    const createProduct = {
      ...validateBodyParams.data,
      id: uuidv4(),
    };
    dataProducts.push(createProduct);
    fs.writeFileSync(this.path, JSON.stringify(dataProducts));
    return createProduct;
  };

  findProductById = (pid: string) => {
    const dataProduct: Product[] = this.getProducts();

    const locateById = dataProduct.find((e) => e.id === pid);
    if (!locateById) {
      return {
        error: `Product with ID: ${pid} not found`,
      };
    }
    return locateById;
  };

  editProduct = (pid: string, body: Product) => {
    const dataProduct: Product[] = this.getProducts();

    const findProduct = dataProduct.findIndex((e) => e.id === pid);
    if (findProduct <= -1) {
      return { error: `Product with ID: ${pid} not found` };
    }

    const validateRequestParams = ProductSchema.partial().safeParse(body);

    if (validateRequestParams.success === false) {
      return z.treeifyError(validateRequestParams.error);
    }

    //!Code Validation

    const updateProduct = {
      ...dataProduct[findProduct],
      ...validateRequestParams.data,
      id: pid,
    };

    dataProduct[findProduct] = updateProduct;
    fs.writeFileSync(this.path, JSON.stringify(dataProduct));
    return updateProduct;
  };

  deleteProduct = (pid: string) => {
    const dataProduct: Product[] = this.getProducts();
    const indexProduc = dataProduct.findIndex((e) => e.id === pid);
    if (indexProduc <= -1) {
      console.log("No se encontró el índice");
      return {
        error: `Product with ID ${pid} not found`,
      };
    }

    const [removed] = dataProduct.splice(indexProduc, 1);
    fs.writeFileSync(this.path, JSON.stringify(dataProduct));
    console.log("Producto eliminado y archivo guardado");
    return removed;
  };
}

export const productManager = new ProductManager("./data/products.json");
