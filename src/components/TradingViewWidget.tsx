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

declare global {
  interface Window {
    TradingView: any;
  }
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
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    if (!window.TradingView) {
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/tv.js'
      script.async = true
      script.onload = initializeWidget
      document.head.appendChild(script)
      return () => {
        document.head.removeChild(script)
      }
    } else {
      initializeWidget()
    }

    function initializeWidget() {
      if (containerRef.current && window.TradingView) {
        // Clean up previous widget if it exists
        if (widgetRef.current) {
          try {
            widgetRef.current.remove()
          } catch (e) {
            console.error('Error removing previous widget:', e)
          }
        }

        const uniqueId = container_id || `tradingview_${Math.random().toString(36).substring(2, 11)}`
        containerRef.current.innerHTML = ''
        
        // Create a new div with the unique ID
        const widgetContainer = document.createElement('div')
        widgetContainer.id = uniqueId
        widgetContainer.style.width = '100%'
        widgetContainer.style.height = '100%'
        containerRef.current.appendChild(widgetContainer)

        // Create the widget
        widgetRef.current = new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: 'Etc/UTC',
          theme: theme,
          style: style === 'candles' ? '1' : style === 'bars' ? '0' : style === 'line' ? '2' : '3',
          locale: locale,
          toolbar_bg: toolbar_bg,
          enable_publishing: enable_publishing,
          allow_symbol_change: allow_symbol_change,
          container_id: uniqueId,
          studies: studies
        })
      }
    }

    return () => {
      if (widgetRef.current) {
        try {
          widgetRef.current.remove()
        } catch (e) {
          console.error('Error removing widget on unmount:', e)
        }
      }
    }
  }, [symbol, interval, theme, style, locale, toolbar_bg, enable_publishing, allow_symbol_change, container_id, studies])

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width, 
        height: typeof height === 'number' ? `${height}px` : height 
      }}
      className="tradingview-widget-container"
    />
  )
}

export default TradingViewWidget