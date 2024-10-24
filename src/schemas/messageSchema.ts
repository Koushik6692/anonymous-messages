import {z} from "zod";

export const messageSchema = z.object({
  content : z.string()
  .min(6 , "message must be atleast 6 charactes")
  .max(300, "message must be no longer than 100 characters")
})