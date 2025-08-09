// Rwanda currency utilities
export const CURRENCY = {
  symbol: 'RWF',
  name: 'Rwandan Franc',
  decimals: 0, // Rwanda Franc doesn't use decimals in everyday transactions
};

// Realistic pricing for Rwanda (in RWF)
export const PRICING = {
  // Event tickets (reasonable for events in Rwanda)
  tickets: {
    regular: 3000,      // ~$2.50 USD
    vip: 8000,          // ~$6.50 USD
    premium: 15000,     // ~$12 USD
    vvip: 25000,        // ~$20 USD
  },
  
  // Food and drinks (realistic Rwanda prices)
  food: {
    softDrinks: 800,    // ~$0.65 USD (Coca-Cola, Fanta)
    water: 500,         // ~$0.40 USD
    beer: 1200,         // ~$1.00 USD
    burger: 3500,       // ~$2.80 USD
    pizza: 8000,        // ~$6.50 USD
    rice: 2500,         // ~$2.00 USD
    chicken: 4500,      // ~$3.60 USD
    snacks: 1000,       // ~$0.80 USD
  },
  
  // Service fees
  processing: 500,      // ~$0.40 USD
  delivery: 1000,       // ~$0.80 USD
};

export function formatCurrency(amount: number): string {
  // Format without decimals as is common in Rwanda
  return `${Math.round(amount).toLocaleString()} ${CURRENCY.symbol}`;
}

export function formatCurrencyShort(amount: number): string {
  // Short format for display
  return `${Math.round(amount).toLocaleString()} Rwf`;
}

// Convert from other currencies (for admin/backend use)
export function convertToRWF(amount: number, fromCurrency: 'USD' | 'EUR'): number {
  const rates = {
    USD: 1250, // Approximate exchange rate (changes frequently)
    EUR: 1350,
  };
  return Math.round(amount * rates[fromCurrency]);
}

// Common price calculations
export function calculateSubtotal(items: Array<{price: number, quantity: number}>): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function calculateTotal(subtotal: number, processingFee: number = PRICING.processing): number {
  return subtotal + processingFee;
}

export function applyDiscount(amount: number, discountPercent: number): number {
  return Math.round(amount * (1 - discountPercent / 100));
}
