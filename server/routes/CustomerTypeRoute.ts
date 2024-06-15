import { Router } from "express";
import { getCustomerTypeData } from "../controllers/customerTypeController";

const customerTypeRoutes = Router();

customerTypeRoutes.get('/', getCustomerTypeData);


export default customerTypeRoutes;