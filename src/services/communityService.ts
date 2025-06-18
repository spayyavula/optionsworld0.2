interface CommunityPlatform {
  id: string
  name: string
  icon: string
  color: string
  url?: string
  isConfigured: boolean
}

interface CommunityMessage {
  id: string
  platform: string
  content: string
  author: string
  timestamp: Date
  type: 'trade_alert' | 'market_update' | 'discussion' | 'analysis'
}

interface TradingAlert {
  symbol: string
  action: 'buy' | 'sell'
  price: number
  quantity: number
  strategy: string
  reasoning: string
}

export class CommunityService {
  private static readonly PLATFORMS: CommunityPlatform[] = [
    {
      id: 'slack',
      name: 'Slack',
      icon: '💬',
      color: '#4A154B',
      url: import.meta.env.VITE_SLACK_WEBHOOK_URL,
      isConfigured: !!import.meta.env.VITE_SLACK_WEBHOOK_URL
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: '🎮',
      color: '#5865F2',
      url: import.meta.env.VITE_DISCORD_WEBHOOK_URL,
      isConfigured: !!import.meta.env.VITE_DISCORD_WEBHOOK_URL
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: '✈️',
      color: '#0088CC',
      url: `https://t.me/${import.meta.env.VITE_TELEGRAM_CHANNEL}`,
      isConfigured: !!import.meta.env.VITE_TELEGRAM_BOT_TOKEN
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '📱',
      color: '#25D366',
      url: `https://chat.whatsapp.com/${import.meta.env.VITE_WHATSAPP_GROUP_INVITE}`,
      isConfigured: !!import.meta.env.VITE_WHATSAPP_GROUP_INVITE
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '📘',
      color: '#1877F2',
      url: `https://facebook.com/groups/${import.meta.env.VITE_FACEBOOK_GROUP_ID}`,
      isConfigured: !!import.meta.env.VITE_FACEBOOK_GROUP_ID
    }
  ]

  /**
   * Get all available community platforms
   */
  static getPlatforms(): CommunityPlatform[] {
    return [...this.PLATFORMS]
  }

  /**
   * Get configured platforms only
   */
  static getConfiguredPlatforms(): CommunityPlatform[] {
    return this.PLATFORMS.filter(platform => platform.isConfigured)
  }

  /**
   * Share trading alert to community platforms
   */
  static async shareTradingAlert(alert: TradingAlert, platforms: string[] = []): Promise<void> {
    const message = this.formatTradingAlert(alert)
    const targetPlatforms = platforms.length > 0 
      ? this.PLATFORMS.filter(p => platforms.includes(p.id))
      : this.getConfiguredPlatforms()

    const promises = targetPlatforms.map(platform => 
      this.sendMessage(platform.id, message, 'trade_alert')
    )

    try {
      await Promise.allSettled(promises)
      console.log(`Trading alert shared to ${targetPlatforms.length} platforms`)
    } catch (error) {
      console.error('Failed to share trading alert:', error)
    }
  }

  /**
   * Share market analysis to community
   */
  static async shareMarketAnalysis(
    title: string, 
    analysis: string, 
    platforms: string[] = []
  ): Promise<void> {
    const message = this.formatMarketAnalysis(title, analysis)
    const targetPlatforms = platforms.length > 0 
      ? this.PLATFORMS.filter(p => platforms.includes(p.id))
      : this.getConfiguredPlatforms()

    const promises = targetPlatforms.map(platform => 
      this.sendMessage(platform.id, message, 'analysis')
    )

    try {
      await Promise.allSettled(promises)
      console.log(`Market analysis shared to ${targetPlatforms.length} platforms`)
    } catch (error) {
      console.error('Failed to share market analysis:', error)
    }
  }

  /**
   * Join community platform
   */
  static joinPlatform(platformId: string): void {
    const platform = this.PLATFORMS.find(p => p.id === platformId)
    if (platform?.url) {
      window.open(platform.url, '_blank', 'noopener,noreferrer')
    } else {
      console.warn(`Platform ${platformId} not configured or URL not available`)
    }
  }

  /**
   * Send message to specific platform
   */
  private static async sendMessage(
    platformId: string, 
    message: string, 
    type: CommunityMessage['type']
  ): Promise<void> {
    switch (platformId) {
      case 'slack':
        await this.sendToSlack(message)
        break
      case 'discord':
        await this.sendToDiscord(message)
        break
      case 'telegram':
        await this.sendToTelegram(message)
        break
      case 'whatsapp':
        this.shareToWhatsApp(message)
        break
      case 'facebook':
        this.shareToFacebook(message)
        break
      default:
        console.warn(`Platform ${platformId} not supported`)
    }
  }

  /**
   * Send message to Slack
   */
  private static async sendToSlack(message: string): Promise<void> {
    const webhookUrl = import.meta.env.VITE_SLACK_WEBHOOK_URL
    if (!webhookUrl) {
      console.warn('Slack webhook URL not configured')
      return
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: message,
          username: 'Options World Bot',
          icon_emoji: ':chart_with_upwards_trend:'
        })
      })
    } catch (error) {
      console.error('Failed to send to Slack:', error)
    }
  }

  /**
   * Send message to Discord
   */
  private static async sendToDiscord(message: string): Promise<void> {
    const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL
    if (!webhookUrl) {
      console.warn('Discord webhook URL not configured')
      return
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message,
          username: 'Options World Bot',
          avatar_url: 'https://example.com/bot-avatar.png'
        })
      })
    } catch (error) {
      console.error('Failed to send to Discord:', error)
    }
  }

  /**
   * Send message to Telegram
   */
  private static async sendToTelegram(message: string): Promise<void> {
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID
    
    if (!botToken || !chatId) {
      console.warn('Telegram bot token or chat ID not configured')
      return
    }

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      })
    } catch (error) {
      console.error('Failed to send to Telegram:', error)
    }
  }

  /**
   * Share to WhatsApp (opens WhatsApp with pre-filled message)
   */
  private static shareToWhatsApp(message: string): void {
    const encodedMessage = encodeURIComponent(message)
    const groupInvite = import.meta.env.VITE_WHATSAPP_GROUP_INVITE
    
    if (groupInvite) {
      window.open(`https://chat.whatsapp.com/${groupInvite}`, '_blank')
    } else {
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
    }
  }

  /**
   * Share to Facebook (opens Facebook with pre-filled post)
   */
  private static shareToFacebook(message: string): void {
    const encodedMessage = encodeURIComponent(message)
    const groupId = import.meta.env.VITE_FACEBOOK_GROUP_ID
    
    if (groupId) {
      window.open(`https://facebook.com/groups/${groupId}`, '_blank')
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}&quote=${encodedMessage}`, '_blank')
    }
  }

  /**
   * Format trading alert message
   */
  private static formatTradingAlert(alert: TradingAlert): string {
    const emoji = alert.action === 'buy' ? '🟢' : '🔴'
    const action = alert.action.toUpperCase()
    
    return `${emoji} **TRADING ALERT** ${emoji}

**${action} ${alert.symbol}**
💰 Price: $${alert.price.toFixed(2)}
📊 Quantity: ${alert.quantity}
🎯 Strategy: ${alert.strategy}

**Analysis:**
${alert.reasoning}

⚠️ This is for educational purposes only. Not financial advice.

#OptionsTrading #${alert.symbol} #TradingAlert`
  }

  /**
   * Format market analysis message
   */
  private static formatMarketAnalysis(title: string, analysis: string): string {
    return `📈 **MARKET ANALYSIS** 📈

**${title}**

${analysis}

💡 Join our community for more insights and trading discussions!

#MarketAnalysis #OptionsTrading #TradingCommunity`
  }

  /**
   * Get community statistics (mock data for demo)
   */
  static getCommunityStats(): {
    totalMembers: number
    activeToday: number
    tradesShared: number
    platformStats: { platform: string; members: number }[]
  } {
    return {
      totalMembers: 15420,
      activeToday: 342,
      tradesShared: 1250,
      platformStats: [
        { platform: 'Discord', members: 8500 },
        { platform: 'Telegram', members: 3200 },
        { platform: 'Slack', members: 2100 },
        { platform: 'WhatsApp', members: 1200 },
        { platform: 'Facebook', members: 420 }
      ]
    }
  }

  /**
   * Get recent community messages (mock data for demo)
   */
  static getRecentMessages(): CommunityMessage[] {
    return [
      {
        id: '1',
        platform: 'discord',
        content: 'Great SPY call analysis! Thanks for sharing the setup.',
        author: 'TraderMike',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'discussion'
      },
      {
        id: '2',
        platform: 'telegram',
        content: 'BUY AAPL $185 Call - Strong bullish momentum detected',
        author: 'OptionsBot',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        type: 'trade_alert'
      },
      {
        id: '3',
        platform: 'slack',
        content: 'Market regime analysis: Transitioning to high volatility phase',
        author: 'MarketAnalyst',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        type: 'analysis'
      }
    ]
  }

  /**
   * Check if any platforms are configured
   */
  static hasConfiguredPlatforms(): boolean {
    return this.getConfiguredPlatforms().length > 0
  }

  /**
   * Get platform configuration status
   */
  static getPlatformStatus(): Record<string, boolean> {
    return this.PLATFORMS.reduce((status, platform) => {
      status[platform.id] = platform.isConfigured
      return status
    }, {} as Record<string, boolean>)
  }
}