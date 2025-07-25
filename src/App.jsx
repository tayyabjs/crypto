import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, TextField, Button, Grid,
  CircularProgress, IconButton, Chip, Snackbar, Alert, InputAdornment,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Tooltip
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// Custom Material-UI Theme for a dark, professional look
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Light blue for primary actions
    },
    secondary: {
      main: '#f48fb1', // Pink for secondary actions
    },
    background: {
      default: '#1a202c', // Dark slate background
      paper: '#2d3748', // Slightly lighter slate for cards/components
    },
    text: {
      primary: '#e0e0e0', // Light gray text
      secondary: '#a0aec0', // Muted gray text
    },
    success: {
      main: '#66bb6a', // Green for 'GO AHEAD'
    },
    warning: {
      main: '#ffa726', // Orange for 'CAUTION'
    },
    error: {
      main: '#ef5350', // Red for 'NO-GO'
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 400,
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body2: {
      fontSize: '0.8rem', // Slightly smaller for dense table
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
          border: '1px solid',
          borderColor: 'primary.dark',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#3a475c', // Slightly lighter dark for table header
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#4a5568', // Border color for table cells
          padding: '8px 12px', // Adjust padding for better spacing in dense table
        },
        head: {
          color: 'text.primary',
          fontWeight: 'bold',
          fontSize: '0.85rem', // Slightly smaller font for headers
        },
        body: {
          color: 'text.primary',
          fontSize: '0.8rem', // Slightly smaller font for body
        },
      },
    },
  },
});

const CryptoInvestmentAnalyzer = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCryptos, setSelectedCryptos] = useState([
    'bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana'
  ]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  // Helper function to show snackbar messages
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Fetch crypto data from CoinGecko API
  const fetchCryptoData = async () => {
    if (selectedCryptos.length === 0) {
      setCryptos([]);
      setLastUpdated(new Date());
      showSnackbar('No cryptocurrencies selected to analyze.', 'info');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${selectedCryptos.join(',')}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Identify cryptos that were requested but not returned by CoinGecko (invalid IDs)
      const returnedIds = new Set(data.map(c => c.id));
      const notFoundIds = selectedCryptos.filter(id => !returnedIds.has(id));
      if (notFoundIds.length > 0) {
        showSnackbar(`Could not find data for: ${notFoundIds.join(', ')}. Please check the crypto IDs.`, 'warning');
        // Filter out the non-existent IDs from selectedCryptos for future fetches
        setSelectedCryptos(prev => prev.filter(id => returnedIds.has(id)));
      }

      // Process data with our assessment logic
      const processedData = data.map(crypto => {
        const marketCap = crypto.market_cap;
        const fdv = crypto.fully_diluted_valuation;
        const volume = crypto.total_volume;

        // Calculate ratios
        const fdvRatio = fdv && marketCap ? fdv / marketCap : null;
        const volumeToMarketCapRatio = volume && marketCap ? volume / marketCap : null;

        // Assessment logic
        let assessment = 'GO AHEAD';
        let riskScore = 2;
        let className = 'go'; // Used for color coding
        let reasons = [];

        // FDV Ratio Check (Fully Diluted Valuation / Market Cap)
        // High FDV ratio implies significant future token unlocks, potentially diluting price.
        if (fdvRatio && fdvRatio > 2) {
          assessment = 'STRONG NO-GO';
          riskScore = 9;
          className = 'no-go';
          reasons.push('Extremely high FDV ratio indicates massive future dilution');
        } else if (fdvRatio && fdvRatio > 1.5) {
          assessment = 'HIGH RISK';
          riskScore = 7;
          className = 'caution';
          reasons.push('High FDV ratio suggests significant token unlocks ahead');
        } else if (fdvRatio && fdvRatio > 1.2) {
          assessment = 'MEDIUM RISK';
          riskScore = 5;
          className = 'caution';
          reasons.push('Moderate FDV ratio - research vesting schedules');
        }

        // Volume/MarketCap Ratio Check
        // Low volume relative to market cap indicates poor liquidity, making large trades difficult.
        if (volumeToMarketCapRatio && volumeToMarketCapRatio < 0.005) {
          assessment = 'NO-GO';
          riskScore = Math.max(riskScore, 8); // Take the max risk score if multiple conditions apply
          className = 'no-go';
          reasons.push('Very low liquidity - difficult to trade');
        } else if (volumeToMarketCapRatio && volumeToMarketCapRatio < 0.01) {
          riskScore = Math.max(riskScore, 6);
          if (assessment === 'GO AHEAD') { // Only downgrade if not already a higher risk
            assessment = 'MEDIUM RISK';
            className = 'caution';
          }
          reasons.push('Low liquidity - be careful with large orders');
        }

        // Price volatility check (24h price change)
        if (Math.abs(crypto.price_change_percentage_24h) > 20) {
          riskScore = Math.max(riskScore, 6);
          reasons.push('High volatility detected in 24h price change');
        }

        return {
          ...crypto,
          fdvRatio,
          volumeToMarketCapRatio,
          assessment,
          riskScore,
          className,
          reasons: reasons.join('. '),
          positionSizeRec: getPositionSizeRecommendation(riskScore)
        };
      });

      setCryptos(processedData);
      setLastUpdated(new Date());
      if (notFoundIds.length === 0) { // Only show success if all requested cryptos were found
        showSnackbar('Crypto data refreshed successfully!', 'success');
      }
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      showSnackbar(`Failed to fetch crypto data: ${error.message}`, 'error');
    }
    setLoading(false);
  };

  // Recommends position size based on calculated risk score
  const getPositionSizeRecommendation = (riskScore) => {
    if (riskScore <= 2) return '10-15%';
    if (riskScore <= 4) return '5-8%';
    if (riskScore <= 6) return '2-3%';
    if (riskScore <= 8) return '0.5-1%';
    return 'AVOID';
  };

  // Returns Material-UI icon based on assessment class
  const getAssessmentIcon = (className) => {
    switch (className) {
      case 'go':
        return <CheckCircleOutlineIcon color="success" sx={{ fontSize: 20 }} />;
      case 'caution':
        return <WarningAmberIcon color="warning" sx={{ fontSize: 20 }} />;
      case 'no-go':
        return <CancelOutlinedIcon color="error" sx={{ fontSize: 20 }} />;
      default:
        return <WarningAmberIcon color="info" sx={{ fontSize: 20 }} />;
    }
  };

  // Formats currency values
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 6 : 2
    }).format(value);
  };

  // Formats large numbers for display (e.g., Market Cap, FDV)
  const formatLargeNumber = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  // Formats percentage values
  const formatPercentage = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  // Adds a crypto to the list of selected cryptos for analysis
  const addCrypto = () => {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    if (trimmedSearchTerm && !selectedCryptos.includes(trimmedSearchTerm)) {
      setSelectedCryptos([...selectedCryptos, trimmedSearchTerm]);
      setSearchTerm('');
      // Data fetch will be triggered by useEffect, and snackbar will confirm if found
    } else if (selectedCryptos.includes(trimmedSearchTerm)) {
      showSnackbar(`${trimmedSearchTerm} is already in your list.`, 'warning');
    } else if (!trimmedSearchTerm) {
      showSnackbar('Please enter a crypto ID.', 'warning');
    }
  };

  // Removes a crypto from the list
  const removeCrypto = (cryptoId) => {
    setSelectedCryptos(selectedCryptos.filter(id => id !== cryptoId));
    setCryptos(cryptos.filter(crypto => crypto.id !== cryptoId));
    showSnackbar(`Removed ${cryptoId} from analysis.`, 'info');
  };

  // Effect hook to fetch data whenever selected cryptos change
  useEffect(() => {
    fetchCryptoData();
  }, [selectedCryptos]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Provides a consistent baseline for styling */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a202c 0%, #2b3a50 50%, #1a202c 100%)',
          color: 'text.primary',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h1" component="h1" gutterBottom>
              Crypto Investment Analyzer
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Real-time analysis using CoinGecko data with Phase 1 investment criteria for personal trading.
            </Typography>
          </Box>

          {/* Controls Section */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 3,
              p: 4,
              mb: 6,
              border: '1px solid',
              borderColor: 'primary.dark',
              boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Enter Crypto ID (e.g., bitcoin, ethereum). Check CoinGecko for exact IDs."
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCrypto()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addCrypto}
                  sx={{ height: '56px' }} // Match TextField height
                >
                  Add Crypto
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={fetchCryptoData}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                  sx={{ height: '56px' }}
                >
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </Button>
              </Grid>
            </Grid>
            {lastUpdated && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'right' }}>
                Last updated: {lastUpdated.toLocaleString()}
              </Typography>
            )}
          </Box>

          {/* Crypto Data Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : cryptos.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary">
                No cryptocurrencies to analyze. Add some above!
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
              <Table sx={{ minWidth: 1200 }} aria-label="crypto analysis table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Crypto</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">24H Change</TableCell>
                    <TableCell align="right">24H High</TableCell>
                    <TableCell align="right">24H Low</TableCell>
                    <TableCell align="right">Market Cap</TableCell>
                    <TableCell align="right">FDV</TableCell>
                    <TableCell align="center">FDV Ratio</TableCell>
                    <TableCell align="center">Vol/MC Ratio</TableCell>
                    <TableCell align="right">Circulating Supply</TableCell>
                    <TableCell align="right">Total Supply</TableCell>
                    <TableCell align="right">ATH</TableCell>
                    <TableCell align="center">ATH % Change</TableCell>
                    <TableCell align="right">ATL</TableCell>
                    <TableCell align="center">ATL % Change</TableCell>
                    <TableCell align="center">Risk Score</TableCell>
                    <TableCell align="center">Position Size</TableCell>
                    <TableCell>Assessment & Remarks</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cryptos.map((crypto) => (
                    <TableRow
                      key={crypto.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <img src={crypto.image} alt={crypto.name} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{crypto.name}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase' }}>{crypto.symbol}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{formatCurrency(crypto.current_price)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={crypto.price_change_percentage_24h >= 0 ? <TrendingUpIcon sx={{ fontSize: 16 }} /> : <TrendingDownIcon sx={{ fontSize: 16 }} />}
                          label={formatPercentage(crypto.price_change_percentage_24h)}
                          color={crypto.price_change_percentage_24h >= 0 ? 'success' : 'error'}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">{formatCurrency(crypto.high_24h)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">{formatCurrency(crypto.low_24h)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">{formatLargeNumber(crypto.market_cap)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">{formatLargeNumber(crypto.fully_diluted_valuation)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">{crypto.fdvRatio ? crypto.fdvRatio.toFixed(2) : 'N/A'}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">{crypto.volumeToMarketCapRatio ? formatPercentage(crypto.volumeToMarketCapRatio * 100) : 'N/A'}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">{crypto.circulating_supply ? new Intl.NumberFormat().format(crypto.circulating_supply) : 'N/A'}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">{crypto.total_supply ? new Intl.NumberFormat().format(crypto.total_supply) : 'N/A'}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">{formatCurrency(crypto.ath)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={formatPercentage(crypto.ath_change_percentage)}
                          color={crypto.ath_change_percentage <= 0 ? 'error' : 'success'} // ATH change is usually negative
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">{formatCurrency(crypto.atl)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={formatPercentage(crypto.atl_change_percentage)}
                          color={crypto.atl_change_percentage >= 0 ? 'success' : 'error'} // ATL change is usually positive
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{crypto.riskScore}/10</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.light' }}>
                          {crypto.positionSizeRec}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          {getAssessmentIcon(crypto.className)}
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            {crypto.assessment}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {crypto.reasons || 'No specific concerns detected based on current criteria.'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<OpenInNewIcon />}
                            href={`https://www.coingecko.com/en/coins/${crypto.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            CoinGecko
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => removeCrypto(crypto.id)}
                            startIcon={<CloseIcon />}
                          >
                            Remove
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 10, color: 'text.secondary' }}>
            <Typography variant="body2">
              Data provided by CoinGecko API • Investment decisions are your own responsibility
            </Typography>
          </Box>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CryptoInvestmentAnalyzer;
