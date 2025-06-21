import React, { useEffect, useRef } from 'react'

interface TradingViewDirectMiniChartProps {
  symbol: string
  width?: string | number
  height?: string | number
  theme?: 'light' | 'dark'
  container_id?: string
}

const TradingViewDirectMiniChart: React.FC<TradingViewDirectMiniChartProps> = ({
  symbol,
  width = 350,
  height = 220,
  theme = 'light',
  container_id
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Clean up function
    const cleanup = () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
    
    // Clean up first
    cleanup()
    
    if (!containerRef.current) return
    
    try {
      // Create mini chart container
      const chartContainer = document.createElement('div')
      chartContainer.className = 'tradingview-mini-chart'
      chartContainer.style.display = 'flex'
      chartContainer.style.flexDirection = 'column'
      chartContainer.style.alignItems = 'center'
      chartContainer.style.justifyContent = 'center'
      chartContainer.style.width = '100%'
      chartContainer.style.height = '100%'
      chartContainer.style.backgroundColor = theme === 'dark' ? '#1a1a1a' : '#f8f9fa'
      chartContainer.style.borderRadius = '0.5rem'
      chartContainer.style.padding = '1rem'
      chartContainer.style.textAlign = 'center'
      
      // Format symbol to ensure it has exchange prefix if needed
      const formattedSymbol = symbol.includes(':') ? symbol : `NASDAQ:${symbol}`
      
      // Construct the URL with parameters
      const baseUrl = 'https://www.tradingview.com/chart'
      const params = new URLSearchParams()
      params.append('symbol', formattedSymbol)
      
      // Add theme parameter if it's dark
      if (theme === 'dark') {
        params.append('theme', 'dark')
      }
      
      // Create symbol header
      const symbolHeader = document.createElement('div')
      symbolHeader.style.fontWeight = 'bold'
      symbolHeader.style.fontSize = '16px'
      symbolHeader.style.marginBottom = '0.5rem'
      symbolHeader.style.color = theme === 'dark' ? '#e0e0e0' : '#111827'
      symbolHeader.textContent = symbol
      
      // Create mini chart placeholder
      const chartPlaceholder = document.createElement('div')
      chartPlaceholder.style.width = '100%'
      chartPlaceholder.style.height = '70%'
      chartPlaceholder.style.backgroundColor = theme === 'dark' ? '#2a2a2a' : '#e9ecef'
      chartPlaceholder.style.borderRadius = '0.375rem'
      chartPlaceholder.style.marginBottom = '0.75rem'
      chartPlaceholder.style.display = 'flex'
      chartPlaceholder.style.alignItems = 'center'
      chartPlaceholder.style.justifyContent = 'center'
      
      // Add chart icon
      const chartIcon = document.createElement('div')
      chartIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${theme === 'dark' ? '#e0e0e0' : '#6c757d'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      `
      
      chartPlaceholder.appendChild(chartIcon)
      
      // Create link button
      const linkButton = document.createElement('a')
      linkButton.href = `${baseUrl}/?${params.toString()}`
      linkButton.target = '_blank'
      linkButton.rel = 'noopener noreferrer'
      linkButton.style.display = 'inline-flex'
      linkButton.style.alignItems = 'center'
      linkButton.style.justifyContent = 'center'
      linkButton.style.padding = '0.5rem 0.75rem'
      linkButton.style.backgroundColor = '#2962FF'
      linkButton.style.color = 'white'
      linkButton.style.borderRadius = '0.375rem'
      linkButton.style.fontSize = '0.875rem'
      linkButton.style.fontWeight = '500'
      linkButton.style.textDecoration = 'none'
      linkButton.style.transition = 'background-color 150ms'
      linkButton.textContent = 'View Chart'
      
      // Add note about account
      const accountNote = document.createElement('div')
      accountNote.style.marginTop = '0.5rem'
      accountNote.style.fontSize = '10px'
      accountNote.style.color = theme === 'dark' ? '#adb5bd' : '#6c757d'
      accountNote.textContent = 'Requires TradingView account'
      
      // Add hover effect
      linkButton.onmouseover = () => {
        linkButton.style.backgroundColor = '#1E53E5'
      }
      linkButton.onmouseout = () => {
        linkButton.style.backgroundColor = '#2962FF'
      }
      
      // Assemble the container
      chartContainer.appendChild(symbolHeader)
      chartContainer.appendChild(chartPlaceholder)
      chartContainer.appendChild(linkButton)
      chartContainer.appendChild(accountNote)
      
      containerRef.current.appendChild(chartContainer)
    } catch (error) {
      console.error('Error initializing TradingView mini chart:', error)
      
      // Show error message
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #888;">Failed to load chart</div>'
      }
    }
    
    return cleanup
  }, [symbol, width, height, theme])

  const containerId = container_id || `tradingview-mini-${Math.random().toString(36).substring(2, 11)}`

  return (
    <div 
      ref={containerRef}
      id={containerId}
      className="tradingview-mini-chart-container"
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

export default TradingViewDirectMiniChart