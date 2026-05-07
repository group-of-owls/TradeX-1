import { Asset } from '../types';

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'apple',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    price: 189.45,
    change24h: 1.2,
    volume: '52.4M',
    high24h: 191.20,
    low24h: 188.10,
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    history: []
  },
  {
    id: 'bitcoin',
    symbol: 'BTCUSDT',
    name: 'Bitcoin',
    type: 'crypto',
    price: 64230.50,
    change24h: -2.3,
    volume: '34.1B',
    high24h: 66800.00,
    low24h: 63500.00,
    description: 'Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network.',
    history: []
  },
  {
    id: 'ethereum',
    symbol: 'ETHUSDT',
    name: 'Ethereum',
    type: 'crypto',
    price: 3450.20,
    change24h: 0.5,
    volume: '15.2B',
    high24h: 3520.00,
    low24h: 3380.00,
    description: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform.',
    history: []
  },
  {
    id: 'tesla',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    type: 'stock',
    price: 175.30,
    change24h: -4.2,
    volume: '88.5M',
    high24h: 182.40,
    low24h: 174.10,
    description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.',
    history: []
  },
  {
    id: 'nvidia',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    type: 'stock',
    price: 890.15,
    change24h: 3.8,
    volume: '45.1M',
    high24h: 902.00,
    low24h: 875.50,
    description: 'NVIDIA Corporation provides graphics, and computing and networking solutions worldwide.',
    history: []
  },
  {
    id: 'google',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    type: 'stock',
    price: 154.20,
    change24h: 0.8,
    volume: '22.4M',
    high24h: 156.10,
    low24h: 153.20,
    description: 'Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.',
    history: []
  },
  {
    id: 'solana',
    symbol: 'SOLUSDT',
    name: 'Solana',
    type: 'crypto',
    price: 145.20,
    change24h: 8.5,
    volume: '4.2B',
    high24h: 152.00,
    low24h: 132.50,
    description: 'Solana is a public blockchain platform with smart contract functionality. Its native cryptocurrency is SOL.',
    history: []
  },
  {
    id: 'reliance',
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    type: 'stock',
    price: 2950.40,
    change24h: 1.1,
    volume: '8.4M',
    high24h: 2980.00,
    low24h: 2920.00,
    description: 'Reliance Industries Limited is an Indian multinational conglomerate company, headquartered in Mumbai.',
    history: []
  },
  {
    id: 'amazon',
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    type: 'stock',
    price: 178.20,
    change24h: -1.3,
    volume: '38.2M',
    high24h: 181.50,
    low24h: 177.10,
    description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally.',
    history: []
  },
  {
    id: 'cardano',
    symbol: 'ADAUSDT',
    name: 'Cardano',
    type: 'crypto',
    price: 0.45,
    change24h: -1.5,
    volume: '600M',
    high24h: 0.47,
    low24h: 0.44,
    description: 'Cardano is a public blockchain platform. It is open-source and decentralized, with consensus achieved using proof of stake.',
    history: []
  },
  {
    id: 'meta',
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    type: 'stock',
    price: 495.10,
    change24h: 2.1,
    volume: '15.2M',
    high24h: 504.00,
    low24h: 490.50,
    description: 'Meta Platforms, Inc. engages in the development of social media applications and advertising technology.',
    history: []
  },
  {
    id: 'dogecoin',
    symbol: 'DOGEUSDT',
    name: 'Dogecoin',
    type: 'crypto',
    price: 0.16,
    change24h: 4.2,
    volume: '1.8B',
    high24h: 0.17,
    low24h: 0.15,
    description: 'Dogecoin is a cryptocurrency created by software engineers Billy Markus and Jackson Palmer, who decided to create a payment system as a joke.',
    history: []
  }
];

// Initialize history for all assets
INITIAL_ASSETS.forEach(asset => {
  const history = [];
  let currentPrice = asset.price * (1 - (asset.change24h / 100)); // Start from 24h ago
  
  for (let i = 0; i < 50; i++) {
    const time = new Date();
    time.setMinutes(time.getMinutes() - (50 - i) * 5);
    
    // Slight random walk
    currentPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.01);
    history.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: currentPrice
    });
  }
  asset.history = history;
});
