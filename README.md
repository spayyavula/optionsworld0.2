# Paper Trading Platform with Options Trading

A comprehensive paper trading platform built with React, TypeScript, and Vite, featuring both stock and options trading simulation with Polygon.io integration.

## 🚀 Features

### Stock Trading
- Real-time stock price simulation
- Portfolio management and tracking
- Order management (Market, Limit, Stop orders)
- Watchlist functionality
- Advanced analytics and charts
- Risk management tools

### Options Trading
- Top 5 most liquid options contracts simulation
- Complete options chain with Greeks (Delta, Gamma, Theta, Vega)
- Implied volatility tracking
- Historical data (2 weeks) for each option
- Buy/Sell to Open/Close functionality
- Real-time P&L tracking
- Options portfolio analysis

### Data Integration
- Polygon.io API integration for real market data
- TradingView charts integration for advanced technical analysis
- Fallback to simulated data for development
- Historical data storage and retrieval
- Real-time price updates

## 🛠️ Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Polygon.io API key (optional, for real data)

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Environment Configuration:**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
# For real Polygon.io data, add your API key:
VITE_POLYGON_API_KEY=your_actual_api_key_here
VITE_ENABLE_REAL_TIME_DATA=true
VITE_ENABLE_MOCK_DATA=false
```

3. **Start the development server:**
```bash
npm run dev
```

## 📋 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_POLYGON_API_KEY` | Your Polygon.io API key | `demo_api_key` |
| `VITE_ENABLE_MOCK_DATA` | Use simulated data | `true` |
| `VITE_ENABLE_REAL_TIME_DATA` | Enable real API calls | `false` |
| `VITE_OPTIONS_UPDATE_INTERVAL` | Price update frequency (ms) | `5000` |
| `VITE_MAX_HISTORICAL_DAYS` | Historical data range | `14` |
| `VITE_DEFAULT_PORTFOLIO_VALUE` | Starting portfolio value | `100000` |

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run specific test files
npx playwright test tests/options-trading.spec.ts
npx playwright test tests/options-portfolio.spec.ts
```

### Test Coverage
- Complete navigation testing
- Stock trading workflow tests
- Options trading functionality
- Portfolio management
- Order placement and management
- Mobile responsiveness
- Data persistence

## 📊 Options Trading Features

### TradingView Integration
- **Advanced Charts**: Professional-grade charting with technical indicators
- **Real-time Data**: Live market data and price updates
- **Technical Analysis**: RSI, MACD, Bollinger Bands, and 100+ indicators
- **Multiple Timeframes**: From 1-minute to monthly charts
- **Drawing Tools**: Trend lines, support/resistance levels, and annotations
- **Custom Studies**: Create and save custom technical analysis studies

### Supported Options Contracts
1. **SPY $580 Call** - Dec 20, 2024 (High liquidity)
2. **QQQ $500 Call** - Dec 20, 2024 (Tech sector exposure)
3. **AAPL $230 Call** - Dec 20, 2024 (Individual stock)
4. **TSLA $1000 Call** - Dec 20, 2024 (High volatility)
5. **NVDA $1400 Call** - Dec 20, 2024 (AI/Semiconductor play)

### Options Data Points
- **Pricing**: Bid, Ask, Last, Mark
- **Greeks**: Delta, Gamma, Theta, Vega
- **Volatility**: Implied Volatility (IV)
- **Volume**: Daily trading volume
- **Open Interest**: Total open contracts
- **Intrinsic Value**: In-the-money value
- **Time Value**: Extrinsic option value

### Trading Capabilities
- **Buy to Open**: Enter new long positions
- **Sell to Close**: Close existing long positions
- **Sell to Open**: Enter new short positions (coming soon)
- **Buy to Close**: Close existing short positions (coming soon)

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
├── context/            # React Context providers
├── pages/              # Page components
├── services/           # API and data services
├── types/              # TypeScript type definitions
└── tests/              # E2E test files
```

### Key Technologies
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **TradingView** - Advanced charting and technical analysis
- **Playwright** - E2E testing
- **Polygon.io** - Market data API

## 🔧 Development

### Adding New Options Contracts
1. Update `TOP_LIQUID_OPTIONS` in `src/services/polygonService.ts`
2. Add corresponding test data
3. Update E2E tests if needed

### Customizing Update Intervals
Modify `VITE_OPTIONS_UPDATE_INTERVAL` in your `.env` file:
```bash
# Update every 2 seconds (faster)
VITE_OPTIONS_UPDATE_INTERVAL=2000

# Update every 10 seconds (slower)
VITE_OPTIONS_UPDATE_INTERVAL=10000
```

### Enabling Real Data
To use real Polygon.io data:
1. Get an API key from [Polygon.io](https://polygon.io)
2. Update your `.env` file:
```bash
VITE_POLYGON_API_KEY=your_real_api_key
VITE_ENABLE_REAL_TIME_DATA=true
VITE_ENABLE_MOCK_DATA=false
```

## 📱 Mobile Support

The platform is fully responsive and includes:
- Mobile-optimized navigation
- Touch-friendly trading interfaces
- Responsive charts and tables
- Mobile-specific E2E tests

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📈 Performance

- **Real-time Updates**: Configurable update intervals
- **Data Persistence**: Local storage for offline capability
- **Lazy Loading**: Optimized component loading
- **Responsive Design**: Mobile-first approach

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the existing issues
2. Review the environment configuration
3. Verify your Polygon.io API key (if using real data)
4. Run the E2E tests to identify specific problems

---

**Happy Trading! 📈**