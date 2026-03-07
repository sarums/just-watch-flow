const ADMIN_KEY = 'clipflow_admin_token';

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_KEY, token);
}

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_KEY);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_KEY);
}

export function isAdminLoggedIn(): boolean {
  return !!getAdminToken();
}
