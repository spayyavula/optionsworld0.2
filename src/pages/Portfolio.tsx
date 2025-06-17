import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useTradingContext } from '../context/TradingContext'
import { format } from 'date-fns'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export default function Portfolio() {
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

  // Calculate portfolio allocation data for pie chart
  const allocationData = state.positions.map((position, index) => ({
    name: position.symbol,
    value: position.totalValue,
    color: COLORS[index % COLORS.length]
  }))

  // Add cash allocation
  if (state.balance > 0) {
    allocationData.push({
      name: 'Cash',
      value: state.balance,
      color: '#6b7280'
    })
  }

  // Calculate performance data for bar chart
  const performanceData = state.positions.map(position => ({
    symbol: position.symbol,
    unrealizedPnL: position.unrealizedPnL,
    unrealizedPnLPercent: position.unrealizedPnLPercent
  }))

  const totalUnrealizedPnL = state.positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0)
  const totalInvested = state.positions.reduce((sum, pos) => sum + (pos.quantity * pos.avgPrice), 0)
  const totalUnrealizedPnLPercent = totalInvested > 0 ? (totalUnrealizedPnL / totalInvested) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
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
                <TrendingUp className={`h-8 w-8 ${totalUnrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Unrealized P&L</p>
                <p className={`text-2xl font-bold ${totalUnrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalUnrealizedPnL)}
                </p>
                <p className={`text-sm ${totalUnrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercent(totalUnrealizedPnLPercent)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Cash Balance</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(state.balance)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Percent className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Invested</p>
                <p className="text-2xl font-bold text-gray-900">
                  {((totalInvested / state.totalValue) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">{formatCurrency(totalInvested)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Portfolio Allocation */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Portfolio Allocation</h3>
          </div>
          <div className="card-body">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Position Performance */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Position Performance</h3>
          </div>
          <div className="card-body">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="symbol" />
                  <YAxis tickFormatter={(value) => `${value.toFixed(0)}%`} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'unrealizedPnL' ? formatCurrency(value) : `${value.toFixed(2)}%`,
                      name === 'unrealizedPnL' ? 'P&L' : 'P&L %'
                    ]}
                  />
                  <Bar 
                    dataKey="unrealizedPnLPercent" 
                    fill={(entry: any) => entry.unrealizedPnLPercent >= 0 ? '#10b981' : '#ef4444'}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Current Positions</h3>
        </div>
        <div className="card-body">
          {state.positions.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No positions</h3>
              <p className="mt-1 text-sm text-gray-500">Start trading to build your portfolio.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Quantity</th>
                    <th>Avg Price</th>
                    <th>Current Price</th>
                    <th>Market Value</th>
                    <th>Unrealized P&L</th>
                    <th>% Change</th>
                    <th>Purchase Date</th>
                  </tr>
                </thead>
                <tbody>
                  {state.positions.map((position) => (
                    <tr key={position.id}>
                      <td>
                        <div>
                          <div className="font-medium text-gray-900">{position.symbol}</div>
                          <div className="text-sm text-gray-500">{position.name}</div>
                        </div>
                      </td>
                      <td className="font-medium">{position.quantity}</td>
                      <td>{formatCurrency(position.avgPrice)}</td>
                      <td>{formatCurrency(position.currentPrice)}</td>
                      <td className="font-medium">{formatCurrency(position.totalValue)}</td>
                      <td className={position.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}>
                        <div className="font-medium">{formatCurrency(position.unrealizedPnL)}</div>
                      </td>
                      <td className={position.unrealizedPnLPercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                        <div className="flex items-center">
                          {position.unrealizedPnLPercent >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {formatPercent(position.unrealizedPnLPercent)}
                        </div>
                      </td>
                      <td className="text-sm text-gray-500">
                        {format(position.purchaseDate, 'MMM dd, yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}