interface StripeCheckoutOptions {
  priceId: string
  successUrl?: string
  cancelUrl?: string
  customerEmail?: string
  metadata?: Record<string, string>
  couponCode?: string
}

interface StripeProduct {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval?: 'month' | 'year'
  type: 'subscription' | 'one_time'
}

export class StripeService {
  private static readonly PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  private static readonly MONTHLY_PRICE_ID = import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID
  private static readonly YEARLY_PRICE_ID = import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID
  private static readonly COFFEE_PRICE_ID = import.meta.env.VITE_STRIPE_COFFEE_PRICE_ID

  /**
   * Initialize Stripe (loads Stripe.js)
   */
  static async initializeStripe() {
    if (!this.PUBLISHABLE_KEY) {
      console.warn('Stripe not configured')
      return null
    }

    try {
      // Dynamically import Stripe
      const { loadStripe } = await import('@stripe/stripe-js')
      return await loadStripe(this.PUBLISHABLE_KEY)
    } catch (error) {
      console.error('Failed to load Stripe:', error)
      return null
    }
  }

  /**
   * Redirect to Stripe Checkout for subscription
   */
  static async redirectToCheckout(
    plan: 'monthly' | 'yearly', 
    customerEmail?: string,
    couponCode?: string
  ): Promise<void> {
    try {
      const priceId = plan === 'monthly' ? this.MONTHLY_PRICE_ID : this.YEARLY_PRICE_ID
      
      if (!priceId) {
        throw new Error(`${plan} price ID not configured`)
      }

      const stripe = await this.initializeStripe()
      if (!stripe) {
        throw new Error('Stripe not available')
      }

      const options: StripeCheckoutOptions = {
        priceId,
        successUrl: `${window.location.origin}/app?subscription=success&plan=${plan}`,
        cancelUrl: `${window.location.origin}/?subscription=cancelled`,
        metadata: {
          plan,
          source: 'landing_page'
        }
      }

      if (customerEmail) {
        options.customerEmail = customerEmail
      }

      if (couponCode) {
        options.couponCode = couponCode
      }
      // Create checkout session
      const checkoutOptions: any = {
        lineItems: [{
          price: priceId,
          quantity: 1
        }],
        mode: 'subscription',
        successUrl: options.successUrl,
        cancelUrl: options.cancelUrl,
        customerEmail: options.customerEmail,
        allowPromotionCodes: true,
        billingAddressCollection: 'auto'
      }

      const { error } = await stripe.redirectToCheckout(checkoutOptions)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Stripe checkout error:', error)
      
      // Fallback for development
      if (import.meta.env.DEV) {
        this.mockStripeCheckout(plan, couponCode)
        return
      }
      
      throw new Error('Failed to redirect to checkout. Please try again.')
    }
  }

  /**
   * Create checkout session with coupon support
   */
  static async createCheckoutSession(
    plan: 'monthly' | 'yearly',
    couponCode?: string
  ): Promise<{ url: string }> {
    try {
      // For demo purposes, redirect to mock checkout with deal pricing
      if (couponCode) {
        // Import coupon service to get deal pricing
        const { CouponService } = await import('./couponService')
        const validation = CouponService.validateCoupon(couponCode, plan, plan === 'monthly' ? 29 : 290, true)
        
        if (validation.isValid) {
          // Redirect to mock Stripe checkout with discounted price
          this.mockStripeCheckout(plan, couponCode)
          return { url: '#' } // Return placeholder since redirect happens immediately
        }
      }
      
      // Regular checkout without coupon
      this.mockStripeCheckout(plan)
      return { url: '#' }
    } catch (error) {
      console.error('Checkout session error:', error)
      throw new Error('Failed to create checkout session')
    }
  }
  /**
   * Redirect to Stripe Checkout for one-time payment (Buy Me a Coffee)
   */
  static async redirectToCoffeeCheckout(customerEmail?: string): Promise<void> {
    try {
      if (!this.COFFEE_PRICE_ID) {
        throw new Error('Coffee price ID not configured')
      }

      const stripe = await this.initializeStripe()
      if (!stripe) {
        throw new Error('Stripe not available')
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{
          price: this.COFFEE_PRICE_ID,
          quantity: 1
        }],
        mode: 'payment',
        successUrl: `${window.location.origin}/?coffee=success`,
        cancelUrl: `${window.location.origin}/?coffee=cancelled`,
        customerEmail,
        billingAddressCollection: 'auto'
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Coffee checkout error:', error)
      
      // Fallback for development
      if (import.meta.env.DEV) {
        this.mockCoffeeCheckout()
        return
      }
      
      throw new Error('Failed to process payment. Please try again.')
    }
  }

  /**
   * Create a customer portal session for subscription management
   */
  static async createCustomerPortalSession(customerId: string): Promise<string> {
    try {
      // This would typically be done on your backend
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_id: customerId,
          return_url: `${window.location.origin}/app/settings`
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const { url } = await response.json()
      return url
    } catch (error) {
      console.error('Portal session error:', error)
      throw new Error('Failed to access customer portal')
    }
  }

  /**
   * Get available products/pricing
   */
  static getProducts(): StripeProduct[] {
    return [
      {
        id: 'free',
        name: 'Free Starter',
        description: 'Basic options trading with 5 top liquid contracts',
        price: 0,
        currency: 'USD',
        type: 'subscription'
      },
      {
        id: 'monthly',
        name: 'Pro Monthly',
        description: 'Full access with advanced analytics and strategy backtesting',
        price: 29,
        currency: 'USD',
        interval: 'month',
        type: 'subscription'
      },
      {
        id: 'yearly',
        name: 'Pro Yearly',
        description: 'Everything in Pro Monthly plus 1-on-1 coaching and exclusive webinars',
        price: 290,
        currency: 'USD',
        interval: 'year',
        type: 'subscription'
      },
      {
        id: 'coffee',
        name: 'Buy Me a Coffee',
        description: 'Support our development with a one-time contribution',
        price: 5,
        currency: 'USD',
        type: 'one_time'
      }
    ]
  }

  /**
   * Mock checkout for development
   */
  private static mockStripeCheckout(plan: 'monthly' | 'yearly', couponCode?: string): void {
    const products = this.getProducts()
    const product = products.find(p => p.id === plan)
    
    let displayPrice = product?.price || 0
    let discountInfo = ''
    let finalPrice = displayPrice
    
    if (couponCode) {
      // Import coupon service for validation
      import('../services/couponService').then(({ CouponService }) => {
        const validation = CouponService.validateCoupon(couponCode, plan, displayPrice, true)
        if (validation.isValid) {
          finalPrice = validation.finalAmount
          discountInfo = `\nCoupon Applied: ${couponCode}\nDiscount: $${validation.discountAmount.toFixed(2)}`
          
          // Show confirmation with discounted price
          if (confirm(`Mock Stripe Checkout\n\nPlan: ${product?.name}\nOriginal Price: $${displayPrice}/${product?.interval}${discountInfo}\nFinal Price: $${finalPrice}/${product?.interval}\n\nProceed with mock subscription?`)) {
            this.completeMockCheckout(plan, couponCode, finalPrice)
          }
        } else {
          alert('Invalid coupon code: ' + validation.error)
            } else {
      if (confirm(`Mock Stripe Checkout\n\nPlan: ${product?.name}\nPrice: $${displayPrice}/${product?.interval}\n\nProceed with mock subscription?`)) {
        this.completeMockCheckout(plan, couponCode, finalPrice)
      }
    }
        }
      )
    }
  }

  /**
   * Complete mock checkout process
   */
  private static completeMockCheckout(plan: 'monthly' | 'yearly', couponCode?: string, finalPrice?: number): void {
    // Store mock subscription in localStorage
    const mockSubscription = {
      id: `sub_mock_${Date.now()}`,
      plan,
      status: 'active',
      created: new Date().toISOString(),
      current_period_end: new Date(Date.now() + (plan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
      coupon_applied: couponCode || null,
      amount_paid: finalPrice || (plan === 'monthly' ? 29 : 290)
    }
    
    localStorage.setItem('mock_subscription', JSON.stringify(mockSubscription))
    
    // Apply coupon usage if provided
    if (couponCode) {
      import('../services/couponService').then(({ CouponService }) => {
        CouponService.applyCoupon(couponCode)
      })
    }
    
    // Redirect to success page
    window.location.href = `/app?subscription=success&plan=${plan}`
  }

  /**
   * Mock coffee checkout for development
   */
  private static mockCoffeeCheckout(): void {
    if (confirm('Mock Buy Me a Coffee\n\nAmount: $5\n\nProceed with mock payment?')) {
      // Store mock payment in localStorage
      const mockPayment = {
        id: `pi_mock_${Date.now()}`,
        amount: 500, // $5 in cents
        status: 'succeeded',
        created: new Date().toISOString()
      }
      
      localStorage.setItem('mock_coffee_payment', JSON.stringify(mockPayment))
      
      // Redirect to success page
      window.location.href = '/?coffee=success'
    }
  }

  /**
   * Check if user has active subscription (mock for development)
   */
  static getSubscriptionStatus(): { active: boolean; plan?: string; subscription?: any } {
    try {
      const mockSubscription = localStorage.getItem('mock_subscription')
      if (mockSubscription) {
        const subscription = JSON.parse(mockSubscription)
        const isActive = subscription.status === 'active' && new Date(subscription.current_period_end) > new Date()
        
        return {
          active: isActive,
          plan: subscription.plan,
          subscription
        }
      }
      
      return { active: false }
    } catch (error) {
      console.error('Error checking subscription status:', error)
      return { active: false }
    }
  }
}