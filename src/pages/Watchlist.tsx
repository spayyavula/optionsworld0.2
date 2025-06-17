import React, { useState } from 'react'
import { Plus, Trash2, TrendingUp, TrendingDown, Search, Eye } from 'lucide-react'
import { useTradingContext } from '../context/TradingContext'
import { format } from 'date-fns'

export default function Watchlist() {
  const { state, dispatch } = useTradingContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`
  }

  const handleAddToWatchlist = (stock: any) => {
    const isAlreadyInWatchlist = state.watchlist.some(item => item.symbol === stock.symbol)
    if (isAlreadyInWatchlist) {
      alert('Stock is already in your watchlist')
      return
    }

    dispatch({ type: 'ADD_TO_WATCHLIST', payload: stock })
    setShowAddModal(false)
    setSearchTerm('')
  }

  const handleRemoveFromWatchlist = (itemId: string) => {
    if (window.confirm('Remove this stock from your watchlist?')) {
      dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: itemId })
    }
  }

  const filteredStocks = state.stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const watchlistStats = {
    total: state.watchlist.length,
    gainers: state.watchlist.filter(item => item.changePercent > 0).length,
    losers: state.watchlist.filter(item => item.changePercent < 0).length,
    avgChange: state.watchlist.length > 0 
      ? state.watchlist.reduce((sum, item) => sum + item.changePercent, 0) / state.watchlist.length
      : 0
  }

  return (
    <div className="space-y-6">
      {/* Watchlist Statistics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Watched</p>
                <p className="text-2xl font-bold text-gray-900">{watchlistStats.total}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Gainers</p>
                <p className="text-2xl font-bold text-gray-900">{watchlistStats.gainers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Losers</p>
                <p className="text-2xl font-bold text-gray-900">{watchlistStats.losers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className={`h-8 w-8 ${watchlistStats.avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Change</p>
                <p className={`text-2xl font-bold ${watchlistStats.avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercent(watchlistStats.avgChange)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist Table */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">My Watchlist</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4" />
              Add Stock
            </button>
          </div>
        </div>
        <div className="card-body">
          {state.watchlist.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No stocks in watchlist</h3>
              <p className="mt-1 text-sm text-gray-500">Add stocks to track their performance.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 btn btn-primary"
              >
                <Plus className="h-4 w-4" />
                Add Your First Stock
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>Change</th>
                    <th>% Change</th>
                    <th>Added Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.watchlist.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div>
                          <div className="font-medium text-gray-900">{item.symbol}</div>
                          <div className="text-sm text-gray-500">{item.name}</div>
                        </div>
                      </td>
                      <td className="font-medium">{formatCurrency(item.price)}</td>
                      <td className={item.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                        <div className="flex items-center">
                          {item.change >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {formatCurrency(Math.abs(item.change))}
                        </div>
                      </td>
                      <td className={item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatPercent(item.changePercent)}
                      </td>
                      <td className="text-sm text-gray-500">
                        {format(item.addedDate, 'MMM dd, yyyy')}
                      </td>
                      <td>
                        <button
                          onClick={() => handleRemoveFromWatchlist(item.id)}
                          className="btn btn-secondary text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddModal(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Add Stock to Watchlist
                    </h3>
                    
                    <div className="mb-4">
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

                    <div className="max-h-60 overflow-y-auto">
                      {filteredStocks.map((stock) => {
                        const isInWatchlist = state.watchlist.some(item => item.symbol === stock.symbol)
                        return (
                          <div
                            key={stock.symbol}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                          >
                            <div>
                              <div className="font-medium text-gray-900">{stock.symbol}</div>
                              <div className="text-sm text-gray-500">{stock.name}</div>
                              <div className="text-sm font-medium">{formatCurrency(stock.price)}</div>
                            </div>
                            <button
                              onClick={() => handleAddToWatchlist(stock)}
                              disabled={isInWatchlist}
                              className={`btn ${isInWatchlist ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-primary'}`}
                            >
                              {isInWatchlist ? 'Added' : 'Add'}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}