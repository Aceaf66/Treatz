import { TrackingEvent, OrderStatus } from '../types';

export interface DeliveryPartnerEstimate {
  partner: string;
  speed: 'standard' | 'express' | 'same_day';
  estimatedDays: string;
  fee: number;
}

export interface GeolocationCoordinate {
  lat: number;
  lng: number;
}

export interface DeliverySimulation {
  orderId: string;
  currentStatus: OrderStatus;
  driverName?: string;
  driverPhone?: string;
  hubLocation: string;
  lastUpdated: string;
  progressPercent: number;
}

export class DeliveryService {
  static getDeliveryOptions(postalCode: string): DeliveryPartnerEstimate[] {
    const isMetro = postalCode.startsWith('11') || postalCode.startsWith('40') || postalCode.startsWith('56') || postalCode.startsWith('97');
    return [
      {
        partner: 'Treatz Fresh Express',
        speed: 'standard',
        estimatedDays: isMetro ? 'Tomorrow by 2:00 PM' : '2-3 Business Days',
        fee: 0 // Free standard delivery
      },
      {
        partner: 'Treatz Rush Delivery',
        speed: 'express',
        estimatedDays: 'Within 24 Hours',
        fee: 99
      }
    ];
  }

  static generateTrackingEvents(orderDate: string, status: OrderStatus): TrackingEvent[] {
    const events: TrackingEvent[] = [
      {
        status: 'Order Placed',
        time: 'Order Confirmed',
        completed: true,
        description: 'Payment verified and sent to nearest Treatz eco-fulfillment center.'
      },
      {
        status: 'Confirmed',
        time: 'Order Processing',
        completed: ['Confirmed', 'Packed', 'Out for Delivery', 'Delivered'].includes(status),
        description: 'Inventory picked and quality inspected.'
      },
      {
        status: 'Packed',
        time: 'Fulfillment Completed',
        completed: ['Packed', 'Out for Delivery', 'Delivered'].includes(status),
        description: 'Packed in biodegradable temperature-safe packaging.'
      },
      {
        status: 'Out for Delivery',
        time: 'Courier Dispatched',
        completed: ['Out for Delivery', 'Delivered'].includes(status),
        description: 'Assigned to courier partner for final doorstep transit.'
      },
      {
        status: 'Delivered',
        time: 'Completed',
        completed: status === 'Delivered',
        description: 'Package delivered to address.'
      }
    ];

    return events;
  }
}
