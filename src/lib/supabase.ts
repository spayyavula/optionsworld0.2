import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url_here' || supabaseAnonKey === 'your_supabase_anon_key_here') {
  console.warn('Supabase configuration missing. Using local storage fallback.')
}

export const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url_here' && supabaseAnonKey !== 'your_supabase_anon_key_here'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type Database = {
  public: {
    Tables: {
      historical_data: {
        Row: {
          id: string
          ticker: string
          date: string
          open: number
          high: number
          low: number
          close: number
          volume: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ticker: string
          date: string
          open: number
          high: number
          low: number
          close: number
          volume: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ticker?: string
          date?: string
          open?: number
          high?: number
          low?: number
          close?: number
          volume?: number
          created_at?: string
          updated_at?: string
        }
      }
      options_historical_data: {
        Row: {
          id: string
          contract_ticker: string
          underlying_ticker: string
          date: string
          bid: number
          ask: number
          last: number
          volume: number
          open_interest: number
          implied_volatility: number
          delta: number
          gamma: number
          theta: number
          vega: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contract_ticker: string
          underlying_ticker: string
          date: string
          bid: number
          ask: number
          last: number
          volume: number
          open_interest: number
          implied_volatility: number
          delta: number
          gamma: number
          theta: number
          vega: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contract_ticker?: string
          underlying_ticker?: string
          date?: string
          bid?: number
          ask?: number
          last?: number
          volume?: number
          open_interest?: number
          implied_volatility?: number
          delta?: number
          gamma?: number
          theta?: number
          vega?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_portfolios: {
        Row: {
          id: string
          user_id: string
          balance: number
          buying_power: number
          total_value: number
          day_change: number
          day_change_percent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance: number
          buying_power: number
          total_value: number
          day_change?: number
          day_change_percent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          buying_power?: number
          total_value?: number
          day_change?: number
          day_change_percent?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}