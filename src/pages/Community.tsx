import React, { useState, useEffect } from 'react'
import { 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Share2, 
  Settings,
  ExternalLink,
  Activity,
  Clock,
  Hash,
  Send,
  Bell,
  Globe
} from 'lucide-react'
import { CommunityService } from '../services/communityService'
import { useTradingContext } from '../context/TradingContext'

export default function Community() {
  const { state } = useTradingContext()
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [shareMessage, setShareMessage] = useState('')
  const [isSharing, setIsSharing] = useState(false)
  const [communityStats, setCommunityStats] = useState<any>(null)
  const [recentMessages, setRecentMessages] = useState<any[]>([])

  useEffect(() => {
    loadCommunityData()
  }, [])

  const loadCommunityData = () => {
    setCommunityStats(CommunityService.getCommunityStats())
    setRecentMessages(CommunityService.getRecentMessages())
  }

  const platforms = CommunityService.getPlatforms()
  const configuredPlatforms = CommunityService.getConfiguredPlatforms()

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const handleJoinPlatform = (platformId: string) => {
    CommunityService.joinPlatform(platformId)
  }

  const handleShareMessage = async () => {
    if (!shareMessage.trim()) return

    setIsSharing(true)
    try {
      await CommunityService.shareMarketAnalysis(
        'Community Update',
        shareMessage,
        selectedPlatforms
      )
      setShareMessage('')
      setSelectedPlatforms([])
      alert('Message shared successfully!')
    } catch (error) {
      alert('Failed to share message. Please try again.')
    } finally {
      setIsSharing(false)
    }
  }

  const handleShareTrade = async (symbol: string) => {
    const position = state.positions.find(p => p.symbol === symbol)
    if (!position) return

    const alert = {
      symbol: position.symbol,
      action: 'buy' as const,
      price: position.currentPrice,
      quantity: position.quantity,
      strategy: 'Long Position',
      reasoning: `Strong position in ${symbol} with ${position.unrealizedPnLPercent.toFixed(2)}% unrealized P&L`
    }

    try {
      await CommunityService.shareTradingAlert(alert, selectedPlatforms)
      alert('Trade shared to community!')
    } catch (error) {
      alert('Failed to share trade. Please try again.')
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId)
    return platform?.icon || '💬'
  }

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'trade_alert': return 'text-green-600 bg-green-50'
      case 'analysis': return 'text-blue-600 bg-blue-50'
      case 'market_update': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Community Overview */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Trading Community</h2>
              <p className="text-gray-600 mt-2">
                Connect with fellow traders, share insights, and learn together
              </p>
            </div>
            <Globe className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <div className="card-body">
          {communityStats && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{communityStats.totalMembers.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{communityStats.activeToday}</div>
                <div className="text-sm text-gray-500">Active Today</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{communityStats.tradesShared}</div>
                <div className="text-sm text-gray-500">Trades Shared</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{configuredPlatforms.length}</div>
                <div className="text-sm text-gray-500">Platforms</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Platform Connections */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Community Platforms
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{platform.icon}</div>
                    <div>
                      <h4 className="font-medium text-gray-900">{platform.name}</h4>
                      <p className="text-sm text-gray-500">
                        {platform.isConfigured ? 'Connected' : 'Not configured'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {platform.isConfigured && (
                      <div className="text-sm text-gray-500">
                        {communityStats?.platformStats.find(s => s.platform === platform.name)?.members || 0} members
                      </div>
                    )}
                    <button
                      onClick={() => handleJoinPlatform(platform.id)}
                      disabled={!platform.isConfigured}
                      className={`btn ${platform.isConfigured ? 'btn-primary' : 'btn-secondary opacity-50'}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                      {platform.isConfigured ? 'Join' : 'Setup Required'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {configuredPlatforms.length === 0 && (
              <div className="text-center py-8">
                <Settings className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No platforms configured</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure your community platforms in settings to start connecting with other traders.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Community Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </h3>
          </div>
          <div className="card-body">
            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-lg">{getPlatformIcon(message.platform)}</span>
                          <span className="font-medium text-gray-900">{message.author}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMessageTypeColor(message.type)}`}>
                            {message.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{message.content}</p>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeAgo(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Community messages will appear here once platforms are configured.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share to Community */}
      {configuredPlatforms.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Share2 className="h-5 w-5 mr-2" />
              Share with Community
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {/* Platform Selection */}
              <div>
                <label className="form-label">Select Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {configuredPlatforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => handlePlatformToggle(platform.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                        selectedPlatforms.includes(platform.id)
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{platform.icon}</span>
                      <span className="text-sm font-medium">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="form-label">Message</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Share your market insights, trading ideas, or analysis with the community..."
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                />
              </div>

              {/* Share Button */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {selectedPlatforms.length > 0 
                    ? `Sharing to ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''}`
                    : 'Select platforms to share'
                  }
                </div>
                <button
                  onClick={handleShareMessage}
                  disabled={!shareMessage.trim() || selectedPlatforms.length === 0 || isSharing}
                  className="btn btn-primary"
                >
                  <Send className="h-4 w-4" />
                  {isSharing ? 'Sharing...' : 'Share Message'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Share Trades */}
      {state.positions.length > 0 && configuredPlatforms.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Share Your Trades
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {state.positions.slice(0, 6).map((position) => (
                <div key={position.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{position.symbol}</h4>
                    <span className={`text-sm font-medium ${
                      position.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {position.unrealizedPnLPercent >= 0 ? '+' : ''}{position.unrealizedPnLPercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    {position.quantity} shares @ ${position.avgPrice.toFixed(2)}
                  </div>
                  <button
                    onClick={() => handleShareTrade(position.symbol)}
                    className="w-full btn btn-secondary text-sm"
                  >
                    <Share2 className="h-3 w-3" />
                    Share Trade
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Community Guidelines */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Community Guidelines
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">✅ Do's</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Share educational content and analysis</li>
                <li>• Be respectful and constructive</li>
                <li>• Use proper risk disclaimers</li>
                <li>• Help fellow traders learn</li>
                <li>• Share both wins and losses</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">❌ Don'ts</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Give financial advice</li>
                <li>• Spam or self-promote excessively</li>
                <li>• Share insider information</li>
                <li>• Guarantee returns or outcomes</li>
                <li>• Engage in toxic behavior</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> All content shared is for educational purposes only. 
              This is not financial advice. Always do your own research and consult with a financial advisor.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}