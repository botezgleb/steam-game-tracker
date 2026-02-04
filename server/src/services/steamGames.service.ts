import fetch from "node-fetch";
import { Game } from "../models/Game";
import { UserGame } from "../models/UserGame";
import { GameStatus } from "../models/enums";

interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url?: string;
}

interface SteamOwnedGamesResponse {
  response: {
    games: SteamGame[];
  };
}

export async function importSteamGames(userId: number, steamId: string) {
  const apiKey = process.env.STEAM_API_KEY;
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true`;

  const res = await fetch(url);
  const json = (await res.json()) as SteamOwnedGamesResponse;

  const games = json.response.games;

  for (const g of games) {
    const [game] = await Game.findOrCreate({
      where: { steamAppId: g.appid },
      defaults: {
        steamAppId: g.appid,
        title: g.name,
        iconUrl: g.img_icon_url
          ? `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`
          : null,
        headerImageUrl: `https://cdn.akamai.steamstatic.com/steam/apps/${g.appid}/header.jpg`,
      },
    });

    const [userGame, created] = await UserGame.findOrCreate({
      where: { userId, gameId: game.id },
      defaults: {
        userId,
        gameId: game.id,
        status: GameStatus.PLANNED, // 👈 ВСЕГДА
        playtimeMinutes: g.playtime_forever,
      },
    });

    // ✅ обновляем ТОЛЬКО playtime
    if (!created) {
      await userGame.update({
        playtimeMinutes: g.playtime_forever,
      });
    }
  }

  return games.length;
}
