import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { AddShoppingCart, CheckCircle } from '@mui/icons-material';
import { Pokemon } from '../types';
import { convertPrice } from '../services/api';
import { isPokemonOwned, addToCart, getCart } from '../utils/storage';
import { getWallet } from '../utils/storage';

interface PokemonCardProps {
  pokemon: Pokemon;
  onCartUpdate: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onCartUpdate }) => {
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null);
  const [isOwned, setIsOwned] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [wallet, setWallet] = useState(getWallet());
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const checkOwnership = () => {
      setIsOwned(isPokemonOwned(pokemon.id));
    };
    
    const checkCartStatus = () => {
      const cart = getCart();
      const cartItem = cart.find(item => item.pokemon.id === pokemon.id);
      setIsInCart(!!cartItem);
    };
    
    const convertPriceToWallet = async () => {
      try {
        const converted = await convertPrice(pokemon.price, pokemon.currency, wallet.currency);
        setConvertedPrice(converted);
      } catch (error) {
        console.error('Error converting price:', error);
        setConvertedPrice(pokemon.price);
      }
    };

    checkOwnership();
    checkCartStatus();
    convertPriceToWallet();
  }, [pokemon, wallet.currency]);

  useEffect(() => {
    const updateWalletState = () => {
      setWallet(getWallet());
    };

    window.addEventListener('storage', updateWalletState);
    
    updateWalletState();

    return () => {
      window.removeEventListener('storage', updateWalletState);
    };
  }, []);

  const handleAddToCart = () => {
    if (isOwned) {
      setSnackbarMessage('You already own this Pokémon!');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
      return;
    }

    if (isInCart) {
      setSnackbarMessage('You already have this Pokémon in your cart!');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
      return;
    }

    if (convertedPrice && convertedPrice > wallet.balance) {
      setSnackbarMessage('Not enough balance in your wallet');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
      return;
    }

    addToCart(pokemon);
    setIsInCart(true);
    onCartUpdate();
    setSnackbarMessage('Pokemon added to cart successfully!');
    setSnackbarSeverity('success');
    setShowSnackbar(true);
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
      <Card sx={{ 
        maxWidth: 345, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        opacity: isOwned ? 0.7 : 1
      }}>
        {isOwned && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1,
              backgroundColor: 'success.main',
              borderRadius: '50%',
              p: 0.5
            }}
          >
            <CheckCircle sx={{ color: 'white', fontSize: 24 }} />
          </Box>
        )}
        
        {isInCart && !isOwned && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 1,
              backgroundColor: 'primary.main',
              borderRadius: '50%',
              p: 0.5
            }}
          >
            <AddShoppingCart sx={{ color: 'white', fontSize: 24 }} />
          </Box>
        )}
        
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
            <Typography variant="h6" color="primary">
              {formatPrice(pokemon.price, pokemon.currency)}
            </Typography>
            {convertedPrice && pokemon.currency !== wallet.currency && (
              <Typography variant="body2" color="text.secondary">
                {formatPrice(convertedPrice, wallet.currency)}
              </Typography>
            )}
          </Box>

          <Box sx={{ mb: 2 }}>
            
          </Box>

          <Button
            variant="contained"
            startIcon={isOwned ? <CheckCircle /> : isInCart ? <AddShoppingCart /> : <AddShoppingCart />}
            onClick={handleAddToCart}
            disabled={isOwned || isInCart}
            sx={{ mt: 'auto' }}
            fullWidth
          >
            {isOwned ? 'Pokemon owned' : isInCart ? 'Pokemon in cart' : 'Add to cart'}
          </Button>
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

export default PokemonCard; 