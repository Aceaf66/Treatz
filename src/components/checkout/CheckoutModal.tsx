import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Address, Order } from '../../types';
import { activePaymentProvider } from '../../services/paymentService';
import confetti from 'canvas-confetti';
import { 
  X, CheckCircle2, Truck, CreditCard, Banknote, 
  MapPin, ShieldCheck, Sparkles, ArrowRight, Loader2,
  Phone, User as UserIcon
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, setIsCheckoutOpen,
    cart, cartSubtotal, cartDiscount, cartDeliveryFee, cartTotal,
    addresses, addAddress,
    placeOrder, setTrackingOrderId, setCurrentPage
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || 'addr-1');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // New address form state
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newApartment, setNewApartment] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');

  // Payment mock inputs
  const [upiId, setUpiId] = useState('petparent@okaxis');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4022');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('890');

  if (!isCheckoutOpen) return null;

  const currentAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newStreet || !newCity) return;

    addAddress({
      fullName: newFullName,
      phone: newPhone || '+1 (555) 000-0000',
      street: newStreet,
      apartment: newApartment,
      city: newCity,
      state: newState || 'California',
      postalCode: newPostalCode || '90210',
      isDefault: false
    });

    setIsAddingNewAddress(false);
  };

  const handleProcessPayment = async () => {
    if (!currentAddress) return;
    setIsProcessing(true);

    try {
      // 1. Process payment via abstraction
      const paymentResult = await activePaymentProvider.processPayment({
        amount: cartTotal,
        currency: 'INR',
        orderId: 'ORD_' + Date.now(),
        customer: {
          name: currentAddress.fullName,
          email: 'alex.morgan@example.com',
          phone: currentAddress.phone
        },
        method: paymentMethod
      });

      if (paymentResult.success) {
        // 2. Place order in state
        const order = await placeOrder(currentAddress, paymentMethod);
        setCompletedOrder(order);
        setStep(4);

        // Confetti explosion celebration!
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore if canvas not supported
        }
      }
    } catch (err) {
      console.error('Payment failure', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep(1);
    setCompletedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        id="checkout-modal-container"
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-purple-100 my-6 max-h-[92vh] overflow-y-auto relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B4A]">Step {step} of 4</span>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {step === 1 && 'Delivery Address'}
              {step === 2 && 'Delivery Method'}
              {step === 3 && 'Payment & Review'}
              {step === 4 && 'Order Confirmed! 🐾'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress bullets */}
        <div className="flex items-center justify-between my-4 px-2">
          {['Address', 'Delivery', 'Payment', 'Confirmed'].map((label, idx) => {
            const stepNum = (idx + 1) as 1 | 2 | 3 | 4;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;

            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted 
                    ? 'bg-emerald-600 text-white' 
                    : isCurrent 
                    ? 'bg-[#4A154B] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {isCompleted ? '✓' : stepNum}
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* STEP 1: ADDRESS */}
        {step === 1 && (
          <div className="space-y-4 py-2">
            {!isAddingNewAddress ? (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Select Shipping Destination
                </p>
                <div className="space-y-3">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                        selectedAddressId === addr.id
                          ? 'border-[#4A154B] bg-purple-50/40 ring-2 ring-[#4A154B]/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className={`w-5 h-5 mt-0.5 ${selectedAddressId === addr.id ? 'text-[#4A154B]' : 'text-gray-400'}`} />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{addr.fullName}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{addr.street}, {addr.apartment}</p>
                          <p className="text-xs text-gray-600">{addr.city}, {addr.state} - {addr.postalCode}</p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {addr.phone}
                          </p>
                        </div>
                      </div>

                      {selectedAddressId === addr.id && (
                        <span className="w-5 h-5 rounded-full bg-[#4A154B] text-white flex items-center justify-center text-xs">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(true)}
                  className="mt-3 text-xs font-bold text-[#4A154B] hover:underline"
                >
                  + Add a new delivery address
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveNewAddress} className="space-y-3 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900">New Address Form</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="p-2 rounded-xl border border-gray-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Mobile Phone"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="p-2 rounded-xl border border-gray-300 text-xs bg-white"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Street Address"
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-300 text-xs bg-white"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Apartment / Suite"
                    value={newApartment}
                    onChange={(e) => setNewApartment(e.target.value)}
                    className="p-2 rounded-xl border border-gray-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="p-2 rounded-xl border border-gray-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Postal Code"
                    value={newPostalCode}
                    onChange={(e) => setNewPostalCode(e.target.value)}
                    className="p-2 rounded-xl border border-gray-300 text-xs bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#4A154B] text-white text-xs font-bold"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="pt-4 flex justify-end">
              <button
                id="checkout-step1-continue-btn"
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-[#4A154B] text-white font-bold text-sm hover:bg-[#3B1443] flex items-center gap-2"
              >
                Continue to Delivery <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DELIVERY METHOD */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Choose Shipping Speed
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl border-2 border-[#4A154B] bg-purple-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-[#4A154B]">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Treatz Fresh Eco-Express</p>
                    <p className="text-xs text-gray-600">Arriving in 2-3 business days in insulated fresh packaging</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-1 rounded">
                  {cartDeliveryFee === 0 ? 'FREE' : `₹${cartDeliveryFee}`}
                </span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
              <span>Zero plastic packaging. Temperature-controlled dry & wet foods guarantee.</span>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-gray-600 font-semibold text-xs hover:bg-gray-100"
              >
                Back
              </button>
              <button
                id="checkout-step2-continue-btn"
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-[#4A154B] text-white font-bold text-sm hover:bg-[#3B1443] flex items-center gap-2"
              >
                Continue to Payment <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT & REVIEW */}
        {step === 3 && (
          <div className="space-y-5 py-2">
            {/* Order Items Preview */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 max-h-36 overflow-y-auto">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Order Items ({cart.length})</p>
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-800 font-medium truncate max-w-[260px]">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-bold text-gray-900">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Payment Method Selector */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Select Payment Method
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                {[
                  { id: 'card', label: 'Card 💳', icon: CreditCard },
                  { id: 'upi', label: 'UPI 📱', icon: Sparkles },
                  { id: 'cod', label: 'Cash on Deliv.', icon: Banknote },
                ].map(opt => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id as any)}
                    className={`py-3 px-2 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === opt.id
                        ? 'border-[#4A154B] bg-purple-50 text-[#4A154B]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <opt.icon className="w-4 h-4" />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mock Fields based on method */}
            {paymentMethod === 'card' && (
              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2.5">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card Number"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs bg-white font-mono"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="p-2.5 rounded-xl border border-gray-300 text-xs bg-white font-mono"
                  />
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="CVV"
                    className="p-2.5 rounded-xl border border-gray-300 text-xs bg-white font-mono"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200">
                <label className="block text-xs font-semibold text-gray-700 mb-1">VPA / UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@bank"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs bg-white font-medium"
                />
                <p className="text-[10px] text-gray-500 mt-1">Instant approval with Google Pay, PhonePe, or Paytm</p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <p className="font-bold">Cash on Delivery Selected</p>
                <p className="mt-0.5">Please have ₹{cartTotal} ready when the Treatz courier arrives.</p>
              </div>
            )}

            {/* Total breakdown */}
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-gray-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-₹{cartDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>{cartDeliveryFee === 0 ? 'FREE' : `₹${cartDeliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>Amount Payable</span>
                <span className="text-[#4A154B]">₹{cartTotal}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-gray-600 font-semibold text-xs hover:bg-gray-100"
              >
                Back
              </button>

              <button
                id="place-order-confirm-btn"
                type="button"
                disabled={isProcessing}
                onClick={handleProcessPayment}
                className="px-8 py-3 rounded-2xl bg-[#4A154B] text-white font-bold text-sm hover:bg-[#3B1443] flex items-center gap-2 shadow-lg shadow-purple-950/20 active:scale-98 disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authorizing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Pay ₹{cartTotal}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMED */}
        {step === 4 && completedOrder && (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Payment Captured</span>
              <h3 className="text-2xl font-black text-gray-900 mt-1">Thank you for your order! 🐾</h3>
              <p className="text-xs text-gray-500 mt-1 font-mono">Order ID: #{completedOrder.orderNumber}</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-left max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery:</span>
                <strong className="text-gray-900">{completedOrder.estimatedDelivery}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping to:</span>
                <strong className="text-gray-900">{completedOrder.address.city}, {completedOrder.address.postalCode}</strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-purple-200/60">
                <span className="text-gray-600">Treatz Rewards Earned:</span>
                <strong className="text-[#4A154B] font-bold">+{completedOrder.pointsEarned} Points 🎉</strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                id="view-order-tracking-btn"
                onClick={() => {
                  setTrackingOrderId(completedOrder.id);
                  handleClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#4A154B] text-white font-bold text-xs hover:bg-[#3B1443] shadow-md shadow-purple-950/15"
              >
                Track Live Delivery Status
              </button>

              <button
                onClick={() => {
                  handleClose();
                  setCurrentPage('shop');
                }}
                className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
