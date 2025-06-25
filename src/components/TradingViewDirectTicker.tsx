import React, { useEffect, useRef } from 'react'

interface TradingViewDirectTickerProps {
  symbols: string[]
  width?: string | number
  height?: number
  darkMode?: boolean
}

const TradingViewDirectTicker: React.FC<TradingViewDirectTickerProps> = ({
  symbols,
  width = '100%',
  height = 60,
  darkMode = false
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
      // Create ticker container
      const tickerContainer = document.createElement('div')
      tickerContainer.className = 'tradingview-ticker'
      tickerContainer.style.display = 'flex' 
      tickerContainer.style.overflowX = 'auto'
      tickerContainer.style.padding = '15px 0'
      tickerContainer.style.backgroundColor = darkMode ? '#1a1a1a' : '#f1f5f9'
      tickerContainer.style.borderRadius = '0.5rem'
      tickerContainer.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
      
      // Add symbols
      symbols.forEach(symbol => {
        const symbolElement = document.createElement('a')
        symbolElement.href = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}`
        symbolElement.target = '_blank'
        symbolElement.rel = 'noopener noreferrer'
        symbolElement.className = 'tradingview-ticker-symbol'
        symbolElement.style.display = 'inline-flex'
        symbolElement.style.flexDirection = 'column'
        symbolElement.style.alignItems = 'center'
        symbolElement.style.justifyContent = 'center'
        symbolElement.style.padding = '10px 20px'
        symbolElement.style.minWidth = '140px'
        symbolElement.style.textDecoration = 'none'
        symbolElement.style.color = darkMode ? '#e0e0e0' : '#333'
        
        // Symbol name
        const symbolName = document.createElement('div')
        symbolName.textContent = symbol
        symbolName.style.fontWeight = '800'
        symbolName.style.backgroundColor = darkMode ? '#2a2a2a' : '#e2e8f0'
        symbolName.style.padding = '3px 10px'
        symbolName.style.fontSize = '16px'
        symbolName.style.borderRadius = '4px'
        symbolName.style.marginBottom = '5px'
        
        // Create placeholder for price and change (will be filled with mock data)
        const priceElement = document.createElement('div')
        priceElement.id = `${symbol}-price`
        priceElement.textContent = 'Loading...'
        priceElement.style.fontSize = '18px'
        priceElement.style.fontWeight = '700'
        
        const changeElement = document.createElement('div')
        changeElement.id = `${symbol}-change`
        changeElement.textContent = ''
        changeElement.style.fontWeight = '600'
        changeElement.style.fontSize = '14px'
        changeElement.style.marginTop = '3px'
        
        symbolElement.appendChild(symbolName)
        symbolElement.appendChild(priceElement)
        symbolElement.appendChild(changeElement)
        tickerContainer.appendChild(symbolElement)
      })
      
      containerRef.current.appendChild(tickerContainer)
      
      // For demo purposes, update with mock data
      window.setTimeout(() => {
        symbols.forEach(symbol => {
          const priceElement = document.getElementById(`${symbol}-price`)
          const changeElement = document.getElementById(`${symbol}-change`)
          
          if (priceElement && changeElement) {
            const mockPrice = Math.floor(Math.random() * 1000) + 100
            const mockChange = (Math.random() * 10) - 5
            const mockChangePercent = (mockChange / mockPrice) * 100

            priceElement.textContent = `$${mockPrice.toFixed(2)}`
            changeElement.textContent = `${mockChange >= 0 ? '+' : ''}${mockChange.toFixed(2)} (${mockChange >= 0 ? '+' : ''}${mockChangePercent.toFixed(2)}%)`
            changeElement.style.color = mockChange >= 0 ? '#22c55e' : '#ef4444'
            changeElement.style.padding = '3px 8px'
            changeElement.style.borderRadius = '4px'
            changeElement.style.backgroundColor = mockChange >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'
          }
        })
      }, 1000)
    } catch (error) {
      console.error('Error initializing TradingView ticker:', error)
      
      // Show error message
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div style="text-align: center; padding: 10px; color: #888;">Failed to load ticker</div>'
      }
    }
    
    return cleanup
  }, [symbols, width, height, darkMode])

  return (
    <div 
      ref={containerRef}
      className="tradingview-ticker-container"
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width, 
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}
    />
  )
}

export default TradingViewDirectTicker