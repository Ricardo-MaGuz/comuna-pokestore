import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
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
  const [ownedPokemon, setOwnedPokemon] = useState<Pokemon[]>([]);
  const [expanded, setExpanded] = useState(false);
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

  if (ownedPokemon.length === 0) {
    return (
      <Card sx={{ minWidth: 275, mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Collections sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6" component="div" color="text.secondary">
              My Collection
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            There are no Pokémon in your collection yet.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ minWidth: 275, mb: 2 }}>
        <CardContent>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            onClick={handleToggleExpanded}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Collections sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" component="div">
               My Collection ({ownedPokemon.length})
              </Typography>
            </Box>
            <IconButton size="small">
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
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