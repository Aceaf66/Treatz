export type Species = 'dog' | 'cat' | 'all';
export type PetSpecies = 'dog' | 'cat';

export type AgeGroup = 'puppy' | 'kitten' | 'adult' | 'senior' | 'all';
export type ActivityLevel = 'low' | 'moderate' | 'high';
export type DietaryPreference = 'regular' | 'grain_free' | 'sensitive' | 'weight_management' | 'high_protein' | 'hypoallergenic';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  age: string; // e.g., "3 years" or "7 months"
  ageGroup: 'puppy' | 'kitten' | 'adult' | 'senior';
  gender: 'male' | 'female';
  weight: number; // in kg
  activityLevel: ActivityLevel;
  dietaryPreference: DietaryPreference;
  foodSensitivities: string[];
  image?: string;
  isDefault?: boolean;
}

export interface NutritionalInfo {
  protein: string;
  fat: string;
  fiber: string;
  moisture: string;
  calories: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  species: 'dog' | 'cat' | 'both';
  price: number;
  discount: number; // percentage, e.g. 15 for 15% off
  stock: number;
  description: string;
  ingredients: string[];
  nutritionalInfo: NutritionalInfo;
  image: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  ageGroup: ('puppy' | 'kitten' | 'adult' | 'senior' | 'all')[];
  dietaryPreference: DietaryPreference[];
  weightSize: string; // e.g. "3 kg", "12 x 85g", "150g"
  isSubscriptionEligible: boolean;
  featured?: boolean;
  bestSeller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'both';
  icon: string;
  description: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isSubscription?: boolean;
  subscriptionFrequency?: number; // 7, 15, 30, 45, 60
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export type OrderStatus = 'Order Placed' | 'Confirmed' | 'Packed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface TrackingEvent {
  status: string;
  time: string;
  completed: boolean;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  address: Address;
  paymentMethod: 'upi' | 'card' | 'cod';
  paymentStatus: 'completed' | 'pending';
  status: OrderStatus;
  trackingEvents: TrackingEvent[];
  estimatedDelivery: string;
  pointsEarned: number;
  petName?: string;
}

export type SubscriptionFrequency = 7 | 15 | 30 | 45 | 60;

export interface Subscription {
  id: string;
  product: Product;
  petName?: string;
  quantity: number;
  frequencyDays: SubscriptionFrequency;
  nextDeliveryDate: string;
  status: 'active' | 'paused' | 'cancelled';
  address: Address;
  paymentMethod: string;
  discountPercent: number; // typically 10%
  createdDate: string;
}

export interface RewardTransaction {
  id: string;
  date: string;
  description: string;
  points: number;
  type: 'earned' | 'redeemed';
}

export interface RewardVoucher {
  id: string;
  code: string;
  title: string;
  pointsCost: number;
  discountAmount: number;
  minSpend: number;
  claimed: boolean;
  expiresDate: string;
}

export interface UserRewards {
  currentPoints: number;
  pointsEarnedTotal: number;
  pointsRedeemedTotal: number;
  transactions: RewardTransaction[];
  availableVouchers: RewardVoucher[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  petName?: string;
  petBreed?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  memberSince: string;
}

export interface RecommendationMatch {
  product: Product;
  score: number;
  reasons: string[];
}

export interface CompatibilityCheck {
  isCompatible: boolean;
  score: number; // 0-100
  title: string;
  highlights: string[];
  considerations: string[];
}
