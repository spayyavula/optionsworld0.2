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
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbol,
      width,
      height,
      locale: 'en',
      dateRange: '12M',
      colorTheme: theme,
      trendLineColor,
      underLineColor,
      isTransparent,
      autosize,
      largeChartUrl: ''
    })

    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [symbol, width, height, theme, trendLineColor, underLineColor, isTransparent, autosize])

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