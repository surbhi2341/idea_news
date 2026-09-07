import mongoose from 'mongoose';
import dotenv from 'dotenv';
import News from './models/News.js';
import User from './models/User.js';

dotenv.config();

const seedArticles = [
  // ── National (Top News) ──
  {
    title: 'पटना में छात्रों पर लाठीचार्ज, दौड़ाकर पीटा: पथराव में कई पुलिसकर्मी घायल, वाटर कैनन चली; TRE-4 एग्जाम में बदलाव की मांग',
    subtitle: 'गांधी मैदान से डाकबंगला चौराहे तक अभ्यर्थियों का भारी विरोध प्रदर्शन, सुरक्षा बल तैनात।',
    slug: 'patna-students-protest-lathicharge-update-2026',
    content: 'पटना में शिक्षक भर्ती परीक्षा (TRE-4) के नियमों में बदलाव की मांग को लेकर हजारों अभ्यर्थियों ने जोरदार प्रदर्शन किया। पुलिस ने भीड़ को तितर-बितर करने के लिए लाठीचार्ज किया और वाटर कैनन का इस्तेमाल किया। प्रशासन ने शांति बनाए रखने की अपील की है।',
    category: 'National',
    state: 'Bihar',
    city: 'Patna',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&h=450&fit=crop',
    views: 18400,
    breakingNews: true,
    featuredStory: true,
    tags: ['Bihar', 'Patna', 'Exam', 'Protest']
  },
  {
    title: 'दिल्ली-देहरादून नए एक्सप्रेसवे का लोकार्पण: सफर सिर्फ ढाई घंटे का, राजाजी पार्क में बना 12 किमी लंबा वाइल्डलाइफ कॉरिडोर',
    subtitle: 'यातायात में ऐतिहासिक क्रांति, पर्यटन और व्यापार को मिलेगा बड़ा प्रोत्साहन।',
    slug: 'delhi-dehradun-expressway-inauguration-travel-time-reduced',
    content: 'दिल्ली और देहरादून के बीच नए 6-लेन ग्रीनफील्ड एक्सप्रेसवे का लोकार्पण कर दिया गया है। इससे दोनों शहरों के बीच यात्रा का समय घटकर मात्र 2.5 घंटे रह जाएगा। राजाजी राष्ट्रीय उद्यान में जानवरों की सुरक्षा के लिए देश का सबसे लंबा 12 किमी एलिवेटेड कॉरिडोर तैयार किया गया है।',
    category: 'National',
    state: 'Uttarakhand',
    city: 'Dehradun',
    image: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?q=80&w=800&h=450&fit=crop',
    views: 12500,
    tags: ['Highway', 'Expressway', 'Uttarakhand', 'Delhi']
  },

  // ── Investigation (इन्वेस्टिगेशन) ──
  {
    title: 'भास्कर इन्वेस्टिगेशन: 10 राज्यों में फैला था नकली दवाओं का सिंडिकेट, 5 करोड़ की नकली एंटीबायोटिक्स जब्त',
    subtitle: 'गुप्त फैक्ट्रियों पर ड्रग कंट्रोल विभाग और एसटीएफ की संयुक्त छापेमारी, 12 लोग गिरफ्तार।',
    slug: 'Ideaciti-investigation-fake-medicine-racket-busted-10-states',
    content: 'Ideaciti की विशेष पड़ताल में नकली दवाइयों के एक अंतरराज्यीय सिंडिकेट का भंडाफोड़ हुआ है। आरोपी नामी ब्रांड्स के रैपर में चाक और साधारण पाउडर भरकर जीवनरक्षक दवाओं के नाम पर सप्लाई कर रहे थे। जांच में 150 से अधिक मेडिकल स्टोर्स को नोटिस थमाया गया है।',
    category: 'Investigation',
    state: 'Uttar Pradesh',
    city: 'Ghaziabad',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&h=450&fit=crop',
    views: 16200,
    editorsPick: true,
    tags: ['Investigation', 'Health', 'Scam', 'Medicine']
  },
  {
    title: 'पड़ताल: चंबल नदी के किनारे अवैध खनन का काला साम्राज्य, सेटेलाइट तस्वीरों ने खोली पोल',
    subtitle: 'घड़ियाल अभयारण्य के संवेदनशील इलाकों में पोकलैंड मशीनों से दिन-रात रेत खनन।',
    slug: 'chambal-river-illegal-sand-mining-satellite-expose',
    content: 'चंबल नदी के इको-सेंसिटिव जोन में अवैध रेत खनन माफियाओं ने अभयारण्य की भौगोलिक संरचना को तबाह कर दिया है। उच्च-रिजोल्यूशन सेटेलाइट इमेजरी के जरिए जांच में सामने आया है कि पिछले दो वर्षों में 20 से अधिक अवैध रास्ते बनाए गए हैं।',
    category: 'Investigation',
    state: 'Madhya Pradesh',
    city: 'Gwalior',
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=800&h=450&fit=crop',
    views: 9400,
    tags: ['Chambal', 'Mining', 'Environment', 'Expose']
  },

  // ── Cricket (क्रिकेट) ──
  {
    title: 'भारत-श्रीलंका दूसरा टेस्ट: टीम इंडिया की मजबूत पकड़, पंत और गिल के धमाकेदार शतक',
    subtitle: 'ऋषभ पंत ने 90 गेंदों में बनाए 142 रन, शुभमन गिल ने भी जड़ा शानदार शतक; भारत ने घोषित की पहली पारी।',
    slug: 'india-vs-sri-lanka-second-test-pant-gill-centuries',
    content: 'कोलंबो में खेले जा रहे दूसरे टेस्ट मैच में भारतीय टीम ने विशाल स्कोर खड़ा किया। विकेटकीपर बल्लेबाज ऋषभ पंत ने आक्रामक पारी खेलते हुए शतक जड़ा। शुभमन गिल ने धैर्यपूर्वक पारी खेलते हुए 118 रन बनाए। गेंदबाजों ने भी शानदार शुरुआत की है।',
    category: 'Cricket',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&h=450&fit=crop',
    views: 24300,
    breakingNews: true,
    tags: ['Cricket', 'TeamIndia', 'Pant', 'Gill', 'TestMatch']
  },
  {
    title: 'IPL 2026 मेगा ऑक्शन: युवा तेज गेंदबाज पर लगी 18 करोड़ की रिकॉर्ड बोली, कई दिग्गज अनसोल्ड',
    subtitle: 'फ्रेंचाइजियों ने ऑलराउंडर्स और युवा फिनिशर्स पर दिल खोलकर लुटाया पैसा।',
    slug: 'ipl-2026-mega-auction-record-bids-youngsters-shine',
    content: 'आईपीएल के बहुप्रतीक्षित मेगा ऑक्शन में युवा भारतीय प्रतिभाओं का जलवा रहा। 21 वर्षीय घरेलू तेज गेंदबाज को एक फ्रेंचाइजी ने 18.25 करोड़ रुपये में खरीदा। वहीं कई विदेशी दिग्गज खिलाड़ियों को कोई खरीदार नहीं मिला।',
    category: 'Cricket',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&h=450&fit=crop',
    views: 19800,
    tags: ['IPL', 'Auction', 'CricketNews', 'T20']
  },

  // ── Special (खास) ──
  {
    title: 'खास रिपोर्ट: लद्दाख के माइनस 25 डिग्री में सोलर पॉवर का कमाल, 40 दूरदराज गांवों को मिली 24 घंटे बिजली',
    subtitle: 'बैटरी एनर्जी स्टोरेज सिस्टम से पहली बार कड़ाके की ठंड में भी रोशन हुए बॉर्डर इलाके।',
    slug: 'ladakh-solar-power-green-revolution-border-villages',
    content: 'लद्दाख के सीमावर्ती गांवों में सर्दियों के दौरान बिजली गुल होने की समस्या अब इतिहास बन चुकी है। उच्च तुंगता वाले सौर संयंत्रों और आधुनिक लिथियम बैटरी सिस्टम ने शून्य से नीचे तापमान में भी निर्बाध बिजली आपूर्ति सुनिश्चित की है।',
    category: 'Special',
    state: 'Ladakh',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=800&h=450&fit=crop',
    views: 8700,
    editorsPick: true,
    tags: ['Ladakh', 'SolarEnergy', 'SpecialReport', 'Inspiration']
  },

  // ── DB Original (DB ओरिजिनल) ──
  {
    title: 'DB ओरिजिनल: यूपीआई और क्यूआर कोड ने कैसे बदल दी भारतीय हाट-बाजारों की अर्थव्यवस्था',
    subtitle: 'सब्जी विक्रेताओं से लेकर ग्रामीण कारीगरों तक; 90% छोटे व्यापारी अब डिजिटल पेमेंट के भरोसे।',
    slug: 'db-original-upi-digital-payments-grassroots-revolution',
    content: 'भारत में डिजिटल भुगतान अब सिर्फ महानगरों तक सीमित नहीं रहा। हमारी जमीनी पड़ताल में सामने आया कि टियर-3 और टियर-4 कस्बों में भी 85 प्रतिशत से अधिक लेन-देन डिजिटल माध्यम से हो रहे हैं, जिससे क्रेडिट तक पहुंच भी आसान हुई है।',
    category: 'DB Original',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?q=80&w=800&h=450&fit=crop',
    views: 11200,
    tags: ['DBOriginal', 'Economy', 'UPI', 'DigitalIndia']
  },

  // ── Sports (स्पोर्ट्स) ──
  {
    title: 'ओलंपिक ट्रायल्स: भारतीय मुक्केबाजों ने जीते 4 स्वर्ण, विश्व चैंपियनशिप के लिए टीम का चयन पूरा',
    subtitle: 'पटियाला नेशनल इंस्टीट्यूट ऑफ स्पोर्ट्स में संपन्न हुए फाइनल मुकाबले, नए चेहरों ने चौंकाया।',
    slug: 'olympic-boxing-trials-india-four-gold-medals',
    content: 'पटियाला में आयोजित राष्ट्रीय मुक्केबाजी चयन स्पर्धा में युवा मुक्केबाजों ने शानदार खेल का प्रदर्शन करते हुए शीर्ष वरीयता प्राप्त खिलाड़ियों को पछाड़ा। चार वजन वर्गों में भारतीय खिलाड़ियों ने कोटा स्थान हासिल कर इतिहास रचा।',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&h=450&fit=crop',
    views: 7900,
    tags: ['Sports', 'Boxing', 'Olympics', 'IndiaSports']
  },

  // ── Bollywood (बॉलीवुड) ──
  {
    title: 'बॉक्स ऑफिस धमाका: नई एक्शन थ्रिलर ने पहले दिन कमाए 65 करोड़, तोड़े कई ब्लॉकबस्टर फिल्मों के रिकॉर्ड',
    subtitle: 'दर्शकों का जबरदस्त रिस्पॉन्स, सिंगल स्क्रीन से लेकर मल्टीप्लेक्स तक हाउसफुल के बोर्ड।',
    slug: 'bollywood-movie-box-office-record-opening-day',
    content: 'सिनेमाघरों में दर्शकों की भारी भीड़ देखने को मिल रही है। समीक्षकों ने फिल्म के एक्शन सीक्वेंसेज और कहानी की जमकर सराहना की है। विदेशी बॉक्स ऑफिस पर भी फिल्म ने पहले वीकेंड में 100 करोड़ का आंकड़ा पार कर लिया है।',
    category: 'Bollywood',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&h=450&fit=crop',
    views: 28900,
    tags: ['Bollywood', 'BoxOffice', 'Cinema', 'MovieReview']
  },
  {
    title: 'बॉलीवुड एक्सक्लूसिव: ऐतिहासिक वॉर ड्रामा में नजर आएंगे दो बड़े सुपरस्टार्स, बजट 400 करोड़',
    subtitle: 'अगले वर्ष दिवाली पर रिलीज की तैयारी, अंतरराष्ट्रीय वीएफएक्स स्टूडियो से हुआ करार।',
    slug: 'bollywood-historical-action-epic-superstars-announce',
    content: 'भारतीय सिनेमा के दो सबसे बड़े सुपरस्टार्स जल्द ही एक ऐतिहासिक एक्शन ड्रामा में एक साथ स्क्रीन शेयर करते नजर आएंगे। फिल्म की शूटिंग राजस्थान और जॉर्जिया के भव्य लोकेशन्स पर की जाएगी।',
    category: 'Bollywood',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&h=450&fit=crop',
    views: 15400,
    tags: ['Bollywood', 'Exclusive', 'Movies', 'BollywoodNews']
  },

  // ── Job - Education (जॉब - एजुकेशन) ──
  {
    title: 'UPSC सिविल सेवा 2026: 1,100 से अधिक पदों के लिए आधिकारिक अधिसूचना जारी, इस तारीख से करें ऑनलाइन आवेदन',
    subtitle: 'आयु सीमा, योग्यता और परीक्षा पैटर्न में किए गए अहम बदलाव; प्रीलिम्स परीक्षा मई में होगी।',
    slug: 'upsc-civil-services-2026-notification-apply-online',
    content: 'संघ लोक सेवा आयोग (UPSC) ने सिविल सेवा परीक्षा 2026 का विस्तृत नोटिफिकेशन जारी कर दिया है। इस बार कुल 1,120 पदों पर भर्ती की जाएगी। उम्मीदवार यूपीएससी की आधिकारिक वेबसाइट upsc.gov.in पर जाकर ऑनलाइन आवेदन भर सकते हैं।',
    category: 'Job - Education',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&h=450&fit=crop',
    views: 22100,
    tags: ['UPSC', 'Jobs', 'SarkariNaukri', 'Education']
  },
  {
    title: 'JEE Main 2026: आवेदन की अंतिम तिथि बढ़ाई गई, नेशनल टेस्टिंग एजेंसी ने जारी की संशोधित तिथियां',
    subtitle: 'छात्रों की मांग पर मिला अतिरिक्त मौका, अब 15 तारीख तक भर सकेंगे फॉर्म।',
    slug: 'jee-main-2026-registration-deadline-extended-nta',
    content: 'नेशनल टेस्टिंग एजेंसी (NTA) ने तकनीकी दिक्कतों और छात्रों की मांग को ध्यान में रखते हुए जेईई मेन 2026 सत्र-1 के लिए आवेदन की अंतिम तारीख बढ़ा दी है। परीक्षा कंप्यूटर आधारित टेस्ट मोड में आयोजित होगी।',
    category: 'Job - Education',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&h=450&fit=crop',
    views: 14700,
    tags: ['JEE', 'NTA', 'Engineering', 'Education']
  },

  // ── Business (बिजनेस) ──
  {
    title: 'शेयर बाजार में नया इतिहास: सेंसेक्स 79,000 के पार बंद, आईटी और ऑटो शेयरों में रिकॉर्ड खरीदारी',
    subtitle: 'विदेशी संस्थागत निवेशकों (FII) की भारी लिवाली, निवेशकों की संपत्ति में 4 लाख करोड़ का इजाफा।',
    slug: 'stock-market-record-high-sensex-crosses-79000',
    content: 'भारतीय इक्विटी बाजारों में गुरुवार को चौतरफा तेजी देखने को मिली। बीएसई सेंसेक्स 850 अंक उछलकर 79,200 के नए सर्वकालिक उच्च स्तर पर बंद हुआ। एनएसई निफ्टी भी 24,100 के स्तर को पार कर गया।',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&h=450&fit=crop',
    views: 18900,
    breakingNews: true,
    tags: ['StockMarket', 'Sensex', 'Nifty', 'Business']
  },

  // ── Lifestyle (लाइफस्टाइल) ──
  {
    title: 'मानसून में बीमारियों से बचाव के 5 आसान नुस्खे: इम्युनिटी बढ़ाने के लिए डाइट में शामिल करें ये आयुर्वेदिक जड़ी-बूटियां',
    subtitle: 'बरसात के मौसम में फंगल इन्फेक्शन और वायरल बुखार से बचने के लिए विशेषज्ञों की सलाह।',
    slug: 'monsoon-lifestyle-health-tips-ayurvedic-immunity-boost',
    content: 'मौसम में बदलाव के साथ ही मौसमी बीमारियां तेजी से पैर पसारने लगती हैं। आयुर्वेद विशेषज्ञों के अनुसार गिलोय, तुलसी, सोंठ और हल्दी का काढ़ा रोग प्रतिरोधक क्षमता को कई गुना बढ़ा देता है। बाहर के बासी और खुले खाद्य पदार्थों से परहेज करें।',
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&h=450&fit=crop',
    views: 9300,
    tags: ['Lifestyle', 'HealthTips', 'Wellness', 'Ayurveda']
  },

  // ── Jeevan Mantra (जीवन मंत्र) ──
  {
    title: 'जीवन मंत्र: सावन शिवरात्रि पर पूजा का शुभ मुहूर्त और विधि; शिवलिंग पर जल चढ़ाते समय इन बातों का रखें विशेष ध्यान',
    subtitle: 'महादेव की कृपा पाने के लिए 4 प्रहर की पूजा का समय और जरूरी पूजन सामग्री सूची।',
    slug: 'jeevan-mantra-sawan-shivratri-puja-vidhi-muhurat',
    content: 'सावन मास की शिवरात्रि का धार्मिक दृष्टि से विशेष महत्व है। इस पावन दिन भगवान शिव और माता पार्वती की विधिवत पूजा करने से सभी मनोकामनाएं पूर्ण होती हैं। ज्योतिषाचार्यों के अनुसार प्रातः काल से लेकर निशीथ काल तक का समय अत्यंत फलदायी रहेगा।',
    category: 'Jeevan Mantra',
    image: 'https://images.unsplash.com/photo-1567591414240-e791b93c8d92?q=80&w=800&h=450&fit=crop',
    views: 21500,
    editorsPick: true,
    tags: ['JeevanMantra', 'Astrology', 'Spiritual', 'Religion']
  },

  // ── Technology (टेक) ──
  {
    title: 'टेक क्रांति: भारत में 6G नेटवर्क के पहले सफल ट्रायल्स, 100 गुना तेज इंटरनेट स्पीड दर्ज',
    subtitle: 'आईआईटी मद्रास और टीईसी द्वारा विकसित स्वदेशी तकनीक का सफल परीक्षण संपन्न।',
    slug: 'india-6g-network-trials-successful-ultra-fast-speed',
    content: 'दूरसंचार विभाग ने भारत के स्वदेशी 6जी टेस्टबेड पर ऐतिहासिक सफलता दर्ज की है। प्रयोगशाला परीक्षणों में 1 टेराबिट प्रति सेकंड तक की डेटा ट्रांसफर स्पीड दर्ज की गई। यह तकनीक ऑटोमैटिक ड्राइविंग और स्मार्ट शहरों में मील का पत्थर साबित होगी।',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&h=450&fit=crop',
    views: 16800,
    breakingNews: true,
    tags: ['Technology', '6G', 'Telecom', 'TechNews']
  },

  // ── World (देश-विदेश) ──
  {
    title: 'ग्लोबल क्लाइमेट समिट: 80 देशों ने कार्बन उत्सर्जन घटाने के नए लक्ष्य तय किए, रिन्यूएबल एनर्जी पर 1 खरब डॉलर का फंड',
    subtitle: 'ग्लोबल वार्मिंग से निपटने के लिए ऐतिहासिक समझौता; विकासशील देशों को मिलेगी आर्थिक और तकनीकी मदद।',
    slug: 'world-climate-summit-renewable-energy-agreement-80-nations',
    content: 'संयुक्त राष्ट्र जलवायु सम्मेलन में 80 से अधिक देशों ने ग्रीन एनर्जी ट्रांजिशन को गति देने के लिए ऐतिहासिक समझौते पर हस्ताक्षर किए हैं। समझौते के तहत अगले दशक में कोयला आधारित बिजली उत्पादन को चरणबद्ध तरीके से समाप्त करने का लक्ष्य रखा गया है।',
    category: 'World',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&h=450&fit=crop',
    views: 10400,
    tags: ['World', 'Climate', 'International', 'UN']
  },

  // ── Politics (राजनीति) ──
  {
    title: 'संसद मानसून सत्र: डिजिटल शासन और इंफ्रास्ट्रक्चर से जुड़े 4 अहम विधेयक लोकसभा में पेश',
    subtitle: 'सदन में पक्ष और विपक्ष के बीच तीखी बहस, स्पीकर ने शांति बनाए रखने का निर्देश दिया।',
    slug: 'parliament-monsoon-session-key-bills-introduced-lok-sabha',
    content: 'संसद के मानूसन सत्र के दौरान आज लोकसभा में चार महत्वपूर्ण विधेयक पेश किए गए। इनमें नागरिकों के डिजिटल अधिकारों और राष्ट्रीय राजमार्ग विकास से संबंधित संशोधन शामिल हैं। सरकार ने कहा कि ये विधेयक देश के विकास की गति को तेज करेंगे।',
    category: 'Politics',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&h=450&fit=crop',
    views: 17300,
    tags: ['Politics', 'Parliament', 'LokSabha', 'IndiaPolitics']
  },

  // ── Crime (क्राइम) ──
  {
    title: 'साइबर सेल की बड़ी कार्रवाई: विदेश में बैठे आकाओं से जुड़े अंतरराज्यीय फ्रॉड गैंग का पर्दाफाश, 8 गिरफ्तार',
    subtitle: 'फर्जी बैंक खाते खोलकर करोड़ों की ठगी करने वाले गिरोह से 45 लैपटॉप और 120 सिम कार्ड बरामद।',
    slug: 'cyber-cell-busts-international-financial-fraud-gang',
    content: 'पुलिस की स्पेशल साइबर सेल ने आधुनिक तकनीक और वित्तीय ट्रेल की मदद से एक बड़े साइबर गिरोह को गिरफ्तार किया है। यह गिरोह वर्क-फ्रॉम-होम और ऑनलाइन लॉटरी के नाम पर आम लोगों को अपना शिकार बनाता था।',
    category: 'Crime',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&h=450&fit=crop',
    views: 13800,
    tags: ['Crime', 'CyberCrime', 'Police', 'ScamAlert']
  }
];

const seedDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bharat_news';
    console.log('[Seed] Connecting to MongoDB:', connStr);
    await mongoose.connect(connStr);
    console.log('[Seed] MongoDB Connected successfully');

    // Find or create a default staff user to be the reporter
    let reporter = await User.findOne({ role: { $in: ['Admin', 'Super Admin', 'Journalist', 'Editor'] } });
    if (!reporter) {
      reporter = await User.findOne();
    }
    if (!reporter) {
      reporter = await User.create({
        name: 'Ideaciti Staff Reporter',
        email: 'editor@ideanews.in',
        phone: '9876543210',
        role: 'Admin'
      });
      console.log('[Seed] Created default reporter user:', reporter.email);
    } else {
      console.log('[Seed] Using existing reporter user:', reporter.name || reporter.email);
    }

    // Clean up existing seeded articles or upsert
    let createdCount = 0;
    for (const art of seedArticles) {
      const existing = await News.findOne({ slug: art.slug });
      if (!existing) {
        await News.create({
          ...art,
          reporter: reporter._id,
          status: 'Published'
        });
        createdCount++;
      } else {
        // Update category and fields to ensure exact alignment
        await News.updateOne(
          { _id: existing._id },
          { 
            $set: { 
              category: art.category,
              title: art.title,
              subtitle: art.subtitle,
              content: art.content,
              image: art.image,
              status: 'Published'
            }
          }
        );
      }
    }

    const totalNews = await News.countDocuments();
    console.log(`[Seed] Seeded ${createdCount} new articles! Total news articles in DB: ${totalNews}`);

    // Print count by category
    const categoriesCount = await News.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    console.log('[Seed] Category counts in DB:');
    console.table(categoriesCount);

    await mongoose.disconnect();
    console.log('[Seed] Finished and disconnected');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedDB();
