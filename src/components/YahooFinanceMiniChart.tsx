import React, { useEffect, useRef } from 'react'

interface YahooFinanceMiniChartProps {
  symbol: string
  width?: string | number
  height?: string | number
  interval?: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y'
  lineColor?: string
  darkMode?: boolean
  container_id?: string
}

const YahooFinanceMiniChart: React.FC<YahooFinanceMiniChartProps> = ({
  symbol,
  width = 350,
  height = 220,
  interval = '3mo',
  lineColor = '#2563eb',
  darkMode = false,
  container_id
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    // Clean up function
    const cleanup = () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
        scriptRef.current = null
      }
    }
    
    // Clean up first
    cleanup()
    
    if (!containerRef.current) return
    
    try {
      // Create mini chart container
      const chartContainer = document.createElement('div')
      chartContainer.className = 'yahoo-finance-mini-chart'
      chartContainer.style.width = '100%'
      chartContainer.style.height = '100%'
      chartContainer.style.backgroundColor = darkMode ? '#1a1a1a' : '#ffffff'
      chartContainer.style.borderRadius = '0.5rem'
      chartContainer.style.overflow = 'hidden'
      chartContainer.style.position = 'relative'
      
      // Create header
      const header = document.createElement('div')
      header.style.display = 'flex'
      header.style.justifyContent = 'space-between'
      header.style.alignItems = 'center'
      header.style.padding = '10px 15px'
      header.style.borderBottom = darkMode ? '1px solid #333' : '1px solid #e5e7eb'
      
      // Symbol info
      const symbolInfo = document.createElement('div')
      
      const symbolName = document.createElement('a')
      symbolName.href = `https://finance.yahoo.com/quote/${symbol}`
      symbolName.target = '_blank'
      symbolName.rel = 'noopener noreferrer'
      symbolName.textContent = symbol
      symbolName.style.fontWeight = 'bold'
      symbolName.style.fontSize = '16px'
      symbolName.style.color = darkMode ? '#e0e0e0' : '#111827'
      symbolName.style.textDecoration = 'none'
      
      const priceContainer = document.createElement('div')
      priceContainer.style.display = 'flex'
      priceContainer.style.alignItems = 'center'
      priceContainer.style.marginTop = '4px'
      
      const price = document.createElement('span')
      price.id = `${symbol}-mini-price`
      price.textContent = 'Loading...'
      price.style.fontSize = '14px'
      price.style.color = darkMode ? '#e0e0e0' : '#111827'
      
      const change = document.createElement('span')
      change.id = `${symbol}-mini-change`
      change.textContent = ''
      change.style.fontSize = '12px'
      change.style.marginLeft = '8px'
      
      priceContainer.appendChild(price)
      priceContainer.appendChild(change)
      
      symbolInfo.appendChild(symbolName)
      symbolInfo.appendChild(priceContainer)
      
      // Interval selector
      const intervalSelector = document.createElement('select')
      intervalSelector.style.padding = '2px 4px'
      intervalSelector.style.fontSize = '12px'
      intervalSelector.style.borderRadius = '4px'
      intervalSelector.style.border = darkMode ? '1px solid #555' : '1px solid #d1d5db'
      intervalSelector.style.backgroundColor = darkMode ? '#333' : '#f9fafb'
      intervalSelector.style.color = darkMode ? '#e0e0e0' : '#111827'
      
      const intervals = [
        { value: '1d', label: '1D' },
        { value: '5d', label: '5D' },
        { value: '1mo', label: '1M' },
        { value: '3mo', label: '3M' },
        { value: '6mo', label: '6M' },
        { value: '1y', label: '1Y' }
      ]
      
      intervals.forEach(int => {
        const option = document.createElement('option')
        option.value = int.value
        option.textContent = int.label
        option.selected = int.value === interval
        intervalSelector.appendChild(option)
      })
      
      header.appendChild(symbolInfo)
      header.appendChild(intervalSelector)
      
      // Chart area
      const chartArea = document.createElement('div')
      chartArea.id = `${symbol}-chart-area`
      chartArea.style.width = '100%'
      chartArea.style.height = 'calc(100% - 60px)'
      
      // Add elements to container
      chartContainer.appendChild(header)
      chartContainer.appendChild(chartArea)
      containerRef.current.appendChild(chartContainer)
      
      // Create a placeholder message
      const placeholderMessage = document.createElement('div')
      placeholderMessage.style.display = 'flex'
      placeholderMessage.style.alignItems = 'center'
      placeholderMessage.style.justifyContent = 'center'
      placeholderMessage.style.height = '100%'
      placeholderMessage.style.color = '#888'
      placeholderMessage.textContent = 'Yahoo Finance data visualization'
      
      chartArea.appendChild(placeholderMessage)
      
      // For demo purposes, update the price with mock data
      window.setTimeout(() => {
        const priceElement = document.getElementById(`${symbol}-mini-price`)
        const changeElement = document.getElementById(`${symbol}-mini-change`)
        
        if (priceElement && changeElement) {
          const mockPrice = Math.floor(Math.random() * 1000) + 100
          const mockChange = (Math.random() * 10) - 5
          const mockChangePercent = (mockChange / mockPrice) * 100
          
          priceElement.textContent = `$${mockPrice.toFixed(2)}`
          changeElement.textContent = `${mockChange >= 0 ? '+' : ''}${mockChange.toFixed(2)} (${mockChange >= 0 ? '+' : ''}${mockChangePercent.toFixed(2)}%)`
          changeElement.style.color = mockChange >= 0 ? '#22c55e' : '#ef4444'
        }
      }, 1000)
    } catch (error) {
      console.error('Error initializing Yahoo Finance mini chart:', error)
      
      // Show error message
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #888;">Failed to load chart</div>'
      }
    }
    
    return cleanup
  }, [symbol, width, height, interval, lineColor, darkMode])

  const containerId = container_id || `yahoo-finance-mini-${Math.random().toString(36).substring(2, 11)}`

  return (
    <div 
      ref={containerRef}
      id={containerId}
      className="yahoo-finance-mini-chart-container"
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

export default YahooFinanceMiniChart