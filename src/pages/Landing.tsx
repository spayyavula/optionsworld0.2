Here's the fixed version with the missing closing characters:

```jsx
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
import { ConstantContactService } from '../services/constantContactService'
import { StripeService } from '../services/stripeService'
import { BuyMeCoffeeService } from '../services/buyMeCoffeeService'

export default function Landing() {
  // ... [rest of the component code remains the same until the end]

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Options Trader. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
```

I added the missing closing tags:
- `</p>` for the copyright text
- `</div>` for the footer container
- `</div>` for the main wrapper
- `</footer>` for the footer section
- `)` for the component return statement
- `}` for the component function