import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { AccountBalance, Add } from '@mui/icons-material';
import { Wallet as WalletType } from '../types';

interface WalletProps {
  onWalletUpdate: () => void;
}

const WalletComponent: React.FC<WalletProps> = ({ onWalletUpdate }) => {
  const [wallet, setWallet] = useState<WalletType>({
    balance: Math.floor(Math.random() * 10000) + 5000, // Random balance between 5000-15000
    currency: 'MXN'
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [amount, setAmount] = useState('');

  const handleAddFunds = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setWallet(prev => ({ ...prev, balance: prev.balance + numAmount }));
    onWalletUpdate();
    setOpenDialog(false);
    setAmount('');
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

  return (
    <>
      <Card sx={{ minWidth: 275, mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccountBalance sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="div">
              My Wallet
            </Typography>
          </Box>
          
          <Typography variant="h4" color="primary" gutterBottom>
            {getCurrencySymbol(wallet.currency)}{wallet.balance.toLocaleString()}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Currency: {wallet.currency === 'MXN' ? 'Mexican Peso' : wallet.currency}
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            size="small"
            sx={{ mt: 2 }}
          >
            Add Funds
          </Button>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Funds to Wallet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount (MXN)"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddFunds} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WalletComponent; 