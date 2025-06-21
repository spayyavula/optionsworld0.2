import React, { useEffect, useRef } from 'react'

interface StockChartsMiniWidgetProps {
  symbol: string
  width?: string | number
  height?: string | number
  timeframe?: string
  theme?: 'light' | 'dark'
  container_id?: string
}

const StockChartsMiniWidget: React.FC<StockChartsMiniWidgetProps> = ({
  symbol,
  width = 350,
  height = 220,
  timeframe = 'D',
  theme = 'light',
  container_id
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
      // Create mini chart container
      const chartContainer = document.createElement('div')
      chartContainer.className = 'stockcharts-mini-chart'
      chartContainer.style.width = '100%'
      chartContainer.style.height = '100%'
      chartContainer.style.backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff'
      chartContainer.style.borderRadius = '0.5rem'
      chartContainer.style.overflow = 'hidden'
      chartContainer.style.position = 'relative'
      
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
        g: 'false', // No indicators for mini chart
        d: 'false', // No drawings for mini chart
        t: 'false'  // No toolbar for mini chart
      })
      
      iframe.src = `${baseUrl}?${params.toString()}`
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      iframe.style.border = 'none'
      iframe.style.overflow = 'hidden'
      
      chartContainer.appendChild(iframe)
      containerRef.current.appendChild(chartContainer)
      iframeRef.current = iframe
      
      // Create header with symbol info
      const header = document.createElement('div')
      header.style.position = 'absolute'
      header.style.top = '0'
      header.style.left = '0'
      header.style.right = '0'
      header.style.padding = '8px 12px'
      header.style.backgroundColor = theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'
      header.style.backdropFilter = 'blur(4px)'
      header.style.borderBottom = theme === 'dark' ? '1px solid #333' : '1px solid #e5e7eb'
      header.style.zIndex = '10'
      
      const symbolName = document.createElement('div')
      symbolName.textContent = symbol
      symbolName.style.fontWeight = 'bold'
      symbolName.style.fontSize = '14px'
      symbolName.style.color = theme === 'dark' ? '#e0e0e0' : '#111827'
      
      header.appendChild(symbolName)
      chartContainer.appendChild(header)
    } catch (error) {
      console.error('Error initializing StockCharts mini widget:', error)
      
      // Show error message
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #888;">Failed to load chart</div>'
      }
    }
    
    return cleanup
  }, [symbol, width, height, timeframe, theme])

  const containerId = container_id || `stockcharts-mini-${Math.random().toString(36).substring(2, 11)}`

  return (
    <div 
      ref={containerRef}
      id={containerId}
      className="stockcharts-mini-chart-container"
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width, 
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: '0.5rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}
    />
  )
}

export default StockChartsMiniWidget