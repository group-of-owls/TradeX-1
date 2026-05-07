import { motion } from 'motion/react';
import { 
  PieChart as PieChartIcon, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTradeStore } from '../store/useTradeStore';
import { Link } from 'react-router-dom';

const COLORS = ['#00ff88', '#6366f1', '#ff4466', '#f59e0b', '#8b5cf6', '#ec4899'];

import { toast } from 'sonner';

export default function Portfolio() {
  const { portfolio, assets, addFunds } = useTradeStore();

  const handleAddAssets = () => {
    toast.info('Asset Onboarding Protocol', {
      description: 'The secure deposit terminal is currently in maintenance mode.'
    });
  };

  const handleAddFunds = () => {
    addFunds(10000);
    toast.success('Funds Injected', {
      description: 'Successfully added $10,000.00 to your buying power.',
      icon: <Wallet className="h-4 w-4 text-[#00ff88]" />
    });
  };

  const holdingsWithCurrentData = portfolio.holdings.map(holding => {
    const asset = assets.find(a => a.id === holding.assetId);
    const currentValue = (asset?.price || 0) * holding.quantity;
    const profit = currentValue - (holding.avgPrice * holding.quantity);
    const profitPercent = (profit / (holding.avgPrice * holding.quantity)) * 100;
    
    return {
      ...holding,
      currentPrice: asset?.price || 0,
      currentValue,
      profit,
      profitPercent,
    };
  });

  const chartData = holdingsWithCurrentData.map(h => ({
    name: h.symbol,
    value: h.currentValue
  }));

  if (portfolio.cash > 0) {
    chartData.push({ name: 'Cash', value: portfolio.cash });
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black italic tracking-tighter uppercase underline decoration-[#00ff88] decoration-4 underline-offset-8">Portfolio</h1>
          <p className="text-zinc-500 font-medium text-xs sm:text-sm mt-3">Manage and track your asset terminal terminal.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button 
            onClick={handleAddFunds}
            variant="outline"
            className="w-full sm:w-auto rounded-xl border-white/5 bg-white/5 hover:bg-white/10 font-black uppercase tracking-widest text-xs h-12 px-8"
          >
            <Wallet size={18} className="mr-2" />
            Add Funds
          </Button>
          <Button 
            onClick={handleAddAssets}
            className="w-full sm:w-auto rounded-xl font-black uppercase tracking-widest text-xs h-12 px-8 shadow-lg shadow-[#00ff88]/20"
          >
            <Plus size={18} className="mr-2" />
            Add Assets
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 glass flex flex-col border-white/5 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 font-black">
              <PieChartIcon size={16} className="text-[#00ff88]" />
              Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center min-h-[250px] sm:min-h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#050505', 
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 800,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-500 font-bold uppercase tracking-widest text-xs h-32">
                Terminal Syncing...
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Card className="glass relative overflow-hidden group border-white/5">
              <CardHeader className="pb-1 sm:pb-2">
                <CardTitle className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight">${portfolio.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                <div className="flex items-center gap-1 neon-green text-[9px] sm:text-[10px] mt-1 font-black uppercase tracking-widest">
                  <ArrowUpRight size={12} className="sm:w-3.5 sm:h-3.5" />
                  +12.45% all time
                </div>
              </CardContent>
            </Card>
            <Card className="glass border-white/5">
              <CardHeader className="pb-1 sm:pb-2">
                <CardTitle className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Buying Power</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight">${portfolio.cash.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mt-1">Ready to trade</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass border-white/5 overflow-hidden">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Holdings</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
               <div className="overflow-x-auto">
                 <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-white/5">
                      <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500 min-w-[150px]">Asset</TableHead>
                      <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Qty</TableHead>
                      <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Avg</TableHead>
                      <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500 text-right">P&L</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holdingsWithCurrentData.length > 0 ? (
                      holdingsWithCurrentData.map((holding) => (
                        <TableRow key={holding.assetId} className="group border-white/5 hover:bg-white/5 transition-colors">
                          <TableCell className="py-4">
                            <Link to={`/asset/${holding.assetId}`} className="font-extrabold text-sm tracking-tight hover:text-[#00ff88] transition-colors">
                              {holding.symbol}
                            </Link>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{holding.name}</p>
                          </TableCell>
                          <TableCell className="font-bold text-sm tracking-tighter whitespace-nowrap">{holding.quantity}</TableCell>
                          <TableCell className="font-bold text-sm tracking-tighter whitespace-nowrap">${holding.avgPrice.toLocaleString()}</TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <div className={`text-sm font-black tracking-tighter ${holding.profit >= 0 ? 'neon-green' : 'neon-red'}`}>
                              {holding.profit >= 0 ? '+' : '-'}${Math.abs(holding.profit).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </div>
                            <p className={`text-[10px] font-black uppercase tracking-tighter ${holding.profit >= 0 ? 'neon-green' : 'neon-red'}`}>
                              ({holding.profitPercent.toFixed(2)}%)
                            </p>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                          Terminal empty. Execute trades to view holdings.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
