import { Router } from "express";
import {
  getUser,
  getUserGames,
  updateUserGame,
  importSteamAgain
} from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/:id", getUser);
userRouter.get("/:id/games", getUserGames);
userRouter.patch("/:id/game/:gameId", updateUserGame);
userRouter.post("/:id/import", importSteamAgain);
