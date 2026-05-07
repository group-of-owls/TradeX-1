import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  CheckCircle2,
  AlertCircle,
  Wallet,
  Zap,
  ArrowRight
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useTradeStore } from '../store/useTradeStore';
import { toast } from 'sonner';

export default function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { assets, executeTrade, portfolio } = useTradeStore();
  const [quantity, setQuantity] = useState('1');
  const [activeTimeframe, setActiveTimeframe] = useState('1D');
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  const asset = assets.find(a => a.id === id);

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle size={48} className="text-muted-foreground" />
        <h2 className="text-2xl font-bold">Asset Not Found</h2>
        <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
      </div>
    );
  }

  const isPositive = asset.change24h > 0;
  
  const handleOpenTrade = (type: 'buy' | 'sell') => {
    setTradeType(type);
    setIsTradeModalOpen(true);
  };

  const handleTrade = () => {
    const q = parseFloat(quantity);
    if (isNaN(q) || q <= 0) {
      toast.error('Invalid quantity');
      return;
    }

    const success = executeTrade(asset.id, tradeType, q);
    if (success) {
      toast.success(`Successfully ${tradeType === 'buy' ? 'bought' : 'sold'} ${q} ${asset.symbol}`);
      setIsTradeModalOpen(false);
    } else {
      toast.error(tradeType === 'buy' ? 'Insufficient funds' : 'Insufficient holdings');
    }
  };

  const totalCost = parseFloat(quantity || '0') * asset.price;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-lg uppercase shadow-xl">
              {asset.symbol.substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-4xl font-black italic tracking-tighter uppercase">{asset.name}</h1>
                <Badge className="bg-zinc-800 text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-700">
                  {asset.type}
                </Badge>
              </div>
              <p className="text-zinc-500 font-black text-sm tracking-[0.2em] uppercase">{asset.symbol}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
                loading: 'Generating shareable terminal link...',
                success: 'Terminal coordinates copied to clipboard',
                error: 'Relay failed',
              });
            }}
            className="rounded-xl border-white/5 bg-white/5 hover:bg-white/10 font-bold uppercase tracking-widest text-[10px] h-10"
          >
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass p-6 border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <div className="text-5xl font-black tracking-tighter">
                  ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </div>
                <div className={`flex items-center gap-1 font-black mt-1 text-xs uppercase tracking-widest ${isPositive ? 'neon-green' : 'neon-red'}`}>
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{isPositive ? '+' : ''}{asset.change24h.toFixed(2)}% Today</span>
                </div>
              </div>
              <Tabs value={activeTimeframe} onValueChange={setActiveTimeframe}>
                <TabsList className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 shrink-0">
                  {['1H', '1D', '1W', '1M', '1Y', 'ALL'].map((tf) => (
                    <TabsTrigger key={tf} value={tf} className="rounded-lg text-[10px] font-black tracking-widest px-3 h-8 uppercase">
                      {tf}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="h-[250px] sm:h-[300px] md:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={asset.history}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? '#00ff88' : '#ff4466'} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={isPositive ? '#00ff88' : '#ff4466'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#52525b', fontWeight: 800 }}
                    minTickGap={30}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#52525b', fontWeight: 800 }}
                    tickFormatter={(val) => `$${val.toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#050505', 
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 800,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={isPositive ? '#00ff88' : '#ff4466'} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="glass border-white/5">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                <Info size={16} className="text-[#00ff88]" />
                Protocol Intel
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-zinc-400 font-medium leading-relaxed mb-8 text-sm sm:text-base">
                {asset.description}
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                <div className="space-y-1">
                  <p className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest">Market Capacity</p>
                  <p className="font-black italic tracking-tighter text-base sm:text-lg uppercase">TBD</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest">Relay Volume</p>
                  <p className="font-black italic tracking-tighter text-base sm:text-lg uppercase">{asset.volume}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest">24h Ceiling</p>
                  <p className="font-black italic tracking-tighter text-base sm:text-lg text-[#00ff88]">${asset.high24h.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest">24h Floor</p>
                  <p className="font-black italic tracking-tighter text-base sm:text-lg text-[#ff4466]">${asset.low24h.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          <Card className="glass border-white/5 shadow-2xl overflow-hidden group">
            <div className="p-6 sm:p-8 bg-gradient-to-br from-zinc-900 to-black relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={60} className="text-[#00ff88] sm:hidden" />
                <Zap size={80} className="text-[#00ff88] hidden sm:block" />
              </div>
              <h3 className="text-lg sm:text-xl font-black italic tracking-tighter uppercase mb-2">Terminal Trade</h3>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6 sm:mb-8">Execute instant market operations</p>
               <div className="flex flex-col gap-3">
                <Button 
                   className="w-full h-12 sm:h-14 bg-[#00ff88] text-black font-black text-xs sm:text-sm uppercase rounded-xl tracking-[0.2em] hover:brightness-110 shadow-[0_10px_20px_rgba(0,255,136,0.2)] active:scale-95 transition-all"
                   onClick={() => handleOpenTrade('buy')}
                >
                  Initiate Buy
                </Button>
                <Button 
                   variant="outline" 
                   className="w-full h-12 sm:h-14 bg-transparent border border-zinc-800 text-zinc-400 font-black text-xs sm:text-sm uppercase rounded-xl tracking-[0.2em] hover:border-[#ff4466] hover:text-[#ff4466] active:scale-95 transition-all"
                   onClick={() => handleOpenTrade('sell')}
                >
                  Initiate Sell
                </Button>
              </div>
            </div>
            <CardFooter className="bg-white/5 border-t border-white/5 p-4 flex flex-col gap-4">
              <div className="w-full flex items-center justify-between text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                  <Wallet size={12} className="text-[#00ff88]" />
                  <span>Funds: ${portfolio.cash.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-[#00ff88]" />
                  <span>Verified</span>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card className="glass border-white/5 p-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">Position Details</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Holdings</span>
                <span className="font-black italic tracking-tighter">
                  {portfolio.holdings.find(h => h.assetId === asset.id)?.quantity || 0} {asset.symbol}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Avg. Price</span>
                <span className="font-black italic tracking-tighter">
                  ${(portfolio.holdings.find(h => h.assetId === asset.id)?.avgPrice || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={isTradeModalOpen} onOpenChange={setIsTradeModalOpen}>
        <DialogContent className="max-w-md bg-[#050505] border-white/10 p-0 overflow-hidden rounded-[2rem]">
          <div className={`h-2 w-full ${tradeType === 'buy' ? 'bg-[#00ff88]' : 'bg-[#ff4466]'}`} />
          
          <DialogHeader className="p-8 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-sm uppercase">
                {asset.symbol.substring(0, 2)}
              </div>
              <div>
                <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase">
                  {tradeType === 'buy' ? 'Buy' : 'Sell'} {asset.symbol}
                </DialogTitle>
                <DialogDescription className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Confirm transaction details
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 pt-0 space-y-6">
            <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Market Price</span>
                <span className="font-black italic tracking-tighter text-lg">
                  ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Slippage</span>
                <span className="font-black italic tracking-tighter text-[#00ff88] text-xs">AUTO (0.5%)</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Quantity to {tradeType}</label>
              <div className="relative">
                <Input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)} 
                  className="rounded-2xl pr-20 h-16 bg-zinc-900 border-white/5 focus:border-[#00ff88] transition-all text-xl font-black italic tracking-tighter"
                  placeholder="0.00"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  {asset.symbol}
                </span>
              </div>
            </div>

            <div className="space-y-2 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estimated Total</span>
                <span className="font-black italic tracking-tighter text-xl text-white">
                  ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 pt-0 flex-col sm:flex-col gap-3">
            <Button 
              className={`w-full h-14 font-black uppercase tracking-[0.2em] text-sm rounded-xl transition-all shadow-xl ${
                tradeType === 'buy' 
                  ? 'bg-[#00ff88] text-black hover:bg-[#00ff88]/90 shadow-[#00ff88]/20' 
                  : 'bg-[#ff4466] text-white hover:bg-[#ff4466]/90 shadow-[#ff4466]/20'
              }`}
              onClick={handleTrade}
            >
              Confirm Transaction
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white"
              onClick={() => setIsTradeModalOpen(false)}
            >
              Abort Operation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

