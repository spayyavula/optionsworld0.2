import React, { useEffect, useRef } from 'react'

interface YahooFinanceTickerProps {
  symbols: string[]
  width?: string | number
  height?: string | number
  darkMode?: boolean
  container_id?: string
}

const YahooFinanceTicker: React.FC<YahooFinanceTickerProps> = ({
  symbols,
  width = '100%',
  height = 60,
  darkMode = false,
  container_id
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      // Clear previous content
      containerRef.current.innerHTML = ''
      
      // Create ticker container
      const tickerContainer = document.createElement('div')
      tickerContainer.className = 'yahoo-finance-ticker'
      tickerContainer.style.display = 'flex'
      tickerContainer.style.overflowX = 'auto'
      tickerContainer.style.padding = '10px 0'
      tickerContainer.style.backgroundColor = darkMode ? '#1a1a1a' : '#f8f9fa'
      tickerContainer.style.borderRadius = '0.5rem'
      
      // Add symbols
      symbols.forEach(symbol => {
        const symbolElement = document.createElement('a')
        symbolElement.href = `https://finance.yahoo.com/quote/${symbol}`
        symbolElement.target = '_blank'
        symbolElement.rel = 'noopener noreferrer'
        symbolElement.className = 'yahoo-finance-ticker-symbol'
        symbolElement.style.display = 'inline-flex'
        symbolElement.style.flexDirection = 'column'
        symbolElement.style.alignItems = 'center'
        symbolElement.style.justifyContent = 'center'
        symbolElement.style.padding = '0 15px'
        symbolElement.style.minWidth = '120px'
        symbolElement.style.textDecoration = 'none'
        symbolElement.style.color = darkMode ? '#e0e0e0' : '#333'
        
        // Symbol name
        const symbolName = document.createElement('div')
        symbolName.textContent = symbol
        symbolName.style.fontWeight = 'bold'
        symbolName.style.fontSize = '14px'
        symbolName.style.marginBottom = '5px'
        
        // Create placeholder for price and change (will be filled by script)
        const priceElement = document.createElement('div')
        priceElement.id = `${symbol}-price`
        priceElement.textContent = 'Loading...'
        priceElement.style.fontSize = '13px'
        
        const changeElement = document.createElement('div')
        changeElement.id = `${symbol}-change`
        changeElement.textContent = ''
        changeElement.style.fontSize = '12px'
        
        symbolElement.appendChild(symbolName)
        symbolElement.appendChild(priceElement)
        symbolElement.appendChild(changeElement)
        tickerContainer.appendChild(symbolElement)
      })
      
      containerRef.current.appendChild(tickerContainer)
      
      // Add script to fetch real data
      const script = document.createElement('script')
      script.textContent = `
        // Simple function to fetch Yahoo Finance data
        async function fetchYahooData() {
          const symbols = ${JSON.stringify(symbols)};
          
          for (const symbol of symbols) {
            try {
              const response = await fetch('https://api.allorigins.win/get?url=' + 
                encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/' + symbol));
              const data = await response.json();
              
              // Parse the response from the CORS proxy
              const yahooData = JSON.parse(data.contents);
              
              if (yahooData && yahooData.chart && yahooData.chart.result && yahooData.chart.result[0]) {
                const quote = yahooData.chart.result[0].meta;
                const priceElement = document.getElementById(symbol + '-price');
                const changeElement = document.getElementById(symbol + '-change');
                
                if (priceElement && changeElement) {
                  // Format price
                  priceElement.textContent = '$' + quote.regularMarketPrice.toFixed(2);
                  
                  // Calculate change
                  const change = quote.regularMarketPrice - quote.previousClose;
                  const changePercent = (change / quote.previousClose) * 100;
                  
                  // Format change with color
                  changeElement.textContent = (change >= 0 ? '+' : '') + 
                    change.toFixed(2) + ' (' + 
                    (change >= 0 ? '+' : '') + 
                    changePercent.toFixed(2) + '%)';
                  
                  changeElement.style.color = change >= 0 ? '#22c55e' : '#ef4444';
                }
              }
            } catch (error) {
              console.error('Error fetching data for ' + symbol, error);
              
              // Show error state in UI
              const priceElement = document.getElementById(symbol + '-price');
              const changeElement = document.getElementById(symbol + '-change');
              
              if (priceElement && changeElement) {
                priceElement.textContent = 'Error';
                changeElement.textContent = 'Unable to load';
                changeElement.style.color = '#888';
              }
            }
          }
        }
        
        // Run once immediately
        fetchYahooData();
        
        // Then update every 60 seconds
        setInterval(fetchYahooData, 60000);
      `
      
      containerRef.current.appendChild(script)
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [symbols, width, height, darkMode])

  const containerId = container_id || `yahoo-finance-ticker-${Math.random().toString(36).substring(2, 11)}`

  return (
    <div 
      ref={containerRef}
      id={containerId}
      className="yahoo-finance-ticker-container"
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width, 
        height: typeof height === 'number' ? `${height}px` : height
      }}
    />
  )
}

export default YahooFinanceTicker