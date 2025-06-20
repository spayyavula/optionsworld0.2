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

  useEffect(() => {
    if (containerRef.current) {
      // Clear previous content
      containerRef.current.innerHTML = ''
      
      // Format symbol to ensure it has exchange prefix if needed
      const formattedSymbol = symbol.includes(':') ? symbol : `NASDAQ:${symbol}`
      
      // Create widget options
      const widgetOptions = {
        symbol: formattedSymbol,
        width: typeof width === 'number' ? width : '100%',
        height: typeof height === 'number' ? height : 220,
        locale: 'en',
        dateRange: '12M',
        colorTheme: theme,
        trendLineColor: trendLineColor,
        underLineColor: underLineColor,
        isTransparent: isTransparent,
        autosize: autosize,
        largeChartUrl: ''
      }
      
      // Create the script element
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js'
      script.type = 'text/javascript'
      script.async = true
      script.innerHTML = JSON.stringify(widgetOptions)
      
      // Add script to container
      containerRef.current.appendChild(script)
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [symbol, width, height, theme, trendLineColor, underLineColor, isTransparent, autosize])

  // Generate unique container ID
  const containerId = container_id || `tradingview_mini_${Math.random().toString(36).substring(2, 11)}`

  return (
    <div className="tradingview-widget-container">
      <div 
        ref={containerRef}
        id={containerId}
        className="tradingview-widget-container__widget"
        style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }}
      />
    </div>
  )
}

export default TradingViewMiniChart