import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, ArrowUpRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTradingContext } from '../context/TradingContext'
import { format } from 'date-fns'

// Mock data for portfolio performance chart
const portfolioData = [
  { date: '2024-01-01', value: 100000 },
  { date: '2024-01-02', value: 101200 },
  { date: '2024-01-03', value: 99800 },
  { date: '2024-01-04', value: 102500 },
  { date: '2024-01-05', value: 104300 },
  { date: '2024-01-06', value: 103900 },
  { date: '2024-01-07', value: 105600 },
]

export default function Dashboard() {
  const { state } = useTradingContext()

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

      {/* Portfolio Performance Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Portfolio Performance</h3>
        </div>
        <div className="card-body">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Portfolio Value']}
                  labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
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
            <Link to="/watchlist" className="btn btn-secondary">
              <Activity className="h-4 w-4" />
              Manage Watchlist
            </Link>
            <Link to="/analytics" className="btn btn-secondary">
              <TrendingUp className="h-4 w-4" />
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}