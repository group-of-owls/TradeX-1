import { motion } from 'motion/react';
import { useTradeStore } from '../store/useTradeStore';
import { Search, Filter, TrendingUp, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// Copying AssetCard here for simplicity
const AssetCardLocal = ({ asset }: { asset: any; key?: string }) => (
  <Link to={`/asset/${asset.id}`}>
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/5 hover:border-[#00ff88]/30 transition-all group flex items-center justify-between overflow-hidden"
    >
      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
        <div className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-xs sm:text-lg group-hover:border-[#00ff88]/50 transition-colors text-[#00ff88]">
          {asset.symbol.substring(0, 2)}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-black text-sm sm:text-lg tracking-tighter italic uppercase truncate">{asset.symbol}</span>
          <span className="text-[9px] sm:text-xs text-zinc-500 uppercase font-black tracking-widest truncate">{asset.name}</span>
        </div>
      </div>
      <div className="flex flex-col items-end flex-shrink-0 ml-2">
        <span className="font-black text-sm sm:text-lg tracking-tighter italic whitespace-nowrap">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        <span className={`text-[9px] sm:text-xs font-black uppercase tracking-widest ${asset.change24h > 0 ? 'neon-green' : 'neon-red'}`}>
          {asset.change24h > 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
        </span>
      </div>
    </motion.div>
  </Link>
);

export default function Market({ type }: { type: 'stock' | 'crypto' }) {
  const { assets } = useTradeStore();
  const [search, setSearch] = useState('');
  
  const filteredAssets = assets
    .filter(a => a.type === type)
    .filter(a => 
      a.symbol.toLowerCase().includes(search.toLowerCase()) || 
      a.name.toLowerCase().includes(search.toLowerCase())
    );

  const title = type === 'crypto' ? 'Digital Assets' : 'Corporate Equities';
  const Icon = type === 'crypto' ? Activity : TrendingUp;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <Icon size={24} className={type === 'crypto' ? 'text-[#00ff88]' : 'text-blue-500'} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Terminal Category</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tighter uppercase underline decoration-[#00ff88] decoration-4 sm:decoration-8 underline-offset-4 sm:underline-offset-8">
            {title}
          </h1>
          <p className="text-zinc-500 font-bold text-sm mt-6 uppercase tracking-widest">
            Protocol synchronized. Full market transparency for {type === 'crypto' ? 'Web3' : 'NASDAQ/NYSE'} operations.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH PROTOCOL..." 
              className="pl-12 h-14 bg-white/5 border-white/5 rounded-2xl font-black uppercase tracking-widest text-xs focus:ring-1 focus:ring-[#00ff88]/50"
            />
          </div>
          <Button 
            onClick={() => toast.info('Filtering Protocol', { description: 'Advanced metadata indexing is currently in sync mode.' })}
            variant="outline" 
            className="h-14 w-14 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 p-0 text-zinc-500"
          >
            <Filter size={20} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.length > 0 ? (
          filteredAssets.map(asset => (
            <AssetCardLocal key={asset.id} asset={asset} />
          ))
        ) : (
          <div className="col-span-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-[2.5rem] text-zinc-600">
             <Search size={48} className="mb-4 opacity-20" />
             <p className="text-sm font-black uppercase tracking-widest">No matching assets found in local buffer.</p>
          </div>
        )}
      </div>

      <Card className="glass border-white/5 p-8 rounded-[2.5rem]">
         <div className="flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="space-y-2">
             <h3 className="font-black italic text-2xl uppercase tracking-tighter">Market Metrics</h3>
             <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-loose">
               {type === 'crypto' 
                 ? 'Analyzing layer 1 liquidity and DeFi velocity.' 
                 : 'Monitoring global equity flows and institutional positioning.'}
             </p>
           </div>
           <div className="flex gap-12">
             <div className="text-center">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Status</p>
               <p className="text-xl font-black italic tracking-tighter neon-green">SYNCHRONIZED</p>
             </div>
             <div className="text-center">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Assets</p>
               <p className="text-xl font-black italic tracking-tighter">{filteredAssets.length}</p>
             </div>
           </div>
         </div>
      </Card>
    </motion.div>
  );
}
