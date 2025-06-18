interface BuyMeCoffeeConfig {
  username: string
  widgetId?: string
  theme?: 'default' | 'dark' | 'light'
  message?: string
}

export class BuyMeCoffeeService {
  private static readonly USERNAME = import.meta.env.VITE_BUY_ME_COFFEE_USERNAME
  private static readonly WIDGET_ID = import.meta.env.VITE_BUY_ME_COFFEE_WIDGET_ID

  /**
   * Open Buy Me a Coffee page in new tab
   */
  static openBuyMeCoffeePage(message?: string): void {
    if (!this.USERNAME) {
      console.warn('Buy Me a Coffee username not configured, using mock payment')
      this.mockCoffeePayment()
      return
    }

    const baseUrl = `https://www.buymeacoffee.com/${this.USERNAME}`
    const url = message ? `${baseUrl}?message=${encodeURIComponent(message)}` : baseUrl
    
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  /**
   * Create Buy Me a Coffee widget
   */
  static createWidget(config: Partial<BuyMeCoffeeConfig> = {}): HTMLElement | null {
    if (!this.USERNAME) {
      console.warn('Buy Me a Coffee not configured')
      return null
    }

    const {
      username = this.USERNAME,
      theme = 'default',
      message = 'Support our work!'
    } = config

    // Create widget container
    const widget = document.createElement('div')
    widget.innerHTML = `
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        background: #FFDD00;
        color: #000;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      " 
      onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'"
      onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
      onclick="window.open('https://www.buymeacoffee.com/${username}', '_blank')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 14c-1.66 0-3-1.34-3-3V9c0-1.66 1.34-3 3-3h10c1.66 0 3 1.34 3 3v2c0 1.66-1.34 3-3 3H7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7 14v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 6h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        ${message}
      </div>
    `

    return widget.firstElementChild as HTMLElement
  }

  /**
   * Load Buy Me a Coffee widget script
   */
  static async loadWidget(containerId: string, config: Partial<BuyMeCoffeeConfig> = {}): Promise<void> {
    if (!this.USERNAME || !this.WIDGET_ID) {
      console.warn('Buy Me a Coffee widget not fully configured')
      return
    }

    try {
      // Create script element
      const script = document.createElement('script')
      script.setAttribute('data-name', 'BMC-Widget')
      script.setAttribute('data-cfasync', 'false')
      script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js'
      script.setAttribute('data-id', this.USERNAME)
      script.setAttribute('data-description', config.message || 'Support our work!')
      script.setAttribute('data-message', config.message || 'Thanks for your support!')
      script.setAttribute('data-color', '#FFDD00')
      script.setAttribute('data-position', 'Right')
      script.setAttribute('data-x_margin', '18')
      script.setAttribute('data-y_margin', '18')

      // Add to document
      document.head.appendChild(script)

      console.log('Buy Me a Coffee widget loaded')
    } catch (error) {
      console.error('Failed to load Buy Me a Coffee widget:', error)
    }
  }

  /**
   * Mock coffee payment for development
   */
  private static mockCoffeePayment(): void {
    if (confirm('Mock Buy Me a Coffee\n\nAmount: $5\n\nProceed with mock payment?')) {
      // Store mock payment
      const mockPayment = {
        id: `coffee_mock_${Date.now()}`,
        amount: 5,
        currency: 'USD',
        status: 'completed',
        created: new Date().toISOString(),
        message: 'Thanks for the coffee! ☕'
      }
      
      localStorage.setItem('mock_coffee_payments', JSON.stringify([
        ...this.getCoffeePayments(),
        mockPayment
      ]))
      
      alert('Thank you for the coffee! ☕ (Development Mode)')
    }
  }

  /**
   * Get coffee payment history (for development)
   */
  static getCoffeePayments(): any[] {
    try {
      return JSON.parse(localStorage.getItem('mock_coffee_payments') || '[]')
    } catch (error) {
      console.error('Error getting coffee payments:', error)
      return []
    }
  }

  /**
   * Create a simple coffee button
   */
  static createCoffeeButton(
    text: string = 'Buy me a coffee',
    onClick?: () => void
  ): HTMLButtonElement {
    const button = document.createElement('button')
    button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
        <path d="M7 14c-1.66 0-3-1.34-3-3V9c0-1.66 1.34-3 3-3h10c1.66 0 3 1.34 3 3v2c0 1.66-1.34 3-3 3H7z" stroke="currentColor" stroke-width="2"/>
        <path d="M7 14v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-5" stroke="currentColor" stroke-width="2"/>
        <path d="M4 6h16" stroke="currentColor" stroke-width="2"/>
      </svg>
      ${text}
    `
    
    button.style.cssText = `
      display: inline-flex;
      align-items: center;
      padding: 12px 24px;
      background: #FFDD00;
      color: #000;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `
    
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-1px)'
      button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
    })
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)'
      button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
    })
    
    button.addEventListener('click', () => {
      if (onClick) {
        onClick()
      } else {
        this.openBuyMeCoffeePage()
      }
    })
    
    return button
  }

  /**
   * Check if Buy Me a Coffee is configured
   */
  static isConfigured(): boolean {
    return !!this.USERNAME
  }

  /**
   * Get configuration status
   */
  static getConfigStatus(): {
    configured: boolean
    hasUsername: boolean
    hasWidgetId: boolean
  } {
    return {
      configured: this.isConfigured(),
      hasUsername: !!this.USERNAME,
      hasWidgetId: !!this.WIDGET_ID
    }
  }
}