import { motion } from 'motion/react';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  LogOut,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

import { toast } from 'sonner';

const SettingItem = ({ icon: Icon, title, description, action }: any) => {
  const handleClick = () => {
    if (action === 'switch') return;
    toast.info(`Accessing ${title}`, {
      description: `Synchronizing security sub-protocols for ${title}...`
    });
  };

  return (
    <div 
      onClick={handleClick}
      className="flex items-center justify-between py-5 group cursor-pointer hover:bg-white/5 px-4 rounded-2xl transition-all border border-transparent hover:border-white/5"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 group-hover:text-[#00ff88] group-hover:border-[#00ff88]/50 transition-all">
          <Icon size={18} />
        </div>
        <div>
          <h3 className="font-extrabold text-sm tracking-tight">{title}</h3>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{description}</p>
        </div>
      </div>
      {action === 'switch' ? (
        <Switch 
          className="data-[state=checked]:bg-[#00ff88]" 
          onCheckedChange={(checked) => {
            toast.success(`${title} ${checked ? 'Activated' : 'Suspended'}`, {
              description: checked ? 'Global alert relay synced.' : 'Terminal notifications paused.'
            });
          }}
        />
      ) : (
        <ChevronRight size={14} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
      )}
    </div>
  );
};

export default function Profile() {
  const handleSignOut = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: 'Terminating session...',
      success: 'Terminal disconnected securely',
      error: 'Termination failed',
    });
  };

  const handleAddPayment = () => {
    toast.info('Credential Entry', {
      description: 'The PCI-DSS secure vault is currently locked for verification.'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden mb-12 sm:mb-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00ff88]/20 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="absolute -bottom-8 sm:-bottom-10 left-6 sm:left-10 flex items-end gap-4 sm:gap-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#00ff88] to-emerald-400 rounded-[1.5rem] sm:rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <Avatar className="h-24 w-24 sm:h-40 sm:w-40 border-4 sm:border-8 border-[#050505] shadow-2xl rounded-[1.5rem] sm:rounded-[2.5rem] relative">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
              <AvatarFallback className="bg-zinc-900 text-[#00ff88] font-black text-2xl sm:text-4xl">JD</AvatarFallback>
            </Avatar>
          </div>
          <div className="pb-10 sm:pb-16 flex-1">
            <h1 className="text-2xl sm:text-5xl font-black italic tracking-tighter uppercase mb-1 truncate max-w-[200px] sm:max-w-none">John Doe</h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-[#00ff88] text-black font-black uppercase text-[8px] sm:text-[10px] tracking-widest hover:bg-[#00ff88]/80">PRO TERMINAL</Badge>
              <span className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] whitespace-nowrap">Verified Ops</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        <div className="md:col-span-2 space-y-6">
          <Card className="glass overflow-hidden border-white/5">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <SettingItem 
                icon={User} 
                title="Personal Information" 
                description="Manage your terminal identity." 
              />
              <SettingItem 
                icon={Shield} 
                title="Security Protocol" 
                description="Encryption and access logs." 
              />
              <SettingItem 
                icon={Bell} 
                title="Alert System" 
                description="Real-time terminal notifications." 
                action="switch"
              />
            </CardContent>
          </Card>

          <Card className="glass border-white/5">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Payment Methods</CardTitle>
              <CardDescription className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Connect verified liquid assets.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div 
                onClick={() => toast.info('Chase Protocol Linked')}
                className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-[#00ff88]/50 transition-all"
              >
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg group-hover:text-[#00ff88] transition-colors"> <CreditCard size={18} /> </div>
                   <div>
                     <p className="font-extrabold text-sm tracking-tight">Chase Bank ••• 4242</p>
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Primary Protocol</p>
                   </div>
                </div>
                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-zinc-800 text-zinc-500">Default</Badge>
              </div>
              <Button 
                variant="outline" 
                onClick={handleAddPayment}
                className="w-full rounded-xl border-dashed border-zinc-800 text-zinc-500 font-bold uppercase tracking-widest text-[10px] h-12 hover:bg-white/5"
              >
                Add New Payment Method
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#00ff88] shadow-[0_20px_40px_rgba(0,255,136,0.2)] border-none text-black p-8 rounded-[2rem]">
            <div className="flex justify-between items-start mb-8">
              <div className="p-3 bg-black/10 rounded-2xl">
                <Shield size={24} className="text-black" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest border border-black/20 px-2 py-1 rounded-md">Rank A+</span>
            </div>
            <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Trust Score</h3>
            <p className="text-xs font-bold text-black/60 mb-6 uppercase tracking-widest leading-loose">Elite authentication level verified by the TradeX protocol.</p>
            <div className="h-6 w-full bg-black/10 rounded-full overflow-hidden mb-3 p-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '92%' }}
                className="h-full bg-black rounded-full"
              />
            </div>
            <div className="flex justify-between text-xs font-black uppercase tracking-[0.2em]">
              <span>92.00</span>
              <span>Elite Status</span>
            </div>
          </Card>

          <Card className="glass p-2 border-white/5">
             <Button 
               variant="ghost" 
               onClick={handleSignOut}
               className="w-full justify-start gap-4 h-12 text-rose-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl group"
             >
               <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
               <span className="font-black uppercase tracking-widest text-xs">Terminate Session</span>
             </Button>
          </Card>

          <div className="p-6 text-center space-y-2">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">TradeX Terminal v2.4.0</p>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest underline decoration-zinc-800 underline-offset-4 cursor-pointer hover:text-[#00ff88] transition-colors">
              Terms of Service • Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
