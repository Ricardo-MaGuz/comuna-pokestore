import { Pokemon, Wallet, CartItem } from '../types';

const STORAGE_KEYS = {
  WALLET: 'pokemon_store_wallet',
  CART: 'pokemon_store_cart',
  OWNED_POKEMON: 'pokemon_store_owned_pokemon',
  POKEMON_CACHE: 'pokemon_store_cache'
};

// Wallet management
export const getWallet = (): Wallet => {
  const stored = localStorage.getItem(STORAGE_KEYS.WALLET);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Generate random initial balance between 5000 and 15000 MXN
  const initialBalance = Math.floor(Math.random() * 10000) + 5000;
  const wallet: Wallet = {
    balance: initialBalance,
    currency: 'MXN'
  };
  
  localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));
  return wallet;
};

export const updateWallet = (wallet: Wallet): void => {
  localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));
  // Dispatch storage event to notify other components
  window.dispatchEvent(new Event('storage'));
};

export const addFundsToWallet = (amount: number): Wallet => {
  const wallet = getWallet();
  wallet.balance += amount;
  updateWallet(wallet);
  return wallet;
};

// Cart management
export const getCart = (): CartItem[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.CART);
  return stored ? JSON.parse(stored) : [];
};

export const updateCart = (cart: CartItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  // Dispatch storage event to notify other components
  window.dispatchEvent(new Event('storage'));
};

export const addToCart = (pokemon: Pokemon): CartItem[] => {
  const cart = getCart();
  
  // Check if Pokemon is already in cart
  const existingItem = cart.find(item => item.pokemon.id === pokemon.id);
  
  if (existingItem) {
    // Pokemon already in cart, don't add again
    return cart;
  }
  
  // Check if Pokemon is already owned
  if (isPokemonOwned(pokemon.id)) {
    // Pokemon already owned, don't add to cart
    return cart;
  }
  
  // Add new Pokemon to cart
  cart.push({ pokemon, quantity: 1 });
  updateCart(cart);
  return cart;
};

export const removeFromCart = (pokemonId: number): CartItem[] => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.pokemon.id !== pokemonId);
  updateCart(updatedCart);
  return updatedCart;
};

export const clearCart = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CART);
  // Dispatch storage event to notify other components
  window.dispatchEvent(new Event('storage'));
};

// Owned Pokemon management
export const getOwnedPokemon = (): number[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.OWNED_POKEMON);
  return stored ? JSON.parse(stored) : [];
};

export const addOwnedPokemon = (pokemonId: number): void => {
  const owned = getOwnedPokemon();
  if (!owned.includes(pokemonId)) {
    owned.push(pokemonId);
    localStorage.setItem(STORAGE_KEYS.OWNED_POKEMON, JSON.stringify(owned));
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  }
};

export const isPokemonOwned = (pokemonId: number): boolean => {
  const owned = getOwnedPokemon();
  return owned.includes(pokemonId);
};

// Pokemon cache management
export const getPokemonCache = (): { [key: number]: Pokemon } => {
  const stored = localStorage.getItem(STORAGE_KEYS.POKEMON_CACHE);
  return stored ? JSON.parse(stored) : {};
};

export const cachePokemon = (pokemon: Pokemon): void => {
  const cache = getPokemonCache();
  cache[pokemon.id] = pokemon;
  localStorage.setItem(STORAGE_KEYS.POKEMON_CACHE, JSON.stringify(cache));
};

export const getCachedPokemon = (id: number): Pokemon | null => {
  const cache = getPokemonCache();
  return cache[id] || null;
};

// Clear all data (for testing purposes)
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  // Dispatch storage event to notify other components
  window.dispatchEvent(new Event('storage'));
}; 