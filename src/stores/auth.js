import { writable } from 'svelte/store';

export const isAuthenticated = writable(false);
export const user = writable(null);

export function login(email) {
  isAuthenticated.set(true);
  user.set({ email });
}

export function logout() {
  isAuthenticated.set(false);
  user.set(null);
}