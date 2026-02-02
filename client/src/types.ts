export interface SteamAuthResult {
  user: {
    id: number;
    steamName: string;
    avatarUrl: string;
  };
  gamesImported: number;
}
