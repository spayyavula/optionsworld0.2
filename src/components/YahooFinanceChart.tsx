import React, { useEffect, useRef } from 'react'

interface YahooFinanceChartProps {
  symbol: string
  width?: string | number
  height?: string | number
  interval?: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | 'max'
  includePrePost?: boolean
  lineColor?: string
  showControls?: boolean
  darkMode?: boolean
  container_id?: string
}

const YahooFinanceChart: React.FC<YahooFinanceChartProps> = ({
  symbol,
  width = '100%',
  height = 400,
  interval = '1y',
  includePrePost = false,
  lineColor = '#2563eb',
  showControls = true,
  darkMode = false,
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
      // Create iframe for Yahoo Finance chart
      const iframe = document.createElement('iframe')
      
      // Construct the URL with parameters
      const baseUrl = 'https://finance.yahoo.com/chart/'
      const params = new URLSearchParams({
        range: interval,
        includePrePost: includePrePost ? '1' : '0',
        interval: '1d',
        lineColor: lineColor.replace('#', ''),
        chartType: 'line',
        style: darkMode ? 'dark' : 'light',
        showControls: showControls ? '1' : '0'
      })
      
      iframe.src = `${baseUrl}${encodeURIComponent(symbol)}?${params.toString()}`
      iframe.style.width = typeof width === 'number' ? `${width}px` : width
      iframe.style.height = typeof height === 'number' ? `${height}px` : height
      iframe.style.border = 'none'
      iframe.style.overflow = 'hidden'
      
      containerRef.current.appendChild(iframe)
      iframeRef.current = iframe
      
      // Add message to explain iframe behavior
      const message = document.createElement('div')
      message.style.marginTop = '10px'
      message.style.fontSize = '12px'
      message.style.color = '#666'
      message.textContent = 'Yahoo Finance chart loaded. For interactive features, click inside the chart.'
      
      containerRef.current.appendChild(message)
    } catch (error) {
      console.error('Error initializing Yahoo Finance chart:', error)
    }
    
    return cleanup
  }, [symbol, width, height, interval, includePrePost, lineColor, showControls, darkMode])

  const containerId = container_id || `yahoo-finance-chart-${Math.random().toString(36).substring(2, 11)}`

  return (
    <div 
      ref={containerRef}
      id={containerId}
      className="yahoo-finance-chart-container"
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width, 
        height: typeof height === 'number' ? `${height}px` : height,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '0.5rem'
      }}
    />
  )
}

export default YahooFinanceChart