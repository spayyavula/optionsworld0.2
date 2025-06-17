import React, { useState } from 'react'
import { Search, TrendingUp, TrendingDown, Plus, Minus } from 'lucide-react'
import { useTradingContext } from '../context/TradingContext'

export default function Trading() {
  const { state, dispatch } = useTradingContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market')
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [quantity, setQuantity] = useState('')
  const [limitPrice, setLimitPrice] = useState('')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`
  }

  const filteredStocks = state.stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedStockData = state.stocks.find(stock => stock.symbol === selectedStock)
  const existingPosition = state.positions.find(pos => pos.symbol === selectedStock)

  const handlePlaceOrder = () => {
    if (!selectedStock || !quantity || parseInt(quantity) <= 0) return

    const stock = state.stocks.find(s => s.symbol === selectedStock)
    if (!stock) return

    const orderQuantity = parseInt(quantity)
    const price = orderType === 'market' ? stock.price : parseFloat(limitPrice)

    // Validation
    if (tradeType === 'buy') {
      const totalCost = orderQuantity * (orderType === 'market' ? stock.price : parseFloat(limitPrice))
      if (totalCost > state.buyingPower) {
        alert('Insufficient buying power')
        return
      }
    } else {
      if (!existingPosition || existingPosition.quantity < orderQuantity) {
        alert('Insufficient shares to sell')
        return
      }
    }

    if (orderType !== 'market' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      alert('Please enter a valid limit price')
      return
    }

    dispatch({
      type: 'PLACE_ORDER',
      payload: {
        symbol: selectedStock,
        type: tradeType,
        orderType,
        quantity: orderQuantity,
        price: orderType === 'market' ? undefined : parseFloat(limitPrice),
        status: 'pending'
      }
    })

    // Reset form
    setQuantity('')
    setLimitPrice('')
    alert(`${tradeType.toUpperCase()} order placed for ${orderQuantity} shares of ${selectedStock}`)
  }

  const estimatedCost = selectedStockData && quantity 
    ? parseInt(quantity) * (orderType === 'market' ? selectedStockData.price : parseFloat(limitPrice) || 0)
    : 0

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Stock List */}
      <div className="lg:col-span-2">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Available Stocks</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search stocks..."
                  className="form-input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>Change</th>
                    <th>% Change</th>
                    <th>Volume</th>
                    <th>Market Cap</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.map((stock) => (
                    <tr 
                      key={stock.symbol}
                      className={selectedStock === stock.symbol ? 'bg-blue-50' : ''}
                    >
                      <td>
                        <div>
                          <div className="font-medium text-gray-900">{stock.symbol}</div>
                          <div className="text-sm text-gray-500">{stock.name}</div>
                        </div>
                      </td>
                      <td className="font-medium">{formatCurrency(stock.price)}</td>
                      <td className={stock.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                        <div className="flex items-center">
                          {stock.change >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {formatCurrency(Math.abs(stock.change))}
                        </div>
                      </td>
                      <td className={stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatPercent(stock.changePercent)}
                      </td>
                      <td className="text-sm text-gray-500">
                        {(stock.volume / 1000000).toFixed(1)}M
                      </td>
                      <td className="text-sm text-gray-500">
                        ${(stock.marketCap / 1000000000).toFixed(1)}B
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedStock(stock.symbol)}
                          className={`btn ${selectedStock === stock.symbol ? 'btn-primary' : 'btn-secondary'}`}
                        >
                          {selectedStock === stock.symbol ? 'Selected' : 'Select'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Panel */}
      <div className="space-y-6">
        {/* Order Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Place Order</h3>
          </div>
          <div className="card-body">
            {!selectedStock ? (
              <p className="text-gray-500 text-center py-4">Select a stock to start trading</p>
            ) : (
              <div className="space-y-4">
                {/* Selected Stock Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedStock}</h4>
                      <p className="text-sm text-gray-500">{selectedStockData?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(selectedStockData?.price || 0)}</p>
                      <p className={`text-sm ${(selectedStockData?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercent(selectedStockData?.changePercent || 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trade Type */}
                <div className="form-group">
                  <label className="form-label">Trade Type</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setTradeType('buy')}
                      className={`flex-1 btn ${tradeType === 'buy' ? 'btn-success' : 'btn-secondary'}`}
                    >
                      <Plus className="h-4 w-4" />
                      Buy
                    </button>
                    <button
                      onClick={() => setTradeType('sell')}
                      className={`flex-1 btn ${tradeType === 'sell' ? 'btn-danger' : 'btn-secondary'}`}
                      disabled={!existingPosition}
                    >
                      <Minus className="h-4 w-4" />
                      Sell
                    </button>
                  </div>
                </div>

                {/* Order Type */}
                <div className="form-group">
                  <label className="form-label">Order Type</label>
                  <select
                    className="form-select"
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as 'market' | 'limit' | 'stop')}
                  >
                    <option value="market">Market Order</option>
                    <option value="limit">Limit Order</option>
                    <option value="stop">Stop Order</option>
                  </select>
                </div>

                {/* Quantity */}
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Number of shares"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                  />
                  {existingPosition && tradeType === 'sell' && (
                    <p className="text-sm text-gray-500 mt-1">
                      Available: {existingPosition.quantity} shares
                    </p>
                  )}
                </div>

                {/* Limit Price */}
                {orderType !== 'market' && (
                  <div className="form-group">
                    <label className="form-label">
                      {orderType === 'limit' ? 'Limit Price' : 'Stop Price'}
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Price per share"
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(e.target.value)}
                      step="0.01"
                      min="0.01"
                    />
                  </div>
                )}

                {/* Order Summary */}
                {quantity && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Shares:</span>
                        <span>{quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span>
                          {orderType === 'market' 
                            ? `${formatCurrency(selectedStockData?.price || 0)} (Market)`
                            : formatCurrency(parseFloat(limitPrice) || 0)
                          }
                        </span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Estimated {tradeType === 'buy' ? 'Cost' : 'Proceeds'}:</span>
                        <span>{formatCurrency(estimatedCost)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={!quantity || parseInt(quantity) <= 0 || (orderType !== 'market' && !limitPrice)}
                  className={`w-full btn ${tradeType === 'buy' ? 'btn-success' : 'btn-danger'}`}
                >
                  Place {tradeType.toUpperCase()} Order
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Account Info</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Buying Power:</span>
                <span className="font-medium">{formatCurrency(state.buyingPower)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cash Balance:</span>
                <span className="font-medium">{formatCurrency(state.balance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Value:</span>
                <span className="font-medium">{formatCurrency(state.totalValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Positions:</span>
                <span className="font-medium">{state.positions.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Position */}
        {selectedStock && existingPosition && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Current Position</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Shares Owned:</span>
                  <span className="font-medium">{existingPosition.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Avg Price:</span>
                  <span className="font-medium">{formatCurrency(existingPosition.avgPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Market Value:</span>
                  <span className="font-medium">{formatCurrency(existingPosition.totalValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Unrealized P&L:</span>
                  <span className={`font-medium ${existingPosition.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(existingPosition.unrealizedPnL)} ({formatPercent(existingPosition.unrealizedPnLPercent)})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}