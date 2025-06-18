import React, { useState } from 'react'
import { 
  TrendingUp, 
  BookOpen, 
  Users, 
  Shield, 
  CheckCircle, 
  Star,
  Play,
  ArrowRight,
  DollarSign,
  BarChart3,
  Target,
  Award,
  Coffee,
  Mail,
  CreditCard,
  Tag
} from 'lucide-react'
import { ConstantContactService } from '../services/constantContactService'
import { StripeService } from '../services/stripeService'
import { BuyMeCoffeeService } from '../services/buyMeCoffeeService'
import { CouponService } from '../services/couponService'
import DealsSection from '../components/DealsSection'
import CouponInput from '../components/CouponInput'

export default function Landing() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<any>(null)
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [showDeals, setShowDeals] = useState(false)

  // Initialize coupon system
  React.useEffect(() => {
    CouponService.initializeDefaultData()
    setShowDeals(CouponService.hasActiveDeals())
  }, [])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await ConstantContactService.subscribeEmail(email)
      setIsSubscribed(true)
    } catch (error) {
      console.error('Failed to subscribe:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    try {
      // Apply coupon if selected deal or manual coupon
      let couponCode = ''
      if (selectedDeal) {
        couponCode = selectedDeal.couponCode
      } else if (appliedCoupon) {
        couponCode = appliedCoupon.coupon.code
      }

      const { url } = await StripeService.createCheckoutSession(plan, couponCode)
      window.location.href = url
    } catch (error) {
      console.error('Failed to create checkout session:', error)
    }
  }

  const handleDonate = async (amount: number) => {
    try {
      await StripeService.redirectToCoffeeCheckout()
    } catch (error) {
      console.error('Failed to create donation:', error)
    }
  }

  const handleSelectDeal = (deal: any) => {
    setSelectedDeal(deal)
    setAppliedCoupon(null) // Clear manual coupon if deal is selected
  }

  const handleCouponApplied = (validation: any) => {
    setAppliedCoupon(validation)
    setSelectedDeal(null) // Clear deal if manual coupon is applied
  }

  const handleCouponRemoved = () => {
    setAppliedCoupon(null)
  }

  const getDiscountedPrice = (originalPrice: number, plan: 'monthly' | 'yearly') => {
    if (selectedDeal && selectedDeal.plan === plan) {
      return selectedDeal.discountedPrice
    }
    if (appliedCoupon) {
      return appliedCoupon.finalAmount
    }
    return originalPrice
  }

  const getDiscountInfo = (plan: 'monthly' | 'yearly') => {
    if (selectedDeal && selectedDeal.plan === plan) {
      return {
        hasDiscount: true,
        discountText: `${selectedDeal.discountPercentage}% OFF`,
        savings: selectedDeal.originalPrice - selectedDeal.discountedPrice
      }
    }
    if (appliedCoupon) {
      return {
        hasDiscount: true,
        discountText: CouponService.formatDiscount(appliedCoupon.coupon),
        savings: appliedCoupon.discountAmount
      }
    }
    return { hasDiscount: false }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Master Options Trading
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Advanced analytics, real-time data, and AI-powered insights to maximize your options trading profits
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center">
                <Play className="mr-2 h-5 w-5" />
                Start Trading Now
              </button>
              <button className="border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Professional-grade tools and insights that give you the edge in options trading
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-750 transition-colors">
              <TrendingUp className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Real-Time Analytics</h3>
              <p className="text-gray-400">
                Advanced charting and technical analysis tools with real-time market data
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-750 transition-colors">
              <Target className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Strategy Builder</h3>
              <p className="text-gray-400">
                Create, test, and optimize complex options strategies with our intuitive builder
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-750 transition-colors">
              <Shield className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Risk Management</h3>
              <p className="text-gray-400">
                Sophisticated risk analysis and portfolio protection tools
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-750 transition-colors">
              <BarChart3 className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Performance Tracking</h3>
              <p className="text-gray-400">
                Detailed analytics on your trading performance and P&L
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-750 transition-colors">
              <BookOpen className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Educational Resources</h3>
              <p className="text-gray-400">
                Comprehensive learning materials and trading courses
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-750 transition-colors">
              <Users className="h-12 w-12 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Community</h3>
              <p className="text-gray-400">
                Connect with other traders and share strategies
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Special Deals Section */}
      {showDeals && (
        <section className="py-20 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-4">
                <Tag className="h-8 w-8 text-red-500 mr-3" />
                <h2 className="text-4xl font-bold text-white">
                  Limited Time Deals
                </h2>
              </div>
              <p className="text-xl text-gray-400">
                Don't miss out on these exclusive offers
              </p>
            </div>

            <DealsSection 
              onSelectDeal={handleSelectDeal}
              className="max-w-4xl mx-auto"
            />
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-400">
              Start free, upgrade when you're ready to scale
            </p>
          </div>

          {/* Coupon Input */}
          <div className="max-w-md mx-auto mb-8">
            <CouponInput
              plan="monthly"
              originalAmount={29}
              onCouponApplied={handleCouponApplied}
              onCouponRemoved={handleCouponRemoved}
              appliedCoupon={appliedCoupon}
            />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  <span className="text-2xl">$</span>29
                  <span className="text-lg text-gray-400">/month</span>
                </div>
                <p className="text-gray-400">Perfect for beginners</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Real-time market data
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Basic analytics
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  5 watchlists
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Email support
                </li>
              </ul>

              <button 
                onClick={() => handleSubscribe('monthly')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Get Started
              </button>
              {getDiscountInfo('monthly').hasDiscount && (
                <p className="text-center text-green-400 text-sm mt-2">
                  Save ${getDiscountInfo('monthly').savings} with this deal!
                </p>
              )}
            </div>

            {/* Pro Plan */}
            <div className="bg-gray-900 p-8 rounded-xl border-2 border-blue-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                {getDiscountInfo('yearly').hasDiscount && (
                  <div className="mb-2">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      {getDiscountInfo('yearly').discountText}
                    </span>
                  </div>
                )}
                <div className="text-4xl font-bold text-white mb-2">
                  <span className="text-2xl">$</span>79
                  <span className="text-lg text-gray-400">/month</span>
                </div>
                {getDiscountInfo('monthly').hasDiscount && (
                  <div className="text-sm text-gray-400 line-through mb-2">
                    Was $79/month
                  </div>
                )}
                <p className="text-gray-400">For serious traders</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Everything in Basic
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Advanced analytics
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Unlimited watchlists
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Strategy builder
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Priority support
                </li>
              </ul>

              <button 
                onClick={() => handleSubscribe('monthly')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Upgrade to Pro
              </button>
              {getDiscountInfo('monthly').hasDiscount && (
                <p className="text-center text-green-400 text-sm mt-2">
                  Save ${getDiscountInfo('monthly').savings} with this deal!
                </p>
              )}
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                {getDiscountInfo('yearly').hasDiscount && (
                  <div className="mb-2">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      {getDiscountInfo('yearly').discountText}
                    </span>
                  </div>
                )}
                <div className="text-4xl font-bold text-white mb-2">
                  <span className="text-2xl">$</span>199
                  <span className="text-lg text-gray-400">/month</span>
                </div>
                {getDiscountInfo('yearly').hasDiscount && (
                  <div className="text-sm text-gray-400 line-through mb-2">
                    Was $199/month
                  </div>
                )}
                <p className="text-gray-400">For institutions</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Everything in Pro
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Custom integrations
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Dedicated support
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  White-label options
                </li>
              </ul>

              <button 
                onClick={() => handleSubscribe('yearly')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Contact Sales
              </button>
              {getDiscountInfo('yearly').hasDiscount && (
                <p className="text-center text-green-400 text-sm mt-2">
                  Save ${getDiscountInfo('yearly').savings} with this deal!
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mail className="h-16 w-16 text-blue-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Get the latest market insights and trading tips delivered to your inbox
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          ) : (
            <div className="text-green-400 text-lg">
              <CheckCircle className="h-6 w-6 inline mr-2" />
              Thanks for subscribing!
            </div>
          )}
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Coffee className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Support Our Work
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Help us continue building amazing trading tools
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleDonate(5)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
            >
              <Coffee className="mr-2 h-5 w-5" />
              Buy us a coffee - $5
            </button>
            <button
              onClick={() => handleDonate(10)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
            >
              <Coffee className="mr-2 h-5 w-5" />
              Support us - $10
            </button>
            <button
              onClick={() => handleDonate(25)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
            >
              <Award className="mr-2 h-5 w-5" />
              Sponsor us - $25
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Options World</h3>
              <p className="text-gray-400">
                Professional options trading platform for serious traders
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Options World. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}