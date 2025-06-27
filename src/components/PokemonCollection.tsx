import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  Collapse,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Collections, 
  ExpandMore, 
  ExpandLess,
  CheckCircle 
} from '@mui/icons-material';
import { Pokemon } from '../types';
import { getOwnedPokemon, getCachedPokemon } from '../utils/storage';

const PokemonCollection: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [ownedPokemon, setOwnedPokemon] = useState<Pokemon[]>([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info'>('info');

  useEffect(() => {
    const updateOwnedPokemon = () => {
      const ownedIds = getOwnedPokemon();
      const pokemonList: Pokemon[] = [];
      
      ownedIds.forEach(id => {
        const cached = getCachedPokemon(id);
        if (cached) {
          pokemonList.push(cached);
        }
      });
      
      setOwnedPokemon(pokemonList);
      console.log('PokemonCollection: Updated owned Pokemon count:', pokemonList.length);
    };

    window.addEventListener('storage', updateOwnedPokemon);
    
    updateOwnedPokemon();

    return () => {
      window.removeEventListener('storage', updateOwnedPokemon);
    };
  }, []);

  const handleToggleExpanded = () => {
    setExpanded(!expanded);
    if (!expanded && ownedPokemon.length > 0) {
      setSnackbarMessage(`You have ${ownedPokemon.length} Pokémon!`);
      setSnackbarSeverity('info');
      setShowSnackbar(true);
    }
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: { [key: string]: string } = {
      MXN: '$',
      USD: '$',
      EUR: '€',
      JPY: '¥',
      GBP: '£'
    };
    return symbols[currency] || currency;
  };

  const formatPrice = (price: number, currency: string) => {
    return `${getCurrencySymbol(currency)}${price.toLocaleString()}`;
  };

  return (
    <>
      <Card sx={{ minWidth: 275, mb: 2, border: '2px solid #e0e0e0' }}>
        <CardContent>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              backgroundColor: ownedPokemon.length > 0 ? '#f0f8ff' : '#f5f5f5',
              p: 1,
              borderRadius: 1
            }}
            onClick={handleToggleExpanded}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Collections sx={{ mr: 1, color: ownedPokemon.length > 0 ? 'primary.main' : 'text.secondary' }} />
              <Typography variant="h6" component="div" color={ownedPokemon.length > 0 ? 'primary.main' : 'text.secondary'}>
                My Collection ({ownedPokemon.length})
              </Typography>
            </Box>
            <IconButton size="small">
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          {ownedPokemon.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              There are no Pokémon in your collection yet.
            </Typography>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                Owned Pokémon:
              </Typography>

              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 2 }}>
                  <List dense>
                    {ownedPokemon.map((pokemon) => (
                      <ListItem 
                        key={pokemon.id}
                        sx={{ 
                          border: '1px solid #e0e0e0', 
                          borderRadius: 1, 
                          mb: 1,
                          backgroundColor: '#f8f9fa'
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            src={pokemon.image} 
                            alt={pokemon.name}
                            sx={{ width: 40, height: 40 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  textTransform: 'capitalize',
                                  fontWeight: 'medium',
                                  mr: 1
                                }}
                              >
                                {pokemon.name}
                              </Typography>
                              <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Buying price: {formatPrice(pokemon.price, pokemon.currency)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Collapse>
            </>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
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
    </>
  );
};

export default PokemonCollection; 