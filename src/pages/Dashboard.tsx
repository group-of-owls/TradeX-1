import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  TrendingUp, 
  Activity,
  Star
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTradeStore } from '../store/useTradeStore';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const StatCard = ({ title, value, subValue, icon: Icon, trend }: any) => (
  <Card className="glass relative overflow-hidden group border-white/5 p-4 sm:p-0">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
      <CardTitle className="text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-500 font-extrabold">{title}</CardTitle>
      <div className="p-2 bg-primary/10 rounded-lg text-primary hidden sm:block">
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent className="pt-0 sm:pt-6">
      <div className="text-xl sm:text-2xl xl:text-3xl font-extrabold tracking-tight">{value}</div>
      <div className={`text-[10px] sm:text-xs font-bold mt-1 flex items-center gap-1 ${trend > 0 ? 'neon-green' : 'neon-red'}`}>
        {trend > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        <span>{subValue}</span>
      </div>
    </CardContent>
  </Card>
);

const AssetCard = ({ asset }: { asset: any; key?: string }) => (
  <Link to={`/asset/${asset.id}`}>
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group flex items-center justify-between"
    >
      <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-[10px] sm:text-xs text-[#00ff88]">
          {asset.symbol.substring(0, 2)}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-extrabold text-sm tracking-tight truncate">{asset.symbol}</span>
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider hidden lg:block truncate">{asset.name}</span>
        </div>
      </div>
      <div className="flex flex-col items-end flex-shrink-0 ml-2">
        <span className="font-bold text-sm tracking-tight">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        <span className={`text-[10px] font-black ${asset.change24h > 0 ? 'neon-green' : 'neon-red'}`}>
          {asset.change24h > 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
        </span>
      </div>
    </motion.div>
  </Link>
);

export default function Dashboard() {
  const { assets, portfolio, watchlist } = useTradeStore();
  
  const dailyPnL = portfolio.totalValue - 100000;
  const dailyPnLPercent = (dailyPnL / 100000) * 100;

  const topGainers = [...assets].sort((a, b) => b.change24h - a.change24h).slice(0, 4);
  const cryptoAssets = assets.filter(a => a.type === 'crypto').sort((a, b) => b.change24h - a.change24h).slice(0, 4);
  const stockAssets = assets.filter(a => a.type === 'stock').sort((a, b) => b.change24h - a.change24h).slice(0, 4);
  const watchlistAssets = assets.filter(a => watchlist.includes(a.id));

  const handleExtractLogs = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: 'Decrypting and packaging market logs...',
      success: 'MarketLogs_2026_05_07.csv exported successfully',
      error: 'Log extraction failed: Connection timeout',
    });
  };

  const handleNewOrder = () => {
    toast.info('Order Entry System', {
      description: 'Quick order terminal is currently in view-only mode for this asset.'
    });
  };

  const handleFeatureSoon = (feature: string) => {
    toast.info(`${feature} coming soon`, {
      description: 'Our engineering team is currently syncing this module.'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black italic tracking-tighter uppercase">Market Overview</h1>
          <p className="text-zinc-500 font-medium text-xs sm:text-sm">Welcome back, John. Here's your terminal status.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            onClick={handleExtractLogs}
            className="flex-1 md:flex-none rounded-xl font-bold uppercase tracking-widest text-xs h-10 px-6"
          >
            Extract Logs
          </Button>
          <Button 
            onClick={handleNewOrder}
            className="flex-1 md:flex-none rounded-xl shadow-lg shadow-primary/25 font-black uppercase tracking-widest text-xs h-10 px-6"
          >
            New Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        <StatCard 
          title="Total Portfolio Value" 
          value={`$${portfolio.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} 
          subValue="+$2,450.40 (2.4%)" 
          icon={Wallet} 
          trend={1}
        />
        <StatCard 
          title="Today's P&L" 
          value={`$${dailyPnL.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} 
          subValue={`${dailyPnLPercent.toFixed(2)}% vs yesterday`} 
          icon={TrendingUp} 
          trend={dailyPnL > 0 ? 1 : -1}
        />
        <StatCard 
          title="Market Volume" 
          value="$124.5B" 
          subValue="-4.2% from peak" 
          icon={Activity} 
          trend={-1}
        />
        <StatCard 
          title="Success Rate" 
          value="78.5%" 
          subValue="+2.1% this month" 
          icon={Star} 
          trend={1}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                <Activity className="text-[#00ff88] h-4 w-4" />
                Crypto Terminal
              </h2>
              <Link to="/crypto">
                <Button 
                  variant="link" 
                  className="text-[10px] uppercase font-black tracking-widest text-zinc-500"
                >
                  View Tokens
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cryptoAssets.map(asset => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                <TrendingUp className="text-blue-500 h-4 w-4" />
                Stock Terminal
              </h2>
              <Link to="/stocks">
                <Button 
                  variant="link" 
                  className="text-[10px] uppercase font-black tracking-widest text-zinc-500"
                >
                  View Equities
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stockAssets.map(asset => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          </section>

          <section>
             <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                <Star className="text-yellow-500 h-4 w-4 fill-yellow-500/20" />
                Your Watchlist
              </h2>
              <Button 
                variant="link" 
                onClick={() => handleFeatureSoon('Watchlist Management')}
                className="text-[10px] uppercase font-black tracking-widest text-zinc-500"
              >
                Manage
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {watchlistAssets.length > 0 ? (
                watchlistAssets.map(asset => (
                  <AssetCard key={asset.id} asset={asset} />
                ))
              ) : (
                <div className="col-span-full p-8 border-2 border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500 text-sm font-bold uppercase tracking-widest">
                  Watchlist empty.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          <Card className="glass h-fit border-white/5">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className={`w-1.5 h-1.5 mt-1.5 rounded-full ${i % 2 === 0 ? 'bg-[#00ff88]' : 'bg-[#ff4466]'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-bold tracking-tight">
                      {i % 2 === 0 ? 'Bought' : 'Sold'} {i % 2 === 0 ? 'AAPL' : 'BTC'}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">2 hours ago • $1,240.50</p>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={() => handleFeatureSoon('Order History')}
                className="w-full rounded-xl font-bold uppercase tracking-widest text-[10px] border-zinc-800 text-zinc-500"
              >
                View Order History
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/10 border border-primary/20 p-6 rounded-2xl relative overflow-hidden group">
             <div className="relative z-10">
               <h3 className="font-black text-lg mb-2 uppercase italic tracking-tighter">Upgrade to Pro</h3>
               <p className="text-xs font-bold text-zinc-400 mb-6 uppercase leading-relaxed">Unlock advanced terminal metrics and deeper sync.</p>
               <Button 
                 onClick={() => handleFeatureSoon('Pro Upgrade')}
                 className="w-full rounded-xl font-black uppercase tracking-widest text-xs h-12 shadow-xl shadow-primary/20"
               >
                 Upgrade Now
               </Button>
             </div>
             <TrendingUp className="absolute -bottom-6 -right-6 h-32 w-32 text-primary opacity-5 group-hover:opacity-10 transition-opacity" />
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
