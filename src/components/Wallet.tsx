import React, { useState, useEffect } from 'react';
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
  DialogActions,
  Alert,
  Snackbar
} from '@mui/material';
import { AccountBalance, Add, Casino } from '@mui/icons-material';
import { Wallet as WalletType } from '../types';
import { getWallet, addFundsToWallet } from '../utils/storage';

interface WalletProps {
  onWalletUpdate: () => void;
}

const WalletComponent: React.FC<WalletProps> = ({ onWalletUpdate }) => {
  const [wallet, setWallet] = useState<WalletType>(getWallet());
  const [openDialog, setOpenDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

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

  const handleAddRandomFunds = () => {
    const randomAmount = Math.floor(Math.random() * 5000) + 1000;
    const updatedWallet = addFundsToWallet(randomAmount);
    setWallet(updatedWallet);
    onWalletUpdate();
    setSnackbarMessage(`$${randomAmount.toLocaleString()} MXN  were added to your wallet!`);
    setSnackbarSeverity('success');
    setShowSnackbar(true);
  };

  const handleAddCustomFunds = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setSnackbarMessage('Enter a valid amount');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
      return;
    }

    const updatedWallet = addFundsToWallet(numAmount);
    setWallet(updatedWallet);
    onWalletUpdate();
    setSnackbarMessage(` $${numAmount.toLocaleString()} MXN were added to your wallet!`);
    setSnackbarSeverity('success');
    setShowSnackbar(true);
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
            Currency: {wallet.currency === 'MXN' ? 'Mexican peso' : wallet.currency}
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Casino />}
              onClick={handleAddRandomFunds}
              size="small"
            >
             Add Random Funds
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
              size="small"
            >
              Add Funds
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Agregar Fondos al Monedero</DialogTitle>
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
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddCustomFunds} variant="contained">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

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

export default WalletComponent; 