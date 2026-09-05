import type { FaqSection } from "./faq-types";
import { COMMON_PROBLEM_SECTIONS } from "./faq-common-problems";
import { NEW_PARENT_FAQ_SECTIONS } from "./faq-parenting-new";

export type { FaqItem, FaqSection, FaqKind, FaqGroupId } from "./faq-types";
export { FAQ_GROUP_LABELS, FAQ_KIND_LABELS } from "./faq-types";

const CORE_PARENT_FAQ_SECTIONS: FaqSection[] = [
  {
    id: "fever",
    kind: "faq",
    group: "infection",
    emoji: "🌡️",
    title: {
      en: "Fever & common illnesses",
      te: "జ్వరం & సాధారణ అనారోగ్యాలు",
    },
    intro: {
      en: "Fever is a symptom, not a disease. How the child looks and drinks matters more than the number alone.",
      te: "జ్వరం లక్షణం — వ్యాధి కాదు. సంఖ్య కంటే పిల్ల ఎలా ఉంది, తాగుతుందా అనేది ముఖ్యం.",
    },
    items: [
      {
        q: {
          en: "When is a temperature a fever?",
          te: "ఎప్పుడు జ్వరం అంటారు?",
        },
        a: {
          en: "About 38°C (100.4°F) or higher measured correctly (preferably rectal in young infants, or axillary/oral as advised). Feel of the forehead alone is not enough for babies under 3 months.",
          te: "సరిగ్గా కొలిస్తే సుమారు 38°C (100.4°F) లేదా ఎక్కువ. 3 నెలల లోపు పాపలకు నుదురు తాకడం మాత్రమే చాలదు.",
        },
      },
      {
        q: {
          en: "Any fever under 3 months — what should I do?",
          te: "3 నెలల లోపు జ్వరం ఉంటే?",
        },
        a: {
          en: "Seek medical care the same day — even if the baby looks “okay”. Young infants can worsen quickly.",
          te: "అదే రోజు వైద్య సహాయం తీసుకోండి — పాప బాగుందనిపించినా. చిన్న పాపలు త్వరగా క్షీణించవచ్చు.",
        },
      },
      {
        q: {
          en: "Should I always give paracetamol / ibuprofen?",
          te: "ఎల్లప్పుడూ పారాసిటమాల్ / ఐబుప్రోఫెన్ ఇవ్వాలా?",
        },
        a: {
          en: "Use weight-based dosing to keep the child comfortable if they are miserable — not only to bring the number down. Never aspirin. Check Dose Check on this site; avoid double dosing from cold syrups.",
          te: "బాధగా ఉంటే బరువు ప్రకారం మోతాదు — కేవలం సంఖ్య తగ్గించడానికి కాదు. ఆస్పిరిన్ వద్దు. ఈ సైట్‌లో Dose Check చూడండి; కోల్డ్ సిరప్‌లతో రెండు సార్లు ఇవ్వవద్దు.",
        },
      },
      {
        q: {
          en: "When should I worry with fever?",
          te: "జ్వరంతో ఎప్పుడు ఆందోళన?",
        },
        a: {
          en: "Difficulty breathing, unusual sleepiness, poor drinking, rash with fever, stiff neck, seizures, fever lasting more than 3 days, or any fever under 3 months.",
          te: "ఊపిరి కష్టం, అసాధారణ నిద్ర, తాగకపోవడం, జ్వరంతో రాష్, మెడ బిగుసుకోవడం, మూర్ఛ, 3 రోజులకు మించి జ్వరం, లేదా 3 నెలల లోపు ఏ జ్వరమైనా.",
        },
      },
      {
        q: {
          en: "Cold, cough, and mild diarrhoea — home care?",
          te: "జలుబు, దగ్గు, తేలికపాటి విరేచనాలు — ఇంటి సంరక్షణ?",
        },
        a: {
          en: "Fluids, rest, soft foods, saline nose drops for blocked nose. Antibiotics do not help most viral colds. See When Should I Worry? and the Nutrition illness tips if feeding is hard.",
          te: "ద్రవాలు, విశ్రాంతి, మెత్తని ఆహారం, ముక్కు మూసుకుంటే సెలైన్ చుక్కలు. చాలా వైరల్ జలుబులకు యాంటీబయాటిక్స్ పని చేయవు. When Should I Worry? మరియు న్యూట్రిషన్ అనారోగ్య సలహాలు చూడండి.",
        },
      },
    ],
  },
  {
    id: "vaccines",
    kind: "faq",
    group: "vaccines",
    emoji: "💉",
    title: { en: "Vaccines — FAQs", te: "టీకాలు — ప్రశ్నోత్తరాలు" },
    intro: {
      en: "Vaccines prevent serious infections. Mild fussiness after a shot is common; serious reactions are rare.",
      te: "టీకాలు తీవ్రమైన ఇన్ఫెక్షన్లను నివారిస్తాయి. షాట్ తర్వాత కాస్త అలజడి సాధారణం; తీవ్ర ప్రతిచర్యలు అరుదు.",
    },
    items: [
      {
        q: {
          en: "Are vaccines safe if my child has a mild cold?",
          te: "తేలికపాటి జలుబు ఉంటే టీకా సేఫ్‌నా?",
        },
        a: {
          en: "Usually yes. Moderate–high fever or serious illness may mean delaying — ask your paediatrician. A runny nose alone rarely blocks vaccination.",
          te: "సాధారణంగా అవును. మధ్యస్థ–ఎక్కువ జ్వరం లేదా తీవ్ర అనారోగ్యం ఉంటే ఆలస్యం చేయవచ్చు — డాక్టర్‌ను అడగండి. ముక్కు కారడం మాత్రమే అడ్డు కాదు.",
        },
      },
      {
        q: {
          en: "Can vaccines cause autism or infertility?",
          te: "టీకాల వల్ల ఆటిజం లేదా వంధ్యత్వం వస్తుందా?",
        },
        a: {
          en: "No. Large studies have not found a link between vaccines and autism. Vaccines do not cause infertility. Trust clinic schedules (IAP / UIP) over social media rumours.",
          te: "లేదు. పెద్ద అధ్యయనాల్లో టీకాలు–ఆటిజం లింక్ కనిపించలేదు. టీకాలు వంధ్యత్వం కలిగించవు. సోషల్ మీడియా కంటే IAP/UIP షెడ్యూల్‌ను నమ్మండి.",
        },
      },
      {
        q: {
          en: "Fever after vaccination — is it okay?",
          te: "టీకా తర్వాత జ్వరం — సరైనదేనా?",
        },
        a: {
          en: "Low-grade fever and a sore arm for 1–2 days are common. Keep the child hydrated; use weight-based paracetamol if needed. High fever, continuous crying over 3 hours, or difficulty breathing needs urgent care.",
          te: "1–2 రోజులు తక్కువ జ్వరం, చేయి నొప్పి సాధారణం. ద్రవాలు ఇవ్వండి; అవసరమైతే బరువు ప్రకారం పారాసిటమాల్. ఎక్కువ జ్వరం, 3 గంటలకు మించి ఏడుపు, ఊపిరి కష్టం అయితే అత్యవసరం.",
        },
      },
      {
        q: {
          en: "We missed a due date — start again?",
          te: "తేదీ మిస్ అయితే మళ్లీ మొదటి నుంచి?",
        },
        a: {
          en: "Usually you catch up — you rarely restart the whole schedule. Bring the card to Vaccine Buddy / clinic for a catch-up plan.",
          te: "సాధారణంగా క్యాచ్-అప్ చేస్తారు — మొత్తం షెడ్యూల్ మళ్లీ మొదలు పెట్టరు. కార్డు తీసుకుని Vaccine Buddy / క్లినిక్‌కు రండి.",
        },
      },
      {
        q: {
          en: "Private vs government (UIP) vaccines?",
          te: "ప్రైవేట్ vs ప్రభుత్వ (UIP) టీకాలు?",
        },
        a: {
          en: "UIP covers important free vaccines. Some extra shots (e.g. certain combination or optional vaccines) are often private — discuss cost and benefit with your doctor. See Vaccine Buddy on this site.",
          te: "UIP ముఖ్యమైన ఉచిత టీకాలు ఇస్తుంది. కొన్ని అదనపు / ఐచ్ఛిక టీకాలు ప్రైవేట్‌గా ఉండవచ్చు — డాక్టర్‌తో చర్చించండి. ఈ సైట్‌లో Vaccine Buddy చూడండి.",
        },
      },
    ],
  },
  {
    id: "sleep",
    kind: "faq",
    group: "sleep-screens",
    emoji: "😴",
    title: { en: "Sleep — FAQs", te: "నిద్ర — ప్రశ్నోత్తరాలు" },
    intro: {
      en: "Safe sleep protects babies. Good routines help toddlers and school-age children.",
      te: "సురక్షిత నిద్ర పాపలను కాపాడుతుంది. మంచి రొటీన్ టాడ్లర్లు, స్కూల్ పిల్లలకు సహాయపడుతుంది.",
    },
    items: [
      {
        q: {
          en: "How should a baby sleep?",
          te: "పాప ఎలా నిద్రపోవాలి?",
        },
        a: {
          en: "On the back, firm flat surface, no pillows, loose blankets, or soft toys in the cot. Room-share; do not bed-share. Avoid overheating.",
          te: "వీపు మీద, గట్టి చదును ఉపరితలం; దిండు, వదులు దుప్పటి, మెత్తని బొమ్మలు లేకుండా. ఒకే గది — ఒకే మంచం కాదు. ఎక్కువ వేడి పెట్టవద్దు.",
        },
      },
      {
        q: {
          en: "My newborn wakes every 2 hours — is that normal?",
          te: "నవజాత ప్రతి 2 గంటలకు మేల్కొంటే సాధారణమేనా?",
        },
        a: {
          en: "Yes in the early months — night feeds protect milk supply and growth. Daytime light and night dimness help later.",
          te: "మొదటి నెలల్లో అవును — రాత్రి పాలు సరఫరా, వృద్ధికి అవసరం. పగలు వెలుతురు, రాత్రి మసక చివరకు సహాయపడతాయి.",
        },
      },
      {
        q: {
          en: "How much sleep do toddlers need?",
          te: "టాడ్లర్లకు ఎంత నిద్ర?",
        },
        a: {
          en: "Most 1–2 year olds need about 11–14 hours in 24 hours (naps included). A consistent bedtime and wind-down without screens helps.",
          te: "చాలా 1–2 ఏళ్ల పిల్లలకు 24 గంటల్లో సుమారు 11–14 గంటలు (నాప్‌లు కలిపి). స్థిరమైన నిద్ర సమయం, స్క్రీన్ లేని విండ్-డౌన్ సహాయపడుతుంది.",
        },
      },
      {
        q: {
          en: "Night terrors vs nightmares?",
          te: "నైట్ టెర్రర్స్ vs పీడకలలు?",
        },
        a: {
          en: "Night terrors: child seems awake but confused, hard to soothe, often does not remember. Nightmares: wakes scared and remembers. Keep a calm routine; ask the doctor if episodes are frequent or injure the child.",
          te: "నైట్ టెర్రర్: మేల్కొన్నట్టు కనిపించి గందరగోళం, ఓదార్చడం కష్టం, గుర్తుండదు. పీడకల: భయంతో మేల్కొని గుర్తుంటుంది. ప్రశాంత రొటీన్; తరచూ / గాయాలు ఉంటే డాక్టర్‌ను అడగండి.",
        },
      },
      {
        q: {
          en: "When is poor sleep a medical concern?",
          te: "నిద్ర సమస్య ఎప్పుడు వైద్యపరం?",
        },
        a: {
          en: "Loud snoring with pauses in breathing, daytime sleepiness that affects school, or sudden sleep collapse — ask about sleep apnoea or other causes.",
          te: "ఊపిరి ఆగేలా గట్టి గురక, పగటి నిద్రతో స్కూల్ దెబ్బ, అకస్మాత్తు నిద్ర — స్లీప్ అప్నియా గురించి అడగండి.",
        },
      },
    ],
  },
  {
    id: "nutrition",
    kind: "faq",
    group: "feeding",
    emoji: "🥣",
    title: { en: "Nutrition — FAQs", te: "పోషణ — ప్రశ్నోత్తరాలు" },
    intro: {
      en: "Growth on the chart matters more than one fussy day. South Indian home foods can meet needs well.",
      te: "ఒక రోజు మొండితనం కంటే చార్ట్‌లో వృద్ధి ముఖ్యం. దక్షిణ భారత ఇంటి ఆహారం అవసరాలు తీర్చగలదు.",
    },
    items: [
      {
        q: {
          en: "When should I start solids?",
          te: "ఘన ఆహారం ఎప్పుడు మొదలు?",
        },
        a: {
          en: "Around 6 months, while continuing breast milk or formula. Start thick porridge / mashed foods — not thin watery “dal water” as a meal.",
          te: "సుమారు 6 నెలలకు, తల్లిపాలు/ఫార్ములా కొనసాగిస్తూ. గట్టి గంజి / మెత్తని ఆహారం — పలుచని “పప్పు నీరు” భోజనం కాదు.",
        },
      },
      {
        q: {
          en: "My toddler refuses vegetables — what helps?",
          te: "టాడ్లర్ కూరగాయలు తినకపోతే?",
        },
        a: {
          en: "Offer without pressure; keep meal times short and calm. It can take many exposures. Model eating the same food. See Food for Growth and the South Indian diet chart.",
          te: "బలవంతం లేకుండా అందించండి; భోజనం ప్రశాంతంగా, కొద్ది సేపు. చాలా సార్లు చూపించాల్సి రావచ్చు. మీరు కూడా అదే తినండి. Food for Growth మరియు సౌత్ ఇండియన్ డైట్ చార్ట్ చూడండి.",
        },
      },
      {
        q: {
          en: "How much milk after 1 year?",
          te: "1 సంవత్సరం తర్వాత ఎంత పాలు?",
        },
        a: {
          en: "About 300–500 ml/day of animal milk is usually enough so solids are not crowded out. Excess milk is a common reason for poor appetite and anaemia risk.",
          te: "సాధారణంగా రోజుకు 300–500 ml జంతు పాలు చాలు — ఘన ఆహారం తగ్గకుండా. ఎక్కువ పాలు ఆకలి తగ్గడం, రక్తహీనత ప్రమాదం.",
        },
      },
      {
        q: {
          en: "What if my child is underweight?",
          te: "బరువు తక్కువైతే?",
        },
        a: {
          en: "Use catch-up plates: add ghee/oil, cereal+pulse, egg/fish if the family eats them, frequent small meals. Plot growth; use the malnutrition tips and South Indian catch-up chart. Severe thinness needs clinic care.",
          te: "క్యాచ్-అప్ ప్లేట్: నెయ్యి/నూనె, ధాన్యం+పప్పు, కుటుంబం తింటే గుడ్డు/చేప, తరచు చిన్న భోజనాలు. వృద్ధి చార్ట్; పోషకాహార లోపం సలహాలు, సౌత్ ఇండియన్ క్యాచ్-అప్ చార్ట్. తీవ్ర సన్నదనానికి క్లినిక్ అవసరం.",
        },
      },
      {
        q: {
          en: "Are packaged “health drinks” necessary?",
          te: "ప్యాకెట్ “హెల్త్ డ్రింక్స్” అవసరమా?",
        },
        a: {
          en: "Usually no. Home foods (ragi, milk, dals, eggs, vegetables, fruit) are better value. Drinks high in sugar are not a growth solution.",
          te: "సాధారణంగా లేదు. ఇంటి ఆహారం (రాగి, పాలు, పప్పులు, గుడ్డు, కూరగాయలు, పండు) మేలు. చక్కెర ఎక్కువ డ్రింక్స్ వృద్ధి పరిష్కారం కావు.",
        },
      },
    ],
  },
  {
    id: "junk-food",
    kind: "faq",
    group: "feeding",
    emoji: "🍪",
    title: {
      en: "Junk food & biscuits — FAQs",
      te: "జంక్ ఫుడ్ & బిస్కెట్లు — ప్రశ్నోత్తరాలు",
    },
    intro: {
      en: "Occasional treats are fine. Daily biscuits, chips, sweets, and sugary drinks crowd out real food and raise dental and weight risks.",
      te: "అప్పుడప్పుడు ట్రీట్ సరే. రోజూ బిస్కెట్, చిప్స్, మిఠాయి, చక్కెర డ్రింక్స్ నిజమైన ఆహారాన్ని తగ్గిస్తాయి — పళ్లు, బరువు ప్రమాదం పెరుగుతుంది.",
    },
    items: [
      {
        q: {
          en: "Are biscuits okay as a daily snack?",
          te: "రోజూ బిస్కెట్ స్నాక్‌గా సరేనా?",
        },
        a: {
          en: "Not as the main daily snack. Most biscuits are high in sugar, refined flour, and salt/fat with little protein or fibre. Prefer fruit, curd, roasted chana, idli, dosa pieces, milk, or a homemade sandwich. Keep biscuits for rare occasions, not every tea time.",
          te: "ప్రధాన రోజువారీ స్నాక్‌గా కాదు. చాలా బిస్కెట్లలో చక్కెర, మైదా, ఉప్పు/కొవ్వు ఎక్కువ — ప్రోటీన్, ఫైబర్ తక్కువ. పండు, పెరుగు, వేయించిన శనగ, ఇడ్లీ, దోస ముక్కలు, పాలు, ఇంటి సాండ్‌విచ్ ఇవ్వండి. బిస్కెట్ అప్పుడప్పుడే.",
        },
      },
      {
        q: {
          en: "What counts as junk food for children?",
          te: "పిల్లలకు జంక్ ఫుడ్ అంటే ఏమిటి?",
        },
        a: {
          en: "Packaged chips, namkeen, soft drinks, energy drinks, candy, deep-fried street snacks often, instant noodles as a regular meal, and many “kids” biscuits or cream wafers. Fast food once in a while is different from daily habit.",
          te: "ప్యాకెట్ చిప్స్, నమ్కీన్, సాఫ్ట్ డ్రింక్స్, ఎనర్జీ డ్రింక్స్, మిఠాయి, తరచు వేపుడు స్ట్రీట్ ఫుడ్, రోజూ ఇన్‌స్టంట్ నూడుల్స్, చాలా క్రీమ్ బిస్కెట్లు. అప్పుడప్పుడు ఫాస్ట్ ఫుడ్ — రోజువారీ అలవాటు కాదు.",
        },
      },
      {
        q: {
          en: "My child asks for biscuits every evening — what can I do?",
          te: "పిల్ల ప్రతి సాయంత్రం బిస్కెట్ అడిగితే?",
        },
        a: {
          en: "Offer a fixed healthy snack at the same time so hunger is met before craving. Do not use biscuits as a reward or to stop crying. Keep junk out of easy reach at home; adults modelling the same habit helps most.",
          te: "ఆకలి తీరేలా అదే సమయంలో ఆరోగ్యకరమైన స్నాక్ ఇవ్వండి. ఏడుపు ఆపడానికి లేదా రివార్డ్‌గా బిస్కెట్ వాడవద్దు. ఇంట్లో జంక్ చేతికి దూరంగా ఉంచండి; పెద్దలు కూడా అదే అలవాటు పాటిస్తే సులభం.",
        },
      },
      {
        q: {
          en: "When can junk food start harming health?",
          te: "జంక్ ఫుడ్ ఎప్పుడు హాని చేస్తుంది?",
        },
        a: {
          en: "Daily sugar and fried snacks raise tooth decay, constipation, poor appetite for meals, and later overweight / early lifestyle disease risk. If growth is too fast or too slow, plot weight and ask your paediatrician — see Food for Growth.",
          te: "రోజూ చక్కెర, వేపుడు స్నాక్స్ — పళ్లు క్షయం, మలబద్ధకం, భోజనం ఆకలి తగ్గడం, తర్వాత బరువు / జీవనశైలి వ్యాధుల ప్రమాదం. వృద్ధి చాలా వేగం లేదా నెమ్మది అయితే చార్ట్ చూపించి డాక్టర్‌ను అడగండి — Food for Growth చూడండి.",
        },
      },
      {
        q: {
          en: "Are “sugar-free” or “multigrain” biscuits better?",
          te: "“షుగర్-ఫ్రీ” / “మల్టీగ్రెయిన్” బిస్కెట్లు మెరుగా?",
        },
        a: {
          en: "Often still ultra-processed and easy to overeat. Read labels — many remain high in refined carbs and fat. Whole foods beat marketing claims. For toddlers under 2, avoid routine sweet biscuits and sugary drinks.",
          te: "చాలా సార్లు ఇంకా అతి-ప్రాసెస్డ్, ఎక్కువ తినే అవకాశం. లేబుల్ చదవండి — మైదా, కొవ్వు ఎక్కువ ఉండవచ్చు. మార్కెటింగ్ కంటే ఇంటి ఆహారం మేలు. 2 ఏళ్ల లోపు రోజువారీ తీపి బిస్కెట్, చక్కెర డ్రింక్స్ వద్దు.",
        },
      },
    ],
  },
  {
    id: "newborn-screening",
    kind: "faq",
    group: "vaccines",
    emoji: "🧪",
    title: {
      en: "Newborn screening tests — FAQs",
      te: "నవజాత స్క్రీనింగ్ పరీక్షలు — ప్రశ్నోత్తరాలు",
    },
    intro: {
      en: "A few drops of blood (and sometimes hearing / heart checks) can catch treatable conditions before symptoms appear.",
      te: "కొన్ని చుక్కల రక్తం (కొన్నిసార్లు వినికిడి / గుండె పరీక్షలు) — లక్షణాలు రాకముందే చికిత్స చేయదగిన సమస్యలను గుర్తిస్తాయి.",
    },
    items: [
      {
        q: {
          en: "What is newborn screening?",
          te: "నవజాత స్క్రీనింగ్ అంటే ఏమిటి?",
        },
        a: {
          en: "Tests done in the first days of life to find serious but treatable conditions early — for example thyroid problems, some metabolic diseases, hearing loss, and critical heart defects (pulse oximetry). Timing and the exact panel vary by hospital and state.",
          te: "పుట్టిన మొదటి రోజుల్లో చేసే పరీక్షలు — థైరాయిడ్, కొన్ని మెటబాలిక్ వ్యాధులు, వినికిడి లోపం, తీవ్ర గుండె లోపాలు (పల్స్ ఆక్సిమెట్రీ) వంటివి ముందుగా కనుగొనడానికి. ఏ ప్యానల్, ఎప్పుడు అనేది ఆసుపత్రి / రాష్ట్రం మీద ఆధారపడి ఉంటుంది.",
        },
      },
      {
        q: {
          en: "Which tests are commonly offered?",
          te: "సాధారణంగా ఏ పరీక్షలు చేస్తారు?",
        },
        a: {
          en: "Often: TSH (thyroid), hearing screen (OAE / AABR), and pulse oximetry for heart. Expanded dried-blood-spot panels may include metabolic / genetic disorders (e.g. G6PD, CAH, amino-acid disorders) — ask your paediatrician what your birth centre offers and whether private expanded screening is useful for your family.",
          te: "తరచూ: TSH (థైరాయిడ్), వినికిడి (OAE/AABR), గుండెకు పల్స్ ఆక్సిమెట్రీ. విస్తృత బ్లడ్-స్పాట్ ప్యానల్‌లో మెటబాలిక్ / జన్యు సమస్యలు (G6PD, CAH మొదలైనవి) ఉండవచ్చు — మీ ఆసుపత్రిలో ఏమి ఉంది, ప్రైవేట్ విస్తృత స్క్రీనింగ్ అవసరమా అని డాక్టర్‌ను అడగండి.",
        },
      },
      {
        q: {
          en: "When is the blood sample taken?",
          te: "రక్త నమూనా ఎప్పుడు తీస్తారు?",
        },
        a: {
          en: "Usually after 24–48 hours of age (or as per protocol) so hormone levels are reliable. Preterm or sick babies may need repeat testing. If you go home early, ask how and when to complete screening.",
          te: "సాధారణంగా 24–48 గంటల తర్వాత (ప్రోటోకాల్ ప్రకారం) — హార్మోన్ స్థాయిలు నమ్మదగినవి. ప్రీమెచ్యూర్ / అనారోగ్య పాపలకు మళ్లీ పరీక్ష కావచ్చు. త్వరగా డిశ్చార్జ్ అయితే స్క్రీనింగ్ ఎలా పూర్తి చేయాలో అడగండి.",
        },
      },
      {
        q: {
          en: "What if a result is “positive” or “abnormal”?",
          te: "ఫలితం “పాజిటివ్” / అసాధారణమైతే?",
        },
        a: {
          en: "Screening is not a final diagnosis. Many first positives are false alarms or need a confirmatory blood test. Follow up quickly — do not wait for symptoms. Early treatment (e.g. thyroxine for congenital hypothyroidism) protects the brain and growth.",
          te: "స్క్రీనింగ్ అంతిమ రోగ నిర్ధారణ కాదు. చాలా మొదటి పాజిటివ్‌లు తప్పుడు అలారం లేదా నిర్ధారణ పరీక్ష అవసరం. లక్షణాలు కోసం ఆగకుండా త్వరగా ఫాలో-అప్ చేయండి. ముందస్తు చికిత్స (ఉదా. జన్మతః హైపోథైరాయిడ్‌కు థైరాక్సిన్) మెదడు, వృద్ధిని కాపాడుతుంది.",
        },
      },
      {
        q: {
          en: "Is newborn screening mandatory? Does it hurt?",
          te: "స్క్రీనింగ్ తప్పనిసరా? నొప్పి ఉంటుందా?",
        },
        a: {
          en: "Availability and policy differ by place; it is strongly recommended wherever offered. A heel prick causes brief discomfort; hearing and pulse checks are painless. Keep your reports for future visits.",
          te: "విధానం ప్రాంతం మీద ఆధారపడి ఉంటుంది — అందుబాటులో ఉన్న చోట బలంగా సిఫార్సు. మడమ పంక్చర్ కొద్ది సేపు అసౌకర్యం; వినికిడి / పల్స్ పరీక్షలు నొప్పి లేనివి. రిపోర్టులు భద్రపరచండి.",
        },
      },
    ],
  },
  {
    id: "private-vaccines",
    kind: "faq",
    group: "vaccines",
    emoji: "🏥",
    title: {
      en: "Private vaccines — FAQs",
      te: "ప్రైవేట్ టీకాలు — ప్రశ్నోత్తరాలు",
    },
    intro: {
      en: "Government (UIP) vaccines are essential and free. Private / IAP-recommended vaccines add extra protection — discuss cost and timing with your paediatrician.",
      te: "ప్రభుత్వ (UIP) టీకాలు అవసరం, ఉచితం. ప్రైవేట్ / IAP సిఫార్సు టీకాలు అదనపు రక్షణ — ఖర్చు, సమయం గురించి డాక్టర్‌తో మాట్లాడండి.",
    },
    items: [
      {
        q: {
          en: "What are “private vaccines”?",
          te: "“ప్రైవేట్ టీకాలు” అంటే ఏమిటి?",
        },
        a: {
          en: "Vaccines given in clinics that may not be in the free national schedule at that age, or brand / combination shots parents choose to pay for — for example pneumococcal (PCV), rotavirus, influenza, typhoid, hepatitis A, varicella (chickenpox), meningococcal, HPV, and some combination vaccines. Exact list depends on IAP guidance and your child’s age.",
          te: "ఆ వయస్సులో ఉచిత జాతీయ షెడ్యూల్‌లో లేని లేదా తల్లిదండ్రులు చెల్లించి తీసుకునే టీకాలు — ఉదా. న్యుమోకాకల్ (PCV), రోటావైరస్, ఇన్‌ఫ్లుఎంజా, టైఫాయిడ్, హెపటైటిస్ A, చికెన్‌పాక్స్ (వారిసెల్లా), మెనింజోకాకల్, HPV, కొన్ని కాంబినేషన్ షాట్లు. జాబితా IAP మార్గదర్శకాలు, వయస్సు మీద ఆధారపడి ఉంటుంది.",
        },
      },
      {
        q: {
          en: "Are government vaccines enough?",
          te: "ప్రభుత్వ టీకాలు చాలా ఉన్నాయా?",
        },
        a: {
          en: "UIP vaccines protect against many life-threatening diseases and must not be skipped. Private vaccines cover additional infections that are common or serious in India. They are optional extras, not a replacement for the government schedule.",
          te: "UIP టీకాలు అనేక ప్రాణాంతక వ్యాధుల నుంచి కాపాడతాయి — వదలకూడదు. ప్రైవేట్ టీకాలు భారతంలో సాధారణం / తీవ్రమైన అదనపు ఇన్ఫెక్షన్లకు. ఇవి అదనం — ప్రభుత్వ షెడ్యూల్‌కు బదులు కావు.",
        },
      },
      {
        q: {
          en: "Which private vaccines are often discussed?",
          te: "ఏ ప్రైవేట్ టీకాలు తరచూ మాట్లాడతారు?",
        },
        a: {
          en: "Commonly: PCV (pneumonia / meningitis), rotavirus (severe diarrhoea), annual influenza, typhoid, hepatitis A, varicella, and later HPV for cancer prevention. Your paediatrician will prioritise based on age, season, and budget — see Vaccine Buddy for reminders.",
          te: "సాధారణంగా: PCV (న్యుమోనియా/మెనింజైటిస్), రోటావైరస్ (తీవ్ర విరేచనాలు), వార్షిక ఇన్‌ఫ్లుఎంజా, టైఫాయిడ్, హెపటైటిస్ A, వారిసెల్లా, తర్వాత క్యాన్సర్ నివారణకు HPV. వయస్సు, సీజన్, బడ్జెట్ ప్రకారం డాక్టర్ ప్రాధాన్యత ఇస్తారు — రిమైండర్లకు Vaccine Buddy చూడండి.",
        },
      },
      {
        q: {
          en: "Are private vaccines safe? Same day as other shots?",
          te: "ప్రైవేట్ టీకాలు సేఫ్‌నా? ఇతర షాట్లతో అదే రోజు?",
        },
        a: {
          en: "Yes — when given as per age and schedule they have a strong safety record. Many can be given on the same visit as routine vaccines (different sites). Mild fever or fussiness can occur; serious reactions are rare. Tell the clinic about allergies and past reactions.",
          te: "అవును — వయస్సు / షెడ్యూల్ ప్రకారం ఇస్తే భద్రత మంచిది. చాలా వాటిని రొటీన్ టీకాలతో అదే సందర్శనలో (వేరు సైట్) ఇవ్వవచ్చు. తేలికపాటి జ్వరం / అలజడి రావచ్చు; తీవ్ర ప్రతిచర్యలు అరుదు. అలెర్జీలు, గత ప్రతిచర్యలు చెప్పండి.",
        },
      },
      {
        q: {
          en: "We cannot afford all private vaccines — what then?",
          te: "అన్ని ప్రైవేట్ టీకాలు ఖర్చు కాకపోతే?",
        },
        a: {
          en: "Never skip UIP / free vaccines. Ask your doctor to prioritise the highest-value private shots for your child’s age and risk (often PCV and rotavirus in infancy). Catch-up is possible later for many vaccines — partial protection is better than none.",
          te: "UIP / ఉచిత టీకాలు ఎప్పుడూ వదలవద్దు. వయస్సు, ప్రమాదం ప్రకారం అత్యంత ఉపయోగకరమైన ప్రైవేట్ షాట్లకు ప్రాధాన్యత అడగండి (శిశువులో తరచూ PCV, రోటావైరస్). చాలా వాటికి తర్వాత క్యాచ్-అప్ సాధ్యం — కొంత రక్షణ లేకపోవడం కంటే మేలు.",
        },
      },
    ],
  },
  {
    id: "t1dm",
    kind: "faq",
    group: "growth-endo",
    emoji: "🩸",
    title: {
      en: "Type 1 diabetes — FAQs",
      te: "టైప్ 1 డయాబెటిస్ — ప్రశ్నోత్తరాలు",
    },
    intro: {
      en: "Type 1 diabetes is an insulin deficiency — not caused by sugar in the diet alone. Children need insulin, monitoring, and a care team.",
      te: "టైప్ 1లో ఇన్సులిన్ లోపం — కేవలం ఆహారంలో చక్కెర వల్ల కాదు. పిల్లలకు ఇన్సులిన్, పర్యవేక్షణ, కేర్ టీమ్ అవసరం.",
    },
    items: [
      {
        q: {
          en: "What are early warning signs?",
          te: "ముందస్తు హెచ్చరిక సైన్లు ఏమిటి?",
        },
        a: {
          en: "Excessive thirst and urination, weight loss despite eating, tiredness, bedwetting in a previously dry child, fruity breath, or vomiting. Seek care urgently — do not wait.",
          te: "ఎక్కువ దాహం, మూత్రం; తిన్నా బరువు తగ్గడం; అలసట; ఇంతకు ముందు పొడిగా ఉన్న పిల్లలో రాత్రి మూత్రం; పండు వాసన శ్వాస; వాంతులు. వెంటనే వైద్యం — ఆగవద్దు.",
        },
      },
      {
        q: {
          en: "Is Type 1 the same as Type 2?",
          te: "టైప్ 1, టైప్ 2 ఒక్కటేనా?",
        },
        a: {
          en: "No. Type 1 needs lifelong insulin. Type 2 is more about insulin resistance and is less common in young children. Do not stop insulin based on advice from unverified sources.",
          te: "కాదు. టైప్ 1కి జీవితాంతం ఇన్సులిన్. టైప్ 2 ఇన్సులిన్ రెసిస్టెన్స్ — చిన్నపిల్లల్లో తక్కువ. నమ్మదగని సలహాతో ఇన్సులిన్ ఆపవద్దు.",
        },
      },
      {
        q: {
          en: "Can my child still eat rice and festivals foods?",
          te: "అన్నం, పండుగ ఆహారం తినవచ్చా?",
        },
        a: {
          en: "Yes, with carb counting / insulin adjustment taught by your diabetes team. No food is “forever banned”, but sugary drinks and irregular snacks make control harder.",
          te: "అవును — డయాబెటిస్ టీమ్ నేర్పిన కార్బ్ కౌంటింగ్ / ఇన్సులిన్ సర్దుబాటుతో. ఏ ఆహారం “శాశ్వత నిషేధం” కాదు, కానీ చక్కెర డ్రింక్స్, అస్థిర స్నాక్స్ నియంత్రణ కష్టం చేస్తాయి.",
        },
      },
      {
        q: {
          en: "What about school and sports?",
          te: "స్కూల్, స్పోర్ట్స్ గురించి?",
        },
        a: {
          en: "Inform the school, keep hypo treatment (sugar / glucose) available, and plan snacks around PE. Hypoglycaemia (shakiness, confusion, sweat) needs fast sugar, then a snack as taught.",
          te: "స్కూల్‌కు చెప్పండి; హైపో చికిత్స (చక్కెర/గ్లూకోజ్) ఉంచండి; PE చుట్టూ స్నాక్ ప్లాన్. హైపోగ్లైసీమియా (వణుకు, గందరగోళం, చెమట)కు త్వరగా చక్కెర — తర్వాత నేర్పిన స్నాక్.",
        },
      },
      {
        q: {
          en: "When is it an emergency?",
          te: "ఎప్పుడు అత్యవసరం?",
        },
        a: {
          en: "Vomiting with high sugars, deep breathing, drowsiness, or suspected ketoacidosis — go to emergency care. Never omit insulin during illness without a sick-day plan from your team.",
          te: "ఎక్కువ షుగర్‌తో వాంతులు, లోతైన ఊపిరి, మత్తు, కీటోఅసిడోసిస్ అనుమానం — ఎమర్జెన్సీకి వెళ్లండి. అనారోగ్యంలో టీమ్ సిక్-డే ప్లాన్ లేకుండా ఇన్సులిన్ వదలవద్దు.",
        },
      },
    ],
  },
  {
    id: "hypothyroid",
    kind: "faq",
    group: "growth-endo",
    emoji: "🦋",
    title: {
      en: "Hypothyroidism — FAQs",
      te: "హైపోథైరాయిడిజం — ప్రశ్నోత్తరాలు",
    },
    intro: {
      en: "An underactive thyroid slows metabolism and can affect growth and learning. Newborn screening and follow-up matter.",
      te: "థైరాయిడ్ తక్కువగా పనిచేస్తే జీవక్రియ నెమ్మది — వృద్ధి, నేర్చుకోవడం దెబ్బతినవచ్చు. నవజాత స్క్రీనింగ్, ఫాలో-అప్ ముఖ్యం.",
    },
    items: [
      {
        q: {
          en: "Why do newborns get thyroid screening?",
          te: "నవజాతలకు థైరాయిడ్ స్క్రీనింగ్ ఎందుకు?",
        },
        a: {
          en: "Congenital hypothyroidism can be silent at birth but harms brain development if untreated. Early thyroxine (thyroid hormone) protects intelligence and growth.",
          te: "జన్మతః హైపోథైరాయిడిజం పుట్టినప్పుడు కనిపించకపోవచ్చు — చికిత్స లేకపోతే మెదడు వికాసం దెబ్బ. ముందస్తు థైరాక్సిన్ బుద్ధి, వృద్ధిని కాపాడుతుంది.",
        },
      },
      {
        q: {
          en: "What symptoms might older children show?",
          te: "పెద్ద పిల్లల్లో లక్షణాలు?",
        },
        a: {
          en: "Tiredness, constipation, dry skin, feeling cold, slow growth, weight gain, poor school focus, or delayed puberty. Many causes exist — blood tests decide, not guesswork.",
          te: "అలసట, మలబద్ధకం, పొడి చర్మం, చలి, నెమ్మది వృద్ధి, బరువు పెరుగుదల, స్కూల్ దృష్టి తగ్గడం, యవ్వనం ఆలస్యం. కారణాలు చాలా — రక్త పరీక్షలే నిర్ణయం, ఊహ కాదు.",
        },
      },
      {
        q: {
          en: "Is treatment lifelong?",
          te: "చికిత్స జీవితాంతమా?",
        },
        a: {
          en: "Often yes for congenital or permanent hypothyroidism. Dose is adjusted as the child grows. Do not stop tablets because the child “looks fine”.",
          te: "జన్మతః / శాశ్వత హైపోథైరాయిడిజంలో తరచూ అవును. పిల్ల పెరిగేకొద్దీ మోతాదు మారుతుంది. “బాగున్నట్టు” ఉన్నంత మాత్రాన మాత్రలు ఆపవద్దు.",
        },
      },
      {
        q: {
          en: "How should thyroxine be given?",
          te: "థైరాక్సిన్ ఎలా ఇవ్వాలి?",
        },
        a: {
          en: "Usually every morning on an empty stomach with water; wait before milk / food as your doctor advises. Crushing for infants may be taught — follow your clinic’s method. Keep a regular time.",
          te: "సాధారణంగా ఉదయం ఖాళీ కడుపుతో నీటితో; పాలు/ఆహారం ముందు వేచి ఉండండి — డాక్టర్ చెప్పినట్టు. పాపలకు నూరడం నేర్పవచ్చు. సమయం స్థిరంగా ఉంచండి.",
        },
      },
      {
        q: {
          en: "Can diet alone fix hypothyroidism?",
          te: "ఆహారం మాత్రమే సరిపెడుతుందా?",
        },
        a: {
          en: "No. Iodine-sufficient salt helps prevention in the population, but established hypothyroidism needs prescribed hormone replacement and TSH monitoring — not “thyroid diets” from social media.",
          te: "లేదు. అయోడిన్ ఉప్పు జనాభా నివారణకు సహాయపడుతుంది, కానీ నిర్ధారిత హైపోథైరాయిడిజంకు ప్రిస్క్రిప్షన్ హార్మోన్ + TSH పర్యవేక్షణ అవసరం — సోషల్ మీడియా “థైరాయిడ్ డైట్” కాదు.",
        },
      },
    ],
  },
];

export const PARENT_FAQ_SECTIONS: FaqSection[] = [
  ...COMMON_PROBLEM_SECTIONS,
  ...CORE_PARENT_FAQ_SECTIONS,
  ...NEW_PARENT_FAQ_SECTIONS,
];
