import React, { useState } from 'react';
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
  Chip,
  Collapse,
  IconButton
} from '@mui/material';
import { ExpandMore, ExpandLess, Collections } from '@mui/icons-material';
import { Pokemon } from '../types';

interface PokemonCollectionProps {}

const PokemonCollection: React.FC<PokemonCollectionProps> = () => {
  const [expanded, setExpanded] = useState(false);
  const [ownedPokemon, setOwnedPokemon] = useState<Pokemon[]>([]);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
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
            You haven't purchased any Pokémon yet.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Collections sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="div">
            My Collection ({ownedPokemon.length})
          </Typography>
          <IconButton
            onClick={handleToggleExpand}
            sx={{ ml: 'auto' }}
            size="small"
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <List>
            {ownedPokemon.map((pokemon) => (
              <ListItem key={pokemon.id} divider>
                <ListItemAvatar>
                  <Avatar src={pokemon.image} alt={pokemon.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      {pokemon.name}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Box sx={{ mb: 1 }}>
                        {pokemon.types.map((type) => (
                          <Chip
                            key={type}
                            label={type}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5, textTransform: 'capitalize' }}
                          />
                        ))}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Purchased for: {formatPrice(pokemon.price, pokemon.currency)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default PokemonCollection; 