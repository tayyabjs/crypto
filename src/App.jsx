import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, TextField, Button, Grid,
  CircularProgress, IconButton, Chip, Snackbar, Alert, InputAdornment,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Tooltip,
  Card, CardContent, LinearProgress, Divider
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
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

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
  const [marketSentiment, setMarketSentiment] = useState(null);
  const [historicalData, setHistoricalData] = useState({});

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

  // Returns icon based on day trade signal
  const getSignalIcon = (signal) => {
    switch (signal) {
      case 'BUY':
        return <TrendingUpIcon color="success" sx={{ fontSize: 20 }} />;
      case 'SELL':
        return <TrendingDownIcon color="error" sx={{ fontSize: 20 }} />;
      default:
        return <TrendingFlatIcon color="info" sx={{ fontSize: 20 }} />;
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
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h1" component="h1" gutterBottom>
              Crypto Investment Guru
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Advanced analysis with day trading signals, market sentiment, and 6-month outlook
            </Typography>
          </Box>

          {/* Market Sentiment Card */}
          {marketSentiment && (
            <Card sx={{ mb: 4, bgcolor: 'background.paper', borderRadius: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SignalCellularAltIcon /> Market Sentiment
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Overall market conditions for crypto trading
                    </Typography>
                  </Box>
                  <Chip
                    label={getMarketSentimentMessage()}
                    color={getMarketSentimentColor()}
                    variant="outlined"
                    size="medium"
                    sx={{ fontWeight: 'bold', fontSize: '1.1rem', height: '40px' }}
                  />
                </Box>
                
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Fear & Greed Index</Typography>
                    <Typography variant="h6">{marketSentiment.fearGreedIndex}/100</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={marketSentiment.fearGreedIndex} 
                      color={getMarketSentimentColor()}
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">BTC Dominance</Typography>
                    <Typography variant="h6">{marketSentiment.btcDominance.toFixed(1)}%</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">24h Market Cap Change</Typography>
                    <Typography 
                      variant="h6" 
                      color={marketSentiment.marketCapChange24h >= 0 ? 'success.main' : 'error.main'}
                    >
                      {marketSentiment.marketCapChange24h >= 0 ? '+' : ''}{marketSentiment.marketCapChange24h.toFixed(2)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">24h Volume Change</Typography>
                    <Typography 
                      variant="h6" 
                      color={marketSentiment.volumeChange24h >= 0 ? 'success.main' : 'error.main'}
                    >
                      {marketSentiment.volumeChange24h >= 0 ? '+' : ''}{marketSentiment.volumeChange24h.toFixed(2)}%
                    </Typography>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                  <Typography variant="body2">
                    <strong>Investment Outlook:</strong> {
                      marketSentiment.fearGreedIndex < 30 
                        ? "Market fear is high - potential buying opportunity for long-term investors" 
                        : marketSentiment.fearGreedIndex > 70 
                          ? "Market greed is high - consider taking profits or being cautious" 
                          : "Market is neutral - proceed with standard risk management"
                    }
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Controls Section */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 3,
              p: 4,
              mb: 4,
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
              <Table sx={{ minWidth: 1400 }} aria-label="crypto analysis table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Crypto</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">24H Change</TableCell>
                    <TableCell align="center">7D Change</TableCell>
                    <TableCell align="center">Day Trade Signal</TableCell>
                    <TableCell align="center">Signal Strength</TableCell>
                    <TableCell align="right">Market Cap</TableCell>
                    <TableCell align="right">FDV</TableCell>
                    <TableCell align="center">FDV Ratio</TableCell>
                    <TableCell align="center">Vol/MC Ratio</TableCell>
                    <TableCell align="center">6M Outlook</TableCell>
                    <TableCell align="center">6M Trend</TableCell>
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
                      <TableCell align="center">
                        <Chip
                          icon={crypto.price_change_percentage_7d >= 0 ? <TrendingUpIcon sx={{ fontSize: 16 }} /> : <TrendingDownIcon sx={{ fontSize: 16 }} />}
                          label={formatPercentage(crypto.price_change_percentage_7d)}
                          color={crypto.price_change_percentage_7d >= 0 ? 'success' : 'error'}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
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
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={crypto.signalStrength} 
                            color={
                              crypto.signalStrength > 70 ? 'success' : 
                              crypto.signalStrength > 50 ? 'warning' : 'error'
                            }
                            sx={{ width: '60px', height: 6, borderRadius: 3 }}
                          />
                          <Typography variant="body2" sx={{ width: '40px' }}>
                            {crypto.signalStrength}%
                          </Typography>
                        </Box>
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
                      <TableCell align="center">
                        <Chip
                          label={crypto.sixMonthOutlook}
                          color={
                            crypto.sixMonthOutlook === 'Bullish' ? 'success' : 
                            crypto.sixMonthOutlook === 'Bearish' ? 'error' : 'info'
                          }
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography 
                          variant="body2" 
                          color={
                            crypto.sixMonthTrend > 0 ? 'success.main' : 
                            crypto.sixMonthTrend < 0 ? 'error.main' : 'text.primary'
                          }
                        >
                          {crypto.sixMonthTrend >= 0 ? '+' : ''}{crypto.sixMonthTrend}%
                        </Typography>
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
                        {crypto.signalReason && (
                          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                            <AccessTimeIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                            {crypto.signalReason}
                          </Typography>
                        )}
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

          {/* Investment Guidance Section */}
          <Card sx={{ mt: 4, bgcolor: 'background.paper', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CheckCircleOutlineIcon color="success" /> Investment Guru Guidance
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                    Day Trading Signals
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our algorithm analyzes price momentum and volatility to generate buy/sell signals. 
                    Signal strength indicates confidence level. Always combine with your own technical analysis.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                    Market Sentiment
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    The Fear & Greed Index measures market emotions. Extreme fear may indicate buying opportunities, 
                    while extreme greed could signal overbought conditions. Use as a contrarian indicator.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                    6-Month Outlook
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Long-term trends help contextualize short-term trades. A bullish 6-month outlook 
                    supports buying dips, while a bearish trend suggests caution even on buy signals.
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  <strong>Disclaimer:</strong> This tool provides algorithmic analysis for informational purposes only. 
                  Cryptocurrency investments are highly risky and volatile. Always do your own research and never invest 
                  more than you can afford to lose. Past performance is not indicative of future results.
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 6, color: 'text.secondary' }}>
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