import { supabase } from '../lib/supabase'
import { HistoricalData } from '../types/options'

const ENABLE_DATA_PERSISTENCE = import.meta.env.VITE_ENABLE_DATA_PERSISTENCE === 'true'
const RETENTION_DAYS = parseInt(import.meta.env.VITE_HISTORICAL_DATA_RETENTION_DAYS || '30')

export class HistoricalDataService {
  /**
   * Store historical data for a ticker in Supabase
   */
  static async storeHistoricalData(ticker: string, data: HistoricalData[]): Promise<void> {
    if (!supabase || !ENABLE_DATA_PERSISTENCE) {
      console.log('Supabase not configured or persistence disabled, skipping data storage')
      return
    }

    try {
      // Prepare data for insertion
      const insertData = data.map(item => ({
        ticker,
        date: item.date,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
      }))

      // Insert data (upsert to handle duplicates)
      const { error } = await supabase
        .from('historical_data')
        .upsert(insertData, { 
          onConflict: 'ticker,date',
          ignoreDuplicates: false 
        })

      if (error) {
        console.error('Error storing historical data:', error)
        throw error
      }

      console.log(`Stored ${data.length} historical data points for ${ticker}`)
    } catch (error) {
      console.error('Failed to store historical data:', error)
      throw error
    }
  }

  /**
   * Retrieve historical data for a ticker from Supabase
   */
  static async getHistoricalData(ticker: string, days: number = 14): Promise<HistoricalData[]> {
    if (!supabase || !ENABLE_DATA_PERSISTENCE) {
      console.log('Supabase not configured or persistence disabled, returning empty data')
      return []
    }

    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from('historical_data')
        .select('*')
        .eq('ticker', ticker)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true })

      if (error) {
        console.error('Error fetching historical data:', error)
        return []
      }

      return data?.map(item => ({
        date: item.date,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
      })) || []
    } catch (error) {
      console.error('Failed to fetch historical data:', error)
      return []
    }
  }

  /**
   * Store options historical data
   */
  static async storeOptionsHistoricalData(
    contractTicker: string, 
    underlyingTicker: string, 
    data: any[]
  ): Promise<void> {
    if (!supabase || !ENABLE_DATA_PERSISTENCE) {
      console.log('Supabase not configured or persistence disabled, skipping options data storage')
      return
    }

    try {
      const insertData = data.map(item => ({
        contract_ticker: contractTicker,
        underlying_ticker: underlyingTicker,
        date: item.date,
        bid: item.bid,
        ask: item.ask,
        last: item.last,
        volume: item.volume,
        open_interest: item.open_interest,
        implied_volatility: item.implied_volatility,
        delta: item.delta,
        gamma: item.gamma,
        theta: item.theta,
        vega: item.vega
      }))

      const { error } = await supabase
        .from('options_historical_data')
        .upsert(insertData, { 
          onConflict: 'contract_ticker,date',
          ignoreDuplicates: false 
        })

      if (error) {
        console.error('Error storing options historical data:', error)
        throw error
      }

      console.log(`Stored ${data.length} options historical data points for ${contractTicker}`)
    } catch (error) {
      console.error('Failed to store options historical data:', error)
      throw error
    }
  }

  /**
   * Get options historical data
   */
  static async getOptionsHistoricalData(
    contractTicker: string, 
    days: number = 14
  ): Promise<any[]> {
    if (!supabase || !ENABLE_DATA_PERSISTENCE) {
      console.log('Supabase not configured or persistence disabled, returning empty options data')
      return []
    }

    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from('options_historical_data')
        .select('*')
        .eq('contract_ticker', contractTicker)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true })

      if (error) {
        console.error('Error fetching options historical data:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Failed to fetch options historical data:', error)
      return []
    }
  }

  /**
   * Clean up old historical data based on retention policy
   */
  static async cleanupOldData(): Promise<void> {
    if (!supabase || !ENABLE_DATA_PERSISTENCE) {
      return
    }

    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS)

      // Clean up stock historical data
      const { error: stockError } = await supabase
        .from('historical_data')
        .delete()
        .lt('date', cutoffDate.toISOString().split('T')[0])

      if (stockError) {
        console.error('Error cleaning up stock historical data:', stockError)
      }

      // Clean up options historical data
      const { error: optionsError } = await supabase
        .from('options_historical_data')
        .delete()
        .lt('date', cutoffDate.toISOString().split('T')[0])

      if (optionsError) {
        console.error('Error cleaning up options historical data:', optionsError)
      }

      console.log(`Cleaned up historical data older than ${RETENTION_DAYS} days`)
    } catch (error) {
      console.error('Failed to cleanup old data:', error)
    }
  }

  /**
   * Get data storage statistics
   */
  static async getStorageStats(): Promise<{
    stockDataPoints: number
    optionsDataPoints: number
    oldestDate: string | null
    newestDate: string | null
  }> {
    if (!supabase || !ENABLE_DATA_PERSISTENCE) {
      return {
        stockDataPoints: 0,
        optionsDataPoints: 0,
        oldestDate: null,
        newestDate: null
      }
    }

    try {
      // Get stock data count
      const { count: stockCount } = await supabase
        .from('historical_data')
        .select('*', { count: 'exact', head: true })

      // Get options data count
      const { count: optionsCount } = await supabase
        .from('options_historical_data')
        .select('*', { count: 'exact', head: true })

      // Get date range
      const { data: dateRange } = await supabase
        .from('historical_data')
        .select('date')
        .order('date', { ascending: true })
        .limit(1)

      const { data: latestDate } = await supabase
        .from('historical_data')
        .select('date')
        .order('date', { ascending: false })
        .limit(1)

      return {
        stockDataPoints: stockCount || 0,
        optionsDataPoints: optionsCount || 0,
        oldestDate: dateRange?.[0]?.date || null,
        newestDate: latestDate?.[0]?.date || null
      }
    } catch (error) {
      console.error('Failed to get storage stats:', error)
      return {
        stockDataPoints: 0,
        optionsDataPoints: 0,
        oldestDate: null,
        newestDate: null
      }
    }
  }
}