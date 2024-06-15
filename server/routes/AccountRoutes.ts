import { Router } from "express";
import { getAccountIndustryData } from "../controllers/AccountControllers";


const accountRoutes = Router();

accountRoutes.get('/', getAccountIndustryData);


export default accountRoutes;