import React, { useEffect, useRef, memo } from 'react'

interface TradingViewChartProps {
  symbol: string
  interval?: string
  theme?: 'light' | 'dark'
  style?: 'candles' | 'line' | 'area' | 'bars'
  width?: string | number
  height?: string | number
  autosize?: boolean
  toolbar_bg?: string
  enable_publishing?: boolean
  withdateranges?: boolean
  hide_side_toolbar?: boolean
  allow_symbol_change?: boolean
  studies?: string[]
  container_id?: string
  locale?: string
}

const TradingViewChart: React.FC<TradingViewChartProps> = memo(({
  symbol,
  interval = 'D',
  theme = 'light',
  style = 'candles',
  width = '100%',
  height = 400,
  autosize = true,
  toolbar_bg = '#f1f3f6',
  enable_publishing = false,
  withdateranges = true,
  hide_side_toolbar = false,
  allow_symbol_change = true,
  studies = ['RSI', 'MACD'],
  container_id,
  locale = 'en'
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const tvScriptRef = useRef<HTMLScriptElement | null>(null)

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
      
      if (tvScriptRef.current && tvScriptRef.current.parentNode) {
        tvScriptRef.current.parentNode.removeChild(tvScriptRef.current)
        tvScriptRef.current = null
      }
    }
    
    // Clean up first
    cleanup()
    
    if (!containerRef.current) return
    
    // Load TradingView script
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
        script.onerror = () => {
          console.error('Failed to load TradingView script')
          resolve() // Resolve anyway to prevent hanging
        }
        
        document.head.appendChild(script)
        tvScriptRef.current = script
      })
    }
    
    const initializeWidget = async () => {
      try {
        await loadTradingViewScript()
        
        if (!containerRef.current || !window.TradingView) return
        
        // Format symbol to ensure it has exchange prefix if needed
        const formattedSymbol = symbol.includes(':') ? symbol : `NASDAQ:${symbol}`
        
        // Create widget options
        const widgetOptions = {
          symbol: formattedSymbol,
          interval: interval,
          timezone: 'Etc/UTC',
          theme: theme,
          style: style,
          locale: locale,
          toolbar_bg: toolbar_bg,
          enable_publishing: enable_publishing,
          allow_symbol_change: allow_symbol_change,
          container_id: containerRef.current.id,
          width: '100%',
          height: '100%',
          autosize: autosize,
          save_image: true,
          hide_top_toolbar: false,
          hide_legend: false,
          withdateranges: withdateranges,
          hide_side_toolbar: hide_side_toolbar,
          studies: studies,
          details: true,
          hotlist: true,
          calendar: true,
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650'
        }
        
        // Create the widget
        new window.TradingView.widget(widgetOptions)
      } catch (error) {
        console.error('Error initializing TradingView chart:', error)
      }
    }
    
    initializeWidget()
    
    return cleanup
  }, [symbol, interval, theme, style, width, height, autosize, toolbar_bg, enable_publishing, withdateranges, hide_side_toolbar, allow_symbol_change, studies, locale])

  // Generate unique container ID
  const containerId = container_id || `tradingview_${Math.random().toString(36).substring(2, 11)}`

  return (
    <div 
      ref={containerRef}
      id={containerId}
      className="tradingview-widget-container"
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width, 
        height: typeof height === 'number' ? `${height}px` : height 
      }}
    />
  )
})

TradingViewChart.displayName = 'TradingViewChart'

export default TradingViewChart