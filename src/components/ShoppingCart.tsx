import React, { useState } from 'react';
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
  Divider
} from '@mui/material';
import { Delete, ShoppingCart } from '@mui/icons-material';
import { CartItem } from '../types';

interface ShoppingCartProps {
  onCartUpdate: () => void;
}

const ShoppingCartComponent: React.FC<ShoppingCartProps> = ({ onCartUpdate }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleRemoveFromCart = (pokemonId: number) => {
    setCart(prev => prev.filter(item => item.pokemon.id !== pokemonId));
    onCartUpdate();
  };

  const handleCheckout = () => {
    // TODO: Implement checkout functionality
    console.log('Checking out with items:', cart);
    setCart([]);
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

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.pokemon.price * item.quantity), 0);
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
            Your cart is empty. Add some Pokémon!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
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
            {formatPrice(calculateTotal(), 'MXN')}
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleCheckout}
          fullWidth
          size="large"
        >
          Checkout
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShoppingCartComponent; 