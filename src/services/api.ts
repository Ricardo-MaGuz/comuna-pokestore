import axios from 'axios';
import { Pokemon } from '../types';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const EXCHANGE_API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

// Currencies available in the store
export const CURRENCIES = [
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'GBP', name: 'British Pound', symbol: '£' }
];

// Generate random price for a Pokemon
const generateRandomPrice = (currency: string): number => {
  const basePrice = Math.random() * 1000 + 100; // Between 100 and 1100
  const currencyMultipliers: { [key: string]: number } = {
    MXN: 1,
    USD: 0.06,
    EUR: 0.055,
    JPY: 8.5,
    GBP: 0.047
  };
  return Math.round(basePrice * (currencyMultipliers[currency] || 1));
};

// Get Pokemon data from PokeAPI
export const fetchPokemon = async (id: number): Promise<Pokemon> => {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${id}`);
    const data = response.data;
    
    // Generate random currency and price
    const randomCurrency = CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)].code;
    const price = generateRandomPrice(randomCurrency);
    
    return {
      id: data.id,
      name: data.name,
      image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
      types: data.types.map((type: any) => type.type.name),
      height: data.height,
      weight: data.weight,
      price,
      currency: randomCurrency,
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        specialAttack: data.stats[3].base_stat,
        specialDefense: data.stats[4].base_stat,
        speed: data.stats[5].base_stat
      }
    };
  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    throw error;
  }
};

// Get exchange rate between currencies
export const getExchangeRate = async (from: string, to: string): Promise<number> => {
  try {
    const response = await axios.get(`${EXCHANGE_API_BASE_URL}/${from}`);
    const rates = response.data.rates;
    return rates[to] || 1;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    // Fallback rates if API fails
    const fallbackRates: { [key: string]: { [key: string]: number } } = {
      MXN: { USD: 0.06, EUR: 0.055, JPY: 8.5, GBP: 0.047, MXN: 1 },
      USD: { MXN: 16.67, EUR: 0.92, JPY: 141.67, GBP: 0.78, USD: 1 },
      EUR: { MXN: 18.18, USD: 1.09, JPY: 154.55, GBP: 0.85, EUR: 1 },
      JPY: { MXN: 0.118, USD: 0.007, EUR: 0.006, GBP: 0.0055, JPY: 1 },
      GBP: { MXN: 21.28, USD: 1.28, EUR: 1.18, JPY: 181.82, GBP: 1 }
    };
    return fallbackRates[from]?.[to] || 1;
  }
};

// Convert price from one currency to another
export const convertPrice = async (price: number, fromCurrency: string, toCurrency: string): Promise<number> => {
  if (fromCurrency === toCurrency) return price;
  const rate = await getExchangeRate(fromCurrency, toCurrency);
  return price * rate;
}; 