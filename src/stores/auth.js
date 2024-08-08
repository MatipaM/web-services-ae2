import { writable, derived } from 'svelte/store';

export const isAuthenticated = writable(false);
export const user = writable(null);
export const userEmail = derived(user, $user => $user ? $user.email : null);

const storedUser = localStorage.getItem('user');
if (storedUser) {
  const parsedUser = JSON.parse(storedUser);
  user.set(parsedUser);
  isAuthenticated.set(true);
}

export function login(email) {
  const userData = { email };
  localStorage.setItem('user', JSON.stringify(userData));
  isAuthenticated.set(true);
  user.set(userData);
}

export function logout() {
  localStorage.removeItem('user');
  isAuthenticated.set(false);
  user.set(null);
}

