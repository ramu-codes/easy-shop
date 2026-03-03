import { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { Store } from 'lucide-react';

export default function Login() {
  const [shopNameInput, setShopNameInput] = useState('Verma Fancy Store');
  const [password, setPassword] = useState('');
  const { login } = useShop();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopNameInput.trim()) { toast.error('Enter shop name'); return; }
    if (login(shopNameInput, password)) {
      toast.success('Welcome to Verma Fancy Store!');
    } else {
      toast.error('Invalid password. Try: admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="h-20 w-20 mx-auto mb-2 rounded-2xl bg-primary flex items-center justify-center">
            <Store className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Verma Fancy Store</h1>
          <p className="text-sm text-muted-foreground">Sign in to manage your shop</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="shopName">Shop Name</Label>
              <Input id="shopName" value={shopNameInput} onChange={e => setShopNameInput(e.target.value)} placeholder="Enter shop name" className="mt-1 h-12 text-base" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="mt-1 h-12 text-base" />
            </div>
            <Button type="submit" className="w-full big-button">Sign In</Button>
            <p className="text-xs text-center text-muted-foreground">Default password: admin123</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
