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
      
      // Create direct link container
      const linkContainer = document.createElement('div')
      linkContainer.className = 'stockcharts-link-container'
      linkContainer.style.width = '100%'
      linkContainer.style.height = '100%'
      linkContainer.style.display = 'flex'
      linkContainer.style.flexDirection = 'column'
      linkContainer.style.alignItems = 'center'
      linkContainer.style.justifyContent = 'center'
      linkContainer.style.backgroundColor = theme === 'dark' ? '#1a1a1a' : '#f8f9fa'
      linkContainer.style.borderRadius = '0.5rem'
      linkContainer.style.padding = '2rem'
      linkContainer.style.textAlign = 'center'
      
      // Create chart placeholder
      const chartPlaceholder = document.createElement('div')
      chartPlaceholder.style.width = '100%'
      chartPlaceholder.style.height = '70%'
      chartPlaceholder.style.backgroundColor = theme === 'dark' ? '#2a2a2a' : '#e9ecef'
      chartPlaceholder.style.borderRadius = '0.5rem'
      chartPlaceholder.style.marginBottom = '1.5rem'
      chartPlaceholder.style.display = 'flex'
      chartPlaceholder.style.alignItems = 'center'
      chartPlaceholder.style.justifyContent = 'center'
      
      // Add chart icon
      const chartIcon = document.createElement('div')
      chartIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="${theme === 'dark' ? '#e0e0e0' : '#6c757d'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="20" x2="12" y2="10"></line>
          <line x1="18" y1="20" x2="18" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="16"></line>
        </svg>
      `
      
      chartPlaceholder.appendChild(chartIcon)
      
      // Create message
      const message = document.createElement('div')
      message.style.marginBottom = '1rem'
      message.style.fontSize = '16px'
      message.style.fontWeight = '500'
      message.style.color = theme === 'dark' ? '#e0e0e0' : '#343a40'
      message.textContent = `View ${symbol} Chart on StockCharts`
      
      // Create description
      const description = document.createElement('div')
      description.style.marginBottom = '1.5rem'
      description.style.fontSize = '14px'
      description.style.color = theme === 'dark' ? '#adb5bd' : '#6c757d'
      description.textContent = 'Click the button below to access professional charting tools with our StockCharts account'
      
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
      
      // Create link button
      const linkButton = document.createElement('a')
      linkButton.href = `${baseUrl}?${params.toString()}`
      linkButton.target = '_blank'
      linkButton.rel = 'noopener noreferrer'
      linkButton.style.display = 'inline-flex'
      linkButton.style.alignItems = 'center'
      linkButton.style.justifyContent = 'center'
      linkButton.style.padding = '0.75rem 1.5rem'
      linkButton.style.backgroundColor = '#2563eb'
      linkButton.style.color = 'white'
      linkButton.style.borderRadius = '0.375rem'
      linkButton.style.fontWeight = '500'
      linkButton.style.textDecoration = 'none'
      linkButton.style.transition = 'background-color 150ms'
      linkButton.textContent = 'Open in StockCharts'
      
      // Add hover effect
      linkButton.onmouseover = () => {
        linkButton.style.backgroundColor = '#1d4ed8'
      }
      linkButton.onmouseout = () => {
        linkButton.style.backgroundColor = '#2563eb'
      }
      
      // Create credentials info
      const credentialsInfo = document.createElement('div')
      credentialsInfo.style.marginTop = '1rem'
      credentialsInfo.style.fontSize = '12px'
      credentialsInfo.style.color = theme === 'dark' ? '#adb5bd' : '#6c757d'
      credentialsInfo.textContent = 'Use your own StockCharts account credentials to log in'
      
      // Assemble the container
      linkContainer.appendChild(chartPlaceholder)
      linkContainer.appendChild(message)
      linkContainer.appendChild(description)
      linkContainer.appendChild(linkButton)
      linkContainer.appendChild(credentialsInfo)
      
      containerRef.current.appendChild(linkContainer)
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