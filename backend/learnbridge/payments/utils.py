import stripe
from django.conf import settings
import razorpay


# Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

# Razorpay
razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)