import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  CheckCircle, 
  CreditCard, 
  Calendar, 
  Shield, 
  Tag, 
  AlertTriangle,
  ArrowLeft
} from 'lucide-react'
import StripeCheckout from '../components/StripeCheckout'
import DealsSection from '../components/DealsSection'
import { StripeService } from '../services/stripeService'
import { CouponService } from '../services/couponService'

export default function SubscriptionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')
  const [showDeals, setShowDeals] = useState(false)
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<any>(null)
  
  useEffect(() => {
    // Check for subscription success in URL
    const urlParams = new URLSearchParams(location.search)
    if (urlParams.get('subscription') === 'success') {
      setSubscriptionSuccess(true)
      // Remove the query parameters from the URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    
    // Check if there are active deals
    setShowDeals(CouponService.hasActiveDeals())
  }, [location])
  
  const handleSelectDeal = (deal: any) => {
    setSelectedDeal(deal)
    setSelectedPlan(deal.plan)
  }
  
  const handleClaimDeal = async (deal: any) => {
    try {
      // Redirect to checkout with the deal's coupon code
      const { url } = await StripeService.createCheckoutSession(
        deal.plan, 
        deal.couponCode
      )
      window.location.href = url
    } catch (error) {
      console.error('Failed to claim deal:', error)
      alert('Failed to process deal. Please try again.')
    }
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
        </div>
        
        {subscriptionSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="block sm:inline font-medium">Success!</span>
            </div>
            <span className="block sm:inline ml-7">Thank you for subscribing to Options World! Your account has been activated.</span>
          </div>
        )}
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Subscription Plan</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get full access to all features and take your trading skills to the next level
          </p>
        </div>
        
        {/* Plan Selection Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setSelectedPlan('monthly')}
              className={`relative inline-flex items-center px-4 py-2 rounded-l-md border ${
                selectedPlan === 'monthly'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('yearly')}
              className={`relative inline-flex items-center px-4 py-2 rounded-r-md border ${
                selectedPlan === 'yearly'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Yearly (Save 20%)
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <StripeCheckout 
              plan={selectedPlan}
              onSuccess={() => setSubscriptionSuccess(true)}
            />
          </div>
          
          {/* Plan Features */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {selectedPlan === 'monthly' ? 'Monthly Plan' : 'Annual Plan'} Features
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">Full Trading Platform Access</h4>
                  <p className="text-sm text-gray-600">
                    Access all trading features, including options trading, portfolio management, and advanced analytics
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">Real-time Market Data</h4>
                  <p className="text-sm text-gray-600">
                    Get real-time market data and quotes for stocks and options
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">Advanced Analytics</h4>
                  <p className="text-sm text-gray-600">
                    Access detailed performance analytics, risk metrics, and portfolio insights
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">Community Integration</h4>
                  <p className="text-sm text-gray-600">
                    Share trades and insights with the community across multiple platforms
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">Learning Resources</h4>
                  <p className="text-sm text-gray-600">
                    Access premium educational content and strategy guides
                  </p>
                </div>
              </div>
              
              {selectedPlan === 'yearly' && (
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Priority Support</h4>
                    <p className="text-sm text-gray-600">
                      Get priority support and personalized assistance
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800">Satisfaction Guarantee</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Not satisfied? Contact us within 14 days for a full refund, no questions asked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Special Deals Section */}
        {showDeals && (
          <div className="mt-12">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Tag className="h-6 w-6 text-red-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Special Offers
                </h2>
              </div>
              <p className="text-lg text-gray-600">
                Limited time deals to help you save on your subscription
              </p>
            </div>
            
            <DealsSection 
              onSelectDeal={handleSelectDeal}
              onClaimDeal={handleClaimDeal}
              selectedPlan={selectedPlan}
              className="max-w-4xl mx-auto"
            />
          </div>
        )}
        
        {/* Disclaimer */}
        <div className="mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-4xl mx-auto">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-800">Important Information</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Options World is for educational purposes only. Our platform is designed to help you learn and develop trading skills, not to provide financial advice. Options trading involves significant risk and requires proper education.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}