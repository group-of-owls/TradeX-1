import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Briefcase, 
  History, 
  User, 
  Search, 
  Bell, 
  Menu, 
  X,
  TrendingUp,
  Moon,
  Sun,
  Activity,
  LogOut
} from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePriceSimulation } from './hooks/usePriceSimulation';
import { useTradeStore } from './store/useTradeStore';

// Import Pages (to be created)
import Dashboard from './pages/Dashboard';
import AssetDetail from './pages/AssetDetail';
import Portfolio from './pages/Portfolio';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Market from './pages/Market';
import Login from './pages/Login';

import { toast } from 'sonner';

const Sidebar = ({ isOpen, toggle, onLogout }: { isOpen: boolean; toggle: () => void; onLogout: () => void }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  const handleFeatureSoon = (feature: string) => {
    toast.info(`${feature} coming soon`, {
      description: 'Our engineering team is currently syncing this module.'
    });
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Activity, label: 'Crypto', path: '/crypto' },
    { icon: TrendingUp, label: 'Stocks', path: '/stocks' },
    { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
    { icon: History, label: 'Orders', path: '/orders' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggle}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isMobile ? (isOpen ? 0 : -300) : 0 }}
        className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r z-50 transition-colors lg:sticky lg:h-screen lg:top-0"
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10">
            <h1 className="text-2xl font-extrabold tracking-tighter italic uppercase underline decoration-[#00ff88] decoration-4 underline-offset-4">
              Trade<span className="text-[#00ff88]">X</span>
            </h1>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) toggle();
                  }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,255,136,0.2)] font-bold' 
                      : 'text-zinc-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                  <span className="text-sm uppercase tracking-widest">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t flex flex-col gap-4">
            <div 
              onClick={() => handleFeatureSoon('Profile Management')}
              className="p-4 bg-muted rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-muted/80 transition-all border border-transparent hover:border-primary/20"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground">Pro Member</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className="w-full flex items-center justify-start gap-4 px-4 py-3 rounded-xl text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm uppercase tracking-widest font-black">Disconnect</span>
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [isDark, setIsDark] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      toast.info(`Searching for "${searchValue}"...`, {
        description: 'Global terminal search is currently in sync mode.'
      });
      setSearchValue('');
    }
  };

  const handleConnectWallet = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: 'Connecting to Web3 Provider...',
      success: 'Wallet Connected: 0x71...4a2c',
      error: 'Failed to connect wallet',
    });
  };

  const handleNotifications = () => {
    toast.success('All systems operational', {
      description: 'You have 3 new matching orders and 1 price alert triggered.'
    });
  };

  const handleFeatureSoon = (feature: string) => {
    toast.info(`${feature} coming soon`, {
      description: 'Our engineering team is currently syncing this module.'
    });
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="lg:hidden flex items-center mr-4">
          <Link to="/" className="text-xl font-extrabold tracking-tighter italic uppercase underline decoration-[#00ff88] decoration-4 underline-offset-2">
            T<span className="text-[#00ff88]">X</span>
          </Link>
        </div>

        <div className="hidden sm:flex flex-1 items-center max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search assets..." 
              className="pl-9 h-9 bg-muted/50 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary text-xs"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-3">
          <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => handleFeatureSoon('Mobile Search')}>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="relative" onClick={handleNotifications}>
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </Button>
          <div className="hidden md:block h-6 w-[1px] bg-border mx-1" />
          <Button 
            onClick={handleConnectWallet}
            variant="outline" 
            className="hidden md:flex border-primary text-primary hover:bg-primary hover:text-primary-foreground font-black uppercase tracking-widest text-[10px] h-9 px-4 rounded-xl"
          >
            Connect
          </Button>
        </div>
      </div>
    </header>
  );
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const assets = useTradeStore(state => state.assets);
  usePriceSimulation();

  useEffect(() => {
    const auth = localStorage.getItem('tradeX_auth');
    setIsAuthenticated(auth === 'true');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('tradeX_auth');
    setIsAuthenticated(false);
    toast.info('Disconnected', { description: 'Secure session terminated.' });
  };

  if (isAuthenticated === null) return null; // Wait for hydration

  if (!isAuthenticated) {
    return (
      <div className="dark">
        <Login onLogin={() => setIsAuthenticated(true)} />
        <Toaster position="top-right" closeButton richColors />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans dark:text-foreground flex flex-col lg:flex-row">
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggle={() => setIsSidebarOpen(false)} 
          onLogout={handleLogout}
        />
        
        <div className="flex-1 flex flex-col min-h-screen w-full relative overflow-x-hidden 2xl:max-w-[1600px] 2xl:mx-auto 2xl:border-x 2xl:border-white/5">
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/crypto" element={<Market type="crypto" />} />
                <Route path="/stocks" element={<Market type="stock" />} />
                <Route path="/asset/:id" element={<AssetDetail />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </AnimatePresence>
          </main>

          <footer className="p-4 md:p-8 border-t bg-muted/30">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap marquee-container">
                <span className="text-[10px] font-black text-[#00ff88] uppercase tracking-tighter">Market Pulse:</span>
                <div className="flex gap-8 text-[11px] font-medium text-zinc-400 animate-marquee">
                  {assets.map(asset => (
                    <span key={asset.id} className="flex items-center gap-2">
                       <div className={`w-1 h-1 rounded-full ${asset.change24h > 0 ? 'bg-[#00ff88]' : 'bg-[#ff4466]'}`} />
                       {asset.symbol} ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                       <span className={asset.change24h > 0 ? 'neon-green' : 'neon-red'}>
                         ({asset.change24h > 0 ? '+' : ''}{asset.change24h.toFixed(2)}%)
                       </span>
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">© 2026 TradeX Terminal. All rights reserved.</p>
            </div>
          </footer>
        </div>
        <Toaster position="top-right" closeButton richColors />
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 20s linear infinite;
        }
        .marquee-container {
          width: 100%;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </BrowserRouter>
  );
}
