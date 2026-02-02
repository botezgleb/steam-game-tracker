import { User } from "../models/User";
import { Game } from "../models/Game";
import { UserGame } from "../models/UserGame";
import { GameStatus } from "../models/enums";
import {
  getSteamProfile,
  getOwnedGames,
} from "../steam/steam.service";

export async function steamAuthAndImport(steamId: string) {
  const profile = await getSteamProfile(steamId);

  const [user] = await User.findOrCreate({
    where: { steamId: profile.steamId },
    defaults: {
      steamId: profile.steamId,
      steamName: profile.steamName,
      avatarUrl: profile.avatarUrl,
    },
  });


  await user.update({
    steamName: profile.steamName,
    avatarUrl: profile.avatarUrl,
  });

  const steamGames = await getOwnedGames(steamId);

  for (const g of steamGames) {
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

    await UserGame.findOrCreate({
      where: {
        userId: user.id,
        gameId: game.id,
      },
      defaults: {
        userId: user.id,
        gameId: game.id,
        status:
          g.playtime_forever > 0
            ? GameStatus.PLAYING
            : GameStatus.PLANNED,
        playtimeMinutes: g.playtime_forever,
      },
    });

  }

  return {
    user: {
      id: user.id,
      steamName: user.steamName,
      avatarUrl: user.avatarUrl,
    },
    gamesImported: steamGames.length,
  };
}
