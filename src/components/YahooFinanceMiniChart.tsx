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

  useEffect(() => {
    if (containerRef.current) {
      // Clear previous content
      containerRef.current.innerHTML = ''
      
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
      
      // Add script to fetch and render chart
      const script = document.createElement('script')
      script.textContent = `
        // Function to fetch Yahoo Finance data and render chart
        async function fetchAndRenderMiniChart(symbol, interval, elementId, lineColor) {
          try {
            const response = await fetch('https://api.allorigins.win/get?url=' + 
              encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/' + 
              symbol + '?interval=1d&range=' + interval));
            const data = await response.json();
            
            // Parse the response from the CORS proxy
            const yahooData = JSON.parse(data.contents);
            
            if (yahooData && yahooData.chart && yahooData.chart.result && yahooData.chart.result[0]) {
              const result = yahooData.chart.result[0];
              const timestamps = result.timestamp;
              const quotes = result.indicators.quote[0];
              const closePrices = quotes.close;
              
              // Update price and change
              const meta = result.meta;
              const priceElement = document.getElementById(symbol + '-mini-price');
              const changeElement = document.getElementById(symbol + '-mini-change');
              
              if (priceElement && changeElement) {
                // Format price
                priceElement.textContent = '$' + meta.regularMarketPrice.toFixed(2);
                
                // Calculate change
                const change = meta.regularMarketPrice - meta.previousClose;
                const changePercent = (change / meta.previousClose) * 100;
                
                // Format change with color
                changeElement.textContent = (change >= 0 ? '+' : '') + 
                  change.toFixed(2) + ' (' + 
                  (change >= 0 ? '+' : '') + 
                  changePercent.toFixed(2) + '%)';
                
                changeElement.style.color = change >= 0 ? '#22c55e' : '#ef4444';
              }
              
              // Render simple chart
              const chartArea = document.getElementById(elementId);
              if (chartArea) {
                // Clear previous chart
                chartArea.innerHTML = '';
                
                // Create SVG
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.style.overflow = 'visible';
                
                // Filter out null values
                const validPrices = [];
                const validTimestamps = [];
                
                for (let i = 0; i < closePrices.length; i++) {
                  if (closePrices[i] !== null) {
                    validPrices.push(closePrices[i]);
                    validTimestamps.push(timestamps[i]);
                  }
                }
                
                if (validPrices.length > 0) {
                  // Calculate min and max for scaling
                  const minPrice = Math.min(...validPrices);
                  const maxPrice = Math.max(...validPrices);
                  const priceRange = maxPrice - minPrice;
                  
                  // Add padding to min/max
                  const paddedMin = minPrice - (priceRange * 0.05);
                  const paddedMax = maxPrice + (priceRange * 0.05);
                  
                  // Create path
                  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                  
                  // Generate path data
                  let pathData = '';
                  
                  for (let i = 0; i < validPrices.length; i++) {
                    const x = (i / (validPrices.length - 1)) * 100 + '%';
                    const y = 100 - ((validPrices[i] - paddedMin) / (paddedMax - paddedMin) * 100) + '%';
                    
                    if (i === 0) {
                      pathData += 'M ' + x + ' ' + y;
                    } else {
                      pathData += ' L ' + x + ' ' + y;
                    }
                  }
                  
                  path.setAttribute('d', pathData);
                  path.setAttribute('fill', 'none');
                  path.setAttribute('stroke', lineColor);
                  path.setAttribute('stroke-width', '2');
                  
                  svg.appendChild(path);
                  
                  // Determine if chart is positive or negative
                  const isPositive = validPrices[validPrices.length - 1] >= validPrices[0];
                  
                  // Add area fill
                  const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                  let areaPathData = pathData;
                  
                  // Add bottom line to close the path
                  const lastX = '100%';
                  const firstX = '0%';
                  const bottomY = '100%';
                  
                  areaPathData += ' L ' + lastX + ' ' + bottomY;
                  areaPathData += ' L ' + firstX + ' ' + bottomY;
                  areaPathData += ' Z';
                  
                  areaPath.setAttribute('d', areaPathData);
                  areaPath.setAttribute('fill', isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)');
                  
                  // Add area path before line path for proper layering
                  svg.insertBefore(areaPath, path);
                  
                  chartArea.appendChild(svg);
                }
              }
            }
          } catch (error) {
            console.error('Error fetching chart data for ' + symbol, error);
            
            // Show error message
            const chartArea = document.getElementById(elementId);
            if (chartArea) {
              chartArea.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #888;">Failed to load chart data</div>';
            }
            
            // Also update price elements to show error state
            const priceElement = document.getElementById(symbol + '-mini-price');
            const changeElement = document.getElementById(symbol + '-mini-change');
            
            if (priceElement && changeElement) {
              priceElement.textContent = 'Error';
              changeElement.textContent = 'Unable to load';
              changeElement.style.color = '#888';
            }
          }
        }
        
        // Initial render
        fetchAndRenderMiniChart('${symbol}', '${interval}', '${symbol}-chart-area', '${lineColor}');
        
        // Add event listener to interval selector
        const intervalSelector = document.querySelector('select');
        if (intervalSelector) {
          intervalSelector.addEventListener('change', function() {
            fetchAndRenderMiniChart('${symbol}', this.value, '${symbol}-chart-area', '${lineColor}');
          });
        }
      `
      
      containerRef.current.appendChild(script)
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
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