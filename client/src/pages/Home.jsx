import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import PollWidget from '../components/PollWidget.jsx';
import AdBanner from '../components/AdBanner.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { getLocalizedNews } from '../utils/languageUtils.js';
import { getMediaUrl } from '../utils/mediaUtils.js';
import {
  BookOpen,
  Star,
  Flame,
  Clock,
  Award,
  Eye,
  MessageCircle,
  Play,
  ChevronRight,
  Share2,
  Facebook,
  Twitter,
  Link2
} from 'lucide-react';

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useSelector((state) => state.theme);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const category = searchParams.get('category');
  const state = searchParams.get('state');
  const city = searchParams.get('city');
  const district = searchParams.get('district');
  const search = searchParams.get('search');

  // Trending topic pills
  const trendingTags = language === 'Hindi'
    ? [
      { title: 'बारिश का मौसम', query: 'weather' },
      { title: 'भारत-श्रीलंका सीरीज', query: 'Cricket' },
      { title: 'सावन का महीना', query: 'festival' },
      { title: 'स्कूल - कॉलेज', query: 'Education' },
      { title: 'शेयर बाजार', query: 'Business' },
      { title: 'सोने-चांदी के भाव', query: 'gold' },
    ]
    : [
      { title: 'Monsoon Season', query: 'weather' },
      { title: 'India-SriLanka Series', query: 'Cricket' },
      { title: 'Sawan Festival', query: 'festival' },
      { title: 'School - College', query: 'Education' },
      { title: 'Stock Market', query: 'Business' },
      { title: 'Gold & Silver Rates', query: 'gold' },
    ];

  const fetchNews = async () => {
    setLoading(true);
    try {
      let url = '/api/news?limit=50';
      if (category) url += `&category=${encodeURIComponent(category)}`;
      if (state) url += `&state=${encodeURIComponent(state)}`;
      if (city) url += `&city=${encodeURIComponent(city)}`;
      if (district) url += `&district=${encodeURIComponent(district)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await axios.get(url);
      if (res.data.success) {
        // Always display live backend news from MongoDB
        setNews(res.data.news || []);
      } else {
        setNews(getMockNewsList());
      }
    } catch (err) {
      console.warn(' news unavailable, falling back to mock news', err);
      setNews(getMockNewsList());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category, state, city, district, search]);

  const getMockNewsList = () => {
    const list = [
      {
        _id: 'm1',
        title: 'पटना में छात्रों पर लाठीचार्ज, दौड़ाकर पीटा: पथराव में कई पुलिसकर्मी घायल, वाटर कैनन चली; TRE-4 एग्जाम में बदलाव की मांग',
        subtitle: 'गांधी मैदान से डाकबंगला चौराहे तक अभ्यर्थियों का भारी विरोध प्रदर्शन, सुरक्षा बल तैनात।',
        slug: 'patna-students-protest-lathicharge-update',
        content: 'पटना में शिक्षक भर्ती परीक्षा (TRE-4) के नियमों में बदलाव की मांग को लेकर हजारों अभ्यर्थियों ने जोरदार प्रदर्शन किया। पुलिस ने भीड़ को तितर-बितर करने के लिए लाठीचार्ज किया और वाटर कैनन का इस्तेमाल किया।',
        category: 'National',
        state: 'Bihar',
        city: 'Patna',
        image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&h=450&fit=crop',
        views: 14200,
        createdAt: new Date().toISOString(),
        reporter: { name: 'दैनिक टीम पटना' },
        isLive: true,
        duration: '1:11',
      },
      {
        _id: 'm2',
        title: 'भारत-श्रीलंका दूसरा टेस्ट: टीम इंडिया की मजबूत पकड़, पंत और गिल के धमाकेदार शतक',
        subtitle: 'ऋषभ पंत ने 90 गेंदों में बनाए 142 रन, शुभमन गिल ने भी जड़ा शानदार शतक।',
        slug: 'india-vs-sri-lanka-second-test-pant-gill-centuries',
        content: 'भारतीय टीम ने कोलंबो टेस्ट मैच में शानदार प्रदर्शन करते हुए पहली पारी में 503 रनों का विशाल स्कोर खड़ा किया। जवाब में श्रीलंका की टीम संघर्ष कर रही है।',
        category: 'Cricket',
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&h=450&fit=crop',
        views: 24300,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        reporter: { name: 'स्पोर्ट्स डेस्क' },
        featuredStory: true,
      },
      {
        _id: 'm2b',
        title: 'IPL 2026 मेगा ऑक्शन: युवा तेज गेंदबाज पर लगी 18 करोड़ की रिकॉर्ड बोली, कई दिग्गज अनसोल्ड',
        subtitle: 'फ्रेंचाइजियों ने ऑलराउंडर्स और युवा फिनिशर्स पर दिल खोलकर लुटाया पैसा।',
        slug: 'ipl-2026-mega-auction-record-bids-youngsters-shine',
        content: 'आईपीएल के बहुप्रतीक्षित मेगा ऑक्शन में युवा भारतीय प्रतिभाओं का जलवा रहा। 21 वर्षीय घरेलू तेज गेंदबाज को फ्रेंचाइजी ने 18.25 करोड़ में खरीदा।',
        category: 'Cricket',
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&h=450&fit=crop',
        views: 19800,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        reporter: { name: 'क्रिकेट ब्यूरो' },
      },
      {
        _id: 'm3',
        title: 'शेयर बाजार में रिकॉर्ड तेजी: सेंसेक्स 79,000 के पार, आईटी और बैंकिंग सेक्टर में बंपर खरीदारी',
        subtitle: 'विदेशी निवेशकों की ओर से भारी लिवाली से बाजार में उत्साह का माहौल।',
        slug: 'stock-market-record-high-sensex-crosses-79000',
        content: 'भारतीय शेयर बाजार ने आज नया ऐतिहासिक रिकॉर्ड बनाया। निफ्टी और सेंसेक्स में लगातार तीसरे दिन मजबूती देखी गई।',
        category: 'Business',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&h=450&fit=crop',
        views: 18900,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        reporter: { name: 'बिजनेस ब्यूरो' },
        editorsPick: true,
      },
      {
        _id: 'm4',
        title: 'भास्कर इन्वेस्टिगेशन: नकली दवाओं के रैकेट का बड़ा पर्दाफाश, 10 राज्यों में फैला था नेटवर्क',
        subtitle: 'गुप्त गोदामों पर छापेमारी, 5 करोड़ की नकली एंटीबायोटिक्स और जीवनरक्षक दवाएं जब्त।',
        slug: 'Ideaciti-investigation-fake-medicine-racket-busted-10-states',
        content: 'Ideaciti की विशेष पड़ताल में नकली दवाइयों के एक अंतरराज्यीय सिंडिकेट का खुलासा हुआ है। ड्रग कंट्रोल विभाग ने कई फैक्ट्रियों को सील कर दिया है।',
        category: 'Investigation',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&h=450&fit=crop',
        views: 16200,
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        reporter: { name: 'विशेष अन्वेषण दल' },
      },
      {
        _id: 'm5',
        title: 'बॉलीवुड ब्लॉकबस्टर: नई फिल्म ने पहले ही दिन बॉक्स ऑफिस पर तोड़े सारे रिकॉर्ड, 65 करोड़ का ओपनिंग कलेक्शन',
        subtitle: 'ओपनिंग डे पर कमाए 65 करोड़ रुपये, दर्शकों और समीक्षकों की जबरदस्त तारीफ।',
        slug: 'bollywood-movie-box-office-record-opening-day',
        content: 'सिनेमाघरों में दर्शकों की भारी भीड़ देखने को मिल रही है। सभी प्रमुख शहरों में वीकेंड के सभी शो हाउसफुल हैं।',
        category: 'Bollywood',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&h=450&fit=crop',
        views: 28900,
        createdAt: new Date(Date.now() - 28800000).toISOString(),
        reporter: { name: 'एंटरटेनमेंट डेस्क' },
      },
      {
        _id: 'm6',
        title: 'UPSC सिविल सेवा 2026: 1,100 से अधिक पदों के लिए आधिकारिक अधिसूचना जारी, ऑनलाइन आवेदन शुरू',
        subtitle: 'आयु सीमा, योग्यता और परीक्षा पैटर्न में किए गए अहम बदलाव; प्रीलिम्स परीक्षा मई में होगी।',
        slug: 'upsc-civil-services-2026-notification-apply-online',
        content: 'संघ लोक सेवा आयोग (UPSC) ने सिविल सेवा परीक्षा 2026 का विस्तृत नोटिफिकेशन जारी कर दिया है। उम्मीदवार upsc.gov.in पर जाकर ऑनलाइन आवेदन भर सकते हैं।',
        category: 'Job - Education',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&h=450&fit=crop',
        views: 22100,
        createdAt: new Date(Date.now() - 18000000).toISOString(),
        reporter: { name: 'एजुकेशन डेस्क' },
      },
      {
        _id: 'm7',
        title: 'संसद मानसून सत्र: डिजिटल शासन और इंफ्रास्ट्रक्चर से जुड़े 4 अहम विधेयक लोकसभा में पेश',
        subtitle: 'सदन में पक्ष और विपक्ष के बीच तीखी बहस, स्पीकर ने शांति बनाए रखने का निर्देश दिया।',
        slug: 'parliament-monsoon-session-key-bills-introduced-lok-sabha',
        content: 'संसद के मानूसन सत्र के दौरान आज लोकसभा में चार महत्वपूर्ण विधेयक पेश किए गए। इनमें नागरिकों के डिजिटल अधिकारों और राष्ट्रीय राजमार्ग विकास से संबंधित संशोधन शामिल हैं।',
        category: 'Politics',
        image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&h=450&fit=crop',
        views: 17300,
        createdAt: new Date(Date.now() - 21600000).toISOString(),
        reporter: { name: 'पॉलिटिकल ब्यूरो' },
      },
      {
        _id: 'm8',
        title: 'टेक क्रांति: भारत में 6G नेटवर्क के पहले सफल ट्रायल्स, 100 गुना तेज इंटरनेट स्पीड दर्ज',
        subtitle: 'आईआईटी मद्रास और टीईसी द्वारा विकसित स्वदेशी तकनीक का सफल परीक्षण संपन्न।',
        slug: 'india-6g-network-trials-successful-ultra-fast-speed',
        content: 'दूरसंचार विभाग ने भारत के स्वदेशी 6जी टेस्टबेड पर ऐतिहासिक सफलता दर्ज की है। प्रयोगशाला परीक्षणों में 1 टेराबिट प्रति सेकंड तक की डेटा ट्रांसफर स्पीड दर्ज की गई।',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&h=450&fit=crop',
        views: 16800,
        createdAt: new Date(Date.now() - 25200000).toISOString(),
        reporter: { name: 'टेक टीम' },
      },
      {
        _id: 'm9',
        title: 'जीवन मंत्र: सावन शिवरात्रि पर पूजा का शुभ मुहूर्त और विधि; शिवलिंग पर जल चढ़ाते समय इन बातों का रखें ध्यान',
        subtitle: 'महादेव की कृपा पाने के लिए 4 प्रहर की पूजा का समय और जरूरी पूजन सामग्री सूची।',
        slug: 'jeevan-mantra-sawan-shivratri-puja-vidhi-muhurat',
        content: 'सावन मास की शिवरात्रि का धार्मिक दृष्टि से विशेष महत्व है। इस पावन दिन भगवान शिव और माता पार्वती की विधिवत पूजा करने से सभी मनोकामनाएं पूर्ण होती हैं।',
        category: 'Jeevan Mantra',
        image: 'https://images.unsplash.com/photo-1567591414240-e791b93c8d92?q=80&w=800&h=450&fit=crop',
        views: 21500,
        createdAt: new Date(Date.now() - 32400000).toISOString(),
        reporter: { name: 'धर्म-अध्यात्म डेस्क' },
      },
      {
        _id: 'm10',
        title: 'मानसून में बीमारियों से बचाव के 5 आसान नुस्खे: इम्युनिटी बढ़ाने के लिए डाइट में शामिल करें ये आयुर्वेदिक जड़ी-बूटियां',
        subtitle: 'बरसात के मौसम में फंगल इन्फेक्शन और वायरल बुखार से बचने के लिए विशेषज्ञों की सलाह।',
        slug: 'monsoon-lifestyle-health-tips-ayurvedic-immunity-boost',
        content: 'मौसम में बदलाव के साथ ही मौसमी बीमारियां तेजी से पैर पसारने लगती हैं। आयुर्वेद विशेषज्ञों के अनुसार गिलोय, तुलसी, सोंठ और हल्दी का काढ़ा रोग प्रतिरोधक क्षमता को कई गुना बढ़ा देता है।',
        category: 'Lifestyle',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&h=450&fit=crop',
        views: 9300,
        createdAt: new Date(Date.now() - 36000000).toISOString(),
        reporter: { name: 'लाइफस्टाइल डेस्क' },
      },
      {
        _id: 'm11',
        title: 'ग्लोबल क्लाइमेट समिट: 80 देशों ने कार्बन उत्सर्जन घटाने के नए लक्ष्य तय किए, ग्रीन फंड पर मुहर',
        subtitle: 'ग्लोबल वार्मिंग से निपटने के लिए ऐतिहासिक समझौता; विकासशील देशों को मिलेगी मदद।',
        slug: 'world-climate-summit-renewable-energy-agreement-80-nations',
        content: 'संयुक्त राष्ट्र जलवायु सम्मेलन में 80 से अधिक देशों ने ग्रीन एनर्जी ट्रांजिशन को गति देने के लिए ऐतिहासिक समझौते पर हस्ताक्षर किए हैं।',
        category: 'World',
        image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&h=450&fit=crop',
        views: 10400,
        createdAt: new Date(Date.now() - 39600000).toISOString(),
        reporter: { name: 'इंटरनेशनल डेस्क' },
      },
      {
        _id: 'm12',
        title: 'DB ओरिजिनल: यूपीआई और क्यूआर कोड ने कैसे बदल दी भारतीय हाट-बाजारों की अर्थव्यवस्था',
        subtitle: 'सब्जी विक्रेताओं से लेकर ग्रामीण कारीगरों तक; 90% छोटे व्यापारी अब डिजिटल पेमेंट के भरोसे।',
        slug: 'db-original-upi-digital-payments-grassroots-revolution',
        content: 'भारत में डिजिटल भुगतान अब सिर्फ महानगरों तक सीमित नहीं रहा। हमारी जमीनी पड़ताल में सामने आया कि टियर-3 और टियर-4 कस्बों में भी 85 प्रतिशत से अधिक लेन-देन डिजिटल माध्यम से हो रहे हैं।',
        category: 'DB Original',
        image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?q=80&w=800&h=450&fit=crop',
        views: 11200,
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        reporter: { name: 'DB इन्वेस्टिगेशन' },
      },
      {
        _id: 'm13',
        title: 'खास रिपोर्ट: लद्दाख के माइनस 25 डिग्री में सोलर पॉवर का कमाल, 40 दूरदराज गांवों को मिली 24 घंटे बिजली',
        subtitle: 'बैटरी एनर्जी स्टोरेज सिस्टम से पहली बार कड़ाके की ठंड में भी रोशन हुए बॉर्डर इलाके।',
        slug: 'ladakh-solar-power-green-revolution-border-villages',
        content: 'लद्दाख के सीमावर्ती गांवों में सर्दियों के दौरान बिजली गुल होने की समस्या अब इतिहास बन चुकी है। उच्च तुंगता वाले सौर संयंत्रों ने निरंतर बिजली आपूर्ति सुनिश्चित की है।',
        category: 'Special',
        image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=800&h=450&fit=crop',
        views: 8700,
        createdAt: new Date(Date.now() - 46800000).toISOString(),
        reporter: { name: 'विशेष संवाददाता' },
      },
      {
        _id: 'm14',
        title: 'ओलंपिक ट्रायल्स: भारतीय मुक्केबाजों ने जीते 4 स्वर्ण, विश्व चैंपियनशिप के लिए टीम का चयन पूरा',
        subtitle: 'पटियाला नेशनल इंस्टीट्यूट ऑफ स्पोर्ट्स में संपन्न हुए फाइनल मुकाबले, नए चेहरों ने चौंकाया।',
        slug: 'olympic-boxing-trials-india-four-gold-medals',
        content: 'पटियाला में आयोजित राष्ट्रीय मुक्केबाजी चयन स्पर्धा में युवा मुक्केबाजों ने शानदार खेल का प्रदर्शन करते हुए शीर्ष वरीयता प्राप्त खिलाड़ियों को पछाड़ा।',
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&h=450&fit=crop',
        views: 7900,
        createdAt: new Date(Date.now() - 50400000).toISOString(),
        reporter: { name: 'स्पोर्ट्स डेस्क' },
      },
      {
        _id: 'm15',
        title: 'साइबर सेल की बड़ी कार्रवाई: विदेश में बैठे आकाओं से जुड़े अंतरराज्यीय फ्रॉड गैंग का पर्दाफाश, 8 गिरफ्तार',
        subtitle: 'फर्जी बैंक खाते खोलकर करोड़ों की ठगी करने वाले गिरोह से 45 लैपटॉप और 120 सिम कार्ड बरामद।',
        slug: 'cyber-cell-busts-international-financial-fraud-gang',
        content: 'पुलिस की स्पेशल साइबर सेल ने आधुनिक तकनीक और वित्तीय ट्रेल की मदद से एक बड़े साइबर गिरोह को गिरफ्तार किया है।',
        category: 'Crime',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&h=450&fit=crop',
        views: 13800,
        createdAt: new Date(Date.now() - 54000000).toISOString(),
        reporter: { name: 'क्राइम रिपोर्टर' },
      }
    ];

    let filtered = [...list];
    if (category) {
      const c = category.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const itemCat = item.category.toLowerCase().trim();
        if (itemCat === c) return true;
        if ((c === 'bollywood' || c === 'entertainment') && (itemCat === 'bollywood' || itemCat === 'entertainment')) return true;
        if ((c === 'cricket' || c === 'sports') && (itemCat === 'cricket' || itemCat === 'sports')) return true;
        if ((c === 'jeevan mantra' || c === 'astrology') && (itemCat === 'jeevan mantra' || itemCat === 'astrology')) return true;
        if ((c === 'world' || c === 'international') && (itemCat === 'world' || itemCat === 'international')) return true;
        if ((c === 'job - education' || c === 'education' || c === 'job-education') && (itemCat === 'job - education' || itemCat === 'education')) return true;
        if ((c === 'db original' || c === 'opinion') && (itemCat === 'db original' || itemCat === 'opinion')) return true;
        if ((c === 'special' || c === 'khas') && (itemCat === 'special' || itemCat === 'khas')) return true;
        return false;
      });
    }
    if (state) filtered = filtered.filter(item => item.state === state);
    if (city) filtered = filtered.filter(item => item.city === city);
    if (search) filtered = filtered.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));

    return filtered;
  };

  const featured = getLocalizedNews(news[0], language);
  const listItems = news.slice(1).map((item) => getLocalizedNews(item, language));

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200">

      {/* Top Banner Advertisement */}
      <AdBanner type="Banner" />

      {/* Main 3-Column Layout: [Left Sidebar] [Center Feed] [Right Widgets] */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 py-4 flex flex-col md:flex-row gap-5 items-start">

        {/* ── LEFT COLUMN: Vertical Categories Sidebar ── */}
        <aside className="w-full md:w-56 lg:w-60 flex-shrink-0">
          <Sidebar />
        </aside>

        {/* ── CENTER COLUMN: Main News Feed & Trending Pills ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Active Category Banner Indicator */}
          {category && (
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  {category} {language === 'Hindi' ? 'समाचार' : 'News'}
                </h2>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {news.length} {language === 'Hindi' ? 'खबरें' : 'Stories'}
                </span>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 transition-colors"
              >
                {language === 'Hindi' ? 'सभी खबरें देखें ›' : 'View All News ›'}
              </button>
            </div>
          )}

          {/* Horizontal Trending Tags Bar (Dainik Bhaskar style) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <span className="text-red-600 font-extrabold text-xs flex-shrink-0 flex items-center gap-1">
              {language === 'Hindi' ? 'ट्रेंडिंग' : 'Trending'}
            </span>
            <div className="flex items-center gap-1.5 whitespace-nowrap text-xs">
              {trendingTags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/?category=${tag.query}`)}
                  className="px-3 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>{tag.title}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
            </div>
          ) : featured ? (
            <div className="space-y-4">

              {/* Featured LIVE Hero Card (Dainik Bhaskar Style) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs p-4 space-y-3">

                {/* Headline with Red LIVE Badge */}
                <div className="space-y-1.5">
                  <Link to={`/news/${featured.slug}`} className="block group">
                    <h1 className="text-lg md:text-xl lg:text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug group-hover:text-red-600 transition-colors">
                      <span className="inline-flex items-center gap-1 bg-red-600 text-white font-black text-xs px-2 py-0.5 rounded mr-2 align-middle">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        LIVE
                      </span>
                      {featured.title}
                    </h1>
                  </Link>
                </div>

                {/* Main Hero Video / Photo with Centered Play Button Overlay */}
                <Link to={`/news/${featured.slug}`} className="block relative group rounded-xl overflow-hidden bg-slate-950">
                  <img
                    src={featured.image ? getMediaUrl(featured.image) : 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&h=450&fit=crop'}
                    alt={featured.title}
                    className="w-full h-64 sm:h-80 md:h-96 object-cover group-hover:scale-102 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-black/70 group-hover:bg-red-600 transition-colors flex items-center justify-center shadow-xl border-2 border-white/80">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                  {/* Video Duration Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                    {featured.duration || '1:15'}
                  </div>
                </Link>

                {/* Sub-bar / Live Update footer */}
                <div className="flex items-center justify-between pt-1 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <span className="text-red-600 font-bold">लाइव अपडेट्स</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{featured.views?.toLocaleString()} व्यूज</span>
                    <span>•</span>
                    <span>{new Date(featured.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

              </div>


              {/* News Grid (2-column on desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listItems.map((item) => (
                  <div key={item._id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <Link to={`/news/${item.slug}`} className="block relative group overflow-hidden">
                        <img
                          src={item.image ? getMediaUrl(item.image) : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400&h=240&fit=crop'}
                          alt={item.title}
                          className="w-full h-40 object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-sm">
                          {item.category}
                        </div>
                      </Link>
                      <div className="p-3.5 space-y-1.5">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                          <span>{item.reporter?.name}</span>
                          <span>•</span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <Link to={`/news/${item.slug}`} className="block hover:text-red-600 transition-colors">
                          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug line-clamp-2">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {item.subtitle || item.content?.substring(0, 90) + '...'}
                        </p>
                      </div>
                    </div>
                    <div className="px-3.5 pb-3 pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{item.views} व्यूज</span>
                      {item.editorsPick && (
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-500" /> खास
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                  {category ? `"${category}" श्रेणी में अभी कोई समाचार उपलब्ध नहीं है` : 'कोई समाचार नहीं मिला'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  एडमिन पैनल (Write News) से इस श्रेणी के लिए नया समाचार पब्लिश करें, या मुख्य खबरें देखें।
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                  सभी मुख्य समाचार देखें (All News)
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── RIGHT COLUMN: Live Cricket Score, Google News, Ads & Trending ── */}
        <aside className="w-full md:w-72 lg:w-80 flex-shrink-0 space-y-4">

          {/* Google News Favorite Card (Dainik Bhaskar Style) */}


          {/* Live Cricket Scorecard Widget (Matching Image 1) */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span className="text-lg">🇮🇳</span>
                <span>503-9 d <span className="text-slate-400 font-normal">(138.0)</span></span>
              </div>
              <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded animate-pulse">
                LIVE
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span>253-8 <span className="text-slate-400 font-normal">(75.0)</span></span>
                <span className="text-lg">🇱🇰</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span>भारत</span>
              <span className="text-[11px] text-amber-400">श्रीलंका 250 रन से पीछे</span>
              <span>श्रीलंका</span>
            </div>

            <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-800 text-slate-400 text-xs">
              <button title="Facebook" className="hover:text-blue-400 transition-colors"><Facebook className="w-4 h-4" /></button>
              <button title="X (Twitter)" className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></button>
              <button title="Copy Link" className="hover:text-emerald-400 transition-colors"><Link2 className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Devbhoomi Uttarakhand / Ad Slot */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=400&h=300&fit=crop"
              alt="Special Feature"
              className="w-full h-44 object-cover"
            />
            <div className="p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-t border-amber-200/40 text-center">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                • अनुपम • अद्भुत • अलौकिक दर्शन •
              </span>
            </div>
          </div>

          {/* Active Poll Widget */}
          <PollWidget />

          {/* Trending News List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Flame className="w-5 h-5 text-red-600" />
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider">
                {language === 'Hindi' ? 'ट्रेंडिंग खबरें' : 'Trending News'}
              </h3>
            </div>
            <div className="space-y-3.5">
              {news.slice(0, 5).map((itemRaw, idx) => {
                const item = getLocalizedNews(itemRaw, language);
                return (
                  <div key={item._id} className="flex gap-3 items-start group">
                    <span className="font-black text-2xl text-slate-300 dark:text-slate-700 leading-none group-hover:text-red-600 transition-colors w-6">
                      {idx + 1}
                    </span>
                    <div className="space-y-1 flex-1">
                      <Link to={`/news/${item.slug}`} className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-red-600 leading-snug block line-clamp-2">
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{item.views}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
};

export default Home;
