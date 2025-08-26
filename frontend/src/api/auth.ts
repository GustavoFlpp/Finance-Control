// src/api/auth.ts

const BASE_URL = "http://localhost:3000/api";

interface LoginResponse {
  token: string;
}

interface LoginData {
  email: string;
  password: string;
}
interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export async function login({ email, password }: LoginData): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to login");
  }

  const data: LoginResponse = await res.json();
  localStorage.setItem("token", data.token);
}

export async function register({
  name,
  email,
  password,
}: RegisterData): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to register");
  }

  const data: LoginResponse = await res.json();
  localStorage.setItem("token", data.token);
}