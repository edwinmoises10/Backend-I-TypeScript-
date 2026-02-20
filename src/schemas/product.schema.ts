import * as z from "zod";

export const ProductSchema = z.object({
  title: z.string({ message: "Title is required" }).trim().min(1, "Title cannot be empty"),



  description: z.string({ message: "Description is required" }).trim().min(10, "Description too Short"),

  code: z.string({ message: "Code is required" }).trim().min(1, "Code cannot be empty"),

  price: z.number({ message: "Price is required" }).
  
  positive("Cannot be less of 0 "),
  status: z.boolean({ message: "Status cannot be a number o text" }),

  stock: z.number({ message: "stock cannot be a number o text" }).positive("cannor be less of 0"),

  category: z.string({ message: "Category is required" }).trim().min(1, "Category cannot be empty"),

  thumbnails: z.array(z.string({ message: "Each Thumbnails must be a text URL " }), {message : "Thumbnails are required and must be an array"})
});

