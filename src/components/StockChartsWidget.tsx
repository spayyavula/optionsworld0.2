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
      // Create iframe container
      const iframeContainer = document.createElement('div')
      iframeContainer.style.width = '100%'
      iframeContainer.style.height = '100%'
      iframeContainer.style.overflow = 'hidden'
      iframeContainer.style.borderRadius = '0.5rem'
      
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
      
      // Create iframe
      const iframe = document.createElement('iframe')
      iframe.src = `${baseUrl}?${params.toString()}`
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      iframe.style.border = 'none'
      iframe.style.overflow = 'hidden'
      iframe.setAttribute('frameborder', '0')
      iframe.setAttribute('allowfullscreen', 'true')
      iframe.setAttribute('scrolling', 'no')
      
      iframeContainer.appendChild(iframe)
      containerRef.current.appendChild(iframeContainer)
      iframeRef.current = iframe
      
      // Add resize listener
      const handleResize = () => {
        if (containerRef.current && iframe) {
          const containerWidth = containerRef.current.clientWidth
          const containerHeight = containerRef.current.clientHeight
          
          iframe.style.width = `${containerWidth}px`
          iframe.style.height = `${containerHeight}px`
        }
      }
      
      window.addEventListener('resize', handleResize)
      
      // Initial resize
      handleResize()
      
      return () => {
        window.removeEventListener('resize', handleResize)
        cleanup()
      }
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