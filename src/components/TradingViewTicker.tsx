import React, { useEffect, useRef } from 'react'

interface TradingViewTickerProps {
  symbols: Array<{
    proName: string
    title: string
  }>
  showSymbolLogo?: boolean
  colorTheme?: 'light' | 'dark'
  isTransparent?: boolean
  displayMode?: 'adaptive' | 'compact' | 'regular'
  locale?: string
  container_id?: string
}

const TradingViewTicker: React.FC<TradingViewTickerProps> = ({
  symbols,
  showSymbolLogo = true,
  colorTheme = 'light',
  isTransparent = false,
  displayMode = 'adaptive',
  locale = 'en',
  container_id
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      // Clear previous content
      containerRef.current.innerHTML = ''
      
      // Create widget options
      const widgetOptions = {
        symbols: symbols,
        showSymbolLogo: showSymbolLogo,
      // Add script to container
      // Clear previous content
      containerRef.current.innerHTML = ''
      
      // Create widget options
      const widgetOptions = {
        symbols: symbols,
        showSymbolLogo: showSymbolLogo,
        colorTheme: colorTheme,
        isTransparent: isTransparent,
        displayMode: displayMode,
        locale: locale
      }
      
      // Create the script element
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
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
  }, [symbols, showSymbolLogo, colorTheme, isTransparent, displayMode, locale])

  // Generate unique container ID
  const containerId = container_id || `tradingview_ticker_${Math.random().toString(36).substring(2, 11)}`

  return (
    <div className="tradingview-widget-container">
      <div 
        ref={containerRef}
        id={containerId}
        className="tradingview-widget-container__widget"
      />
    </div>
  )
}

export default TradingViewTicker