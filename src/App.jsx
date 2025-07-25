import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, TextField, Button, Grid, useMediaQuery,
  CircularProgress, IconButton, Chip, Snackbar, Alert, InputAdornment,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Tooltip,
  Drawer, List, ListItem, ListItemText, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  Pagination, Skeleton, Stack
} from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
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
import MenuIcon from '@mui/icons-material/Menu';
import StarIcon from '@mui/icons-material/Star';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import LinearProgress from '@mui/material/LinearProgress';

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
    info: {
      main: '#29b6f6', // Light blue for neutral/info
    }
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontSize: '2rem', // Smaller for mobile
      fontWeight: 700,
      background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h5: {
      fontSize: '1rem', // Smaller for mobile
      fontWeight: 400,
    },
    h6: {
      fontSize: '1rem', // Smaller for mobile
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '0.9rem', // Smaller for mobile
      fontWeight: 500,
    },
    body2: {
      fontSize: '0.75rem', // Slightly smaller for dense table/mobile
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          // Responsive padding
          padding: '6px 12px',
          '@media (max-width: 600px)': {
            padding: '4px 8px',
            fontSize: '0.75rem',
          },
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
          height: 24, // Smaller height
          fontSize: '0.7rem', // Smaller font
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
          // For mobile responsiveness
          overflowX: 'auto',
          '@media (max-width: 600px)': {
            fontSize: '0.7rem',
          },
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
          padding: '6px 8px', // Reduced padding for mobile
          fontSize: '0.75rem', // Smaller font for body
          '@media (max-width: 600px)': {
            padding: '4px 6px',
            fontSize: '0.7rem',
          },
        },
        head: {
          color: 'text.primary',
          fontWeight: 'bold',
          fontSize: '0.75rem', // Smaller font for headers
          '@media (max-width: 600px)': {
            fontSize: '0.65rem',
          },
        },
        body: {
          color: 'text.primary',
          fontSize: '0.75rem', // Slightly smaller font for body
          '@media (max-width: 600px)': {
            fontSize: '0.7rem',
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            '@media (max-width: 600px)': {
              minWidth: 30, // Smaller pagination items
              height: 30,
              fontSize: '0.7rem',
            },
          },
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
  const [marketSentiment, setMarketSentiment] = useState(null);
  const [historicalData, setHistoricalData] = useState({});
  const [topCryptos, setTopCryptos] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [topCryptosDialogOpen, setTopCryptosDialogOpen] = useState(false);
  const [topCryptosLoading, setTopCryptosLoading] = useState(false);
  // Pagination states
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // Show 10 items per page

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Helper function to show snackbar messages
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Fetch market sentiment data
  const fetchMarketSentiment = async () => {
    try {
      // In a real implementation, you would fetch actual sentiment data
      // For now, we'll simulate with random data
      const simulatedSentiment = {
        fearGreedIndex: Math.floor(Math.random() * 100),
        btcDominance: 45 + Math.random() * 10, // Between 45% and 55%
        marketCapChange24h: -2 + Math.random() * 4, // Between -2% and +2%
        volumeChange24h: -5 + Math.random() * 10, // Between -5% and +5%
      };
      setMarketSentiment(simulatedSentiment);
    } catch (error) {
      console.error('Error fetching market sentiment:', error);
      setMarketSentiment(null);
    }
  };

  // Fetch historical data for 6-month outlook
  const fetchHistoricalData = async (cryptoId) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=180&interval=daily`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching historical data for ${cryptoId}:`, error);
      return null;
    }
  };

  // Fetch top cryptocurrencies from CoinGecko
  const fetchTopCryptos = async () => {
    setTopCryptosLoading(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTopCryptos(data.map(crypto => ({
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol
      })));
    } catch (error) {
      console.error('Error fetching top cryptos:', error);
      showSnackbar(`Failed to fetch top cryptos: ${error.message}`, 'error');
    } finally {
      setTopCryptosLoading(false);
    }
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
      // Fetch market sentiment
      await fetchMarketSentiment();

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${selectedCryptos.join(',')}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h,7d`
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

      // Fetch historical data for each crypto
      const historicalDataPromises = data.map(crypto =>
        fetchHistoricalData(crypto.id).then(history => ({ id: crypto.id, history }))
      );

      const historicalResults = await Promise.all(historicalDataPromises);
      const newHistoricalData = {};
      historicalResults.forEach(result => {
        if (result.history) {
          newHistoricalData[result.id] = result.history;
        }
      });
      setHistoricalData(newHistoricalData);

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

        // Calculate 6-month outlook
        const history = newHistoricalData[crypto.id];
        let sixMonthOutlook = 'Neutral';
        let sixMonthTrend = 0;
        let supportLevel = null;
        let resistanceLevel = null;

        if (history && history.prices && history.prices.length > 30) {
          const prices = history.prices.map(p => p[1]); // [timestamp, price]
          const firstPrice = prices[0];
          const lastPrice = prices[prices.length - 1];
          sixMonthTrend = ((lastPrice - firstPrice) / firstPrice) * 100;

          // Simple support/resistance based on min/max in last 30 days
          const recentPrices = prices.slice(-30);
          supportLevel = Math.min(...recentPrices);
          resistanceLevel = Math.max(...recentPrices);

          if (sixMonthTrend > 15) sixMonthOutlook = 'Bullish';
          else if (sixMonthTrend < -15) sixMonthOutlook = 'Bearish';
          else sixMonthOutlook = 'Neutral';
        }

        // Day trading signal (simplified)
        let dayTradeSignal = 'HOLD';
        let signalStrength = 0;
        let signalReason = '';

        const priceChange24h = crypto.price_change_percentage_24h;
        const priceChange7d = crypto.price_change_percentage_7d;
        const rsi = 50 + (priceChange24h / 2); // Simplified RSI approximation

        if (rsi < 30 && priceChange24h > 2) {
          dayTradeSignal = 'BUY';
          signalStrength = 80;
          signalReason = 'Oversold conditions with positive momentum';
        } else if (rsi > 70 && priceChange24h < -2) {
          dayTradeSignal = 'SELL';
          signalStrength = 80;
          signalReason = 'Overbought conditions with negative momentum';
        } else if (priceChange24h > 5 && priceChange7d > 0) {
          dayTradeSignal = 'BUY';
          signalStrength = 65;
          signalReason = 'Strong upward momentum';
        } else if (priceChange24h < -5 && priceChange7d < 0) {
          dayTradeSignal = 'SELL';
          signalStrength = 65;
          signalReason = 'Strong downward momentum';
        } else {
          dayTradeSignal = 'HOLD';
          signalStrength = 30;
          signalReason = 'No clear signal';
        }

        // Adjust position size based on day trade signal and market conditions
        let adjustedRiskScore = riskScore;
        if (dayTradeSignal === 'BUY' && sixMonthOutlook === 'Bullish') {
          adjustedRiskScore = Math.max(1, riskScore - 1);
        } else if (dayTradeSignal === 'SELL' && sixMonthOutlook === 'Bearish') {
          adjustedRiskScore = Math.min(10, riskScore + 1);
        }

        return {
          ...crypto,
          fdvRatio,
          volumeToMarketCapRatio,
          assessment,
          riskScore,
          className,
          reasons: reasons.join('. '),
          positionSizeRec: getPositionSizeRecommendation(adjustedRiskScore),
          dayTradeSignal,
          signalStrength,
          signalReason,
          sixMonthOutlook,
          sixMonthTrend: sixMonthTrend.toFixed(2),
          supportLevel,
          resistanceLevel
        };
      });

      setCryptos(processedData);
      setLastUpdated(new Date());
      setPage(1); // Reset to first page on new data
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
        return <CheckCircleOutlineIcon color="success" sx={{ fontSize: 16 }} />;
      case 'caution':
        return <WarningAmberIcon color="warning" sx={{ fontSize: 16 }} />;
      case 'no-go':
        return <CancelOutlinedIcon color="error" sx={{ fontSize: 16 }} />;
      default:
        return <WarningAmberIcon color="info" sx={{ fontSize: 16 }} />;
    }
  };

  // Returns icon based on day trade signal
  const getSignalIcon = (signal) => {
    switch (signal) {
      case 'BUY':
        return <TrendingUpIcon color="success" sx={{ fontSize: 16 }} />;
      case 'SELL':
        return <TrendingDownIcon color="error" sx={{ fontSize: 16 }} />;
      default:
        return <TrendingFlatIcon color="info" sx={{ fontSize: 16 }} />;
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

  // Add a top crypto to the watchlist
  const addTopCrypto = (cryptoId) => {
    if (!selectedCryptos.includes(cryptoId)) {
      setSelectedCryptos([...selectedCryptos, cryptoId]);
      setTopCryptosDialogOpen(false);
      showSnackbar(`Added ${cryptoId} to your watchlist.`, 'success');
    } else {
      showSnackbar(`${cryptoId} is already in your list.`, 'warning');
    }
  };

  // Effect hook to fetch data whenever selected cryptos change
  useEffect(() => {
    fetchCryptoData();
  }, [selectedCryptos]);

  // Effect to fetch top cryptos on mount
  useEffect(() => {
    fetchTopCryptos();
  }, []);

  // Get market sentiment message
  const getMarketSentimentMessage = () => {
    if (!marketSentiment) return 'Loading market sentiment...';

    const { fearGreedIndex } = marketSentiment;
    if (fearGreedIndex < 25) return 'Extreme Fear';
    if (fearGreedIndex < 45) return 'Fear';
    if (fearGreedIndex < 55) return 'Neutral';
    if (fearGreedIndex < 75) return 'Greed';
    return 'Extreme Greed';
  };

  // Get market sentiment color
  const getMarketSentimentColor = () => {
    if (!marketSentiment) return 'info';

    const { fearGreedIndex } = marketSentiment;
    if (fearGreedIndex < 25) return 'error';
    if (fearGreedIndex < 45) return 'warning';
    if (fearGreedIndex < 55) return 'info';
    if (fearGreedIndex < 75) return 'success';
    return 'success';
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Calculate pagination data
  const paginatedCryptos = cryptos.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(cryptos.length / itemsPerPage);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a202c 0%, #2b3a50 50%, #1a202c 100%)',
          color: 'text.primary',
          py: 2, // Reduced padding for mobile
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}> {/* Responsive padding */}
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 2 }}> {/* Reduced margin for mobile */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h1" component="h1" sx={{ flexGrow: 1 }}>
                Crypto Investment Guru
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary"> {/* Smaller subtitle */}
              Advanced analysis with day trading signals
            </Typography>
          </Box>

          {/* Market Sentiment Card - Simplified for mobile */}
          {marketSentiment && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SignalCellularAltIcon fontSize="small" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Market Sentiment
                  </Typography>
                </Box>
                <Chip
                  label={getMarketSentimentMessage()}
                  color={getMarketSentimentColor()}
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Fear & Greed</Typography>
                  <Typography variant="body2">{marketSentiment.fearGreedIndex}/100</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">BTC Dominance</Typography>
                  <Typography variant="body2">{marketSentiment.btcDominance.toFixed(1)}%</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">24h Change</Typography>
                  <Typography
                    variant="body2"
                    color={marketSentiment.marketCapChange24h >= 0 ? 'success.main' : 'error.main'}
                  >
                    {marketSentiment.marketCapChange24h >= 0 ? '+' : ''}{marketSentiment.marketCapChange24h.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Controls Section - Responsive */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2, // Smaller radius
              p: 2, // Reduced padding
              mb: 2, // Reduced margin
              border: '1px solid',
              borderColor: 'primary.dark',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Smaller shadow
            }}
          >
            <Grid container spacing={1} alignItems="center"> {/* Reduced spacing */}
              <Grid item xs={12} sm={7}>
                <TextField
                  fullWidth
                  label="Enter Crypto ID..."
                  variant="outlined"
                  size="small" // Smaller input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCrypto()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" sx={{ fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={2.5}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addCrypto}
                  size="small" // Smaller button
                >
                  Add Crypto
                </Button>
              </Grid>
              <Grid item xs={6} sm={2.5}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={() => setTopCryptosDialogOpen(true)}
                  size="small" // Smaller button
                  startIcon={<StarIcon sx={{ fontSize: 16 }} />} // Smaller icon
                >
                  Top Crypto
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={fetchCryptoData}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon sx={{ fontSize: 16 }} />}
                  size="small"
                  sx={{ mt: 1 }} // Margin top for mobile stacking
                >
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </Button>
              </Grid>
            </Grid>
            {lastUpdated && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'right', fontSize: '0.7rem' }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
            )}
          </Box>

          {/* Selected Cryptos Chips - Horizontal scroll for mobile */}
          {selectedCryptos.length > 0 && (
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', gap: 1, pb: 1 }}>
              {selectedCryptos.map((id) => (
                <Chip
                  key={id}
                  label={id}
                  onDelete={() => removeCrypto(id)}
                  size="small"
                  sx={{ flexShrink: 0 }}
                />
              ))}
            </Box>
          )}

          {/* Crypto Data Table - Responsive with pagination */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : cryptos.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No cryptocurrencies to analyze. Add some above!
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', mb: 1 }}>
                <Table aria-label="crypto analysis table" size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Crypto</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">24H</TableCell>
                      <TableCell align="center">Signal</TableCell>
                      <TableCell align="center">Risk</TableCell>
                      <TableCell align="center">Position</TableCell>
                      <TableCell>Assessment</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCryptos.map((crypto) => (
                      <TableRow
                        key={crypto.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <img src={crypto.image} alt={crypto.name} style={{ width: 20, height: 20, borderRadius: '50%' }} />
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{crypto.name}</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>{crypto.symbol}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{formatCurrency(crypto.current_price)}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={crypto.price_change_percentage_24h >= 0 ? <TrendingUpIcon sx={{ fontSize: 12 }} /> : <TrendingDownIcon sx={{ fontSize: 12 }} />}
                            label={formatPercentage(crypto.price_change_percentage_24h)}
                            color={crypto.price_change_percentage_24h >= 0 ? 'success' : 'error'}
                            size="small"
                            sx={{ fontWeight: 'bold', height: 20 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={getSignalIcon(crypto.dayTradeSignal)}
                            label={crypto.dayTradeSignal}
                            color={
                              crypto.dayTradeSignal === 'BUY' ? 'success' :
                                crypto.dayTradeSignal === 'SELL' ? 'error' : 'info'
                            }
                            size="small"
                            sx={{ fontWeight: 'bold', height: 20 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{crypto.riskScore}/10</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.light' }}>
                            {crypto.positionSizeRec}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            {getAssessmentIcon(crypto.className)}
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                              {crypto.assessment}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            {crypto.reasons ? crypto.reasons.substring(0, 30) + (crypto.reasons.length > 30 ? '...' : '') : 'No concerns'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                    siblingCount={isMobile ? 0 : 1} // Show fewer page numbers on mobile
                    boundaryCount={isMobile ? 1 : 2}
                  />
                </Box>
              )}
            </>
          )}

          {/* Investment Guidance Section - Simplified for mobile */}
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, fontWeight: 'bold' }}>
              <CheckCircleOutlineIcon color="success" fontSize="small" /> Investment Guru Tips
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              Use day trading signals as a starting point. Combine with market sentiment and long-term trends.
              Always manage risk with appropriate position sizing.
            </Typography>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}>
            <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
              Data from CoinGecko API • Investment decisions are your own responsibility
            </Typography>
          </Box>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000} // Shorter duration for mobile
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Centered for mobile
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>

          {/* Mobile Drawer Menu */}
          {isMobile && (
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <Box
                sx={{ width: 250, bgcolor: 'background.default', height: '100%', pt: 2 }}
                role="presentation"
              >
                <List>
                  <ListItem>
                    <ListItemText primary="Crypto Investment Guru" primaryTypographyProps={{ fontWeight: 'bold' }} />
                  </ListItem>
                  <Divider />
                  <ListItem button onClick={() => { setDrawerOpen(false); setTopCryptosDialogOpen(true); }}>
                    <ListItemText primary="Add Top Cryptos" />
                  </ListItem>
                  <ListItem button onClick={() => { setDrawerOpen(false); fetchCryptoData(); }}>
                    <ListItemText primary="Refresh Data" />
                  </ListItem>
                </List>
              </Box>
            </Drawer>
          )}

          {/* Top Cryptos Dialog */}
          <Dialog
            open={topCryptosDialogOpen}
            onClose={() => setTopCryptosDialogOpen(false)}
            fullScreen={isMobile} // Full screen on mobile
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Add Top Cryptocurrencies
              <IconButton
                aria-label="close"
                onClick={() => setTopCryptosDialogOpen(false)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {topCryptosLoading ? (
                <Stack spacing={1}>
                  {[...Array(10)].map((_, index) => (
                    <Skeleton key={index} variant="rectangular" height={40} />
                  ))}
                </Stack>
              ) : (
                <List>
                  {topCryptos.map((crypto) => (
                    <ListItem
                      key={crypto.id}
                      divider
                      secondaryAction={
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => addTopCrypto(crypto.id)}
                        >
                          Add
                        </Button>
                      }
                    >
                      <ListItemText
                        primary={`${crypto.name} (${crypto.symbol.toUpperCase()})`}
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setTopCryptosDialogOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CryptoInvestmentAnalyzer;