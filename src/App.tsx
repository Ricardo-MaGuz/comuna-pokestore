import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  CircularProgress,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { Search, Refresh, Clear } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Pokemon } from './types';
import { fetchPokemon, CURRENCIES } from './services/api';
import { cachePokemon } from './utils/storage';
import PokemonCard from './components/PokemonCard';
import WalletComponent from './components/Wallet';
import ShoppingCartComponent from './components/ShoppingCart';
import PokemonCollection from './components/PokemonCollection';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const loadPokemons = useCallback(async (page: number, append: boolean = false) => {
    setLoading(true);
    try {
      const newPokemons: Pokemon[] = [];
      const startId = (page - 1) * 20 + 1;
      const endId = page * 20;

      for (let id = startId; id <= endId; id++) {
        try {
          const pokemon = await fetchPokemon(id);
          cachePokemon(pokemon);
          newPokemons.push(pokemon);
        } catch (error) {
          console.error(`Error loading Pokemon ${id}:`, error);
        }
      }

      if (append) {
        setPokemons(prev => [...prev, ...newPokemons]);
      } else {
        setPokemons(newPokemons);
      }

      if (endId >= 151) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading Pokemons:', error);
      setSnackbarMessage('Error loading Pokémon');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPokemons(1);
  }, [loadPokemons]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadPokemons(nextPage, true);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleRefresh = () => {
    setPokemons([]);
    setCurrentPage(1);
    setHasMore(true);
    setSearchTerm('');
    loadPokemons(1);
    setSnackbarMessage('Data has been updated successfully');
    setSnackbarSeverity('success');
    setShowSnackbar(true);
  };

  const handleCartUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  const handleWalletUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  const filteredPokemons = pokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pokemon Store
          </Typography>
          <IconButton color="inherit" onClick={handleRefresh} title="Update data">
            <Refresh />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <WalletComponent onWalletUpdate={handleWalletUpdate} />
            <ShoppingCartComponent onCartUpdate={handleCartUpdate} />
            <PokemonCollection />
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" gutterBottom>
                Pokemon Catalog
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <TextField
                  placeholder="Search Pokémon..."
                  value={searchTerm}
                  onChange={handleSearch}
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 200 }}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                    endAdornment: searchTerm && (
                      <IconButton size="small" onClick={handleClearSearch}>
                        <Clear />
                      </IconButton>
                    )
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Available currencies: {CURRENCIES.map(c => `${c.name} (${c.code})`).join(', ')}
                </Typography>
              </Box>
            </Box>

            {/* Pokemon Grid */}
            <Grid container spacing={2}>
              {filteredPokemons.map((pokemon) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={`${pokemon.id}-${updateTrigger}`}>
                  <PokemonCard pokemon={pokemon} onCartUpdate={handleCartUpdate} />
                </Grid>
              ))}
            </Grid>

            {/* Load More Button */}
            {hasMore && !loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  Load more
                </Button>
              </Box>
            )}

            {/* Loading Indicator */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <CircularProgress />
              </Box>
            )}

            {/* No Results */}
            {!loading && filteredPokemons.length === 0 && searchTerm && (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="h6" color="text.secondary">
                  No matches found for "{searchTerm}"
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App; 