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
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols,
      showSymbolLogo,
      colorTheme,
      isTransparent,
      displayMode,
      locale
    })

    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [symbols, showSymbolLogo, colorTheme, isTransparent, displayMode, locale])

  const containerId = container_id || `tradingview_ticker_${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="tradingview-widget-container">
      <div 
        ref={containerRef}
        id={containerId}
        className="tradingview-widget-container__widget"
      />
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  )
}

export default TradingViewTicker