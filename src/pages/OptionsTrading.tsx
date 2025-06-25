import React, { useState, useEffect } from 'react'
import { Search, TrendingUp, TrendingDown, Plus, Minus, Calculator, Share2, AlertTriangle, Shield } from 'lucide-react'
import { useOptionsContext } from '../context/OptionsContext'
import { PolygonService } from '../services/polygonService'
import { CommunityService } from '../services/communityService'
import TradingViewWidget from '../components/TradingViewWidget' 
import Disclaimer from '../components/Disclaimer'
import type { OptionsContract } from '../types/options'

export default function OptionsTrading() {
  const { state, dispatch } = useOptionsContext()
  const [contracts, setContracts] = useState<OptionsContract[]>([])
  const [selectedContract, setSelectedContract] = useState<string | null>(null)
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market')
  const [tradeType, setTradeType] = useState<'buy_to_open' | 'sell_to_close'>('buy_to_open')
  const [quantity, setQuantity] = useState('')
  const [limitPrice, setLimitPrice] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOptionsContracts()
  }, [])

  const loadOptionsContracts = async () => {
    try {
      setLoading(true)
      const topContracts = PolygonService.getTopLiquidOptions()
      setContracts(topContracts)
    } catch (error) {
      console.error('Failed to load options contracts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${(percent * 100).toFixed(2)}%`
  }

  const selectedContractData = contracts.find(contract => contract.ticker === selectedContract)
  const existingPosition = state.positions.find(pos => pos.contractTicker === selectedContract)

  const handlePlaceOrder = () => {
    if (!selectedContract || !quantity || parseInt(quantity) <= 0) return

    const contract = contracts.find(c => c.ticker === selectedContract)
    if (!contract) return

    const orderQuantity = parseInt(quantity)
    const price = orderType === 'market' ? contract.last : parseFloat(limitPrice)
    const totalCost = orderQuantity * price * 100 // Options are per 100 shares

    // Validation
    if (tradeType === 'buy_to_open') {
      if (totalCost > state.buyingPower) {
        alert('Insufficient buying power')
        return
      }
    } else {
      if (!existingPosition || existingPosition.quantity < orderQuantity) {
        alert('Insufficient contracts to sell')
        return
      }
    }

    if (orderType !== 'market' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      alert('Please enter a valid limit price')
      return
    }

    dispatch({
      type: 'PLACE_OPTIONS_ORDER',
      payload: {
        contractTicker: selectedContract,
        underlyingTicker: contract.underlying_ticker,
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
    alert(`${tradeType.replace('_', ' ').toUpperCase()} order placed for ${orderQuantity} contracts of ${selectedContract}`)
    
    // Offer to share trade with community
    if (CommunityService.hasConfiguredPlatforms()) {
      const shouldShare = confirm('Would you like to share this trade with the community?')
      if (shouldShare) {
        handleShareTrade(contract, orderQuantity, price, tradeType)
      }
    }
  }
  
  const handleShareTrade = async (
    contract: OptionsContract, 
    quantity: number, 
    price: number, 
    type: string
  ) => {
    const alert = {
      symbol: contract.underlying_ticker,
      action: type.includes('buy') ? 'buy' as const : 'sell' as const,
      price,
      quantity,
      strategy: `${contract.contract_type.toUpperCase()} ${contract.strike_price} ${contract.expiration_date}`,
      reasoning: `Options trade: ${type.replace('_', ' ')} ${quantity} contracts of ${contract.ticker} at $${price.toFixed(2)}`
    }
    
    try {
      await CommunityService.shareTradingAlert(alert)
    } catch (error) {
      console.error('Failed to share trade:', error)
    }
  }

  const estimatedCost = selectedContractData && quantity 
    ? parseInt(quantity) * (orderType === 'market' ? selectedContractData.last : parseFloat(limitPrice) || 0) * 100
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading options contracts...</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3"> 
      {/* Trading Disclaimer */}
      <div className="lg:col-span-3">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important Risk Disclaimer</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Options trading involves substantial risk and is not suitable for all investors. The valuation of options may fluctuate, and as a result, you may lose more than your original investment.
                </p>
                <p className="mt-1">
                  This platform is for educational purposes only. Past performance is not indicative of future results. Consider your investment objectives before trading.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Options Contracts List */}
      <div className="lg:col-span-2"> 
        <div className="card shadow-md border-blue-200">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Top Liquid Options Contracts</h3>
              <div className="text-sm text-gray-500">
                Real-time options data
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Contract</th>
                    <th>Underlying</th>
                    <th>Strike</th>
                    <th>Expiry</th>
                    <th>Bid/Ask</th>
                    <th>Last</th>
                    <th>IV</th>
                    <th>Delta</th>
                    <th>Volume</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => (
                    <tr 
                      key={contract.ticker} 
                      className={selectedContract === contract.ticker ? 'bg-blue-50' : ''}
                    >
                      <td>
                        <div>
                          <div className="font-medium text-gray-900">{contract.ticker}</div>
                          <div className="text-sm text-gray-500 capitalize">{contract.contract_type}</div>
                        </div>
                      </td>
                      <td className="font-medium text-blue-700">{contract.underlying_ticker}</td>
                      <td>{formatCurrency(contract.strike_price)}</td>
                      <td className="text-sm text-gray-500">{contract.expiration_date}</td>
                      <td>
                        <div className="text-sm">
                          <div>{formatCurrency(contract.bid)} / {formatCurrency(contract.ask)}</div>
                        </div>
                      </td>
                      <td className="font-medium">{formatCurrency(contract.last)}</td>
                      <td>{formatPercent(contract.implied_volatility)}</td>
                      <td className={`font-mono ${contract.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {contract.delta.toFixed(3)}
                      </td>
                      <td className="text-sm text-gray-500">
                        {(contract.volume / 1000).toFixed(1)}K
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedContract(contract.ticker)} 
                          className={`btn ${selectedContract === contract.ticker ? 'btn-primary' : 'btn-secondary'}`}
                        >
                          {selectedContract === contract.ticker ? 'Selected' : 'Select'}
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
        {/* Order Form with enhanced styling */}
        <div className="card shadow-md border-blue-200">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Place Options Order</h3>
          </div>
          <div className="card-body">
            {!selectedContract ? (
              <p className="text-gray-500 text-center py-4">Select an options contract to start trading</p>
            ) : (
              <div className="space-y-4">
                {/* Selected Contract Info */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 text-lg">{selectedContract}</h4>
                      <p className="text-sm text-gray-500">
                        {selectedContractData?.underlying_ticker} ${selectedContractData?.strike_price} {selectedContractData?.contract_type?.toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">Exp: {selectedContractData?.expiration_date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(selectedContractData?.last || 0)}</p>
                      <p className="text-sm text-gray-500">
                        IV: {formatPercent(selectedContractData?.implied_volatility || 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Greeks Display */}
                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delta:</span>
                    <span className="font-medium">{selectedContractData?.delta.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gamma:</span>
                    <span className="font-medium">{selectedContractData?.gamma.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Theta:</span>
                    <span className="font-medium">{selectedContractData?.theta.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vega:</span>
                    <span className="font-medium">{selectedContractData?.vega.toFixed(3)}</span>
                  </div>
                </div>

                {/* Trade Type */}
                <div className="form-group">
                  <label className="form-label">Trade Type</label>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setTradeType('buy_to_open')}
                      className={`flex-1 btn ${tradeType === 'buy_to_open' ? 'btn-success' : 'btn-secondary'}`}
                    >
                      <Plus className="h-4 w-4" />
                      Buy to Open
                    </button>
                    <button
                      onClick={() => setTradeType('sell_to_close')} 
                      className={`flex-1 btn ${tradeType === 'sell_to_close' ? 'btn-danger' : 'btn-secondary'}`}
                      disabled={!existingPosition}
                    >
                      <Minus className="h-4 w-4" />
                      Sell to Close
                    </button>
                  </div>
                </div>

                {/* Order Type */}
                <div className="form-group">
                  <label className="form-label">Order Type</label>
                  <select
                    className="form-select"
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as 'market' | 'limit')}
                  >
                    <option value="market">Market Order</option>
                    <option value="limit">Limit Order</option>
                  </select>
                </div>

                {/* Quantity */}
                <div className="form-group">
                  <label className="form-label">Contracts</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Number of contracts"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200 shadow-sm">
                    <h4 className="font-medium text-blue-800 mb-2 text-sm">Learning Opportunity</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Position adjustment is one of the most valuable skills to develop as a trader. Each adjustment technique has different risk/reward tradeoffs:
                      <ul className="mt-2 space-y-1 ml-4">
                        <li>• <span className="font-medium">Rolling Out:</span> Gives your thesis more time but costs additional premium</li>
                        <li>• <span className="font-medium">Adjusting Strikes:</span> Changes your breakeven point and risk exposure</li>
                        <li>• <span className="font-medium">Creating Spreads:</span> Reduces both risk and potential profit</li>
                        <li>• <span className="font-medium">Adding Hedges:</span> Provides protection at the cost of additional capital</li>
                      </ul>
                    </p>
                  )}
                </div>

                {/* Limit Price */}
                {orderType !== 'market' && (
                  <div className="form-group">
                    <label className="form-label">Limit Price</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Price per contract"
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(e.target.value)}
                      step="0.01"
                      min="0.01"
                    />
                  </div>
                )}

                {/* Order Summary */}
                {quantity && (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Calculator className="h-4 w-4 mr-2" />
                      Order Summary
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Contracts:</span>
                        <span>{quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price per Contract:</span>
                        <span>
                          {orderType === 'market' 
                            ? `${formatCurrency(selectedContractData?.last || 0)} (Market)`
                            : formatCurrency(parseFloat(limitPrice) || 0)
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Multiplier:</span>
                        <span>100 shares</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total {tradeType === 'buy_to_open' ? 'Cost' : 'Proceeds'}:</span>
                        <span>{formatCurrency(estimatedCost)}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Risk Management Options */}
                {quantity && (
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200 mb-4">
                    <h4 className="font-medium text-yellow-800 mb-3 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Risk Management Options
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="use-stop-loss" 
                          className="h-4 w-4 text-blue-600 rounded mr-2" 
                        />
                        <label htmlFor="use-stop-loss" className="text-gray-700">
                          Set stop loss at 50% of max loss
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="use-take-profit" 
                          className="h-4 w-4 text-blue-600 rounded mr-2" 
                        />
                        <label htmlFor="use-take-profit" className="text-gray-700">
                          Set take profit at 50% of max gain
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="use-spread" 
                          className="h-4 w-4 text-blue-600 rounded mr-2" 
                        />
                        <label htmlFor="use-spread" className="text-gray-700">
                          Convert to spread to reduce risk
                        </label>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-yellow-700 bg-white p-2 rounded-md border border-yellow-100">
                      <p className="font-medium">Learning Note:</p>
                      <p>Risk management is a critical skill for successful trading. These options help you practice defensive position management techniques.</p>
                    </div>
                  </div>
                )}

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={!quantity || parseInt(quantity) <= 0 || (orderType !== 'market' && !limitPrice)} 
                  className={`w-full btn ${tradeType === 'buy_to_open' ? 'btn-success' : 'btn-danger'}`}
                >
                  Place {tradeType.replace('_', ' ').toUpperCase()} Order
                </button>
                
                {CommunityService.hasConfiguredPlatforms() && (
                  <div className="text-xs text-gray-500 text-center mt-2">
                    <Share2 className="h-3 w-3 inline mr-1" />
                    Share trades with community after placing orders
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Risk Adjustment Panel for Existing Positions */}
        {selectedContract && existingPosition && (
          <div className="card shadow-md border-yellow-200 mb-6">
            <div className="card-header bg-gradient-to-r from-yellow-50 to-yellow-100">
              <h3 className="text-lg font-medium text-gray-900">Position Risk Adjustment</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Adjust your existing position to manage risk and potentially improve outcomes.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                    <h4 className="font-medium text-gray-900 mb-1">Roll Out (Extend Time)</h4>
                    <p className="text-xs text-gray-500 mb-2">Move to a later expiration date to give your position more time.</p>
                    <button className="w-full btn btn-secondary text-xs py-1">Roll Position Out</button>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                    <h4 className="font-medium text-gray-900 mb-1">Roll Up/Down (Adjust Strike)</h4>
                    <p className="text-xs text-gray-500 mb-2">Change the strike price to adjust risk/reward profile.</p>
                    <button className="w-full btn btn-secondary text-xs py-1">Adjust Strike Price</button>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                    <h4 className="font-medium text-gray-900 mb-1">Convert to Spread</h4>
                    <p className="text-xs text-gray-500 mb-2">Add an opposing leg to create a spread and define risk.</p>
                    <button className="w-full btn btn-secondary text-xs py-1">Create Spread</button>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                    <h4 className="font-medium text-gray-900 mb-1">Add Hedge</h4>
                    <p className="text-xs text-gray-500 mb-2">Add a complementary position to offset some risk.</p>
                    <button className="w-full btn btn-secondary text-xs py-1">Add Hedge</button>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-1 text-sm">Learning Note</h4>
                  <p className="text-xs text-blue-700">
                    Learning to adjust existing positions is a key skill for managing risk and improving trading outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account Info */}
        <div className="card shadow-md border-blue-200">
          <div className="card-header bg-gradient-to-r from-gray-50 to-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Account Info</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Buying Power:</span>
                <span className="font-medium">{formatCurrency(state.buyingPower)}</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                <span className="text-gray-500">Cash Balance:</span>
                <span className="font-medium">{formatCurrency(state.balance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Value:</span>
                <span className="font-medium">{formatCurrency(state.totalValue)}</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                <span className="text-gray-500">Options Positions:</span>
                <span className="font-medium">{state.positions.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Position */}
        {selectedContract && existingPosition && (
          <div className="card shadow-md border-green-200">
            <div className="card-header bg-gradient-to-r from-green-50 to-green-100">
              <h3 className="text-lg font-medium text-gray-900">Current Position</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Contracts Owned:</span>
                  <span className="font-medium">{existingPosition.quantity}</span>
                </div>
                <div className="flex justify-between bg-gray-50 p-2 rounded-md">
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
                    {formatCurrency(existingPosition.unrealizedPnL)} 
                    <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-gray-100">
                      {formatPercent(existingPosition.unrealizedPnLPercent / 100)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Underlying Chart */}
        {selectedContract && selectedContractData && (
          <div className="card shadow-md border-blue-200 mb-6">
            <div className="card-header bg-gradient-to-r from-blue-50 to-blue-100">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedContractData.underlying_ticker} Chart 
                <a 
                  href={`https://www.tradingview.com/chart/?symbol=${selectedContractData.underlying_ticker}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-blue-600 hover:underline ml-2"
                > 
                  Open in TradingView
                </a>
              </h3>
            </div>
            <div className="card-body">
              <TradingViewWidget
                symbol={`NASDAQ:${selectedContractData.underlying_ticker}`}
                width="100%"
                height={300}
                interval="D"
                theme="light"
                studies={["RSI", "Volume"]}
                style="area"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}