import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Tag, CreditCard, Trash2, X } from 'lucide-react';
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import Api from '../Services/Api';
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


const OrdersCheckout = () => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [couponCode, setCouponCode] = useState('');

    // stipe

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [paymentMethod,setPaymentMethod]=useState("card")



  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);


  // Mock Data
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'aghoshaghu',
      type: 'Default',
      address: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400001',
      phone: '9876543210',
    },
    {
      id: 2,
      name: 'Tirun',
      type: '',
      address: 'Abc123, kiralur',
      city: 'kerala',
      state: '',
      zip: '12345',
      phone: '123134',
    },
  ]);

  



  useEffect(()=>{
    fetchCart()
  },[])

  const fetchCart = async() =>{

        try{
            const res = await Api.get("/cart/")
            setCartItems(res.data.items)
            setTotal(res.data.total_amount)
        
        }catch{
            toast.error("Failed to load checkout data")
        }finally{
            setLoading(false)
        }
  }


  const handleAddAddress = (e) => {
    e.preventDefault();
    // Logic to add address would go here
    setIsAddressModalOpen(false);
  };



  
const payWithStripe  = async ()=>{

    if(!stripe || !elements){

      toast.error("Stripe not loaded")
      return
    }



    try{
        const res = await Api.post("/createorder/")
        const { client_secret } = res.data


        const result = await stripe.confirmCardPayment(client_secret,{
          payment_method:{
            card:elements.getElement(CardElement)
          }
        })

        if (result.error){

            toast.error(result.error.message)
        }else{

          if(result.paymentIntent.status==="succeeded"){
            await Api.delete("/cart/clear/");
            toast.success("Payment Successful")
            navigate("/mycourse")
          }
        }

    }catch(err){
      toast.error("Payment Failed")
    }
}

const payWithRazorpay = () => {
  toast.info("Razorpay UPI flow will open here");
};




const handleCheckout = async ()=>{

    if (paymentMethod==="card"){
        payWithStripe()
    }else{
        payWithRazorpay()
    }
}

if (loading) {
    return <div className="text-center py-20">Loading checkout...</div>;
  }


  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Addresses and Items */}
          <div className="lg:col-span-2 space-y-6">

            {/* Delivery Address Section */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Delivery Address</h2>
                </div>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="flex items-center gap-1 text-sm font-medium border border-border rounded-lg px-3 py-1.5 hover:bg-secondary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Address
                </button>
              </div>

              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`relative flex gap-4 p-4 rounded-lg border cursor-pointer transition-all ${selectedAddress === addr.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                      }`}
                    onClick={() => setSelectedAddress(addr.id)}
                  >
                    <div className="mt-1">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedAddress === addr.id ? 'border-primary' : 'border-muted-foreground'
                        }`}>
                        {selectedAddress === addr.id && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{addr.name}</span>
                        {addr.type && (
                          <span className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-medium uppercase tracking-wider">
                            {addr.type}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {addr.address}, {addr.city}, {addr.state && `${addr.state} - `}{addr.zip}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Phone: {addr.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items Section */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-lg font-semibold">Order Items ({cartItems.length})</h2>
              </div>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-16 sm:w-32 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border border-border">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-sm sm:text-base truncate pr-4" title={item.title}>
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">Instructor: {item.instructor}</p>
                        </div>
                        <div className="text-right">
                          {/* <div className="text-sm text-muted-foreground line-through">₹{Number(item.originalPrice).toFixed(2)}</div> */}
                          <div className="font-bold text-primary">₹{Number(item.price).toFixed(2)}</div>
                        </div>
                      </div>
                      {item.tag && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground border border-border w-fit px-2 py-1 rounded">
                          <Tag className="w-3 h-3" />
                          <span>{item.tag}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column - Summary & Coupons */}
          <div className="space-y-6">

            {/* Apply Coupon */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4" />
                <h2 className="font-semibold">Apply Coupon</h2>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="ENTER COUPON CODE"
                  className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all uppercase placeholder:normal-case"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button className="px-4 py-2 text-sm font-medium bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                  Apply
                </button>
              </div>

              <div className="relative">
                <p className="text-xs text-muted-foreground mb-2">Or select from available coupons:</p>
                <select className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Select a coupon</option>
                  <option>WELCOME50</option>
                  <option>LEARN20</option>
                </select>
                <div className="absolute right-3 top-[2.2rem] pointer-events-none">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h2 className="font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal (1 items)</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-green-600 dark:text-green-500">
                  <span>% Offer Discount</span>
                  <span>-₹ 0</span>
                </div>
                <div className="border-t border-border pt-3 mt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{total}</span>
                </div>
              </div>

              {/* <div className="mt-4 p-3 bg-secondary/50 rounded-lg text-xs text-muted-foreground space-y-1">
                <p>Revenue Distribution:</p>
                <div className="flex justify-between">
                  <span>Platform (25%):</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Teacher (75%):</span>
                  <span>₹0.00</span>
                </div>
              </div> */}

              {/* Payment Method */}
                <div className="mb-4 space-y-3">
                <h3 className="font-semibold text-sm">Payment Method</h3>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    />
                    <CreditCard className="w-4 h-4" />
                    Card (Stripe)
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    />
                    UPI (Razorpay)
                </label>
                </div>

              {paymentMethod === "card" && (
                <div className="mb-4 p-3 border rounded-lg">
                    <CardElement />
                </div>
                )}

              <button onClick={handleCheckout} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]">
                Place Order
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-xl shadow-xl border border-border animate-in zoom-in-95 duration-200 p-6 relative">
            <button
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-6">Add New Address</h2>

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Address Line 1</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="House No, Building, Street Area"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Landmark, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Mumbai"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Maharashtra"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">ZIP / Pin Code</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="400001"
                  />
                </div>
                <div className="space-y-2 flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                    <span className="text-sm">Make this my default address</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg font-medium hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersCheckout