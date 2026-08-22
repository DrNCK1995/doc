export type ConditionId =
  | "constipation"
  | "anaemia"
  | "diarrhea"
  | "fever"
  | "cold_cough"
  | "malnutrition";

export type AdviceLang = "en" | "te";

type Lines = { en: string[]; te: string[] };
type Title = { en: string; te: string };

export type ConditionAdvice = {
  id: ConditionId;
  title: Title;
  summary: Title;
  offer: Lines;
  avoid: Lines;
  homeCare: Lines;
  seekCare: Lines;
};

export const CONDITION_ADVICE: ConditionAdvice[] = [
  {
    id: "constipation",
    title: { en: "Constipation", te: "మలబద్ధకం" },
    summary: {
      en: "Softer stools with fibre, water, and less excess milk.",
      te: "పీచు పదార్థం, నీరు, పాలు తగ్గించడంతో మలం మెత్తగా వస్తుంది.",
    },
    offer: {
      en: [
        "Papaya, ripe banana, orange, pear, apple with skin (if chewed well), soaked raisins.",
        "Green vegetables, salad, dal, ragi, whole wheat roti — not only maida / bakery food.",
        "Water in a cup with meals after 6 months. Buttermilk or diluted fresh fruit (no packaged juice).",
        "A little ghee in food. Regular play and a calm toilet time after breakfast.",
      ],
      te: [
        "బొప్పాయి, పండిన అరటి, నారింజ, బేరి, తొక్కతో ఆపిల్ (బాగా నమలగలిగితే), నానబెట్టిన ఎండుద్రాక్ష.",
        "ఆకుకూరలు, కూరగాయలు, పప్పు, రాగి, గోధుమ రొట్టె — మైదా / బేకరీ ఆహారం మాత్రమే కాదు.",
        "6 నెలల తర్వాత భోజనంతో పాటు కప్పులో నీరు. మజ్జిగ లేదా తాజా పండు (ప్యాకెట్ జ్యూస్ కాదు).",
        "ఆహారంలో కొంచెం నెయ్యి. ఆటపాట, అలాగే ఉదయం భోజనం తర్వాత టాయిలెట్ అలవాటు.",
      ],
    },
    avoid: {
      en: [
        "Too much milk (especially >500–600 ml after 1 year) — it fills the child and reduces fibre foods.",
        "Chips, biscuits, noodles, and low-fibre junk every day.",
        "Force-sitting on the pot for a long time, or punishment around toilet.",
      ],
      te: [
        "ఎక్కువ పాలు (1 సంవత్సరం తర్వాత రోజుకు 500–600 మి.లీ. కంటే ఎక్కువ) — పీచు ఆహారం తినరు.",
        "చిప్స్, బిస్కెట్లు, నూడుల్స్ వంటి జంక్ ప్రతిరోజూ.",
        "చాలా సేపు బలవంతంగా టాయిలెట్‌లో కూర్చోబెట్టడం లేదా శిక్ష.",
      ],
    },
    homeCare: {
      en: [
        "Under 6 months: continue exclusive breastfeeding. Do not give extra water, honey, or home laxatives unless the doctor says so.",
        "Gentle clockwise tummy massage; bicycle leg movements for infants.",
        "If formula-fed, check powder-to-water mixing. Do not add extra cereal to the bottle.",
      ],
      te: [
        "6 నెలల లోపు: తల్లిపాలు మాత్రమే. డాక్టర్ చెప్పితే తప్ప అదనపు నీరు, తేనె, ఇంటి మందులు వేయవద్దు.",
        "పొట్టను మెల్లగా గడియారం దిశలో మసాజ్ చేయండి. పాపలకు కాళ్లు సైకిల్ లాగా ఆడించండి.",
        "ఫార్ములా ఇస్తే నీటి–పొడి నిష్పత్తి సరిగా ఉందా చూడండి. సీసాలో ఆహారం కలపవద్దు.",
      ],
    },
    seekCare: {
      en: [
        "Blood in stool, severe pain, vomiting, a swollen belly, or no stool with lethargy.",
        "A young baby who is not passing stool and is vomiting — seek care the same day.",
      ],
      te: [
        "మలంలో రక్తం, తీవ్ర నొప్పి, వాంతులు, ఉబ్బిన పొట్ట, మలం రాకపోవడంతో నీరసం.",
        "చిన్న పాపకు మలం రాకుండా వాంతులు ఉంటే అదే రోజు డాక్టర్‌ను చూపించండి.",
      ],
    },
  },
  {
    id: "anaemia",
    title: { en: "Anaemia", te: "రక్తహీనత (అనీమియా)" },
    summary: {
      en: "Iron-rich foods with vitamin C; less tea and excess milk.",
      te: "ఇనుము ఎక్కువగా ఉన్న ఆహారం, విటమిన్ సి; టీ, అధిక పాలు తగ్గించండి.",
    },
    offer: {
      en: [
        "Ragi, jowar, rice with dal, green leafy vegetables (palak, gongura, drumstick leaves).",
        "Egg, fish, chicken, or meat if the family eats them — well cooked, deboned for small children.",
        "Dal, sprouts, paneer, groundnuts (age-safe, not whole nuts for toddlers).",
        "Lemon, amla, orange, or tomato with meals — vitamin C helps iron absorption.",
        "A little jaggery in cooking for older children, not as sweets all day.",
      ],
      te: [
        "రాగి, జొన్న, అన్నం+పప్పు, ఆకుకూరలు (పాలకూర, గోంగూర, మునగాకు).",
        "కుటుంబం తింటే గుడ్డు, చేప, కోడి, మాంసం — బాగా ఉడికించి, ఎముకలు తీసి.",
        "పప్పు, మొలకలు, పనీర్, పల్లీలు (చిన్నపిల్లలకు మొత్తం గింజలు కాదు).",
        "భోజనంతో నిమ్మరసం, ఉసిరి, నారింజ, టమోటా — విటమిన్ సి ఇనుము పీల్చుకోవడానికి సహాయపడుతుంది.",
        "పెద్ద పిల్లలకు వంటలో కొంచెం బెల్లం; రోజంతా తీపి తినించవద్దు.",
      ],
    },
    avoid: {
      en: [
        "Tea or coffee with meals — they block iron.",
        "Too much milk instead of meals.",
        "Starting high-dose iron syrups on your own without a blood test and a doctor’s plan.",
      ],
      te: [
        "భోజనంతో టీ లేదా కాఫీ — ఇనుము పీల్చుకోవడం తగ్గుతుంది.",
        "భోజనం బదులు ఎక్కువ పాలు మాత్రమే.",
        "రక్తపరీక్ష, డాక్టర్ సలహా లేకుండా ఎక్కువ మోతాదు ఐరన్ సిరప్ మొదలుపెట్టవద్దు.",
      ],
    },
    homeCare: {
      en: [
        "Give a protein food at every meal (dal, curd, egg, fish, or chicken).",
        "After 6 months, start iron-rich complementary foods; do not delay solids.",
        "If iron medicine is prescribed, give it as advised, usually away from milk.",
      ],
      te: [
        "ప్రతి భోజనంలో ప్రోటీన్ ఉండేలా చూడండి (పప్పు, పెరుగు, గుడ్డు, చేప, కోడి).",
        "6 నెలల తర్వాత ఇనుము ఎక్కువగా ఉన్న ఆహారం మొదలుపెట్టండి; ఆలస్యం చేయవద్దు.",
        "ఐరన్ మందు వ్రాస్తే డాక్టర్ చెప్పినట్లు, సాధారణంగా పాలకు దూరంగా ఇవ్వండి.",
      ],
    },
    seekCare: {
      en: [
        "Pale inner eyelids or tongue, unusual tiredness, poor growth, breathlessness, or pica (eating mud/ice).",
        "A clinic blood test is needed before calling it anaemia and starting treatment.",
      ],
      te: [
        "కళ్ల లోపలి భాగం / నాలుక తెల్లగా ఉండటం, అలసట, ఎదుగుదల తక్కువ, ఊపిరి ఆందోళన, మట్టి/ఐస్ తినడం.",
        "అనీమియా అని చెప్పి మందు మొదలుపెట్టే ముందు క్లినిక్‌లో రక్తపరీక్ష అవసరం.",
      ],
    },
  },
  {
    id: "diarrhea",
    title: { en: "Diarrhoea", te: "విరేచనాలు" },
    summary: {
      en: "Fluids first, then food. Do not starve. Breastfeeding continues.",
      te: "ముందు ద్రవాలు, తర్వాత ఆహారం. ఆకలితో ఉంచవద్దు. తల్లిపాలు కొనసాగించండి.",
    },
    offer: {
      en: [
        "ORS (WHO packet) in small sips, often. Continue breast milk. Formula as usual if already used.",
        "Khichdi, rice with curd, mashed banana, boiled potato, apple (cooked), soft idli, toast.",
        "Dal water plus mashed dal, not only very thin water. A little salt and oil/ghee as tolerated.",
        "After each loose stool, extra ORS. Offer food as soon as the child wants to eat.",
      ],
      te: [
        "ORS (WHO ప్యాకెట్) చిన్న చిన్న గుక్కలుగా తరచుగా. తల్లిపాలు కొనసాగించండి. ఫార్ములా అలవాటు ఉంటే అలాగే.",
        "ఖిచిడీ, పెరుగన్నం, అరటి పండు, ఉడికించిన బంగాళాదుంప, ఉడికించిన ఆపిల్, మెత్తని ఇడ్లీ, టోస్ట్.",
        "పప్పు నీళ్లు మాత్రమే కాదు — మెత్తని పప్పు కూడా. తట్టుకోగలిగితే కొంచెం ఉప్పు, నూనె/నెయ్యి.",
        "ప్రతి విరేచనం తర్వాత అదనపు ORS. తినాలనిపిస్తే వెంటనే తేలికపాటి ఆహారం ఇవ్వండి.",
      ],
    },
    avoid: {
      en: [
        "Packaged juices, soda, very sweet drinks, spicy fried food, and junk.",
        "Stopping all food or giving only water for many hours.",
        "Anti-diarrhoeal syrups or antibiotics unless a doctor prescribes them.",
      ],
      te: [
        "ప్యాకెట్ జ్యూస్, సోడా, చాలా తీపి పానీయాలు, కారం వేయించిన ఆహారం, జంక్.",
        "ఆహారం పూర్తిగా ఆపి నీళ్లు మాత్రమే చాలా సేపు ఇవ్వడం.",
        "డాక్టర్ రాయకుండా విరేచనాల మందులు లేదా యాంటీబయాటిక్స్.",
      ],
    },
    homeCare: {
      en: [
        "Zinc is often advised for 14 days in children — use only the dose your doctor gives.",
        "Wash hands with soap. Keep the child’s bottom clean and dry; a barrier cream helps nappy rash.",
        "Count wet nappies / urine. A child who still plays and passes urine is usually taking enough fluid.",
      ],
      te: [
        "పిల్లలకు సాధారణంగా 14 రోజుల జింక్ సూచిస్తారు — డాక్టర్ చెప్పిన మోతాదు మాత్రమే.",
        "సబ్బుతో చేతులు కడగండి. పిల్ల నడుము శుభ్రంగా, పొడిగా ఉంచండి; రాష్‌కు క్రీమ్ ఉపయోగించవచ్చు.",
        "మూత్రం / తడి డైపర్లు చూడండి. ఆడుతూ మూత్రం వస్తుంటే సాధారణంగా ద్రవాలు సరిపోతున్నాయి.",
      ],
    },
    seekCare: {
      en: [
        "Blood in stool, high fever, repeated vomiting, very thirsty or no tears / no urine for 6–8 hours.",
        "Lethargy, sunken eyes, infants under 6 months, or diarrhoea lasting more than a few days.",
      ],
      te: [
        "మలంలో రక్తం, ఎక్కువ జ్వరం, పదే పదే వాంతులు, తీవ్ర దాహం, కన్నీళ్లు రాకపోవడం, 6–8 గంటలు మూత్రం రాకపోవడం.",
        "నీరసం, లోనికి వంగిన కళ్లు, 6 నెలల లోపు పాప, లేదా విరేచనాలు కొన్ని రోజులు ఆగకపోవడం.",
      ],
    },
  },
  {
    id: "fever",
    title: { en: "Fever", te: "జ్వరం" },
    summary: {
      en: "Offer extra fluids and light meals. Do not starve.",
      te: "ఎక్కువ ద్రవాలు, తేలికపాటి ఆహారం. ఆకలితో ఉంచవద్దు.",
    },
    offer: {
      en: [
        "Breast milk more often. For older children: water, milk, buttermilk, dal-rice, khichdi, idli, curd rice, fruit.",
        "Small frequent meals. Soft, warm, familiar foods the child already likes.",
        "If appetite is poor, fluids and one energy-dense item (khichdi with ghee, milk, banana) matter more than a full thali.",
      ],
      te: [
        "తల్లిపాలు ఎక్కువసార్లు. పెద్ద పిల్లలకు: నీరు, పాలు, మజ్జిగ, పప్పు-అన్నం, ఖిచిడీ, ఇడ్లీ, పెరుగన్నం, పండు.",
        "చిన్న మొత్తాలు తరచుగా. మెత్తని, వెచ్చని, పిల్లకు ఇష్టమైన ఆహారం.",
        "ఆకలి తక్కువైతే పూర్తి భోజనం కంటే ద్రవాలు, ఖిచిడీ+నెయ్యి, పాలు, అరటి ముఖ్యం.",
      ],
    },
    avoid: {
      en: [
        "Stopping all food until the fever “comes down”.",
        "Heavy fried food, leftover stale food, and sugary cold drinks as the main intake.",
        "Wrapping the child in many layers; use light clothes and a comfortable room.",
      ],
      te: [
        "జ్వరం దిగే వరకు ఆహారం పూర్తిగా ఆపడం.",
        "వేయించిన భారీ ఆహారం, పాతగా ఉన్న ఆహారం, తీపి చల్లని పానీయాలు మాత్రమే ఇవ్వడం.",
        "చాలా బట్టలు కప్పడం; తేలికపాటి బట్టలు, సుఖమైన గది ఉష్ణోగ్రత ఉంచండి.",
      ],
    },
    homeCare: {
      en: [
        "Give paracetamol only as advised by the doctor for that child’s age and weight. Do not combine extra fever syrups on your own.",
        "Sponge with lukewarm water if the child is very uncomfortable — not ice-cold water.",
        "Keep breastfeeding. Watch urine output and alertness.",
      ],
      te: [
        "పారాసిటమాల్ ఆ వయసు, బరువుకు డాక్టర్ చెప్పిన మోతాదులో మాత్రమే. అదనపు జ్వరపు సిరప్‌లు కలపవద్దు.",
        "చాలా అసౌకర్యంగా ఉంటే గోరువెచ్చని నీటితో స్పాంజ్ చేయండి — మంచునీరు కాదు.",
        "తల్లిపాలు కొనసాగించండి. మూత్రం, మెలకువ చూడండి.",
      ],
    },
    seekCare: {
      en: [
        "Any fever in a baby under 3 months — same-day clinic or emergency.",
        "Lethargy, rash, stiff neck, fast or difficult breathing, poor feeding, seizures, or fever lasting more than 3 days.",
      ],
      te: [
        "3 నెలల లోపు పాపకు జ్వరం — అదే రోజు క్లినిక్ / అత్యవసరం.",
        "నీరసం, రాష్, మెడ బిగుసుకోవడం, వేగంగా లేదా కష్టంగా ఊపిరి, తినకపోవడం, మూర్ఛ, లేదా 3 రోజులకు మించి జ్వరం.",
      ],
    },
  },
  {
    id: "cold_cough",
    title: { en: "Cold & cough", te: "జలుబు మరియు దగ్గు" },
    summary: {
      en: "Fluids, rest, and feeding. Most colds are viral.",
      te: "ద్రవాలు, విశ్రాంతి, ఆహారం. చాలా జలుబులు వైరల్.",
    },
    offer: {
      en: [
        "Warm fluids: water, milk, rasam, thin dal, kashayam without excess spice if the family uses it.",
        "Soft foods: khichdi, idli, porridge, banana, soup with vegetables.",
        "Honey in warm water only after 1 year of age (never under 1 year).",
        "Continue regular meals; a cold should not mean 3 days of only biscuits.",
      ],
      te: [
        "వెచ్చని ద్రవాలు: నీరు, పాలు, రసం, పలుచని పప్పు, ఇంటి కషాయం (ఎక్కువ కారం లేకుండా).",
        "మెత్తని ఆహారం: ఖిచిడీ, ఇడ్లీ, గంజి, అరటి, కూరగాయల సూప్.",
        "1 సంవత్సరం తర్వాత మాత్రమే వెచ్చని నీటిలో తేనె (1 సంవత్సరం లోపు తేనె వద్దు).",
        "సాధారణ భోజనం కొనసాగించండి; జలుబుకు 3 రోజులు బిస్కెట్లు మాత్రమే కాదు.",
      ],
    },
    avoid: {
      en: [
        "Cough syrups in young children unless a doctor specifically prescribes them.",
        "Very cold ice creams, packaged juices, and dusty / smoky rooms.",
        "Force-feeding when the nose is blocked — clean the nose first, then offer food.",
      ],
      te: [
        "డాక్టర్ రాయకుండా చిన్నపిల్లలకు దగ్గు సిరప్‌లు వేయవద్దు.",
        "ఐస్ క్రీమ్, ప్యాకెట్ జ్యూస్, ధూళి / పొగ ఉన్న గది.",
        "ముక్కు మూసుకుపోయి ఉండగా బలవంతంగా తినించవద్దు — ముక్కు శుభ్రం చేసి తర్వాత ఆహారం.",
      ],
    },
    homeCare: {
      en: [
        "Saline nose drops and gentle suction for infants. Sit the child slightly upright while feeding.",
        "A steamy bathroom (not hot steam on the face) can ease a blocked nose.",
        "Handwashing, exclusive breastfeeding for infants, and smoke-free air help recovery.",
      ],
      te: [
        "పాపలకు సెలైన్ నోటి చుక్కలు, మెల్లగా ముక్కు శుభ్రం. తినిపించేటప్పుడు కాస్త నిటారుగా పట్టుకోండి.",
        "వేడి ఆవిరి ముఖం మీద కాదు — స్నానాల గదిలో కాస్త ఆవిరి ముక్కు తెరవడానికి పనికి వస్తుంది.",
        "చేతులు కడగడం, పాపలకు తల్లిపాలు, పొగ లేని గాలి కోలుకోవడానికి సహాయపడతాయి.",
      ],
    },
    seekCare: {
      en: [
        "Fast breathing, chest indrawing, noisy / difficult breathing, bluish lips, or inability to feed.",
        "Fever more than 3 days, ear pain, or a cough lasting more than 2 weeks.",
      ],
      te: [
        "వేగంగా ఊపిరి, పక్కటెముకలు లోనికి వచ్చడం, శ్వాస కష్టం, నీలి పెదవులు, తినలేకపోవడం.",
        "3 రోజులకు మించి జ్వరం, చెవి నొప్పి, లేదా 2 వారాలకు మించి దగ్గు.",
      ],
    },
  },
  {
    id: "malnutrition",
    title: { en: "Malnutrition", te: "పోషకాహార లోపం" },
    summary: {
      en: "Frequent, energy-dense meals and follow-up on growth charts.",
      te: "తరచుగా శక్తి ఎక్కువగా ఉన్న భోజనం, వృద్ధి చార్టులతో ఫాలో-అప్.",
    },
    offer: {
      en: [
        "3 meals + 2 snacks. Add ghee or oil to khichdi, dal-rice, ragi porridge, and mashed vegetables.",
        "Cereal + pulse at least once a day (rice-dal, roti-dal, ragi-dal). Egg, fish, or chicken if the family eats them.",
        "Groundnut / sesame paste mixed into food for older toddlers (never whole nuts under 5 if choking risk).",
        "Curd, paneer, banana, potato, and ripe mango in season for extra energy.",
        "Small portions often if appetite is poor — do not wait for a “full meal” hunger.",
      ],
      te: [
        "3 పూటలు + 2 టిఫిన్లు. ఖిచిడీ, పప్పు-అన్నం, రాగి జావ, మెత్తని కూరల్లో నెయ్యి లేదా నూనె కలపండి.",
        "రోజుకు ఒక్కసారైనా ధాన్యం+పప్పు (అన్నం-పప్పు, రొట్టె-పప్పు, రాగి-పప్పు). కుటుంబం తింటే గుడ్డు, చేప, కోడి.",
        "పెద్ద టాడ్లర్లకు పల్లీ / నువ్వుల పేస్ట్ ఆహారంలో కలపండి (చిన్న పిల్లలకు మొత్తం గింజలు కాదు — ఉక్కిరిబిక్కిరి ప్రమాదం).",
        "పెరుగు, పనీర్, అరటి, బంగాళాదుంప, కాలంలో మామిడి — శక్తి పెంచుతాయి.",
        "ఆకలి తక్కువైతే చిన్న మొత్తాలు తరచుగా — పూర్తి భోజనం కోసం ఆగవద్దు.",
      ],
    },
    avoid: {
      en: [
        "Only watery dal water, tea, or biscuits as meals.",
        "Excess milk that replaces solids. Packaged junk that fills without protein.",
        "Force-feeding or long screen-time meals — they worsen poor appetite.",
      ],
      te: [
        "పలుచని పప్పు నీళ్లు, టీ, బిస్కెట్లు మాత్రమే భోజనంగా ఇవ్వడం.",
        "ఘనాహారం బదులు ఎక్కువ పాలు. ప్రోటీన్ లేని జంక్ తో కడుపు నింపడం.",
        "బలవంతంగా తినించడం, ఫోన్ చూస్తూ తినిపించడం — ఆకలి మరింత తగ్గుతుంది.",
      ],
    },
    homeCare: {
      en: [
        "Plot weight and height on WHO/IAP charts and review every 2–4 weeks until catch-up.",
        "Treat constipation, anaemia, worms, and repeated illness with your paediatrician — they stall growth.",
        "After 6 months, complementary food should be thick, not watery. Continue breastfeeding.",
      ],
      te: [
        "బరువు, ఎత్తు WHO/IAP చార్టుల్లో గుర్తించి, కావాల్సిన ఎదుగుదల వచ్చే వరకు 2–4 వారాలకు ఒకసారి చూపించండి.",
        "మలబద్ధకం, అనీమియా, పురుగులు, తరచుగా జబ్బు — ఇవి ఎదుగుదలను ఆపుతాయి; పీడియాట్రిషియన్‌తో చూపించండి.",
        "6 నెలల తర్వాత ఆహారం గట్టిగా/మెత్తగా ఉండాలి, నీళ్లలా కాదు. తల్లిపాలు కొనసాగించండి.",
      ],
    },
    seekCare: {
      en: [
        "Very low weight, swelling of feet, visible ribs, lethargy, or not gaining for months.",
        "Any infant who is not feeding, vomiting everything, or looks unwell — same-day care.",
      ],
      te: [
        "చాలా తక్కువ బరువు, కాళ్లు వాయడం, పక్కటెముకలు కనిపించడం, నీరసం, నెలల తరబడి బరువు పెరగకపోవడం.",
        "తినని, అంతా వాంతి చేసే, రోగంగా కనిపించే పాపను అదే రోజు చూపించండి.",
      ],
    },
  },
];

export const CONDITION_LABELS: { id: ConditionId; en: string; te: string }[] =
  CONDITION_ADVICE.map((c) => ({ id: c.id, en: c.title.en, te: c.title.te }));
