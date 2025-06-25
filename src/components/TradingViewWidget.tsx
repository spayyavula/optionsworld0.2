import React, { useEffect, useRef } from 'react'

interface TradingViewWidgetProps {
  symbol: string
  width?: string | number
  height?: number
  interval?: string
  theme?: 'light' | 'dark'
  style?: 'candles' | 'line' | 'area' | 'bars'
  locale?: string
  toolbar_bg?: string
  enable_publishing?: boolean
  allow_symbol_change?: boolean
  container_id?: string
  studies?: string[]
  autosize?: boolean
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol,
  width = '100%',
  height = 500,
  interval = 'D',
  theme = 'light', 
  style = 'candles',
  locale = 'en',
  toolbar_bg = '#f1f3f6',
  enable_publishing = false,
  allow_symbol_change = true,
  container_id,
  studies = [],
  autosize = false 
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    // Clean up function to remove any existing scripts
    const cleanup = () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
        scriptRef.current = null
      }
    }
    
    // Clean up first
    cleanup()
    
    if (!containerRef.current) return
    
    try {
      // Create a new div for the widget
      const widgetContainer = document.createElement('div')
      widgetContainer.className = 'tradingview-widget-container__widget'
      widgetContainer.style.width = '100%'
      widgetContainer.style.height = '100%'
      containerRef.current.appendChild(widgetContainer)
      
      // Format symbol to ensure it has exchange prefix if needed
      const formattedSymbol = symbol.includes(':') ? symbol : 
        symbol === 'SPY' ? 'AMEX:SPY' :
        symbol === 'QQQ' ? 'NASDAQ:QQQ' :
        symbol === 'AAPL' ? 'NASDAQ:AAPL' :
        symbol === 'MSFT' ? 'NASDAQ:MSFT' :
        symbol === 'GOOGL' ? 'NASDAQ:GOOGL' :
        symbol === 'AMZN' ? 'NASDAQ:AMZN' :
        symbol === 'TSLA' ? 'NASDAQ:TSLA' :
        symbol === 'NVDA' ? 'NASDAQ:NVDA' :
        `NASDAQ:${symbol}` 
      
      // Create the script element with embedded JSON
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
      script.type = 'text/javascript'
      script.async = true
      
      // Create widget options as a proper JSON string
      const widgetOptions = {
        "symbol": formattedSymbol,
        "interval": interval,
        "timezone": "Etc/UTC",
        "theme": theme,
        "style": style,
        "locale": locale,
        "toolbar_bg": toolbar_bg,
        "enable_publishing": enable_publishing,
        "allow_symbol_change": allow_symbol_change,
        "width": autosize ? "100%" : typeof width === 'number' ? `${width}px` : width,
        "height": autosize ? "100%" : typeof height === 'number' ? `${height}px` : height,
        "save_image": true,
        "studies": studies,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "withdateranges": true,
        "hide_side_toolbar": false,
        "details": true,
        "hotlist": true,
        "calendar": true, 
        "show_popup_button": true,
        "popup_width": "1000",
        "popup_height": "650",
        "container_id": containerId
      }
      
      script.innerHTML = JSON.stringify(widgetOptions)
      
      // Add script to document head for proper TradingView initialization
      document.head.appendChild(script)
      scriptRef.current = script
    } catch (error) {
      console.error('Error initializing TradingView widget:', error)
    }
    
    return cleanup
  }, [symbol, width, height, interval, theme, style, locale, toolbar_bg, enable_publishing, allow_symbol_change, studies, autosize])

  // Generate unique container ID
  const containerId = container_id || `tradingview_${Math.random().toString(36).substring(2, 11)}`

  return (
    <div 
      ref={containerRef}
      id={containerId}
      className="tradingview-widget-container"
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: '0.5rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
    />
  )
}

export default TradingViewWidget