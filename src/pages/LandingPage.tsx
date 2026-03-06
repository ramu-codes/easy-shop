import { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Phone, User, ChevronDown, ChevronUp, Star, ShoppingBag, Sparkles, MapPin, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useShop } from '@/contexts/ShopContext';
import { toast } from 'sonner';
import heroImg from '@/assets/shop-hero.jpg';
import fashionImg from '@/assets/shop-fashion.jpg';
import accessoriesImg from '@/assets/shop-accessories.jpg';
import productsImg from '@/assets/shop-products.jpg';

const faqs = [
  { q: 'What products does Verma Fancy Store offer?', a: 'We offer a wide range of fancy items including garments, fashion accessories, cosmetics, jewelry, bags, and traditional Indian clothing for all occasions.' },
  { q: 'What are the store timings?', a: 'We are open from 10:00 AM to 9:00 PM, Monday to Saturday. Sunday timings are 11:00 AM to 7:00 PM.' },
  { q: 'Do you offer home delivery?', a: 'Yes! We provide home delivery within the city limits. Contact us for more details on delivery charges and timelines.' },
  { q: 'Can I return or exchange products?', a: 'We accept returns and exchanges within 7 days of purchase with the original bill. Items must be in unused condition with tags intact.' },
  { q: 'Do you offer wholesale pricing?', a: 'Yes, we offer special wholesale rates for bulk orders. Please visit the store or call us to discuss wholesale requirements.' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [shopNameInput, setShopNameInput] = useState('Verma Fancy Store');
  const [password, setPassword] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">Verma Fancy Store</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="tel:+919876543210" className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
              <Phone className="h-3.5 w-3.5" /> +91 98765 43210
            </a>
            <Button size="sm" onClick={() => setShowLogin(true)} className="text-xs">
              Login
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Verma Fancy Store Interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24 md:py-32">
          <motion.div
            initial="hidden" animate="visible" variants={stagger}
            className="max-w-lg"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-xs font-medium mb-4">
                <Sparkles className="h-3.5 w-3.5" /> Your Trusted Fashion Destination
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3"
            >
              Verma Fancy Store
            </motion.h1>
            <motion.p variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-white/80 mb-2"
            >
              Premium garments, fashion accessories & fancy items for every occasion.
            </motion.p>
            <motion.p variants={fadeUp} transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm text-white/60 mb-6"
            >
              Director: <strong className="text-white/90">Mr. Verma</strong> &nbsp;|&nbsp; 📞 +91 98765 43210
            </motion.p>
            <motion.div variants={fadeUp} transition={{ duration: 0.6, delay: 0.4 }} className="flex gap-3">
              <Button size="lg" onClick={() => setShowLogin(true)} className="text-sm font-semibold">
                Shop Manager Login
              </Button>
              <Button size="lg" variant="outline" className="text-sm font-semibold bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Strip */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}
        className="bg-primary/5 border-y border-border"
      >
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: ShoppingBag, label: 'Wide Collection', desc: '1000+ Products' },
            { icon: Star, label: 'Premium Quality', desc: 'Best Brands' },
            { icon: MapPin, label: 'Easy Location', desc: 'City Center' },
            { icon: Clock, label: 'Open Daily', desc: '10AM - 9PM' },
          ].map((f, i) => (
            <motion.div key={i} variants={fadeUp} className="text-center">
              <f.icon className="h-6 w-6 mx-auto mb-1.5 text-primary" />
              <p className="text-sm font-semibold text-foreground">{f.label}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* About / Gallery */}
      <section id="about" className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-2xl sm:text-3xl font-bold text-center mb-8"
        >
          Our <span className="text-primary">Collections</span>
        </motion.h2>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { img: fashionImg, title: 'Fashion & Garments', desc: 'Traditional & modern clothing for all' },
            { img: accessoriesImg, title: 'Accessories & Cosmetics', desc: 'Jewelry, beauty & fashion accessories' },
            { img: productsImg, title: 'Premium Products', desc: 'Bags, shoes & lifestyle products' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeUp} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/50 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-2xl sm:text-3xl font-bold text-center mb-8"
          >
            Frequently Asked <span className="text-primary">Questions</span>
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border text-left hover:border-primary/40 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 text-primary shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}
                    className="px-4 pb-3 pt-1"
                  >
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-bold mb-4">
            Visit <span className="text-primary">Us Today</span>
          </motion.h2>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> Main Market, City Center</span>
            <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-primary" /> +91 98765 43210</span>
            <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-primary" /> verma.store@email.com</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background/70">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Store className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-background text-sm">Verma Fancy Store</p>
                <p className="text-xs text-background/50">Director: Mr. Verma</p>
              </div>
            </div>
            <p className="text-xs text-background/40">© {new Date().getFullYear()} Verma Fancy Store. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowLogin(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            <Card className="w-full max-w-sm shadow-2xl">
              <CardContent className="pt-6 pb-6">
                <div className="text-center mb-5">
                  <div className="h-16 w-16 mx-auto mb-3 rounded-2xl bg-primary flex items-center justify-center">
                    <Store className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Shop Manager Login</h2>
                  <p className="text-xs text-muted-foreground mt-1">Sign in to manage your shop</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-3">
                  <div>
                    <Label htmlFor="shopName" className="text-xs">Shop Name</Label>
                    <Input id="shopName" value={shopNameInput} onChange={e => setShopNameInput(e.target.value)} placeholder="Enter shop name" className="mt-1 h-11" />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-xs">Password</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="mt-1 h-11" />
                  </div>
                  <Button type="submit" className="w-full h-11 font-semibold">Sign In</Button>
                  <p className="text-[10px] text-center text-muted-foreground">Default password: admin123</p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
