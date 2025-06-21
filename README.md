# 🎮 Pokémon Store

A Pokémon store application developed with React, TypeScript, and Material UI. Users can explore, search, and purchase Pokémon with different currencies and an integrated shopping cart system.

## ✨ Features

- **Pokémon Catalog**: Explore over 150 Pokémon with detailed information
- **Multiple Currencies**: Each Pokémon has a price in one of 5 different currencies:
  - Mexican Peso (MXN)
  - US Dollar (USD)
  - Euro (EUR)
  - Japanese Yen (JPY)
  - British Pound (GBP)
- **Currency Conversion**: Automatic price conversion to wallet currency
- **Virtual Wallet**: Random initial balance with option to replenish funds
- **Shopping Cart**: Add, remove, and confirm purchases
- **Search**: Search Pokémon by name
- **Lazy Loading**: Progressive loading of Pokémon with pagination
- **Local Persistence**: Data stored in browser localStorage
- **Responsive Design**: Interface adapted for mobile and desktop

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd pokemon-store
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the application**:
   ```bash
   npm start
   ```

4. **Open your browser** and go to `http://localhost:3000`

## 🛠️ Technologies Used

- **React 18** - User interface library
- **TypeScript** - Static typing for JavaScript
- **Material UI** - User interface components
- **Axios** - HTTP client for API calls
- **PokeAPI** - API for Pokémon data
- **Exchange Rate API** - API for currency conversions

## 📱 Main Features

### 🎯 Virtual Wallet
- Random initial balance between $5,000 and $15,000 MXN
- Option to add random funds (between $1,000 and $6,000 MXN)
- Option to add custom funds
- Automatic price conversion to Mexican pesos

### 🛒 Shopping Cart
- Add multiple Pokémon to cart
- View total in wallet currency
- Remove individual items
- Confirm purchase and update balance
- Purchased Pokémon are added to collection

### 🔍 Search and Navigation
- Real-time search by Pokémon name
- Progressive loading of Pokémon (20 per page)
- "Load more" button for pagination
- Refresh button to change prices and currencies

### 💾 Data Persistence
- Wallet and balance saved in localStorage
- Persistent shopping cart
- Collection of purchased Pokémon
- Pokémon data cache

## 🎨 User Interface

The application features a modern and intuitive interface:

- **Header**: Application title and refresh button
- **Sidebar**: Wallet and shopping cart
- **Main Area**: Pokémon catalog with search
- **Pokémon Cards**: Detailed information, stats, and prices
- **Notifications**: Success and error messages with Snackbars

## 🔧 APIs Used

### PokeAPI
- **URL**: `https://pokeapi.co/api/v2`
- **Purpose**: Get Pokémon data (image, types, stats, etc.)
- **Usage**: Each Pokémon is fetched individually and cached locally

### Exchange Rate API
- **URL**: `https://api.exchangerate-api.com/v4/latest`
- **Purpose**: Real-time currency conversions
- **Usage**: Convert Pokémon prices to wallet currency

## 📊 Project Structure

```
src/
├── components/
│   ├── PokemonCard.tsx      # Individual Pokémon card
│   ├── Wallet.tsx           # Wallet component
│   └── ShoppingCart.tsx     # Shopping cart component
├── services/
│   └── api.ts              # API services and utilities
├── types/
│   └── index.ts            # TypeScript type definitions
├── utils/
│   └── storage.ts          # localStorage utilities
├── App.tsx                 # Main component
├── index.tsx              # Entry point
└── index.css              # Global styles
```

## 🎯 User Flow

1. **Start**: Application loads with random balance in wallet
2. **Exploration**: Users can view Pokémon catalog with prices in different currencies
3. **Search**: Filter Pokémon by name using search bar
4. **Purchase**: Add Pokémon to cart (if not already owned)
5. **Review**: View cart with totals converted to wallet currency
6. **Confirmation**: Complete purchase and see Pokémon added to collection
7. **Replenishment**: Add more funds to wallet when needed

## 🔄 State Management

The application uses localStorage to persist:
- **Wallet**: Balance and currency
- **Cart**: Selected items
- **Collection**: Purchased Pokémon
- **Cache**: Pokémon data for better performance

## 🎨 Customization

### Themes
The application uses Material UI with a custom theme:
- Primary color: Blue (#1976d2)
- Secondary color: Pink (#dc004e)

### Currencies
Available currencies can be modified in `src/services/api.ts`:
```typescript
export const CURRENCIES = [
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  // ... more currencies
];
```

## 🚀 Available Scripts

- `npm start` - Start the application in development mode
- `npm build` - Build the application for production
- `npm test` - Run tests
- `npm eject` - Expose webpack configuration (irreversible)

## 📝 Technical Notes

- **Lazy Loading**: Pokémon are loaded in batches of 20 for better performance
- **Cache**: Pokémon data is stored in localStorage to avoid repeated API calls
- **Conversions**: Currency conversions are performed in real-time using external API
- **Responsive**: Interface automatically adapts to different screen sizes
- **Error Handling**: Robust error handling with fallbacks for external APIs

## 🤝 Contributing

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT License. See the `LICENSE` file for more details.

## 🙏 Acknowledgments

- [PokeAPI](https://pokeapi.co/) for providing Pokémon data
- [Exchange Rate API](https://exchangerate-api.com/) for currency conversions
- [Material UI](https://mui.com/) for interface components
- [React](https://reactjs.org/) for the development framework 