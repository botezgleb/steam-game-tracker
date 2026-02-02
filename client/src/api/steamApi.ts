export const API_URL = "http://localhost:3001/api";

export async function loginSteam() {
  window.location.href = `${API_URL}/steam/login`;
}

export async function getUserGames(userId: number) {
  const res = await fetch(`${API_URL}/steam/games/${userId}`);
  return res.json();
}
