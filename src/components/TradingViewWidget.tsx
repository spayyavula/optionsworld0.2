import React, { useEffect, useRef } from 'react'

interface TradingViewWidgetProps {
  symbol: string
  width?: string | number
  height?: string | number
  interval?: string
  theme?: 'light' | 'dark'
  style?: 'candles' | 'line' | 'area' | 'bars'
  locale?: string
  toolbar_bg?: string
  enable_publishing?: boolean
  allow_symbol_change?: boolean
  container_id?: string
  studies?: string[]
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol,
  width = '100%',
  height = 400,
  interval = 'D',
  theme = 'light',
  style = 'candles',
  locale = 'en',
  toolbar_bg = '#f1f3f6',
  enable_publishing = false,
  allow_symbol_change = true,
  container_id,
  studies = []
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      // Clear previous content
      containerRef.current.innerHTML = '';
      
      // Create iframe for advanced chart
      const iframe = document.createElement('iframe');
      const uniqueId = container_id || `tradingview_widget_${Math.random().toString(36).substr(2, 9)}`;
      
      // Convert studies array to URL parameter
      const studiesParam = studies.length > 0 
        ? `&studies=${encodeURIComponent(JSON.stringify(studies))}` 
        : '';
      
      // Construct the iframe URL with proper parameters
      iframe.src = `https://s.tradingview.com/widgetembed/?frameElementId=${uniqueId}&symbol=${symbol}&interval=${interval}&hidesidetoolbar=0&symboledit=${allow_symbol_change ? 1 : 0}&saveimage=1&toolbarbg=${toolbar_bg.replace('#', '')}&theme=${theme}&style=${style === 'candles' ? 1 : style === 'bars' ? 0 : style === 'line' ? 2 : 3}&timezone=exchange&withdateranges=1&showpopupbutton=${enable_publishing ? 1 : 0}${studiesParam}`;
      
      // Set dimensions
      iframe.style.width = typeof width === 'number' ? `${width}px` : width.toString();
      iframe.style.height = typeof height === 'number' ? `${height}px` : height.toString();
      iframe.style.border = 'none';
      iframe.allowTransparency = true;
      iframe.frameBorder = '0';
      
      containerRef.current.appendChild(iframe);
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, width, height, interval, theme, style, locale, toolbar_bg, enable_publishing, allow_symbol_change, container_id, studies])

  return (
    <div 
      ref={containerRef}
      className="tradingview-widget-container"
      style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }}
    />
  )
}

export default TradingViewWidget