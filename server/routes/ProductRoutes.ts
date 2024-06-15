import { Router } from "express";
import { getProductLineData } from "../controllers/productLineController";

const productRoutes = Router();

productRoutes.get('/', getProductLineData);

export default productRoutes;