import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CreditCard, CheckCircle, AlertTriangle } from 'lucide-react'

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

interface StripePaymentFormProps {
  amount: number
  currency?: string
  description?: string
  onSuccess?: (paymentIntent: any) => void
  onError?: (error: any) => void
  buttonText?: string
  className?: string
}

const PaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  currency = 'usd',
  description = 'Payment',
  onSuccess,
  onError,
  buttonText = 'Pay Now',
  className = ''
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    // In a real implementation, you would call your backend to create a payment intent
    // For demo purposes, we'll simulate this
    const createPaymentIntent = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock client secret
        setClientSecret(`pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(2, 15)}`)
      } catch (err) {
        console.error('Error creating payment intent:', err)
        setError('Failed to initialize payment. Please try again.')
      }
    }
    
    createPaymentIntent()
  }, [amount, currency])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!stripe || !elements || !clientSecret) {
      return
    }
    
    setLoading(true)
    setError(null)
    
    const cardElement = elements.getElement(CardElement)
    
    if (!cardElement) {
      setError('Card element not found')
      setLoading(false)
      return
    }
    
    try {
      // In a real implementation, this would confirm the payment
      // For demo, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate successful payment
      setSuccess(true)
      
      if (onSuccess) {
        onSuccess({
          id: `pi_mock_${Date.now()}`,
          amount,
          currency,
          status: 'succeeded'
        })
      }
    } catch (err: any) {
      console.error('Payment error:', err)
      setError(err.message || 'An error occurred while processing your payment')
      
      if (onError) {
        onError(err)
      }
    } finally {
      setLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  }

  return (
    <div className={className}>
      {success ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center mb-3">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-green-800">Payment Successful</h3>
          </div>
          <p className="text-green-700">
            Thank you for your payment of {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency.toUpperCase()
            }).format(amount / 100)}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details
            </label>
            <div className="p-3 border border-gray-300 rounded-md">
              <CardElement options={cardElementOptions} />
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                {buttonText}
              </>
            )}
          </button>
          
          <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
            <span>Amount: {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency.toUpperCase()
            }).format(amount / 100)}</span>
          </div>
        </form>
      )}
    </div>
  )
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  )
}

export default StripePaymentForm