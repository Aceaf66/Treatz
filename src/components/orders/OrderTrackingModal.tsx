import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, CheckCircle2, Clock, Truck, Package, 
  MapPin, Phone, RotateCcw, AlertCircle
} from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const { trackingOrderId, setTrackingOrderId, orders, reorderItems, setIsCartOpen } = useStore();

  if (!trackingOrderId) return null;

  const order = orders.find(o => o.id === trackingOrderId);
  if (!order) return null;

  const steps = [
    { key: 'Order Placed', label: 'Order Placed', icon: CheckCircle2 },
    { key: 'Confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
    { key: 'Packed', label: 'Packed & Inspected', icon: Package },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'Delivered', label: 'Delivered 🐾', icon: CheckCircle2 }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Order Placed': return 0;
      case 'Confirmed': return 1;
      case 'Packed': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  const handleReorder = () => {
    reorderItems(order.id);
    setTrackingOrderId(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        id="order-tracking-modal"
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-purple-100 my-6 max-h-[92vh] overflow-y-auto relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B4A]">Live Shipment Tracking</span>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">Order #{order.orderNumber}</h2>
          </div>
          <button
            onClick={() => setTrackingOrderId(null)}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Courier & ETA card */}
        <div className="my-5 p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs text-purple-900 font-semibold">Estimated Delivery</p>
            <p className="text-lg font-black text-gray-900">{order.estimatedDelivery}</p>
            <p className="text-xs text-gray-500 mt-0.5">Carrier: Treatz Eco-Express (AWB: TRZ-{order.orderNumber}-EXP)</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Calling Treatz delivery executive for Order #${order.orderNumber}...`)}
              className="px-3 py-1.5 rounded-xl bg-white border border-purple-300 text-[#4A154B] text-xs font-bold hover:bg-purple-100 flex items-center gap-1.5 shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Courier
            </button>
          </div>
        </div>

        {/* Visual Progress Steps */}
        <div className="py-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Milestone Progress</p>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            {steps.map((step, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div key={step.key} className="relative flex items-start gap-3.5">
                  <div className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${
                    isPast || isCurrent ? 'bg-[#4A154B] text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <step.icon className="w-3 h-3" />
                  </div>
                  <div>
                    <p className={`text-xs font-bold leading-none ${isCurrent ? 'text-[#4A154B]' : isPast ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                      {isCurrent && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-[#4A154B] font-extrabold uppercase">In Progress</span>}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Logs */}
        {order.trackingEvents && order.trackingEvents.length > 0 && (
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Live Dispatch Logs</p>
            <div className="space-y-2.5 text-xs">
              {order.trackingEvents.map((ev, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-gray-50 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-800">{ev.status}</p>
                    <p className="text-[11px] text-gray-500">{ev.description}</p>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono shrink-0">{ev.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Items Preview */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Items in this Package</p>
          <div className="space-y-2 max-h-36 overflow-y-auto">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <img src={item.product.image} alt={item.product.name} referrerPolicy="no-referrer" className="w-8 h-8 rounded object-cover" />
                  <span className="font-medium text-gray-800 truncate max-w-[220px]">{item.product.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.quantity}x ₹{item.product.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <span className="text-xs font-black text-gray-900">Total: ₹{order.total}</span>
          <button
            onClick={handleReorder}
            className="px-4 py-2 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#3B1443] flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reorder this Package
          </button>
        </div>

      </div>
    </div>
  );
};
