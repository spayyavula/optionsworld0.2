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
  hide_top_toolbar?: boolean
  hide_side_toolbar?: boolean
  withdateranges?: boolean
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
  studies = [],
  hide_top_toolbar = false,
  hide_side_toolbar = false,
  withdateranges = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    const loadTradingViewScript = () => {
      return new Promise<void>((resolve) => {
        if (window.TradingView) {
          resolve()
          return
        }
        
        const script = document.createElement('script')
        script.src = 'https://s3.tradingview.com/tv.js'
        script.async = true
        script.onload = () => resolve()
        document.head.appendChild(script)
      })
    }

    const initializeWidget = async () => {
      try {
        await loadTradingViewScript()
        
        if (!containerRef.current || !window.TradingView) {
          return
        }

        // Clean up existing widget
        if (widgetRef.current) {
          widgetRef.current = null
        }

        const uniqueId = container_id || `tradingview_${Math.random().toString(36).substring(2, 11)}`
        
        // Clear container and create a new div with the unique ID
        containerRef.current.innerHTML = ''
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
          container_id: uniqueId,
          library_path: '/charting_library/',
          locale: locale,
          timezone: 'Etc/UTC',
          theme: theme,
          style: style === 'candles' ? '1' : style === 'bars' ? '0' : style === 'line' ? '2' : '3',
          toolbar_bg: toolbar_bg,
          enable_publishing: enable_publishing,
          allow_symbol_change: allow_symbol_change,
          hide_top_toolbar: hide_top_toolbar,
          hide_side_toolbar: hide_side_toolbar,
          withdateranges: withdateranges,
          studies: studies
        })
      } catch (error) {
        console.error('Failed to initialize TradingView widget:', error)
        
        // Fallback to iframe embed if widget initialization fails
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <iframe 
              src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_embed&symbol=${symbol}&interval=${interval}&hidesidetoolbar=${hide_side_toolbar ? 1 : 0}&symboledit=${allow_symbol_change ? 1 : 0}&saveimage=1&toolbarbg=${toolbar_bg.replace('#', '')}&studies=${encodeURIComponent(JSON.stringify(studies))}&theme=${theme}&style=${style === 'candles' ? 1 : style === 'bars' ? 0 : style === 'line' ? 2 : 3}&timezone=exchange&withdateranges=${withdateranges ? 1 : 0}"
              style="width:100%; height:100%; border:none;"
              allowtransparency="true"
              frameborder="0"
            ></iframe>
          `
        }
      }
    }

    initializeWidget()

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [symbol, interval, theme, style, locale, toolbar_bg, enable_publishing, allow_symbol_change, container_id, studies, hide_top_toolbar, hide_side_toolbar, withdateranges])

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