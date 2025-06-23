import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { Pokemon } from '../types';

interface PokemonCardProps {
  pokemon: Pokemon;
  onCartUpdate: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onCartUpdate }) => {
  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log('Adding to cart:', pokemon.name);
    onCartUpdate();
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
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={pokemon.image}
        alt={pokemon.name}
        sx={{ objectFit: 'contain', backgroundColor: '#f5f5f5' }}
      />
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ textTransform: 'capitalize' }}>
          {pokemon.name}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          {pokemon.types.map((type) => (
            <Chip
              key={type}
              label={type}
              size="small"
              sx={{ mr: 0.5, mb: 0.5, textTransform: 'capitalize' }}
            />
          ))}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Height: {pokemon.height / 10}m | Weight: {pokemon.weight / 10}kg
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="primary">
            {formatPrice(pokemon.price, pokemon.currency)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddShoppingCart />}
          onClick={handleAddToCart}
          sx={{ mt: 'auto' }}
          fullWidth
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default PokemonCard; 