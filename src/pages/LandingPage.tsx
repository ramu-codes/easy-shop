import { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Phone, User, ChevronDown, ChevronUp, Star, ShoppingBag, Sparkles, MapPin, Clock, Mail, Eye, EyeOff, TrendingUp, Users, Package, BarChart3, Calculator, Receipt, Shield } from 'lucide-react';
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
    description: 'Easy Shop is a comprehensive business management system specifically designed for retail stores, fancy shops, and small businesses across India. Our platform helps you manage every aspect of your business - from inventory and sales to customer relationships and financial tracking.',
    benefits: [
      'Manage products, customers, and suppliers all in one place',
      'Track sales, purchases, and inventory automatically',
      'Monitor daily expenses and calculate profits accurately',
      'Handle customer dues and payment collections efficiently',
      'Manage employee attendance and salary payments',
      'Generate digital invoices and share them instantly',
      'Get real-time business analytics and insights',
      'Work offline - all data stored securely on your device',
      'Available in English and Hindi for your convenience'
    ]
  },
  hi: {
    title: 'संपूर्ण दुकान प्रबंधन समाधान',
    subtitle: 'भारतीय खुदरा व्यवसायों के लिए डिज़ाइन किया गया',
    description: 'ईज़ी शॉप एक व्यापक व्यवसाय प्रबंधन प्रणाली है जो विशेष रूप से खुदरा स्टोर, फैंसी दुकानों और भारत भर के छोटे व्यवसायों के लिए डिज़ाइन की गई है। हमारा प्लेटफॉर्म आपको अपने व्यवसाय के हर पहलू को प्रबंधित करने में मदद करता है - इन्वेंटरी और बिक्री से लेकर ग्राहक संबंधों और वित्तीय ट्रैकिंग तक।',
    benefits: [
      'एक ही स्थान पर उत्पाद, ग्राहक और आपूर्तिकर्ता प्रबंधित करें',
      'बिक्री, खरीद और इन्वेंटरी स्वचालित रूप से ट्रैक करें',
      'दैनिक खर्चों की निगरानी करें और मुनाफे की सटीक गणना करें',
      'ग्राहक बकाया और भुगतान संग्रह को कुशलतापूर्वक संभालें',
      'कर्मचारी उपस्थिति और वेतन भुगतान प्रबंधित करें',
      'डिजिटल चालान बनाएं और तुरंत साझा करें',
      'वास्तविक समय व्यवसाय विश्लेषण और अंतर्दृष्टि प्राप्त करें',
      'ऑफ़लाइन काम करें - सभी डेटा आपके डिवाइस पर सुरक्षित रूप से संग्रहीत',
      'आपकी सुविधा के लिए अंग्रेजी और हिंदी में उपलब्ध'
    ]
  }
};

const faqs = {
  en: [
    { q: 'What is Easy Shop and how does it help my business?', a: 'Easy Shop is a complete shop management system that helps you track sales, manage inventory, handle customer dues, monitor expenses, and calculate profits. It simplifies daily operations and gives you real-time insights to grow your business.' },
    { q: 'Do I need internet connection to use this system?', a: 'No! Easy Shop works completely offline. All your data is stored securely on your device, so you can manage your business even without internet connectivity.' },
    { q: 'Is my business data safe and secure?', a: 'Yes, absolutely! All your business data is stored locally on your device using secure browser storage. No data is sent to external servers, ensuring complete privacy and security.' },
    { q: 'Can I use this system in Hindi language?', a: 'Yes! Easy Shop supports both English and Hindi languages. You can switch between languages anytime based on your preference from the settings.' },
    { q: 'What features are included in the system?', a: 'The system includes: Product & Inventory Management, Sales & Invoicing, Customer & Supplier Management, Purchase Tracking, Expense Management, Employee Management & Attendance, Payment Tracking, Daily Revenue/Expense Tracker, and Detailed Business Analytics Dashboard.' },
    { q: 'How do I get started?', a: 'Simply click the "Shop Manager Login" button, enter your shop name and the default password (admin123) to access the complete system. You can start adding your products, customers, and begin managing your business right away!' },
  ],
  hi: [
    { q: 'ईज़ी शॉप क्या है और यह मेरे व्यवसाय की कैसे मदद करता है?', a: 'ईज़ी शॉप एक संपूर्ण दुकान प्रबंधन प्रणाली है जो आपको बिक्री ट्रैक करने, इन्वेंटरी प्रबंधित करने, ग्राहक बकाया संभालने, खर्चों की निगरानी करने और मुनाफे की गणना करने में मदद करती है। यह दैनिक संचालन को सरल बनाती है और आपको अपने व्यवसाय को बढ़ाने के लिए वास्तविक समय की जानकारी देती है।' },
    { q: 'क्या मुझे इस प्रणाली का उपयोग करने के लिए इंटरनेट कनेक्शन की आवश्यकता है?', a: 'नहीं! ईज़ी शॉप पूरी तरह से ऑफ़लाइन काम करता है। आपका सभी डेटा आपके डिवाइस पर सुरक्षित रूप से संग्रहीत है, इसलिए आप इंटरनेट कनेक्टिविटी के बिना भी अपने व्यवसाय का प्रबंधन कर सकते हैं।' },
    { q: 'क्या मेरा व्यवसाय डेटा सुरक्षित है?', a: 'हां, बिल्कुल! आपका सभी व्यवसाय डेटा सुरक्षित ब्राउज़र स्टोरेज का उपयोग करके स्थानीय रूप से आपके डिवाइस पर संग्रहीत है। कोई डेटा बाहरी सर्वर को नहीं भेजा जाता है, जो पूर्ण गोपनीयता और सुरक्षा सुनिश्चित करता है।' },
    { q: 'क्या मैं इस प्रणाली को हिंदी भाषा में उपयोग कर सकता हूं?', a: 'हां! ईज़ी शॉप अंग्रेजी और हिंदी दोनों भाषाओं का समर्थन करता है। आप सेटिंग्स से अपनी प्राथमिकता के आधार पर किसी भी समय भाषाओं के बीच स्विच कर सकते हैं।' },
    { q: 'प्रणाली में कौन सी सुविधाएं शामिल हैं?', a: 'प्रणाली में शामिल हैं: उत्पाद और इन्वेंटरी प्रबंधन, बिक्री और चालान, ग्राहक और आपूर्तिकर्ता प्रबंधन, खरीद ट्रैकिंग, खर्च प्रबंधन, कर्मचारी प्रबंधन और उपस्थिति, भुगतान ट्रैकिंग, दैनिक राजस्व/खर्च ट्रैकर, और विस्तृत व्यवसाय विश्लेषण डैशबोर्ड।' },
    { q: 'मैं कैसे शुरू करूं?', a: 'बस "शॉप मैनेजर लॉगिन" बटन पर क्लिक करें, अपनी दुकान का नाम और डिफ़ॉल्ट पासवर्ड (admin123) दर्ज करें संपूर्ण प्रणाली तक पहुंचने के लिए। आप अपने उत्पादों, ग्राहकों को जोड़ना शुरू कर सकते हैं और तुरंत अपने व्यवसाय का प्रबंधन शुरू कर सकते हैं!' },
  ]
};

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary flex items-center justify-center">
              <Store className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">Easy Shop</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="text-sm font-medium h-10 px-4"
            >
              {language === 'en' ? 'हिंदी' : 'English'}
            </Button>
            <a href="tel:+919876543210" className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Phone className="h-4 w-4" /> +91 98765 43210
            </a>
            <Button size="default" onClick={() => setShowLogin(true)} className="text-sm font-semibold h-10 px-6">
              {language === 'en' ? 'Login' : 'लॉगिन'}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Shop Management System" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/65 to-foreground/35" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28 md:py-36">
          <motion.div
            initial="hidden" animate="visible" variants={stagger}
            className="max-w-2xl"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/90 text-secondary-foreground text-sm font-semibold mb-5">
                <Shield className="h-4 w-4" /> {language === 'en' ? 'Professional Shop Management System' : 'पेशेवर दुकान प्रबंधन प्रणाली'}
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-5"
            >
              {language === 'en' ? 'Grow Your Business with Easy Shop' : 'ईज़ी शॉप के साथ अपना व्यवसाय बढ़ाएं'}
            </motion.h1>
            <motion.p variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl text-white/90 mb-4 font-medium"
            >
              {language === 'en'
                ? 'Complete solution for inventory, sales, customers & business analytics'
                : 'इन्वेंटरी, बिक्री, ग्राहक और व्यवसाय विश्लेषण के लिए संपूर्ण समाधान'}
            </motion.p>
            <motion.p variants={fadeUp} transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg text-white/75 mb-8"
            >
              {language === 'en'
                ? '✓ Works Offline  ✓ Bilingual Support  ✓ No Monthly Fees'
                : '✓ ऑफ़लाइन काम करता है  ✓ द्विभाषी समर्थन  ✓ कोई मासिक शुल्क नहीं'}
            </motion.p>
            <motion.div variants={fadeUp} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => setShowLogin(true)} className="text-base font-bold h-14 px-8 shadow-lg">
                {language === 'en' ? 'Start Managing Now' : 'अभी प्रबंधन शुरू करें'}
              </Button>
              <Button size="lg" variant="outline" className="text-base font-semibold h-14 px-8 bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {language === 'en' ? 'Learn More' : 'और जानें'}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Business Features Grid */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}
        className="bg-gradient-to-b from-primary/5 to-background border-y border-border py-16"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {language === 'en' ? 'Why Choose Easy Shop?' : 'ईज़ी शॉप क्यों चुनें?'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === 'en'
                ? 'Everything you need to manage and grow your retail business efficiently'
                : 'अपने खुदरा व्यवसाय को कुशलतापूर्वक प्रबंधित और बढ़ाने के लिए आपको जो कुछ भी चाहिए'}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessFeatures[language].map((feature, i) => (
              <motion.div key={i} variants={fadeUp}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:border-primary/40"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Section with Details */}
      <section id="about" className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              {language === 'en' ? 'About Easy Shop' : 'ईज़ी शॉप के बारे में'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{aboutContent[language].title}</h2>
            <p className="text-lg font-semibold text-primary mb-4">{aboutContent[language].subtitle}</p>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              {aboutContent[language].description}
            </p>
            <Button size="lg" onClick={() => setShowLogin(true)} className="text-base font-semibold h-12 px-8">
              {language === 'en' ? 'Get Started Free' : 'मुफ्त में शुरू करें'}
            </Button>
          </motion.div>
          <motion.div variants={fadeUp}>
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-primary" />
                {language === 'en' ? 'Key Benefits' : 'मुख्य लाभ'}
              </h3>
              <ul className="space-y-4">
                {aboutContent[language].benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-sm">✓</span>
                    </div>
                    <span className="text-base text-foreground leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/50 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold text-center mb-12"
          >
            {language === 'en' ? 'Frequently Asked Questions' : 'अक्सर पूछे जाने वाले प्रश्न'}
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-4">
            {faqs[language].map((faq, i) => (
              <motion.div key={i} variants={fadeUp}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 rounded-xl bg-card border border-border text-left hover:border-primary/40 transition-colors"
                >
                  <span className="text-base font-semibold text-foreground pr-4 leading-relaxed">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-5 w-5 text-primary shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />}
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}
                    className="px-5 pb-4 pt-2"
                  >
                    <p className="text-base text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-10 sm:p-16 text-center border border-primary/20"
        >
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-6">
            {language === 'en' ? 'Ready to Transform Your Business?' : 'अपने व्यवसाय को बदलने के लिए तैयार हैं?'}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {language === 'en'
              ? 'Start managing your shop efficiently today. No credit card required, no monthly fees.'
              : 'आज ही अपनी दुकान को कुशलतापूर्वक प्रबंधित करना शुरू करें। क्रेडिट कार्ड की आवश्यकता नहीं, कोई मासिक शुल्क नहीं।'}
          </motion.p>
          <motion.div variants={fadeUp}>
            <Button size="lg" onClick={() => setShowLogin(true)} className="text-base font-bold h-14 px-10 shadow-lg">
              {language === 'en' ? 'Get Started Now - It\'s Free!' : 'अभी शुरू करें - यह मुफ़्त है!'}
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background/70 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Store className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-background text-base">Easy Shop</p>
                <p className="text-sm text-background/50">
                  {language === 'en' ? 'Smart Business Management' : 'स्मार्ट व्यवसाय प्रबंधन'}
                </p>
              </div>
            </div>
            <p className="text-sm text-background/40">© {new Date().getFullYear()} Easy Shop. All rights reserved.</p>
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
            <Card className="w-full max-w-md shadow-2xl">
              <CardContent className="pt-8 pb-8 px-8">
                <div className="text-center mb-6">
                  <div className="h-20 w-20 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center">
                    <Store className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {language === 'en' ? 'Shop Manager Login' : 'शॉप मैनेजर लॉगिन'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    {language === 'en' ? 'Sign in to manage your business' : 'अपने व्यवसाय को प्रबंधित करने के लिए साइन इन करें'}
                  </p>
                </div>
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <Label htmlFor="shopName" className="text-sm font-medium">
                      {language === 'en' ? 'Shop Name' : 'दुकान का नाम'}
                    </Label>
                    <Input
                      id="shopName"
                      value={shopNameInput}
                      onChange={e => setShopNameInput(e.target.value)}
                      placeholder={language === 'en' ? 'Enter shop name' : 'दुकान का नाम दर्ज करें'}
                      className="mt-2 h-12 text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium">
                      {language === 'en' ? 'Password' : 'पासवर्ड'}
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder={language === 'en' ? 'Enter password' : 'पासवर्ड दर्ज करें'}
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
                  <Button type="submit" className="w-full h-12 text-base font-bold">
                    {language === 'en' ? 'Sign In' : 'साइन इन करें'}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    {language === 'en' ? 'Default password: admin123' : 'डिफ़ॉल्ट पासवर्ड: admin123'}
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
