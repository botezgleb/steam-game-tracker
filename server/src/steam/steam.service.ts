import fetch from "node-fetch";

const STEAM_API_KEY = process.env.STEAM_API_KEY as string;

if (!STEAM_API_KEY) {
  throw new Error("STEAM_API_KEY is not defined");
}

export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
}

export async function getSteamProfile(steamId: string) {
  const res = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`
  );

  const data: any = await res.json();
  const player = data.response.players[0];

  if (!player) {
    throw new Error("Steam profile not found");
  }

  return {
    steamId: player.steamid,
    steamName: player.personaname,
    avatarUrl: player.avatarfull,
  };
}

export async function getOwnedGames(steamId: string): Promise<SteamGame[]> {
  const res = await fetch(
    `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&include_appinfo=1`
  );

  const data: any = await res.json();
  return data.response.games || [];
}
