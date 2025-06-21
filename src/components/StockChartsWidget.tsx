import React, { useEffect, useRef } from 'react'

interface StockChartsWidgetProps {
  symbol: string
  width?: string | number
  height?: string | number
  timeframe?: string
  theme?: 'light' | 'dark'
  container_id?: string
  showToolbar?: boolean
  showDrawings?: boolean
  showIndicators?: boolean
}

const StockChartsWidget: React.FC<StockChartsWidgetProps> = ({
  symbol,
  width = '100%',
  height = 500,
  timeframe = 'D',
  theme = 'light',
  container_id,
  showToolbar = true,
  showDrawings = true,
  showIndicators = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    // Clean up function
    const cleanup = () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      
      if (iframeRef.current) {
        iframeRef.current = null
      }
    }
    
    // Clean up first
    cleanup()
    
    if (!containerRef.current) return
    
    try {
      // Create iframe for StockCharts
      const iframe = document.createElement('iframe')
      
      // Format symbol to ensure it has exchange prefix if needed
      const formattedSymbol = symbol.includes(':') ? symbol : symbol
      
      // Construct the URL with parameters
      const baseUrl = 'https://stockcharts.com/h-sc/ui'
      const params = new URLSearchParams({
        s: formattedSymbol,
        p: timeframe,
        b: theme === 'dark' ? 'dark' : 'light',
        g: showIndicators ? 'true' : 'false',
        d: showDrawings ? 'true' : 'false',
        t: showToolbar ? 'true' : 'false'
      })
      
      iframe.src = `${baseUrl}?${params.toString()}`
      iframe.style.width = typeof width === 'number' ? `${width}px` : width
      iframe.style.height = typeof height === 'number' ? `${height}px` : height
      iframe.style.border = 'none'
      iframe.style.overflow = 'hidden'
      iframe.allow = 'fullscreen'
      
      containerRef.current.appendChild(iframe)
      iframeRef.current = iframe
      
      // Add message to explain iframe behavior
      const message = document.createElement('div')
      message.style.marginTop = '10px'
      message.style.fontSize = '12px'
      message.style.color = '#666'
      message.textContent = 'StockCharts loaded. For interactive features, click inside the chart.'
      
      containerRef.current.appendChild(message)
    } catch (error) {
      console.error('Error initializing StockCharts widget:', error)
      
      // Show error message
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #888;">Failed to load StockCharts widget</div>'
      }
    }
    
    return cleanup
  }, [symbol, width, height, timeframe, theme, showToolbar, showDrawings, showIndicators])

  const containerId = container_id || `stockcharts-${Math.random().toString(36).substring(2, 11)}`

  return (
    <div 
      ref={containerRef}
      id={containerId}
      className="stockcharts-widget-container"
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width, 
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}
    />
  )
}

export default StockChartsWidget