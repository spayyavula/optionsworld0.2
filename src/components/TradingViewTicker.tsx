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
      
      // Create the script element with embedded JSON
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
      script.type = 'text/javascript'
      script.async = true
      
      // Create widget options as a proper JSON string
      const widgetOptions = {
        "symbols": symbols,
        "showSymbolLogo": showSymbolLogo,
        "colorTheme": colorTheme,
        "isTransparent": isTransparent,
        "displayMode": displayMode,
        "locale": locale
      }
      
      script.innerHTML = JSON.stringify(widgetOptions)
      
      // Add script to container
      widgetContainer.appendChild(script)
      scriptRef.current = script
    } catch (error) {
      console.error('Error initializing TradingView ticker:', error)
    }
    
    return cleanup
  }, [symbols, showSymbolLogo, colorTheme, isTransparent, displayMode, locale])

  // Generate unique container ID
  const containerId = container_id || `tradingview_ticker_${Math.random().toString(36).substring(2, 11)}`

  return (
    <div 
      ref={containerRef}
      id={containerId}
      className="tradingview-widget-container"
    />
  )
}

export default TradingViewTicker