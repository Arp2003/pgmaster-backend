import stripe
from django.conf import settings

# Mock Stripe Setup
# In production, set stripe.api_key = settings.STRIPE_SECRET_KEY
stripe.api_key = "sk_test_placeholder_key"

class StripeIntegration:
    @staticmethod
    def process_payment(amount, currency="inr", source="tok_visa", description="PG Rent Payment"):
        """
        Mock function to process a Stripe payment.
        Since we are in a non-Docker local dev environment, this will just simulate success.
        """
        try:
            # Simulate a stripe charge
            # charge = stripe.Charge.create(
            #     amount=int(amount * 100),  # amount in paise
            #     currency=currency,
            #     source=source,
            #     description=description
            # )
            
            # Simulated successful charge response
            return {
                "success": True,
                "transaction_id": "ch_mock_transaction_" + str(int(amount)),
                "message": "Payment successful"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
