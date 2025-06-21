/**
 * Service for interacting with StockCharts
 */
export class StockChartsService {
  private static readonly USERNAME = 'spayyavula@gmail.com'
  private static readonly PASSWORD = 'TOAST-INDIGO-177'
  private static readonly BASE_URL = 'https://stockcharts.com'
  
  /**
   * Get the StockCharts URL for a symbol
   */
  static getChartUrl(
    symbol: string, 
    timeframe: string = 'D', 
    theme: 'light' | 'dark' = 'light'
  ): string {
    // Format symbol to ensure it has exchange prefix if needed
    const formattedSymbol = symbol.includes(':') ? symbol : symbol
    
    // Construct the URL with parameters
    const baseUrl = 'https://stockcharts.com/h-sc/ui'
    const params = new URLSearchParams({
      s: formattedSymbol,
      p: timeframe,
      b: theme === 'dark' ? 'dark' : 'light',
      g: 'true',  // Show indicators
      d: 'true',  // Show drawings
      t: 'true'   // Show toolbar
    })
    
    return `${baseUrl}?${params.toString()}`
  }
  
  /**
   * Get the StockCharts mini chart URL for a symbol
   */
  static getMiniChartUrl(
    symbol: string, 
    timeframe: string = 'D', 
    theme: 'light' | 'dark' = 'light'
  ): string {
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
    
    return `${baseUrl}?${params.toString()}`
  }
  
  /**
   * Get the StockCharts login URL
   */
  static getLoginUrl(): string {
    return `${this.BASE_URL}/user/login`
  }
  
  /**
   * Get the StockCharts credentials
   */
  static getCredentials(): { username: string; password: string } {
    return {
      username: this.USERNAME,
      password: this.PASSWORD
    }
  }
  
  /**
   * Check if StockCharts is configured
   */
  static isConfigured(): boolean {
    return !!this.USERNAME && !!this.PASSWORD
  }
  
  /**
   * Get configuration status
   */
  static getConfigStatus(): {
    configured: boolean
    hasUsername: boolean
    hasPassword: boolean
  } {
    return {
      configured: this.isConfigured(),
      hasUsername: !!this.USERNAME,
      hasPassword: !!this.PASSWORD
    }
  }
}