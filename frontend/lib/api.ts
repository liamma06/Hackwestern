import { auth } from "./firebase";

const API_URL = "http://localhost:8000";

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const token = await user.getIdToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) throw new Error("API error");
  return res.json();
}