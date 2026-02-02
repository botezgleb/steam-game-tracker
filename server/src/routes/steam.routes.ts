import express, { Router } from "express";
import { steamLogin, steamCallback } from "../controllers/steam.controller";

export const steamRouter = Router();

steamRouter.get("/login", steamLogin);
steamRouter.get("/callback", steamCallback);