import { Router } from "express";
import { getTeamData } from "../controllers/teamController";

const teamRoutes = Router();

teamRoutes.get('/', getTeamData);

export default teamRoutes;