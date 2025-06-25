import React, { useState, useEffect } from 'react'
import { 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ArrowRight,
  Info,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Target,
  DollarSign,
  Clock,
  Zap,
  Play
} from 'lucide-react'
import Disclaimer from '../components/Disclaimer'
import { LearningService } from '../services/learningService'
import type { StrategyTemplate } from '../types/learning'
import { useOptionsContext } from '../context/OptionsContext'

export default function OptionsStrategies() {
  const { state } = useOptionsContext()
  const [strategies, setStrategies] = useState<StrategyTemplate[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyTemplate | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterComplexity, setFilterComplexity] = useState<string>('all')
  const [showImplementModal, setShowImplementModal] = useState(false)
  const [implementationDetails, setImplementationDetails] = useState({
    underlyingTicker: 'SPY',
    quantity: 1,
    daysToExpiration: 30
  })

  useEffect(() => {
    loadStrategies()
  }, [])

  const loadStrategies = () => {
    setStrategies(LearningService.getStrategyTemplates())
  }

  const filteredStrategies = strategies.filter(strategy => {
    const matchesType = filterType === 'all' || strategy.type === filterType
    const matchesComplexity = filterComplexity === 'all' || strategy.complexity === filterComplexity
    return matchesType && matchesComplexity
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bullish': return 'text-green-600 bg-green-50 border-green-200'
      case 'bearish': return 'text-red-600 bg-red-50 border-red-200'
      case 'neutral': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'volatility': return 'text-purple-600 bg-purple-50 border-purple-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      case 'neutral': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const handleImplementStrategy = () => {
    // In a real implementation, this would create the actual options orders
    // For now, we'll just close the modal
    setShowImplementModal(false)
    alert(`Strategy ${selectedStrategy?.name} implementation prepared for ${implementationDetails.underlyingTicker}. In a real system, this would create the actual options orders.`)
  }

  return (
    <div className="space-y-6">
      {/* Strategy Disclaimer */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 mb-4 shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Strategy Learning Approach</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                These options strategies are presented as learning tools to help you develop trading expertise. Focus on understanding each strategy's mechanics and appropriate use cases.
              </p>
              <p className="mt-1">
                The goal is to build your strategic thinking skills, not to find a "perfect" strategy. Learning when and how to apply different approaches is key to developing expertise.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <div className="card shadow-md border-blue-200">
        <div className="card-header bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Options Strategy Learning Center</h2>
              <p className="text-gray-600 mt-2">
                Master different trading approaches to develop your strategic expertise
              </p>
            </div>
            <Lightbulb className="h-12 w-12 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card shadow-md border-gray-200">
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Strategy Type</label>
              <select
                className="form-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="bullish">Bullish</option>
                <option value="bearish">Bearish</option>
                <option value="neutral">Neutral</option>
                <option value="volatility">Volatility</option>
              </select>
            </div>
            <div>
              <label className="form-label">Complexity</label>
              <select
                className="form-select"
                value={filterComplexity}
                onChange={(e) => setFilterComplexity(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Strategies */}
      <div className="card shadow-md border-blue-200">
        <div className="card-header bg-gradient-to-r from-blue-50 to-blue-100">
          <h3 className="text-lg font-medium text-gray-900">Strategies to Master</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStrategies.map((strategy) => (
              <div
                key={strategy.id}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${getTypeColor(strategy.type)}`}
                onClick={() => setSelectedStrategy(strategy)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{strategy.name}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getComplexityColor(strategy.complexity)}`}>
                    {strategy.complexity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{strategy.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Learning Difficulty:</span>
                    <div className="font-medium text-blue-600">{strategy.complexity}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Skill Development:</span>
                    <div className="font-medium text-green-600">
                      {strategy.type === 'bullish' ? 'Directional Analysis' : 
                       strategy.type === 'bearish' ? 'Risk Management' :
                       strategy.type === 'neutral' ? 'Patience & Timing' :
                       'Volatility Assessment'}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${
                      strategy.type === 'bullish' ? 'bg-green-500' :
                      strategy.type === 'bearish' ? 'bg-red-500' :
                      strategy.type === 'neutral' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}></span>
                    <span className="text-xs text-gray-500 capitalize">{strategy.type}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStrategy(strategy);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center bg-blue-50 px-3 py-1 rounded-lg"
                  >
                    Learn Strategy
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategy Detail Modal */}
      {selectedStrategy && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedStrategy(null)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedStrategy.name}</h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(selectedStrategy.type)}`}>
                      {selectedStrategy.type}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedStrategy(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Strategy Overview */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      Strategy Overview
                    </h4>
                    <p className="text-gray-600 mb-4">{selectedStrategy.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">Max Risk</div>
                        <div className="font-bold text-red-600">
                          ${selectedStrategy.maxRisk}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">Max Profit</div>
                        <div className="font-bold text-green-600">
                          {selectedStrategy.maxProfit === Infinity ? 'Unlimited' : `$${selectedStrategy.maxProfit}`}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">Breakeven</div>
                        <div className="font-medium">
                          {selectedStrategy.breakeven.map((point, i) => (
                            <span key={i}>
                              {i > 0 && ', '}
                              ${point}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">Complexity</div>
                        <div className={`font-medium capitalize ${
                          selectedStrategy.complexity === 'beginner' ? 'text-green-600' :
                          selectedStrategy.complexity === 'intermediate' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {selectedStrategy.complexity}
                        </div>
                      </div>
                    </div>

                    {/* Strategy Legs */}
                    <h4 className="font-semibold text-gray-900 mb-3">Strategy Legs</h4>
                    <div className="space-y-3 mb-6">
                      {selectedStrategy.legs.map((leg, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className={`font-medium ${leg.action === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                              {leg.action === 'buy' ? 'BUY' : 'SELL'}
                            </span>
                            <span className="mx-2">
                              {leg.quantity} {leg.optionType.toUpperCase()}
                            </span>
                            <span className="text-gray-500">
                              @ ${leg.strike} ({leg.expiration})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Market Conditions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-green-700 mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Best Market Conditions
                        </h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {selectedStrategy.bestMarketConditions.map((condition, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              {condition}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-red-700 mb-2 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Worst Market Conditions
                        </h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {selectedStrategy.worstMarketConditions.map((condition, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-red-500 mr-2">•</span>
                              {condition}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Greek Impacts & Implementation */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Greek Impacts
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">Time Decay (Theta)</div>
                        <div className={`font-medium capitalize ${getImpactColor(selectedStrategy.timeDecay)}`}>
                          {selectedStrategy.timeDecay}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">Volatility (Vega)</div>
                        <div className={`font-medium capitalize ${getImpactColor(selectedStrategy.volatilityImpact)}`}>
                          {selectedStrategy.volatilityImpact}
                        </div>
                      </div>
                    </div>

                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Implementation Guide
                    </h4>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                      <h5 className="font-medium text-blue-900 mb-2">When to Use</h5>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Use in {selectedStrategy.type} market conditions</li>
                        <li>• Best when implied volatility is {selectedStrategy.volatilityImpact === 'positive' ? 'low' : selectedStrategy.volatilityImpact === 'negative' ? 'high' : 'moderate'}</li>
                        <li>• Ideal for {selectedStrategy.complexity} level traders</li>
                        <li>• {selectedStrategy.timeDecay === 'positive' ? 'Benefits from time passing' : selectedStrategy.timeDecay === 'negative' ? 'Loses value as time passes' : 'Minimal time decay impact'}</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
                      <h5 className="font-medium text-yellow-900 mb-2">Risk Management</h5>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        <li>• Maximum risk: ${selectedStrategy.maxRisk} per contract</li>
                        <li>• Set stop loss at 50% of max loss</li>
                        <li>• Take profit at 50% of max profit</li>
                        <li>• Consider closing position if market conditions change</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setShowImplementModal(true)
                      }}
                      className="w-full btn btn-primary"
                    >
                      <Zap className="h-4 w-4" />
                      Implement This Strategy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Implementation Modal */}
      {showImplementModal && selectedStrategy && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowImplementModal(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Implement {selectedStrategy.name}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="form-label">Underlying Ticker</label>
                        <select
                          className="form-select"
                          value={implementationDetails.underlyingTicker}
                          onChange={(e) => setImplementationDetails({...implementationDetails, underlyingTicker: e.target.value})}
                        >
                          <option value="SPY">SPY</option>
                          <option value="QQQ">QQQ</option>
                          <option value="AAPL">AAPL</option>
                          <option value="TSLA">TSLA</option>
                          <option value="NVDA">NVDA</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="form-label">Quantity</label>
                        <input
                          type="number"
                          className="form-input"
                          value={implementationDetails.quantity}
                          onChange={(e) => setImplementationDetails({...implementationDetails, quantity: parseInt(e.target.value)})}
                          min="1"
                        />
                      </div>
                      
                      <div>
                        <label className="form-label">Days to Expiration</label>
                        <select
                          className="form-select"
                          value={implementationDetails.daysToExpiration}
                          onChange={(e) => setImplementationDetails({...implementationDetails, daysToExpiration: parseInt(e.target.value)})}
                        >
                          <option value="7">7 days</option>
                          <option value="14">14 days</option>
                          <option value="30">30 days</option>
                          <option value="45">45 days</option>
                          <option value="60">60 days</option>
                        </select>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                          <Info className="h-4 w-4 mr-2" />
                          Strategy Summary
                        </h4>
                        <div className="space-y-1 text-sm text-blue-800">
                          <p>• {selectedStrategy.name} on {implementationDetails.underlyingTicker}</p>
                          <p>• {implementationDetails.quantity} contract(s)</p>
                          <p>• {implementationDetails.daysToExpiration} days to expiration</p>
                          <p>• Max risk: ${selectedStrategy.maxRisk * implementationDetails.quantity}</p>
                          <p>• Max profit: {selectedStrategy.maxProfit === Infinity ? 'Unlimited' : `$${selectedStrategy.maxProfit * implementationDetails.quantity}`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleImplementStrategy}
                  className="btn btn-primary"
                >
                  <Zap className="h-4 w-4" />
                  Implement Strategy
                </button>
                <button
                  onClick={() => setShowImplementModal(false)}
                  className="btn btn-secondary mr-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}