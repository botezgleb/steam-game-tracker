export const API_BASE = "http://localhost:3001/api";

export type GameStatus = "PLANNED" | "PLAYING" | "COMPLETED";

export type User = {
  id: number;
  steamName: string;
  avatarUrl: string;
};

export type Game = {
  id: number;
  steamAppId: number;
  title: string;
  iconUrl: string | null;
  headerImageUrl: string;
};

export type UserGame = {
  id: number;
  userId: number;
  gameId: number;
  status: GameStatus;
  playtimeMinutes: number;
  game: Game;
};

export async function getUser(userId: number) {
  const res = await fetch(`${API_BASE}/user/${userId}`);
  return res.json();
}

export async function getUserGames(userId: number) {
  const res = await fetch(`${API_BASE}/user/${userId}/games`);
  return res.json();
}

export async function updateUserGame(userId: number, gameId: number, body: Partial<{ status: GameStatus; playtimeMinutes: number }>) {
  const res = await fetch(`${API_BASE}/user/${userId}/game/${gameId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}
