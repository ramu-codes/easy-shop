import { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { Store, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [shopNameInput, setShopNameInput] = useState('Verma Fancy Store');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="h-24 w-24 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center">
            <Store className="h-12 w-12 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Easy Shop</h1>
          <p className="text-base text-muted-foreground mt-2">Sign in to manage your shop</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="shopName" className="text-sm font-medium">Shop Name</Label>
              <Input
                id="shopName"
                value={shopNameInput}
                onChange={e => setShopNameInput(e.target.value)}
                placeholder="Enter shop name"
                className="mt-2 h-12 text-base"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="h-12 text-base pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-base font-bold">Sign In</Button>
            <p className="text-sm text-center text-muted-foreground">Default password: admin123</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
