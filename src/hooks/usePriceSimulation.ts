import { useEffect } from 'react';
import { useTradeStore } from '../store/useTradeStore';

export const usePriceSimulation = () => {
  const updatePrices = useTradeStore(state => state.updatePrices);

  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices();
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [updatePrices]);
};
