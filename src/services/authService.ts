// authService.ts
const API_AUTH_URL = import.meta.env.VITE_API_AUTH_URL;

export const authService = {
  async signIn(email: string, password: string) {
    const response = await fetch(`${API_AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message || 'Credenciales incorrectas');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    return data;
  },

  signOut() {
    localStorage.removeItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  async getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    const response = await fetch(`${API_AUTH_URL}/auth/validate`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      this.signOut();
      return null;
    }

    const data = await response.json();
    return data.user;
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
