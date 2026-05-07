import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, ShieldCheck, Zap, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Demo authentication logic
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        localStorage.setItem('tradeX_auth', 'true');
        onLogin();
        toast.success('Access Granted', {
          description: 'Welcome back to the terminal, Commander.',
        });
      } else {
        toast.error('Access Denied', {
          description: 'Invalid credentials. Hint: admin / password',
        });
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-[#00ff88] selection:text-black">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,255,136,0.1)]">
            <ShieldCheck className="text-[#00ff88] w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter italic uppercase underline decoration-[#00ff88] decoration-4 underline-offset-8">
            Trade<span className="text-[#00ff88]">X</span>
          </h1>
          <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] mt-6">
            Secure Terminal Access Node
          </p>
        </div>

        <Card className="bg-zinc-950 border-zinc-900 shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-right from-transparent via-[#00ff88] to-transparent opacity-50" />
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Identity</label>
                <div className="relative">
                  <LogIn className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <Input
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="bg-zinc-900/50 border-zinc-800 h-12 pl-10 focus-visible:ring-[#00ff88] focus-visible:border-[#00ff88] text-white font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Access Protocol</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <Input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-zinc-900/50 border-zinc-800 h-12 pl-10 focus-visible:ring-[#00ff88] focus-visible:border-[#00ff88] text-white"
                  />
                </div>
              </div>

              <Button
                disabled={isLoading}
                type="submit"
                className="w-full h-14 bg-[#00ff88] text-black font-black uppercase tracking-[0.2em] text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_10px_20px_rgba(0,255,136,0.2)]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 animate-pulse" />
                    Synchronizing...
                  </div>
                ) : (
                  'Authorize Entry'
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-900">
              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600">
                <span>System Status: Optimal</span>
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                  Live Network
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center mt-8 text-zinc-600 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
          Authorized personnel only.<br />
          All actions are logged in the terminal registry.
        </p>
      </motion.div>
    </div>
  );
}
