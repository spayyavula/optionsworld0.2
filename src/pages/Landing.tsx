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
  CreditCard
} from 'lucide-react'

export default function Landing() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate Constant Contact integration
    try {
      // In a real implementation, you would integrate with Constant Contact API
      console.log('Subscribing email to Constant Contact:', email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Thank you for subscribing! Check your email for a welcome message.')
      setEmail('')
    } catch (error) {
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStripeSubscription = (plan: 'monthly' | 'yearly') => {
    // In a real implementation, you would integrate with Stripe
    console.log(`Redirecting to Stripe for ${plan} subscription`)
    
    // Simulate Stripe redirect
    const prices = {
      monthly: 'price_monthly_id',
      yearly: 'price_yearly_id'
    }
    
    // This would be your actual Stripe checkout URL
    const checkoutUrl = `https://checkout.stripe.com/pay/${prices[plan]}`
    alert(`Redirecting to Stripe checkout for ${plan} plan...`)
  }

  const handleBuyMeCoffee = () => {
    // In a real implementation, you would integrate with Buy Me a Coffee or Stripe one-time payment
    console.log('Redirecting to Buy Me a Coffee')
    alert('Redirecting to Buy Me a Coffee...')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Options Trading
              <span className="block text-blue-300">Risk-Free</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Learn options trading with our advanced paper trading platform. Practice with real market data, 
              master the Greeks, and build confidence before risking real money.
            </p>
            
            {/* Email Subscription */}
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-8">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to get started"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Joining...' : 'Start Free'}
                </button>
              </div>
              <p className="text-sm text-blue-200 mt-2">
                Join 10,000+ traders learning options risk-free
              </p>
            </form>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center text-blue-200">
                <CheckCircle className="h-5 w-5 mr-2" />
                No Credit Card Required
              </div>
              <div className="flex items-center text-blue-200">
                <CheckCircle className="h-5 w-5 mr-2" />
                Real Market Data
              </div>
              <div className="flex items-center text-blue-200">
                <CheckCircle className="h-5 w-5 mr-2" />
                Advanced Analytics
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for options trading education with features that help you learn faster and trade smarter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-Time Options Data</h3>
              <p className="text-gray-600">
                Practice with live market data from the most liquid options contracts. 
                See real bid/ask spreads, volume, and open interest.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Master the Greeks</h3>
              <p className="text-gray-600">
                Understand Delta, Gamma, Theta, and Vega with interactive visualizations. 
                See how Greeks change with market movements in real-time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Beginner-Friendly</h3>
              <p className="text-gray-600">
                Start with zero knowledge. Our platform includes tutorials, explanations, 
                and guided trading scenarios perfect for beginners.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Risk-Free Learning</h3>
              <p className="text-gray-600">
                Practice with virtual money. Make mistakes, learn from them, 
                and build confidence without financial risk.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Advanced Analytics</h3>
              <p className="text-gray-600">
                Track your performance with detailed analytics. See your win rate, 
                profit/loss patterns, and areas for improvement.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Support</h3>
              <p className="text-gray-600">
                Join a community of learners. Share strategies, ask questions, 
                and learn from experienced options traders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "This platform helped me understand options trading in just 2 weeks. 
                The Greeks explanations are incredibly clear!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  S
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Sarah Chen</p>
                  <p className="text-sm text-gray-500">Beginner Trader</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "The real-time data and paper trading environment gave me confidence 
                to start trading options with real money."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  M
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Mike Rodriguez</p>
                  <p className="text-sm text-gray-500">Active Trader</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Best options education platform I've used. The analytics help me 
                track my progress and improve my strategies."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Alex Thompson</p>
                  <p className="text-sm text-gray-500">Professional Trader</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start free or upgrade for advanced features and personalized coaching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Free Starter</h3>
                <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-400">/month</span></div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    Basic options trading
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    5 top liquid contracts
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    Basic analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    Community access
                  </li>
                </ul>
                <button className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors">
                  Get Started Free
                </button>
              </div>
            </div>

            {/* Monthly Plan */}
            <div className="bg-blue-600 p-8 rounded-xl border-2 border-blue-400 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Pro Monthly</h3>
                <div className="text-4xl font-bold mb-6">$29<span className="text-lg text-blue-200">/month</span></div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    Everything in Free
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    Full options chain access
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    Strategy backtesting
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    Priority support
                  </li>
                </ul>
                <button 
                  onClick={() => handleStripeSubscription('monthly')}
                  className="w-full py-3 px-6 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Subscribe Monthly
                </button>
              </div>
            </div>

            {/* Yearly Plan */}
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Pro Yearly</h3>
                <div className="text-4xl font-bold mb-2">$290<span className="text-lg text-gray-400">/year</span></div>
                <div className="text-green-400 text-sm mb-4">Save $58 (17% off)</div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    Everything in Pro Monthly
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    1-on-1 coaching session
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    Exclusive webinars
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    Custom strategies
                  </li>
                </ul>
                <button 
                  onClick={() => handleStripeSubscription('yearly')}
                  className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Subscribe Yearly
                </button>
              </div>
            </div>
          </div>

          {/* Buy Me a Coffee */}
          <div className="text-center mt-12">
            <div className="bg-gray-800 p-6 rounded-xl max-w-md mx-auto">
              <h4 className="text-xl font-semibold mb-4">Support Our Work</h4>
              <p className="text-gray-300 mb-6">
                Love what we're building? Buy us a coffee to support development!
              </p>
              <button 
                onClick={handleBuyMeCoffee}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center mx-auto"
              >
                <Coffee className="h-5 w-5 mr-2" />
                Buy Me a Coffee - $5
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Learning Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow our structured path from complete beginner to confident options trader.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Learn Basics</h3>
              <p className="text-gray-600">
                Understand what options are, how they work, and basic terminology.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Master Greeks</h3>
              <p className="text-gray-600">
                Learn Delta, Gamma, Theta, Vega and how they affect option prices.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Practice Trading</h3>
              <p className="text-gray-600">
                Start with simple strategies and gradually build complexity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Go Live</h3>
              <p className="text-gray-600">
                Apply your skills with real money, starting small and scaling up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Master Options Trading?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of traders who've learned options trading the smart way - risk-free.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
              <Play className="h-5 w-5 mr-2" />
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center">
              <Mail className="h-5 w-5 mr-2" />
              Get Free Guide
            </button>
          </div>
          
          <p className="text-sm text-blue-200 mt-6">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Options Trader</h3>
              <p className="text-gray-400">
                The best platform to learn options trading risk-free.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Tutorials</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Options Trader. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}