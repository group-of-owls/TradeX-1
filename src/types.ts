export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
  price: number;
  change24h: number;
  volume: string;
  high24h: number;
  low24h: number;
  description: string;
  history: PricePoint[];
}

export interface PricePoint {
  time: string;
  price: number;
}

export interface Holding {
  assetId: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
}

export interface Order {
  id: string;
  assetId: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: Date;
  status: 'executed' | 'pending';
}

export interface Portfolio {
  holdings: Holding[];
  cash: number;
  totalValue: number;
}
