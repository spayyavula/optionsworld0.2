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
      containerRef.current.innerHTML = '';
      
      // Create iframe for mini chart
      const iframe = document.createElement('iframe');
      iframe.src = `https://s.tradingview.com/widgetembed/?frameElementId=${container_id || 'tradingview_mini'}&symbol=${symbol}&interval=D&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=${trendLineColor.replace(/[^a-zA-Z0-9]/g, '')}&studies=[]&theme=${theme}&style=1&timezone=exchange&withdateranges=0&showpopupbutton=0&width=${typeof width === 'number' ? width : '100%'}&height=${typeof height === 'number' ? height : '100%'}`;
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
  }, [symbol, width, height, theme, trendLineColor, container_id])

  const containerId = container_id || `tradingview_mini_${Math.random().toString(36).substr(2, 9)}`

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

export default TradingViewMiniChart