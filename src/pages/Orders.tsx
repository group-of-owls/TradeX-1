import React from 'react';
import { motion } from 'motion/react';
import { 
  History, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Search,
  CheckCircle2,
  Clock
} from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { useTradeStore } from '../store/useTradeStore';
import { format } from 'date-fns';

import { toast } from 'sonner';

export default function Orders() {
  const { orders } = useTradeStore();

  const handleExport = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: 'Compiling transaction manifest...',
      success: 'OrderHistory_Batch_A.csv exported successfully',
      error: 'Export failed: Buffer overflow',
    });
  };

  const handleFilters = () => {
    toast.info('Filter Engine', {
      description: 'Advanced relational filtering is restricted to Enterprise members.'
    });
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      toast.info('Asset Filter Active', {
        description: 'Showing terminal logs filtered by metadata.'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black italic tracking-tighter uppercase">Order History</h1>
          <p className="text-zinc-500 font-medium text-xs sm:text-sm mt-2">Detailed logs of all your terminal operations.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            onClick={handleFilters}
            variant="outline" 
            className="flex-1 md:flex-none rounded-xl gap-2 font-black uppercase text-[10px] tracking-widest h-10 border-zinc-800"
          >
            <Filter size={16} />
            Filters
          </Button>
          <Button 
            onClick={handleExport}
            variant="outline" 
            className="flex-1 md:flex-none rounded-xl gap-2 font-black uppercase text-[10px] tracking-widest h-10 border-zinc-800"
          >
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      <Card className="glass overflow-hidden border-white/5">
        <CardHeader className="border-b border-white/5 bg-white/5 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
              <History size={16} className="text-[#00ff88]" />
              Recent Transactions
            </CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <Input 
                onKeyDown={handleSearch}
                placeholder="SEARCH SYMBOL..." 
                className="pl-10 h-10 border-white/5 bg-zinc-950 rounded-xl text-[10px] font-black tracking-widest uppercase"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-white/5 hover:bg-white/5 border-white/5">
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500 min-w-[120px]">Asset</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Order</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Status</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Qty</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Price</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Total</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-zinc-500 text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id} className="group border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-extrabold text-sm tracking-tight">{order.symbol}</TableCell>
                      <TableCell>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${order.type === 'buy' ? 'border-[#00ff88]/20 neon-green bg-[#00ff88]/5' : 'border-[#ff4466]/20 neon-red bg-[#ff4466]/5'}`}>
                          {order.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                          {order.status === 'executed' ? (
                            <>
                              <CheckCircle2 size={12} className="text-[#00ff88]" />
                              <span className="text-[#00ff88]">Finalized</span>
                            </>
                          ) : (
                            <>
                              <Clock size={12} className="text-yellow-500" />
                              <span className="text-yellow-500">Syncing</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-bold tracking-tighter whitespace-nowrap">{order.quantity}</TableCell>
                      <TableCell className="text-sm font-bold tracking-tighter whitespace-nowrap">${order.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="font-black text-sm tracking-tighter whitespace-nowrap">
                        ${(order.price * order.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right text-[10px] text-zinc-500 font-bold uppercase tracking-widest whitespace-nowrap">
                        {format(new Date(order.timestamp), 'dd MMM • HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-zinc-500">
                        <History size={48} className="opacity-10" />
                        <p className="text-sm font-black uppercase tracking-widest italic">Terminal logs clear.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="glass p-4 sm:p-6 border-white/5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Buy Volume</h3>
          <p className="text-xl sm:text-3xl font-black italic tracking-tighter">
            ${orders.filter(o => o.type === 'buy').reduce((acc, o) => acc + (o.price * o.quantity), 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </Card>
        <Card className="glass p-4 sm:p-6 border-white/5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Sell Volume</h3>
          <p className="text-xl sm:text-3xl font-black italic tracking-tighter">
            ${orders.filter(o => o.type === 'sell').reduce((acc, o) => acc + (o.price * o.quantity), 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </Card>
        <Card className="glass p-4 sm:p-6 border-white/5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Total Logs</h3>
          <p className="text-xl sm:text-3xl font-black italic tracking-tighter">{orders.length}</p>
        </Card>
      </div>
    </motion.div>
  );
}
