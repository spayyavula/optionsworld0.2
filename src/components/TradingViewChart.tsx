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
        // Check if TradingView is already loaded
        if (typeof window.TradingView !== 'undefined') {
          resolve()
          return
        }

        const script = document.createElement('script')
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load TradingView script'))
        document.head.appendChild(script)
      })
    }

    const initializeChart = async () => {
      try {
        await loadTradingViewScript()

        if (!containerRef.current) {
          return
        }

        // Create widget options
        const widgetOptions: any = {
          symbol,
          interval,
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          timezone: 'exchange',
          theme: theme === 'dark' ? 'dark' : 'light',
          style: style || 'candles',
          locale: locale || 'en',
          toolbar_bg: toolbar_bg,
          enable_publishing: enable_publishing,
          withdateranges: withdateranges,
          hide_side_toolbar: hide_side_toolbar,
          allow_symbol_change: allow_symbol_change,
          container_id: container_id || containerRef.current.id,
          studies: studies || [],
          autosize,
          details: true,
          hotlist: true,
          calendar: true,
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
          support_host: 'https://www.tradingview.com'
        }

        // Create the widget script
        const script = document.createElement('script')
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
        script.type = 'text/javascript'
        script.async = true
        script.innerHTML = JSON.stringify(widgetOptions)
        
        // Clear container and add script
        if (containerRef.current) {
          containerRef.current.innerHTML = ''
          containerRef.current.appendChild(script)
        }

      } catch (error) {
        console.error('Failed to initialize TradingView chart:', error)
      }
    }

    initializeChart()

    return () => {
      if (containerRef.current) {
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