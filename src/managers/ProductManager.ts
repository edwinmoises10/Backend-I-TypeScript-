import { Product } from "../interfaces/Product.interface";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { ProductSchema } from "../schemas/product.schema";
import { z } from "zod";

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
    if(checkCodeAvailability) {
        return {error: "Duplicate code detected"}
    }
    const createProduct = {
      ...validateBodyParams.data,
      id: uuidv4(),
    };
    dataProducts.push(createProduct);
    fs.writeFileSync(this.path, JSON.stringify(dataProducts));
    return createProduct;
  };
}

export const productManager = new ProductManager("./data/products.json");
