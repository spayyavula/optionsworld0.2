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
  studies
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      width,
      height,
      autosize: true,
      symbol,
      interval,
      timezone: 'exchange',
      theme,
      style,
      locale,
      toolbar_bg,
      enable_publishing,
      allow_symbol_change,
      withdateranges: true,
      hide_side_toolbar: false,
      details: true,
      hotlist: true,
      calendar: true,
      studies: studies || [],
      container_id: container_id || containerId,
      show_popup_button: true,
      popup_width: '1000',
      popup_height: '650',
      support_host: 'https://www.tradingview.com'
    })

    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [symbol, interval, theme, style, locale, toolbar_bg, enable_publishing, allow_symbol_change])

  const containerId = container_id || `tradingview_widget_${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="tradingview-widget-container relative" style={{ height, width }}>
      <div 
        ref={containerRef}
        id={containerId}
        className="tradingview-widget-container__widget w-full h-full"
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  )
}

export default TradingViewWidget