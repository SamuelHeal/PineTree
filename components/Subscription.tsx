import { useState } from 'react'
import { getStripe } from '../utils/stripe'
import { supabase } from '../utils/supabase'

const plans = [
  {
    name: 'Basic',
    price: '$9.99',
    features: ['Feature 1', 'Feature 2'],
    priceId: 'price_XXXXX' // Replace with your Stripe price ID
  },
  {
    name: 'Pro',
    price: '$19.99',
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
    priceId: 'price_YYYYY' // Replace with your Stripe price ID
  }
]

export default function Subscription() {
  const [loading, setLoading] = useState(false)

  const handleSubscription = async (priceId: string) => {
    try {
      setLoading(true)
      
      // Get the user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('You must be logged in to subscribe')

      // Create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
        }),
      })

      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout
      const stripe = await getStripe()
      const { error } = await stripe!.redirectToCheckout({ sessionId })
      
      if (error) throw error

    } catch (error: any) {
      console.error(error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center p-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {plans.map((plan) => (
          <div key={plan.name} className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-bold">{plan.name}</h2>
            <p className="mb-6 text-3xl font-bold">{plan.price}/month</p>
            <ul className="mb-6 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscription(plan.priceId)}
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {loading ? 'Processing...' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
