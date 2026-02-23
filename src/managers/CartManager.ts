import { CartInterface } from "../interfaces/Cart.interface";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

class CartManager {
  path: string;

  constructor(path: string) {
    this.path = path;
    fs.existsSync(this.path)
      ? fs.readFileSync(this.path, "utf-8")
      : fs.writeFileSync(this.path, JSON.stringify([]));
  }

  getCartProducts = (): CartInterface[] => {
    return fs.existsSync(this.path)
      ? JSON.parse(fs.readFileSync(this.path, "utf-8"))
      : [];
  };

  getCartById = (cid: string) => {
    const cartData = this.getCartProducts();
    const searchById = cartData.find((e) => e.id === cid);
    if (!searchById) {
      return {
        error: `ID #${cid} not found`,
      };
    }
    return searchById;
  };

  createCart = () => {
    const cartData = this.getCartProducts();

    const newCart: CartInterface = {
      id: uuidv4(),
      products: [],
    };

    cartData.push(newCart);
    fs.writeFileSync(this.path, JSON.stringify(cartData));
    return cartData;
  };
}

export const cartManager = new CartManager("./data/cart.json");
