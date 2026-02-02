import { Request, Response } from "express";
import { User } from "../models/User";
import { UserGame } from "../models/UserGame";
import { Game } from "../models/Game";
import { GameStatus } from "../models/enums";
import { importSteamGames } from "../services/steamGames.service";

export async function getUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = await User.findByPk(id);

  if (!user) return res.status(404).json({ ok: false, error: "User not found" });

  res.json({
    ok: true,
    user: {
      id: user.id,
      steamName: user.steamName,
      avatarUrl: user.avatarUrl,
    },
  });
}

export async function getUserGames(req: Request, res: Response) {
  const id = Number(req.params.id);

  const games = await UserGame.findAll({
    where: { userId: id },
    include: [{ model: Game, as: "game" }],
    order: [["playtimeMinutes", "DESC"]],
  });

  res.json({ ok: true, games });
}

export async function updateUserGame(req: Request, res: Response) {
  try {
    const userId = Number(req.params.id);
    const gameId = Number(req.params.gameId);

    const { status, playtimeMinutes } = req.body;

    const ug = await UserGame.findOne({ where: { userId, gameId } });
    if (!ug) return res.status(404).json({ ok: false, error: "Not found" });

    ug.status = status ?? ug.status;
    ug.playtimeMinutes = playtimeMinutes ?? ug.playtimeMinutes;

    await ug.save();

    res.json({ ok: true, userGame: ug });
  } catch (e) {
    console.log("UPDATE USER GAME ERROR:", e);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}

export async function importSteamAgain(req: Request, res: Response) {
  const userId = Number(req.params.id);

  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ ok: false, error: "User not found" });

  const gamesImported = await importSteamGames(userId, user.steamId);

  res.json({ ok: true, gamesImported });
}
