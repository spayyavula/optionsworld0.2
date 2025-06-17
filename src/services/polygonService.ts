@@ .. @@
 import { OptionsContract, OptionsChainData, HistoricalData } from '../types/options'
 
-const POLYGON_API_KEY = 'YOUR_POLYGON_API_KEY' // Replace with your actual API key
-const BASE_URL = 'https://api.polygon.io'
+const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY || 'demo_api_key'
+const BASE_URL = import.meta.env.VITE_POLYGON_BASE_URL || 'https://api.polygon.io'
+const ENABLE_MOCK_DATA = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true'
+const ENABLE_REAL_TIME_DATA = import.meta.env.VITE_ENABLE_REAL_TIME_DATA === 'true'
 
 // Top 5 most liquid options contracts (simulated data based on typical market leaders)
 const TOP_LIQUID_OPTIONS: OptionsContract[] = [
@@ .. @@
   }
 
   static async fetchOptionsChain(underlying: string): Promise<OptionsChainData> {
-    // For demo purposes, we'll use simulated data
-    // In production, uncomment the real API call below
+    if (ENABLE_MOCK_DATA || !ENABLE_REAL_TIME_DATA) {
+      // Use simulated data for demo/development
+      return this.getSimulatedOptionsChain(underlying)
+    }
+
+    // Real Polygon.io API call (requires valid API key)
+    try {
+      const response = await fetch(
+        `${BASE_URL}/v3/reference/options/contracts?underlying_ticker=${underlying}&limit=1000&apikey=${POLYGON_API_KEY}`
+      )
+      
+      if (!response.ok) {
+        console.warn('Polygon API call failed, falling back to mock data')
+        return this.getSimulatedOptionsChain(underlying)
+      }
+      
+      const data = await response.json()
+      return this.transformPolygonData(data)
+    } catch (error) {
+      console.warn('Error fetching from Polygon API, using mock data:', error)
+      return this.getSimulatedOptionsChain(underlying)
+    }
+  }
+
+  private static getSimulatedOptionsChain(underlying: string): OptionsChainData {
     const contracts = TOP_LIQUID_OPTIONS.filter(contract => 
       contract.underlying_ticker === underlying
     )
@@ .. @@
       contracts,
       lastUpdated: new Date()
     }
+  }
+
+  private static transformPolygonData(polygonData: any): OptionsChainData {
+    // Transform Polygon.io API response to our format
+    const contracts: OptionsContract[] = polygonData.results?.map((contract: any) => ({
+      contract_type: contract.contract_type,
+      exercise_style: contract.exercise_style,
+      expiration_date: contract.expiration_date,
+      shares_per_contract: contract.shares_per_contract,
+      strike_price: contract.strike_price,
+      ticker: contract.ticker,
+      underlying_ticker: contract.underlying_ticker,
+      // Add simulated market data
+      bid: contract.strike_price * 0.05,
+      ask: contract.strike_price * 0.06,
+      last: contract.strike_price * 0.055,
+      volume: Math.floor(Math.random() * 10000),
+      open_interest: Math.floor(Math.random() * 50000),
+      implied_volatility: 0.2 + Math.random() * 0.3,
+      delta: Math.random() * 0.8,
+      gamma: Math.random() * 0.1,
+      theta: -Math.random() * 0.05,
+      vega: Math.random() * 0.3,
+      intrinsic_value: Math.max(0, 580 - contract.strike_price), // Assuming SPY at 580
+      time_value: contract.strike_price * 0.055 - Math.max(0, 580 - contract.strike_price)
+    })) || []
 
-    /*
-    // Real Polygon.io API call (uncomment when you have a valid API key)
-    try {
-      const response = await fetch(
-        `${BASE_URL}/v3/reference/options/contracts?underlying_ticker=${underlying}&limit=1000&apikey=${POLYGON_API_KEY}`
-      )
-      const data = await response.json()
-      
-      // Transform Polygon data to our format
-      const contracts: OptionsContract[] = data.results.map((contract: any) => ({
-        // Map Polygon fields to our interface
-        contract_type: contract.contract_type,
-        exercise_style: contract.exercise_style,
-        expiration_date: contract.expiration_date,
-        shares_per_contract: contract.shares_per_contract,
-        strike_price: contract.strike_price,
-        ticker: contract.ticker,
-        underlying_ticker: contract.underlying_ticker,
-        // Add market data from separate API calls
-        bid: 0, // Would need additional API call
-        ask: 0, // Would need additional API call
-        // ... other fields
-      }))
-      
-      return {
-        underlying: underlying,
-        contracts,
-        lastUpdated: new Date()
-      }
-    } catch (error) {
-      console.error('Error fetching options data:', error)
-      throw error
+    return {
+      underlying,
+      contracts,
+      lastUpdated: new Date()
     }
-    */
   }
 
   static async fetchHistoricalData(ticker: string, days: number = 14): Promise<HistoricalData[]> {
+    if (ENABLE_MOCK_DATA || !ENABLE_REAL_TIME_DATA) {
+      return this.generateSimulatedHistoricalData(ticker, days)
+    }
+
+    // Real Polygon.io API call for historical data
+    try {
+      const endDate = new Date()
+      const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)
+      
+      const response = await fetch(
+        `${BASE_URL}/v2/aggs/ticker/${ticker}/range/1/day/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}?apikey=${POLYGON_API_KEY}`
+      )
+      
+      if (!response.ok) {
+        console.warn('Historical data API call failed, using simulated data')
+        return this.generateSimulatedHistoricalData(ticker, days)
+      }
+      
+      const data = await response.json()
+      return this.transformHistoricalData(data)
+    } catch (error) {
+      console.warn('Error fetching historical data, using simulated:', error)
+      return this.generateSimulatedHistoricalData(ticker, days)
+    }
+  }
+
+  private static generateSimulatedHistoricalData(ticker: string, days: number): HistoricalData[] {
     // Generate simulated historical data for the last 'days' days
     const data: HistoricalData[] = []
     const basePrice = this.getBasePriceForTicker(ticker)
@@ .. @@
     
     return data
   }
+
+  private static transformHistoricalData(polygonData: any): HistoricalData[] {
+    return polygonData.results?.map((bar: any) => ({
+      date: new Date(bar.t).toISOString().split('T')[0],
+      open: bar.o,
+      high: bar.h,
+      low: bar.l,
+      close: bar.c,
+      volume: bar.v
+    })) || []
+  }
 
   private static getBasePriceForTicker(ticker: string): number {
     // Base prices for our simulated options
@@ .. @@
 }