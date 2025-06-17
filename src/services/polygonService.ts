import type { OptionsContract, OptionsChainData, HistoricalData } from '../types/options'
 
const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY || 'demo_api_key'
const BASE_URL = import.meta.env.VITE_POLYGON_BASE_URL || 'https://api.polygon.io'
const ENABLE_MOCK_DATA = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true'
const ENABLE_REAL_TIME_DATA = import.meta.env.VITE_ENABLE_REAL_TIME_DATA === 'true'

// Top 5 most liquid options contracts (simulated data based on typical market leaders)
const TOP_LIQUID_OPTIONS: OptionsContract[] = [
  {
    contract_type: 'call',
    exercise_style: 'american',
    expiration_date: '2024-03-15',
    shares_per_contract: 100,
    strike_price: 580,
    ticker: 'SPY240315C00580000',
    underlying_ticker: 'SPY',
    bid: 29.05,
    ask: 29.15,
    last: 29.10,
    volume: 15234,
    open_interest: 45678,
    implied_volatility: 0.25,
    delta: 0.65,
    gamma: 0.02,
    theta: -0.15,
    vega: 0.30,
    intrinsic_value: 0,
    time_value: 29.10
  }
]

export class PolygonService {
  static async fetchOptionsChain(underlying: string): Promise<OptionsChainData> {
    if (ENABLE_MOCK_DATA || !ENABLE_REAL_TIME_DATA) {
      // Use simulated data for demo/development
      return this.getSimulatedOptionsChain(underlying)
    }

    // Real Polygon.io API call (requires valid API key)
    try {
      const response = await fetch(
        `${BASE_URL}/v3/reference/options/contracts?underlying_ticker=${underlying}&limit=1000&apikey=${POLYGON_API_KEY}`
      )
      
      if (!response.ok) {
        console.warn('Polygon API call failed, falling back to mock data')
        return this.getSimulatedOptionsChain(underlying)
      }
      
      const data = await response.json()
      return this.transformPolygonData(data)
    } catch (error) {
      console.warn('Error fetching from Polygon API, using mock data:', error)
      return this.getSimulatedOptionsChain(underlying)
    }
  }

  private static getSimulatedOptionsChain(underlying: string): OptionsChainData {
    const contracts = TOP_LIQUID_OPTIONS.filter(contract => 
      contract.underlying_ticker === underlying
    )

    return {
      underlying,
      contracts,
      lastUpdated: new Date()
    }
  }

  private static transformPolygonData(polygonData: any): OptionsChainData {
    // Transform Polygon.io API response to our format
    const contracts: OptionsContract[] = polygonData.results?.map((contract: any) => ({
      contract_type: contract.contract_type,
      exercise_style: contract.exercise_style,
      expiration_date: contract.expiration_date,
      shares_per_contract: contract.shares_per_contract,
      strike_price: contract.strike_price,
      ticker: contract.ticker,
      underlying_ticker: contract.underlying_ticker,
      // Add simulated market data
      bid: contract.strike_price * 0.05,
      ask: contract.strike_price * 0.06,
      last: contract.strike_price * 0.055,
      volume: Math.floor(Math.random() * 10000),
      open_interest: Math.floor(Math.random() * 50000),
      implied_volatility: 0.2 + Math.random() * 0.3,
      delta: Math.random() * 0.8,
      gamma: Math.random() * 0.1,
      theta: -Math.random() * 0.05,
      vega: Math.random() * 0.3,
      intrinsic_value: Math.max(0, 580 - contract.strike_price), // Assuming SPY at 580
      time_value: contract.strike_price * 0.055 - Math.max(0, 580 - contract.strike_price)
    })) || []

    return {
      underlying: polygonData.underlying,
      contracts,
      lastUpdated: new Date()
    }
  }

  static async fetchHistoricalData(ticker: string, days: number = 14): Promise<HistoricalData[]> {
    try {
      // First try to get data from Supabase
      const { HistoricalDataService } = await import('./historicalDataService')
      const storedData = await HistoricalDataService.getHistoricalData(ticker, days)
      if (storedData.length > 0) {
        console.log(`Retrieved ${storedData.length} historical data points from Supabase for ${ticker}`)
        return storedData
      }
    } catch (error) {
      console.warn('Failed to fetch stored data, using simulated data:', error)
    }

    if (ENABLE_MOCK_DATA || !ENABLE_REAL_TIME_DATA) {
      const simulatedData = this.generateSimulatedHistoricalData(ticker, days)
      
      // Store simulated data in Supabase for future use
      try {
        const { HistoricalDataService } = await import('./historicalDataService')
        await HistoricalDataService.storeHistoricalData(ticker, simulatedData)
      } catch (error) {
        console.warn('Failed to store simulated data:', error)
      }
      
      return simulatedData
    }

    // Real Polygon.io API call for historical data
    try {
      const endDate = new Date()
      const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)
      
      const response = await fetch(
        `${BASE_URL}/v2/aggs/ticker/${ticker}/range/1/day/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}?apikey=${POLYGON_API_KEY}`
      )
      
      if (!response.ok) {
        console.warn('Historical data API call failed, using simulated data')
        return this.generateSimulatedHistoricalData(ticker, days)
      }
      
      const data = await response.json()
      const transformedData = this.transformHistoricalData(data)
      
      // Store real data in Supabase
      try {
        const { HistoricalDataService } = await import('./historicalDataService')
        await HistoricalDataService.storeHistoricalData(ticker, transformedData)
      } catch (error) {
        console.warn('Failed to store real data:', error)
      }
      
      return transformedData
    } catch (error) {
      console.warn('Error fetching historical data, using simulated:', error)
      const simulatedData = this.generateSimulatedHistoricalData(ticker, days)
      
      // Store simulated data as fallback
      try {
        const { HistoricalDataService } = await import('./historicalDataService')
        await HistoricalDataService.storeHistoricalData(ticker, simulatedData)
      } catch (error) {
        console.warn('Failed to store fallback data:', error)
      }
      
      return simulatedData
    }
  }

  private static generateSimulatedHistoricalData(ticker: string, days: number): HistoricalData[] {
    // Generate simulated historical data for the last 'days' days
    const data: HistoricalData[] = []
    const basePrice = this.getBasePriceForTicker(ticker)
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const dailyChange = (Math.random() - 0.5) * 2 // Random price movement
      const open = basePrice * (1 + dailyChange * 0.01)
      const close = open * (1 + (Math.random() - 0.5) * 0.02)
      const high = Math.max(open, close) * (1 + Math.random() * 0.01)
      const low = Math.min(open, close) * (1 - Math.random() * 0.01)
      
      data.push({
        date: date.toISOString().split('T')[0],
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 1000000)
      })
    }
    
    return data
  }

  private static transformHistoricalData(polygonData: any): HistoricalData[] {
    return polygonData.results?.map((bar: any) => ({
      date: new Date(bar.t).toISOString().split('T')[0],
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v
    })) || []
  }

  private static getBasePriceForTicker(ticker: string): number {
    // Base prices for our simulated options
    const basePrices: { [key: string]: number } = {
      'SPY': 580,
      'AAPL': 185,
      'MSFT': 420,
      'GOOGL': 150,
      'AMZN': 175,
      'TSLA': 190
    }
    
    return basePrices[ticker] || 100 // Default to 100 if ticker not found
  }

  /**
   * Initialize historical data for all top liquid options
   */
  static async initializeHistoricalData(): Promise<void> {
    console.log('Initializing historical data for top liquid options...')
    
    const tickers = [...new Set(TOP_LIQUID_OPTIONS.map(option => option.underlying_ticker))]
    
    // Initialize underlying stock data
    for (const ticker of tickers) {
      try {
        await this.fetchHistoricalData(ticker, 14)
        console.log(`Initialized historical data for ${ticker}`)
      } catch (error) {
        console.error(`Failed to initialize data for ${ticker}:`, error)
      }
    }
    
    // Initialize options historical data
    for (const option of TOP_LIQUID_OPTIONS) {
      try {
        const { HistoricalDataService } = await import('./historicalDataService')
        const optionsData = this.generateSimulatedOptionsHistoricalData(option, 14)
        await HistoricalDataService.storeOptionsHistoricalData(
          option.ticker,
          option.underlying_ticker,
          optionsData
        )
        console.log(`Initialized options historical data for ${option.ticker}`)
      } catch (error) {
        console.error(`Failed to initialize options data for ${option.ticker}:`, error)
      }
    }
    
    console.log('Historical data initialization complete')
  }

  private static generateSimulatedOptionsHistoricalData(option: OptionsContract, days: number): any[] {
    const data: any[] = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      // Simulate options price movement
      const dailyChange = (Math.random() - 0.5) * 0.1
      const bid = option.bid * (1 + dailyChange)
      const ask = option.ask * (1 + dailyChange)
      const last = option.last * (1 + dailyChange)
      
      data.push({
        date: date.toISOString().split('T')[0],
        bid,
        ask,
        last,
        volume: Math.floor(Math.random() * option.volume),
        open_interest: option.open_interest + Math.floor((Math.random() - 0.5) * 1000),
        implied_volatility: option.implied_volatility * (1 + (Math.random() - 0.5) * 0.1),
        delta: option.delta * (1 + (Math.random() - 0.5) * 0.05),
        gamma: option.gamma * (1 + (Math.random() - 0.5) * 0.1),
        theta: option.theta * (1 + (Math.random() - 0.5) * 0.1),
        vega: option.vega * (1 + (Math.random() - 0.5) * 0.1)
      })
    }
    
    return data
  }
}