import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Asset, Holding, Order, Portfolio } from '../types';
import { INITIAL_ASSETS } from '../data/assets';

interface TradeState {
  assets: Asset[];
  portfolio: Portfolio;
  orders: Order[];
  updatePrices: () => void;
  executeTrade: (assetId: string, type: 'buy' | 'sell', quantity: number) => boolean;
  addToWatchlist: (assetId: string) => void;
  addFunds: (amount: number) => void;
  watchlist: string[];
}

export const useTradeStore = create<TradeState>()(
  persist(
    (set, get) => ({
      assets: INITIAL_ASSETS,
      portfolio: {
        holdings: [],
        cash: 100000, // Start with $100k
        totalValue: 100000,
      },
      orders: [],
      watchlist: ['apple', 'bitcoin', 'ethereum', 'nvidia'],

      updatePrices: () => {
        set((state) => {
          const newAssets = state.assets.map((asset) => {
            const change = (Math.random() - 0.5) * 0.002 * asset.price;
            const newPrice = asset.price + change;
            const newHistory = [...asset.history.slice(1), {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              price: newPrice
            }];

            return {
              ...asset,
              price: newPrice,
              change24h: asset.change24h + (change / asset.price) * 100,
              history: newHistory,
            };
          });

          // Update total portfolio value based on new prices
          const holdingsValue = state.portfolio.holdings.reduce((acc, holding) => {
            const asset = newAssets.find(a => a.id === holding.assetId);
            return acc + (asset ? asset.price * holding.quantity : 0);
          }, 0);

          return {
            assets: newAssets,
            portfolio: {
              ...state.portfolio,
              totalValue: state.portfolio.cash + holdingsValue,
            },
          };
        });
      },

      executeTrade: (assetId, type, quantity) => {
        const state = get();
        const asset = state.assets.find(a => a.id === assetId);
        if (!asset) return false;

        const totalCost = asset.price * quantity;

        if (type === 'buy') {
          if (state.portfolio.cash < totalCost) return false;

          const newOrder: Order = {
            id: Math.random().toString(36).substr(2, 9),
            assetId,
            symbol: asset.symbol,
            type: 'buy',
            quantity,
            price: asset.price,
            timestamp: new Date(),
            status: 'executed',
          };

          const existingHolding = state.portfolio.holdings.find(h => h.assetId === assetId);
          let newHoldings;

          if (existingHolding) {
            newHoldings = state.portfolio.holdings.map(h => 
              h.assetId === assetId 
                ? { 
                    ...h, 
                    quantity: h.quantity + quantity,
                    avgPrice: (h.avgPrice * h.quantity + totalCost) / (h.quantity + quantity)
                  } 
                : h
            );
          } else {
            newHoldings = [...state.portfolio.holdings, {
              assetId,
              symbol: asset.symbol,
              name: asset.name,
              quantity,
              avgPrice: asset.price,
            }];
          }

          set({
            portfolio: {
              ...state.portfolio,
              cash: state.portfolio.cash - totalCost,
              holdings: newHoldings,
            },
            orders: [newOrder, ...state.orders],
          });
        } else {
          const existingHolding = state.portfolio.holdings.find(h => h.assetId === assetId);
          if (!existingHolding || existingHolding.quantity < quantity) return false;

          const newOrder: Order = {
            id: Math.random().toString(36).substr(2, 9),
            assetId,
            symbol: asset.symbol,
            type: 'sell',
            quantity,
            price: asset.price,
            timestamp: new Date(),
            status: 'executed',
          };

          let newHoldings = state.portfolio.holdings.map(h => 
            h.assetId === assetId 
              ? { ...h, quantity: h.quantity - quantity } 
              : h
          ).filter(h => h.quantity > 0);

          set({
            portfolio: {
              ...state.portfolio,
              cash: state.portfolio.cash + totalCost,
              holdings: newHoldings,
            },
            orders: [newOrder, ...state.orders],
          });
        }

        return true;
      },

      addToWatchlist: (assetId) => {
        set(state => ({
          watchlist: state.watchlist.includes(assetId)
            ? state.watchlist.filter(id => id !== assetId)
            : [...state.watchlist, assetId]
        }));
      },

      addFunds: (amount) => {
        set(state => ({
          portfolio: {
            ...state.portfolio,
            cash: state.portfolio.cash + amount,
            totalValue: state.portfolio.totalValue + amount,
          }
        }));
      }
    }),
    {
      name: 'trade-storage',
    }
  )
);
