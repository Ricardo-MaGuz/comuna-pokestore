import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  Divider,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Delete, ShoppingCart, CheckCircle } from '@mui/icons-material';
import { CartItem } from '../types';
import { getCart, removeFromCart, clearCart, getWallet, updateWallet, addOwnedPokemon } from '../utils/storage';
import { convertPrice } from '../services/api';

interface ShoppingCartProps {
  onCartUpdate: () => void;
}

const ShoppingCartComponent: React.FC<ShoppingCartProps> = ({ onCartUpdate }) => {
  const [cart, setCart] = useState<CartItem[]>(getCart());
  const [wallet, setWallet] = useState(getWallet());
  const [totalInWalletCurrency, setTotalInWalletCurrency] = useState<number>(0);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const updateCartState = () => {
      setCart(getCart());
    };

    window.addEventListener('storage', updateCartState);
    
    updateCartState();

    return () => {
      window.removeEventListener('storage', updateCartState);
    };
  }, []);

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

  useEffect(() => {
    const calculateTotal = async () => {
      let total = 0;
      for (const item of cart) {
        const convertedPrice = await convertPrice(
          item.pokemon.price * item.quantity,
          item.pokemon.currency,
          wallet.currency
        );
        total += convertedPrice;
      }
      setTotalInWalletCurrency(total);
    };

    calculateTotal();
  }, [cart, wallet.currency]);

  const handleRemoveFromCart = (pokemonId: number) => {
    const updatedCart = removeFromCart(pokemonId);
    setCart(updatedCart);
    onCartUpdate();
    setSnackbarMessage('Pokemon removed from cart');
    setSnackbarSeverity('success');
    setShowSnackbar(true);
  };

  const handleCheckout = () => {
    if (totalInWalletCurrency > wallet.balance) {
      setSnackbarMessage('Not enough funds in your wallet to complete this purchase.');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
      return;
    }

    setShowCheckoutDialog(true);
  };

  const confirmCheckout = () => {
    // Deduct total from wallet
    const updatedWallet = { ...wallet };
    updatedWallet.balance -= totalInWalletCurrency;
    updateWallet(updatedWallet);
    setWallet(updatedWallet);

    // Add all Pokemon to owned list
    cart.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        addOwnedPokemon(item.pokemon.id);
      }
    });

    // Clear cart
    clearCart();
    setCart([]);
    onCartUpdate();

    setShowCheckoutDialog(false);
    setSnackbarMessage(`Successful purchase! ${wallet.currency === 'MXN' ? '$' : wallet.currency}${totalInWalletCurrency.toLocaleString()} were taken from your wallet.`);
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

  if (cart.length === 0) {
    return (
      <Card sx={{ minWidth: 275, mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ShoppingCart sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6" component="div" color="text.secondary">
              Shopping Cart
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Your cart is empty. Add some Pokémon to start shopping!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ minWidth: 275, mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ShoppingCart sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="div">
              Shopping Cart ({cart.length} items)
            </Typography>
          </Box>

          <List>
            {cart.map((item, index) => (
              <React.Fragment key={item.pokemon.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                          src={item.pokemon.image}
                          alt={item.pokemon.name}
                          style={{ width: 40, height: 40, marginRight: 12 }}
                        />
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                          {item.pokemon.name} x{item.quantity}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {formatPrice(item.pokemon.price, item.pokemon.currency)} each
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveFromCart(item.pokemon.id)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < cart.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Total:
            </Typography>
            <Typography variant="h6" color="primary">
              {formatPrice(totalInWalletCurrency, wallet.currency)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Available balance:
            </Typography>
            <Typography variant="body2" color={wallet.balance >= totalInWalletCurrency ? 'success.main' : 'error.main'}>
              {formatPrice(wallet.balance, wallet.currency)}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<CheckCircle />}
            onClick={handleCheckout}
            disabled={wallet.balance < totalInWalletCurrency}
            fullWidth
            size="large"
          >
            Confirm Purchase
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showCheckoutDialog} onClose={() => setShowCheckoutDialog(false)}>
        <DialogTitle>Confirm Purchase</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to purchase these Pokémon for {formatPrice(totalInWalletCurrency, wallet.currency)}?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your balance after purchase will be: {formatPrice(wallet.balance - totalInWalletCurrency, wallet.currency)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCheckoutDialog(false)}>Cancel</Button>
          <Button onClick={confirmCheckout} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default ShoppingCartComponent; 