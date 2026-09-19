export interface PaymentIntentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  method: 'upi' | 'card' | 'cod';
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  method: 'upi' | 'card' | 'cod';
  message: string;
  timestamp: string;
}

export interface PaymentGatewayProvider {
  name: 'mock' | 'razorpay' | 'stripe';
  processPayment(request: PaymentIntentRequest): Promise<PaymentResult>;
}

/**
 * Mock Payment Gateway Provider for rapid, realistic testing without live credentials
 */
export class MockPaymentProvider implements PaymentGatewayProvider {
  name = 'mock' as const;

  async processPayment(request: PaymentIntentRequest): Promise<PaymentResult> {
    // Simulate brief network verification
    await new Promise(resolve => setTimeout(resolve, 800));

    const txnId = 'TXN_' + Math.random().toString(36).substring(2, 9).toUpperCase();

    if (request.method === 'cod') {
      return {
        success: true,
        transactionId: txnId,
        method: 'cod',
        message: 'Order confirmed for Cash on Delivery. Please keep exact change ready.',
        timestamp: new Date().toISOString()
      };
    }

    if (request.method === 'upi') {
      return {
        success: true,
        transactionId: txnId,
        method: 'upi',
        message: 'UPI payment verified instantly via Virtual Payment Address.',
        timestamp: new Date().toISOString()
      };
    }

    return {
      success: true,
      transactionId: txnId,
      method: 'card',
      message: 'Card authorized and payment captured successfully.',
      timestamp: new Date().toISOString()
    };
  }
}

export const activePaymentProvider = new MockPaymentProvider();
