import { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

export default function Login() {
  const [shopName, setShopName] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useShop();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) { toast.error('Enter shop name'); return; }
    if (login(shopName, password)) {
      toast.success('Welcome to ShopOne!');
    } else {
      toast.error('Invalid password. Try: admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center pb-2">
          <img src={logo} alt="ShopOne" className="h-20 w-20 mx-auto mb-2 rounded-2xl" />
          <h1 className="text-2xl font-bold text-foreground">ShopOne</h1>
          <p className="text-sm text-muted-foreground">Sign in to manage your shop</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="shopName" className="text-sm font-medium">Shop Name</Label>
              <Input id="shopName" value={shopName} onChange={e => setShopName(e.target.value)} placeholder="Enter your shop name" className="mt-1 h-12 text-base" />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
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
