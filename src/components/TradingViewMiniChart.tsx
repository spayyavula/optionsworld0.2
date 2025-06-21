import React, { useEffect, useRef } from 'react'

interface TradingViewMiniChartProps {
  symbol: string
  width?: string | number
  height?: string | number
  theme?: 'light' | 'dark'
  trendLineColor?: string
  underLineColor?: string
  isTransparent?: boolean
  autosize?: boolean
  container_id?: string
}

const TradingViewMiniChart: React.FC<TradingViewMiniChartProps> = ({
  symbol,
  width = 350,
  height = 220,
  theme = 'light',
  trendLineColor = 'rgba(41, 98, 255, 1)',
  underLineColor = 'rgba(41, 98, 255, 0.3)',
  isTransparent = false,
  autosize = false,
  container_id
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
        `NASDAQ:${symbol}`
      
      // Create the script element with embedded JSON
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js'
      script.type = 'text/javascript'
      script.async = true
      
      // Create widget options as a proper JSON string
      const widgetOptions = {
        "symbol": formattedSymbol,
        "width": typeof width === 'number' ? width : '100%',
        "height": typeof height === 'number' ? height : 220,
        "locale": "en",
        "dateRange": "12M",
        "colorTheme": theme,
        "trendLineColor": trendLineColor,
        "underLineColor": underLineColor,
        "isTransparent": isTransparent,
        "autosize": autosize,
        "largeChartUrl": ""
      }
      
      script.innerHTML = JSON.stringify(widgetOptions)
      
      // Add script to container
      widgetContainer.appendChild(script)
      scriptRef.current = script
    } catch (error) {
      console.error('Error initializing TradingView mini chart:', error)
    }
    
    return cleanup
  }, [symbol, width, height, theme, trendLineColor, underLineColor, isTransparent, autosize])

  // Generate unique container ID
  const containerId = container_id || `tradingview_mini_${Math.random().toString(36).substring(2, 11)}`

  return (
    <div 
      ref={containerRef}
      id={containerId}
      className="tradingview-widget-container"
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width, 
        height: typeof height === 'number' ? `${height}px` : height 
      }}
    />
  )
}

export default TradingViewMiniChart