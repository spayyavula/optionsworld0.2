interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export class ApiService {
  private static readonly BASE_URL = 'https://api.optionsworld.trade';
  private static apiKey: string | null = null;

  /**
   * Set the API key for all future requests
   */
  static setApiKey(key: string): void {
    this.apiKey = key;
    // Store in localStorage for persistence
    localStorage.setItem('agent_api_key', key);
  }

  /**
   * Get the current API key
   */
  static getApiKey(): string | null {
    if (!this.apiKey) {
      // Try to load from localStorage
      this.apiKey = localStorage.getItem('agent_api_key');
    }
    return this.apiKey;
  }

  /**
   * Clear the API key
   */
  static clearApiKey(): void {
    this.apiKey = null;
    localStorage.removeItem('agent_api_key');
  }

  /**
   * Make an API request
   */
  static async request<T>(endpoint: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
    try {
      const {
        method = 'GET',
        headers = {},
        body,
        params
      } = options;

      // Build URL with query parameters
      let url = `${this.BASE_URL}${endpoint}`;
      if (params) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          queryParams.append(key, String(value));
        });
        url += `?${queryParams.toString()}`;
      }

      // Set up headers
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers
      };

      // Add API key if available
      if (this.apiKey) {
        requestHeaders['Authorization'] = `Bearer ${this.apiKey}`;
      }

      // Make the request
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined
      });

      // Parse response
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        return {
          error: data.error || 'An error occurred',
          status: response.status
        };
      }

      return {
        data: data as T,
        status: response.status
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0
      };
    }
  }

  /**
   * Get market data for a symbol
   */
  static async getMarketData(symbol: string, timeframe: string = '1d'): Promise<ApiResponse<any>> {
    return this.request('/api/v1/market/data', {
      params: { symbol, timeframe }
    });
  }

  /**
   * Get options contracts
   */
  static async getOptionsContracts(underlying: string, expiration?: string, strike?: number): Promise<ApiResponse<any>> {
    const params: Record<string, string | number> = { underlying };
    if (expiration) params.expiration = expiration;
    if (strike) params.strike = strike;

    return this.request('/api/v1/market/options', { params });
  }

  /**
   * Get portfolio positions
   */
  static async getPortfolio(): Promise<ApiResponse<any>> {
    return this.request('/api/v1/portfolio');
  }

  /**
   * Place an order
   */
  static async placeOrder(
    symbol: string,
    quantity: number,
    type: 'buy' | 'sell',
    orderType: 'market' | 'limit' = 'market',
    price?: number
  ): Promise<ApiResponse<any>> {
    const body: Record<string, any> = {
      symbol,
      quantity,
      type,
      orderType
    };

    if (orderType === 'limit' && price) {
      body.price = price;
    }

    return this.request('/api/v1/orders', {
      method: 'POST',
      body
    });
  }

  /**
   * Get order history
   */
  static async getOrders(status?: string): Promise<ApiResponse<any>> {
    const params: Record<string, string> = {};
    if (status) params.status = status;

    return this.request('/api/v1/orders', { params });
  }

  /**
   * Cancel an order
   */
  static async cancelOrder(orderId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/v1/orders/${orderId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Get historical data
   */
  static async getHistoricalData(
    symbol: string,
    interval: string = '1d',
    from?: string,
    to?: string
  ): Promise<ApiResponse<any>> {
    const params: Record<string, string> = { symbol, interval };
    if (from) params.from = from;
    if (to) params.to = to;

    return this.request('/api/v1/market/historical', { params });
  }

  /**
   * Get agent-specific data
   */
  static async getAgentData(agentId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/v1/agents/${agentId}`);
  }

  /**
   * Update agent configuration
   */
  static async updateAgentConfig(agentId: string, config: any): Promise<ApiResponse<any>> {
    return this.request(`/api/v1/agents/${agentId}/config`, {
      method: 'PUT',
      body: config
    });
  }

  /**
   * Get API usage statistics
   */
  static async getApiUsage(): Promise<ApiResponse<any>> {
    return this.request('/api/v1/usage');
  }
}