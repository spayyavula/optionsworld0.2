import React, { useEffect, useRef } from 'react'

interface TradingViewWidgetProps {
  symbol: string
  width?: string | number
  height?: string | number
  interval?: string
  theme?: 'light' | 'dark'
  style?: 'candles' | 'line' | 'area' | 'bars'
  locale?: string
  toolbar_bg?: string
  enable_publishing?: boolean
  allow_symbol_change?: boolean
  container_id?: string
  studies?: string[]
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol,
  width = '100%',
  height = 400,
  interval = '1d',
  theme = 'light',
  style = 'candles',
  locale = 'en',
  toolbar_bg = '#f1f3f6',
  enable_publishing = false,
  allow_symbol_change = true,
  container_id,
  studies = []
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      // Clear previous content
      containerRef.current.innerHTML = ''
      
      const loadTradingViewScript = () => {
        return new Promise<void>((resolve) => {
          // Check if TradingView is already loaded
          if (window.TradingView) {
            resolve();
            return;
          }
          
          // Create the script element
          const script = document.createElement('script');
          script.src = 'https://s3.tradingview.com/tv.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => {
            console.error('Failed to load TradingView script');
            resolve(); // Resolve anyway to prevent hanging
          };
          
          document.head.appendChild(script);
          scriptRef.current = script;
        });
      };

      const initializeWidget = async () => {
        try {
          await loadTradingViewScript();
          
          if (!containerRef.current) return;
          
          // Format symbol to ensure it has exchange prefix if needed
          const formattedSymbol = symbol.includes(':') ? symbol : `NASDAQ:${symbol}`;
          
          // Create widget options
          const widgetOptions = {
            symbol: formattedSymbol,
            interval: interval,
            timezone: 'Etc/UTC',
            theme: theme,
            style: style,
            locale: locale,
            toolbar_bg: toolbar_bg,
            enable_publishing: enable_publishing,
            allow_symbol_change: allow_symbol_change,
            container_id: container_id || containerRef.current.id,
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
            autosize: true,
            save_image: true,
            hide_top_toolbar: false,
            hide_legend: false,
            withdateranges: true,
            hide_side_toolbar: false,
            studies: studies || [],
            details: true,
            hotlist: true,
            calendar: true,
            show_popup_button: true,
            popup_width: '1000',
            popup_height: '650',
            support_host: 'https://www.tradingview.com'
          };
          
          if (window.TradingView) {
            new window.TradingView.widget(widgetOptions);
          }
        } catch (error) {
          console.error('Error initializing TradingView widget:', error);
        }
      };
      
      initializeWidget();
    }
    
    return () => {
      // Clean up
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    }
  }, [symbol, width, height, interval, theme, style, locale, toolbar_bg, enable_publishing, allow_symbol_change, container_id, studies]);

  // Generate unique container ID
  const containerId = container_id || `tradingview_${Math.random().toString(36).substring(2, 11)}`

  return (
    <div 
      ref={containerRef}
      id={containerId}
      className="tradingview-widget-container"
      style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }}
    />
  )
}

export default TradingViewWidget