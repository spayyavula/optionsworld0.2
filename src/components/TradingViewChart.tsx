import React, { useEffect, useRef, memo } from 'react'

interface TradingViewChartProps {
  symbol: string
  interval?: string
  theme?: 'light' | 'dark'
  style?: 'candles' | 'line' | 'area' | 'bars'
  width?: string | number
  height?: string | number
  autosize?: boolean
  toolbar_bg?: string
  enable_publishing?: boolean
  withdateranges?: boolean
  hide_side_toolbar?: boolean
  allow_symbol_change?: boolean
  studies?: string[]
  container_id?: string
  locale?: string
}

declare global {
  interface Window {
    TradingView: any
  }
}

const TradingViewChart: React.FC<TradingViewChartProps> = memo(({
  symbol,
  interval = 'D',
  theme = 'light',
  style = 'candles',
  width = '100%',
  height = 400,
  autosize = true,
  toolbar_bg = '#f1f3f6',
  enable_publishing = false,
  withdateranges = true,
  hide_side_toolbar = false,
  allow_symbol_change = true,
  studies = ['RSI', 'MACD'],
  container_id,
  locale = 'en'
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    const loadTradingViewScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.TradingView) {
          resolve()
          return
        }

        const script = document.createElement('script')
        script.src = 'https://s3.tradingview.com/tv.js'
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load TradingView script'))
        document.head.appendChild(script)
      })
    }

    const initializeChart = async () => {
      try {
        await loadTradingViewScript()
        
        if (!containerRef.current || !window.TradingView) {
          return
        }

        // Clean up existing widget
        if (widgetRef.current) {
          widgetRef.current.remove()
        }

        const widgetOptions = {
          symbol,
          interval,
          container_id: container_id || containerRef.current.id,
          datafeed: new window.TradingView.Datafeed({
            // You can customize the datafeed here
            // For now, we'll use TradingView's default datafeed
          }),
          library_path: '/charting_library/',
          locale,
          disabled_features: [
            'use_localstorage_for_settings',
            ...(hide_side_toolbar ? ['left_toolbar'] : []),
            ...(!enable_publishing ? ['publishing_feature'] : []),
          ],
          enabled_features: [
            'study_templates',
            ...(withdateranges ? ['timeframes_toolbar'] : []),
          ],
          charts_storage_url: 'https://saveload.tradingview.com',
          charts_storage_api_version: '1.1',
          client_id: 'tradingview.com',
          user_id: 'public_user_id',
          fullscreen: false,
          autosize,
          width,
          height,
          theme: theme === 'dark' ? 'Dark' : 'Light',
          style,
          toolbar_bg,
          overrides: {
            'paneProperties.background': theme === 'dark' ? '#1a1a1a' : '#ffffff',
            'paneProperties.vertGridProperties.color': theme === 'dark' ? '#2a2a2a' : '#e1e1e1',
            'paneProperties.horzGridProperties.color': theme === 'dark' ? '#2a2a2a' : '#e1e1e1',
            'symbolWatermarkProperties.transparency': 90,
            'scalesProperties.textColor': theme === 'dark' ? '#ffffff' : '#131722',
          },
          studies_overrides: {},
          time_frames: [
            { text: '1m', resolution: '1', description: '1 Minute' },
            { text: '5m', resolution: '5', description: '5 Minutes' },
            { text: '15m', resolution: '15', description: '15 Minutes' },
            { text: '30m', resolution: '30', description: '30 Minutes' },
            { text: '1h', resolution: '60', description: '1 Hour' },
            { text: '4h', resolution: '240', description: '4 Hours' },
            { text: '1d', resolution: 'D', description: '1 Day' },
            { text: '1w', resolution: 'W', description: '1 Week' },
            { text: '1M', resolution: 'M', description: '1 Month' },
          ],
        }

        // Create the widget
        widgetRef.current = new window.TradingView.widget(widgetOptions)

        // Add studies after widget is ready
        widgetRef.current.onChartReady(() => {
          const chart = widgetRef.current.chart()
          
          // Add default studies
          studies.forEach(study => {
            chart.createStudy(study, false, false)
          })
        })

      } catch (error) {
        console.error('Failed to initialize TradingView chart:', error)
      }
    }

    initializeChart()

    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove()
      }
    }
  }, [symbol, interval, theme, style, width, height])

  // Generate unique container ID
  const containerId = container_id || `tradingview_${Math.random().toString(36).substr(2, 9)}`

  return (
    <div 
      ref={containerRef}
      id={containerId}
      className="tradingview-widget-container"
      style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }}
    />
  )
})

TradingViewChart.displayName = 'TradingViewChart'

export default TradingViewChart