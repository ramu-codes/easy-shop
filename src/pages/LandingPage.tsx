import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Phone, ChevronDown, ChevronUp, Star, Sparkles, MapPin, Clock, Mail, Eye, EyeOff, TrendingUp, Users, Package, BarChart3, Calculator, Receipt, Shield, Heart, Zap, Award, ArrowRight } from 'lucide-react';
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

const businessFeatures = {
  en: [
    { icon: TrendingUp, title: 'Boost Your Business', desc: 'Complete shop management system to increase sales & track profits in real-time' },
    { icon: Users, title: 'Customer Management', desc: 'Maintain customer records, track dues & payment history with ease' },
    { icon: Package, title: 'Inventory Control', desc: 'Manage stock levels, get low-stock alerts & never miss a sale opportunity' },
    { icon: BarChart3, title: 'Business Analytics', desc: 'Get detailed insights on sales, expenses & profit to make smarter decisions' },
    { icon: Calculator, title: 'Financial Tracking', desc: 'Track all expenses, employee salaries & calculate net profit automatically' },
    { icon: Receipt, title: 'Digital Invoicing', desc: 'Generate professional invoices instantly & share them with customers' },
  ],
  hi: [
    { icon: TrendingUp, title: 'अपने व्यवसाय को बढ़ाएं', desc: 'बिक्री बढ़ाने और मुनाफे को ट्रैक करने के लिए संपूर्ण दुकान प्रबंधन प्रणाली' },
    { icon: Users, title: 'ग्राहक प्रबंधन', desc: 'ग्राहक रिकॉर्ड बनाए रखें, बकाया और भुगतान इतिहास को आसानी से ट्रैक करें' },
    { icon: Package, title: 'इन्वेंटरी नियंत्रण', desc: 'स्टॉक स्तर प्रबंधित करें, कम स्टॉक अलर्ट प्राप्त करें और बिक्री का अवसर न चूकें' },
    { icon: BarChart3, title: 'व्यवसाय विश्लेषण', desc: 'बिक्री, खर्च और लाभ पर विस्तृत जानकारी प्राप्त करें और बेहतर निर्णय लें' },
    { icon: Calculator, title: 'वित्तीय ट्रैकिंग', desc: 'सभी खर्चों, कर्मचारी वेतन को ट्रैक करें और शुद्ध लाभ स्वचालित रूप से गणना करें' },
    { icon: Receipt, title: 'डिजिटल चालान', desc: 'तुरंत पेशेवर चालान बनाएं और ग्राहकों के साथ साझा करें' },
  ]
};

const aboutContent = {
  en: {
    title: 'Complete Shop Management Solution',
    subtitle: 'Designed for Indian Retail Businesses',
    description: 'Easy Shop is a comprehensive business management system specifically designed for retail stores, fancy shops, and small businesses across India.',
    benefits: [
      'Manage products, customers, and suppliers all in one place',
      'Track sales, purchases, and inventory automatically',
      'Monitor daily expenses and calculate profits accurately',
      'Handle customer dues and payment collections efficiently',
      'Manage employee attendance and salary payments',
      'Generate digital invoices and share them instantly',
      'Get real-time business analytics and insights',
      'Work offline - all data stored securely on your device',
    ]
  },
  hi: {
    title: 'संपूर्ण दुकान प्रबंधन समाधान',
    subtitle: 'भारतीय खुदरा व्यवसायों के लिए डिज़ाइन किया गया',
    description: 'ईज़ी शॉप एक व्यापक व्यवसाय प्रबंधन प्रणाली है जो विशेष रूप से खुदरा स्टोर, फैंसी दुकानों और भारत भर के छोटे व्यवसायों के लिए डिज़ाइन की गई है।',
    benefits: [
      'एक ही स्थान पर उत्पाद, ग्राहक और आपूर्तिकर्ता प्रबंधित करें',
      'बिक्री, खरीद और इन्वेंटरी स्वचालित रूप से ट्रैक करें',
      'दैनिक खर्चों की निगरानी करें और मुनाफे की सटीक गणना करें',
      'ग्राहक बकाया और भुगतान संग्रह को कुशलतापूर्वक संभालें',
      'कर्मचारी उपस्थिति और वेतन भुगतान प्रबंधित करें',
      'डिजिटल चालान बनाएं और तुरंत साझा करें',
      'वास्तविक समय व्यवसाय विश्लेषण और अंतर्दृष्टि प्राप्त करें',
      'ऑफ़लाइन काम करें - सभी डेटा आपके डिवाइस पर सुरक्षित रूप से संग्रहीत',
    ]
  }
};

const faqs = {
  en: [
    { q: 'What is Easy Shop?', a: 'Easy Shop is a complete shop management system that helps you track sales, manage inventory, handle customer dues, monitor expenses, and calculate profits.' },
    { q: 'Do I need internet?', a: 'No! Easy Shop works completely offline. All your data is stored securely on your device.' },
    { q: 'Is my data safe?', a: 'Yes! All data is stored locally on your device. No data is sent to external servers.' },
    { q: 'Can I use Hindi?', a: 'Yes! Switch between English and Hindi anytime from the settings.' },
    { q: 'How do I get started?', a: 'Click Login, enter your shop name and password (default: admin123) to access the system.' },
  ],
  hi: [
    { q: 'ईज़ी शॉप क्या है?', a: 'ईज़ी शॉप एक संपूर्ण दुकान प्रबंधन प्रणाली है जो बिक्री ट्रैक करने, इन्वेंटरी प्रबंधित करने, ग्राहक बकाया संभालने और मुनाफे की गणना करने में मदद करती है।' },
    { q: 'क्या इंटरनेट चाहिए?', a: 'नहीं! ईज़ी शॉप पूरी तरह ऑफ़लाइन काम करता है।' },
    { q: 'क्या डेटा सुरक्षित है?', a: 'हां! सभी डेटा आपके डिवाइस पर स्थानीय रूप से संग्रहीत है।' },
    { q: 'क्या हिंदी में उपयोग कर सकते हैं?', a: 'हां! सेटिंग्स से किसी भी समय भाषा बदलें।' },
    { q: 'कैसे शुरू करें?', a: 'लॉगिन क्लिक करें, दुकान का नाम और पासवर्ड (admin123) दर्ज करें।' },
  ]
};

const galleryImages = [
  { src: heroImg, label: 'Our Store' },
  { src: fashionImg, label: 'Fashion Collection' },
  { src: accessoriesImg, label: 'Accessories' },
  { src: productsImg, label: 'Products' },
];

const stats = [
  { value: '500+', label: 'Products' },
  { value: '1000+', label: 'Happy Customers' },
  { value: '5+', label: 'Years Experience' },
  { value: '24/7', label: 'Support' },
];

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
const fadeLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } };
const fadeRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } };

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [shopNameInput, setShopNameInput] = useState('Verma Fancy Store');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, type: 'spring' }}
        className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
              <Store className="h-6 w-6 text-primary-foreground" />
            </motion.div>
            <div>
              <span className="font-extrabold text-lg text-foreground tracking-tight">Verma Fancy Store</span>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Easy Shop Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className="text-xs font-semibold h-9 px-3">
              {language === 'en' ? 'हिंदी' : 'EN'}
            </Button>
            <Button size="sm" onClick={() => setShowLogin(true)} className="text-xs font-bold h-9 px-5 shadow-md shadow-primary/20">
              {language === 'en' ? '🔐 Login' : '🔐 लॉगिन'}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} src={heroImg} alt="Verma Fancy Store" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
            <motion.div variants={fadeUp} transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-md text-white text-sm font-semibold mb-6 border border-primary/30">
                <Sparkles className="h-4 w-4 text-secondary" /> {language === 'en' ? '✨ Smart Shop Management' : '✨ स्मार्ट दुकान प्रबंधन'}
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight"
            >
              {language === 'en' ? (
                <>Manage Your <span className="text-secondary">Business</span> Like a Pro</>
              ) : (
                <>अपने <span className="text-secondary">व्यवसाय</span> को प्रो की तरह प्रबंधित करें</>
              )}
            </motion.h1>
            <motion.p variants={fadeUp} transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg sm:text-xl text-white/85 mb-8 max-w-lg leading-relaxed"
            >
              {language === 'en'
                ? 'All-in-one solution for inventory, sales, invoicing, customer management & business analytics'
                : 'इन्वेंटरी, बिक्री, चालान, ग्राहक प्रबंधन और व्यवसाय विश्लेषण के लिए ऑल-इन-वन समाधान'}
            </motion.p>
            <motion.div variants={fadeUp} transition={{ duration: 0.7, delay: 0.3 }} className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => setShowLogin(true)} className="text-base font-bold h-14 px-8 shadow-xl shadow-primary/30 gap-2">
                {language === 'en' ? 'Start Managing' : 'शुरू करें'} <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-base font-semibold h-14 px-8 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {language === 'en' ? 'Explore Store' : 'स्टोर देखें'}
              </Button>
            </motion.div>
            <motion.div variants={fadeUp} transition={{ duration: 0.7, delay: 0.4 }}
              className="flex gap-6 mt-8 text-white/70 text-sm"
            >
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-secondary" /> Works Offline</span>
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-secondary" /> 100% Secure</span>
              <span className="flex items-center gap-1.5"><Heart className="h-4 w-4 text-secondary" /> Free Forever</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Counter */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        className="bg-primary text-primary-foreground py-10 -mt-1"
      >
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={i} variants={scaleIn} transition={{ duration: 0.5 }} className="text-center">
              <p className="text-3xl sm:text-4xl font-black">{s.value}</p>
              <p className="text-sm text-primary-foreground/80 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Gallery */}
      <section id="gallery" className="py-16 sm:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-3">{language === 'en' ? 'Our Store' : 'हमारी दुकान'}</h2>
            <p className="text-muted-foreground text-lg">{language === 'en' ? 'A glimpse into Verma Fancy Store' : 'वर्मा फैंसी स्टोर की एक झलक'}</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {galleryImages.map((img, i) => (
              <motion.div key={i} variants={scaleIn} transition={{ duration: 0.5 }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-lg"
              >
                <img src={img.src} alt={img.label} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="absolute bottom-4 left-4 text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">{img.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        className="bg-muted/50 border-y border-border py-16 sm:py-20"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-3">
              {language === 'en' ? 'Why Choose Easy Shop?' : 'ईज़ी शॉप क्यों चुनें?'}
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              {language === 'en' ? 'Everything you need to grow your business' : 'आपके व्यवसाय को बढ़ाने के लिए सब कुछ'}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {businessFeatures[language].map((f, i) => (
              <motion.div key={i} variants={fadeUp}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-4">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About */}
      <section id="about" className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeLeft} transition={{ duration: 0.7 }}>
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
              {language === 'en' ? '🏪 About Us' : '🏪 हमारे बारे में'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">{aboutContent[language].title}</h2>
            <p className="text-lg font-semibold text-primary mb-3">{aboutContent[language].subtitle}</p>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">{aboutContent[language].description}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" /> Main Market, City Center
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" /> +91 98765 43210
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" /> 9 AM - 9 PM
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeRight} transition={{ duration: 0.7 }}>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-secondary" /> {language === 'en' ? 'Key Benefits' : 'मुख्य लाभ'}
              </h3>
              <ul className="space-y-3">
                {aboutContent[language].benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-xs">✓</span>
                    </div>
                    <span className="text-sm text-foreground leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Shop Info */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-16 border-y border-border">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
            <motion.div variants={scaleIn} className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30">
              <Store className="h-12 w-12 text-primary-foreground" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black mb-2">Verma Fancy Store</motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-1">Director: Mr. Verma</motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mt-4">
              <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-primary" /> +91 98765 43210</span>
              <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-primary" /> verma@shop.com</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> Main Market, City Center</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-3xl font-black text-center mb-10"
          >
            {language === 'en' ? '❓ FAQ' : '❓ अक्सर पूछे जाने वाले प्रश्न'}
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-3">
            {faqs[language].map((faq, i) => (
              <motion.div key={i} variants={fadeUp}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border text-left hover:border-primary/40 transition-all"
                >
                  <span className="text-sm font-bold text-foreground pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 text-primary shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                      className="px-4 pb-3 pt-2"
                    >
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn}
          className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-10 sm:p-16 text-center text-primary-foreground shadow-2xl shadow-primary/20"
        >
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            {language === 'en' ? 'Ready to Transform Your Business?' : 'अपने व्यवसाय को बदलने के लिए तैयार?'}
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            {language === 'en' ? 'Start managing your shop efficiently today. Free forever.' : 'आज ही शुरू करें। हमेशा मुफ्त।'}
          </p>
          <Button size="lg" variant="secondary" onClick={() => setShowLogin(true)} className="text-base font-black h-14 px-10 shadow-xl gap-2">
            {language === 'en' ? 'Get Started Now' : 'अभी शुरू करें'} <ArrowRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background/70 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Store className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-background text-sm">Verma Fancy Store</p>
                <p className="text-xs text-background/50">Powered by Easy Shop</p>
              </div>
            </div>
            <p className="text-xs text-background/40">© {new Date().getFullYear()} Verma Fancy Store. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowLogin(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              <Card className="w-full max-w-sm shadow-2xl border-2">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="text-center mb-6">
                    <motion.div whileHover={{ rotate: 5 }} className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-xl shadow-primary/25">
                      <Store className="h-8 w-8 text-primary-foreground" />
                    </motion.div>
                    <h2 className="text-xl font-black text-foreground">
                      {language === 'en' ? 'Shop Manager Login' : 'शॉप मैनेजर लॉगिन'}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'en' ? 'Sign in to manage your business' : 'अपने व्यवसाय को प्रबंधित करने के लिए साइन इन करें'}
                    </p>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="shopName" className="text-xs font-semibold">
                        {language === 'en' ? 'Shop Name' : 'दुकान का नाम'}
                      </Label>
                      <Input id="shopName" value={shopNameInput} onChange={e => setShopNameInput(e.target.value)}
                        placeholder={language === 'en' ? 'Enter shop name' : 'दुकान का नाम'} className="mt-1.5 h-11 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-xs font-semibold">
                        {language === 'en' ? 'Password' : 'पासवर्ड'}
                      </Label>
                      <div className="relative mt-1.5">
                        <Input id="password" type={showPassword ? 'text' : 'password'} value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder={language === 'en' ? 'Enter password' : 'पासवर्ड'} className="h-11 text-sm pr-12"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11 text-sm font-bold shadow-md shadow-primary/20">
                      {language === 'en' ? 'Sign In' : 'साइन इन'}
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground">Default password: admin123</p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
