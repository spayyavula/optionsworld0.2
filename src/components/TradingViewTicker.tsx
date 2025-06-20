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
      containerRef.current.innerHTML = '';
      
      // Create iframe for ticker
      const iframe = document.createElement('iframe');
      const symbolsParam = encodeURIComponent(JSON.stringify(symbols.map(s => ({
        "proName": s.proName,
        "title": s.title
      }))));
      
      iframe.src = `https://s.tradingview.com/embed-widget/ticker-tape/?locale=${locale}&colorTheme=${colorTheme}${isTransparent ? '&isTransparent=true' : ''}&displayMode=${displayMode}&symbols=${symbolsParam}`;
      iframe.style.width = '100%';
      iframe.style.height = '46px';
      iframe.style.border = 'none';
      iframe.setAttribute('allowTransparency', 'true');
      iframe.setAttribute('frameBorder', '0');
      
      containerRef.current.appendChild(iframe);
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbols, colorTheme, isTransparent, displayMode, locale])

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