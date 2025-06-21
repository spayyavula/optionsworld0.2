import React, { useEffect, useRef } from 'react'

interface YahooFinanceWidgetProps {
  symbol: string
  width?: string | number
  height?: string | number
  interval?: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | 'max'
  range?: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | 'max'
  showControls?: boolean
  showTabs?: boolean
  darkMode?: boolean
  container_id?: string
}

const YahooFinanceWidget: React.FC<YahooFinanceWidgetProps> = ({
  symbol,
  width = '100%',
  height = 500,
  interval = '1d',
  range = '1y',
  showControls = true,
  showTabs = true,
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
      // Create iframe for Yahoo Finance
      const iframe = document.createElement('iframe')
      
      // Construct the URL with parameters
      const baseUrl = 'https://finance.yahoo.com/quote/'
      const chartParams = `?interval=${interval}&range=${range}`
      
      iframe.src = `${baseUrl}${encodeURIComponent(symbol)}${chartParams}`
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
      console.error('Error initializing Yahoo Finance widget:', error)
      
      // Show error message
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div style="text-align: center; padding: 20px; color: #888;">Failed to load Yahoo Finance widget</div>'
      }
    }
    
    return cleanup
  }, [symbol, width, height, interval, range, showControls, showTabs, darkMode])

  const containerId = container_id || `yahoo-finance-widget-${Math.random().toString(36).substring(2, 11)}`

  return (
    <div 
      ref={containerRef}
      id={containerId}
      className="yahoo-finance-widget-container"
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}
    />
  )
}

export default YahooFinanceWidget