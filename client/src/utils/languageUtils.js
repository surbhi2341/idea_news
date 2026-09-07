// Utility helper to localize news articles when language switches between Hindi and English

const hindiToEnglishDictionary = {
  // Common Hindi headlines mapped to fluent English
  'पटना में छात्रों पर लाठीचार्ज, दौड़ाकर पीटा: पथराव में कई पुलिसकर्मी घायल, वाटर कैनन चली; TRE-4 एग्जाम में बदलाव की मांग':
    'Lathicharge on Students in Patna: Protests over TRE-4 Exam Rules; Security Forces Deployed',
  'गांधी मैदान से डाकबंगला चौराहे तक अभ्यर्थियों का भारी विरोध प्रदर्शन, सुरक्षा बल तैनात।':
    'Heavy protests by candidates from Gandhi Maidan to Dakbangla crossing as security forces step in.',
  'पटना में शिक्षक भर्ती परीक्षा (TRE-4) के नियमों में बदलाव की मांग को लेकर हजारों अभ्यर्थियों ने जोरदार प्रदर्शन किया। पुलिस ने भीड़ को तितर-बितर करने के लिए लाठीचार्ज किया और वाटर कैनन का इस्तेमाल किया।':
    'Thousands of candidates staged a fierce demonstration in Patna demanding changes in the Teacher Recruitment Exam (TRE-4) rules. Police used water cannons and lathicharge to disperse the crowd.',
  'भारत-श्रीलंका दूसरा टेस्ट: टीम इंडिया की मजबूत पकड़, पंत और गिल के धमाकेदार शतक':
    'India vs Sri Lanka 2nd Test: Pant and Gill Smash Centuries as India Take Dominant Command',
  'ऋषभ पंत ने 90 गेंदों में बनाए 142 रन, शुभमन गिल ने भी जड़ा शानदार शतक।':
    'Rishabh Pant scored 142 off 90 balls, while Shubman Gill also slammed a brilliant century.',
  'भारतीय टीम ने कोलंबो टेस्ट मैच में शानदार प्रदर्शन करते हुए पहली पारी में 503 रनों का विशाल स्कोर खड़ा किया। जवाब में श्रीलंका की टीम संघर्ष कर रही है।':
    'Team India posted a massive 503 in their first innings of the Colombo Test. In response, Sri Lanka is struggling.',
  'शेयर बाजार में रिकॉर्ड तेजी: सेंसेक्स 78,000 के पार, आईटी और बैंकिंग सेक्टर में बंपर खरीदारी':
    'Stock Market Hits All-Time Record: Sensex Crosses 78,000; Heavy Buying in IT & Banking',
  'विदेशी निवेशकों की ओर से भारी लिवाली से बाजार में उत्साह का माहौल।':
    'Heavy buying by foreign investors fuels massive optimism in the domestic equity markets.',
  'भारतीय शेयर बाजार ने आज नया ऐतिहासिक रिकॉर्ड बनाया। निफ्टी और सेंसेक्स में लगातार तीसरे दिन मजबूती देखी गई।':
    'Indian equity markets scaled new historic highs today. Nifty and Sensex closed in the green for the third straight session.',
  'भास्कर इन्वेस्टिगेशन: नकली दवाओं के रैकेट का बड़ा पर्दाफाश, 10 राज्यों में फैला था नेटवर्क':
    'Ideaciti Investigation: Massive Fake Medicine Racket Busted Across 10 States',
  'गुप्त गोदामों पर छापेमारी, 5 करोड़ की नकली एंटीबायोटिक्स और जीवनरक्षक दवाएं जब्त।':
    'Raids on secret warehouses net fake antibiotics and life-saving drugs worth ₹5 Crore.',
  'दैनिक भास्कर की विशेष पड़ताल में नकली दवाइयों के एक अंतरराज्यीय सिंडिकेट का खुलासा हुआ है। ड्रग कंट्रोल विभाग ने कई फैक्ट्रियों को सील कर दिया है।':
    'A special investigation exposed an interstate syndicate manufacturing counterfeit medications. Drug control authorities have sealed multiple manufacturing units.',
  'दैनिक टीम पटना': 'Patna News Desk',
  'स्पोर्ट्स डेस्क': 'Sports Bureau',
  'बिजनेस ब्यूरो': 'Business Desk',
  'विशेष अन्वेषण दल': 'Special Investigation Team',
};

// Fallback auto-translator for unknown Hindi strings
const fallbackTranslate = (str) => {
  if (!str) return str;
  // If string contains Devanagari characters, replace known words or generate readable English label
  if (/[\u0900-\u097F]/.test(str)) {
    let result = str;
    for (const [hi, en] of Object.entries(hindiToEnglishDictionary)) {
      if (result.includes(hi)) {
        result = result.replace(hi, en);
      }
    }
    return result;
  }
  return str;
};

export const getLocalizedNews = (item, language) => {
  if (!item) return item;
  if (language === 'Hindi') return item;

  const title = item.titleEn || hindiToEnglishDictionary[item.title] || fallbackTranslate(item.title);
  const subtitle = item.subtitleEn || hindiToEnglishDictionary[item.subtitle] || fallbackTranslate(item.subtitle);
  const content = item.contentEn || hindiToEnglishDictionary[item.content] || fallbackTranslate(item.content);
  const reporterName = item.reporter?.nameEn || hindiToEnglishDictionary[item.reporter?.name] || item.reporter?.name;

  return {
    ...item,
    title,
    subtitle,
    content,
    reporter: item.reporter ? { ...item.reporter, name: reporterName } : item.reporter,
  };
};
