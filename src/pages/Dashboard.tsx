import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Bot, DollarSign, PieChart, Activity, ArrowUpRight, Users, BookOpen, BookMarked, Lightbulb } from 'lucide-react'
import { useTradingContext } from '../context/TradingContext'
import { CommunityService } from '../services/communityService'
import StockChartsWidget from '../components/StockChartsWidget'
import TradingViewDirectWidget from '../components/TradingViewDirectWidget'
import PageViewCounter from './PageViewCounter'
import YahooFinanceTicker from '../components/YahooFinanceTicker'
import TradingViewDirectTicker from '../components/TradingViewDirectTicker'
import { format } from 'date-fns'

// Ticker symbols
const tickerSymbols = [
  'AAPL',
  'GOOGL',
  'MSFT',
  'TSLA',
  'AMZN',
  'SPY', // SPY is on AMEX (NYSE), not NASDAQ
  'QQQ',
  'NVDA'
]

export default function Dashboard() {
  const { state } = useTradingContext()
  const communityStats = CommunityService.getCommunityStats()
  const recentMessages = CommunityService.getRecentMessages().slice(0, 3)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`
  }

  const topGainers = state.stocks
    .filter(stock => stock.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 3)

  const topLosers = state.stocks
    .filter(stock => stock.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 3)

  const recentOrders = state.orders
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(state.totalValue)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className={`h-8 w-8 ${state.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Day Change</p>
                <p className={`text-2xl font-bold ${state.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(state.dayChange)}
                </p>
                <p className={`text-sm ${state.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercent(state.dayChangePercent)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PieChart className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Buying Power</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(state.buyingPower)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Positions</p>
                <p className="text-2xl font-bold text-gray-900">{state.positions.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Ticker */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Market Overview</h3>
        </div>
        <div className="card-body">
          <TradingViewDirectTicker 
            symbols={tickerSymbols}
            width="100%"
            height={60}
            darkMode={false}
          />
        </div>
      </div>

      {/* Portfolio Performance Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Market Overview</h3>
        </div>
        <div className="card-body">
          <StockChartsWidget
            symbol="SPY"
            width="100%"
            height={400}
            timeframe="D"
            theme="light"
            showToolbar={true}
            showDrawings={true}
            showIndicators={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Market Movers */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Market Movers</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Top Gainers</h4>
                <div className="space-y-2">
                  {topGainers.map((stock) => (
                    <div key={stock.symbol} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{stock.symbol}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(stock.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-600 font-medium">
                          {formatPercent(stock.changePercent)}
                        </p>
                        <p className="text-sm text-green-600">
                          +{formatCurrency(stock.change)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Top Losers</h4>
                <div className="space-y-2">
                  {topLosers.map((stock) => (
                    <div key={stock.symbol} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{stock.symbol}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(stock.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-600 font-medium">
                          {formatPercent(stock.changePercent)}
                        </p>
                        <p className="text-sm text-red-600">
                          {formatCurrency(stock.change)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            <Link to="/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              View all
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="card-body">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.type.toUpperCase()} {order.symbol}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.quantity} shares • {format(order.timestamp, 'MMM dd, HH:mm')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'filled' 
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'cancelled'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/trading" className="btn btn-primary">
              <TrendingUp className="h-4 w-4" />
              Start Trading
            </Link>
            <Link to="/portfolio" className="btn btn-secondary">
              <PieChart className="h-4 w-4" />
              View Portfolio
            </Link>
            <Link to="/learning" className="btn btn-secondary">
              <BookOpen className="h-4 w-4" />
              Start Learning
            </Link>
            <Link to="/journal" className="btn btn-secondary">
              <BookMarked className="h-4 w-4" />
              Trading Journal
            </Link>
            <Link to="/agent" className="btn btn-secondary">
              <Bot className="h-4 w-4" />
              Agent API
            </Link>
          </div>
        </div>
      </div>
      
      {/* Learning Resources */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Learning Resources
          </h3>
          <Link to="/learning" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
            View all
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link to="/learning" className="p-4 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="flex items-center space-x-3 mb-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Options Fundamentals</h4>
              </div>
              <p className="text-sm text-blue-700">Learn the basics of options trading with our structured courses.</p>
            </Link>
            
            <Link to="/strategies" className="p-4 border border-green-200 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="flex items-center space-x-3 mb-2">
                <Lightbulb className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-900">Strategy Library</h4>
              </div>
              <p className="text-sm text-green-700">Explore and implement proven options trading strategies.</p>
            </Link>
            
            <Link to="/journal" className="p-4 border border-purple-200 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="flex items-center space-x-3 mb-2">
                <BookMarked className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium text-purple-900">Trading Journal</h4>
              </div>
              <p className="text-sm text-purple-700">Document and analyze your trades to improve performance.</p>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Community Preview */}
      {CommunityService.hasConfiguredPlatforms() && (
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Community Activity
            </h3>
            <Link to="/community" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              View all
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{communityStats.totalMembers.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{communityStats.activeToday}</div>
                <div className="text-sm text-gray-500">Active Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{communityStats.tradesShared}</div>
                <div className="text-sm text-gray-500">Trades Shared</div>
              </div>
            </div>
            
            {recentMessages.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Recent Messages</h4>
                {recentMessages.map((message) => (
                  <div key={message.id} className="border-l-4 border-blue-500 pl-3 py-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{message.author}</span>
                      <span className="text-xs text-gray-500">
                        {format(message.timestamp, 'HH:mm')}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{message.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Page View Counter */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Site Statistics</h3>
        </div>
        <div className="card-body">
          <PageViewCounter />
        </div>
      </div>
    </div>
  )
}