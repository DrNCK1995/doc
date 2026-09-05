import type { FaqSection } from "./faq-types";

/** Everyday clinic problems — short Q&A (education only). */
export const COMMON_PROBLEM_SECTIONS: FaqSection[] = [
  {
    id: "constipation",
    kind: "common-problem",
    group: "gut",
    emoji: "🚽",
    title: { en: "Constipation", te: "మలబద్ధకం" },
    intro: {
      en: "Hard, infrequent, or painful stools are common. Diet, fluids, and toilet habits usually help — medicines only when advised.",
      te: "గట్టి, తక్కువసార్లు, లేదా నొప్పితో మలం సాధారణం. ఆహారం, ద్రవాలు, టాయిలెట్ అలవాటు సహాయం — మందులు డాక్టర్ చెప్పినప్పుడే.",
    },
    items: [
      {
        q: {
          en: "What counts as constipation in children?",
          te: "పిల్లల్లో మలబద్ధకం అంటే?",
        },
        a: {
          en: "Fewer than 3 soft stools a week, hard pellets, straining, blood on wiping, or stool withholding with tummy pain. Breastfed babies can go days between soft stools if feeding and growth are fine.",
          te: "వారానికి 3 కంటే తక్కువ మెత్తని మలం, గట్టి గింజలు, ఒత్తిడి, తుడిచేటప్పుడు రక్తం, లేదా మలం ఆపి కడుపు నొప్పి. తల్లిపాలు తాగే పాపలు మెత్తగా ఉంటే రోజుల తేడా సాధారణం కావచ్చు.",
        },
      },
      {
        q: {
          en: "What can I try at home?",
          te: "ఇంట్లో ఏమి చేయవచ్చు?",
        },
        a: {
          en: "More water (age-appropriate), fruit (papaya, pear, banana in moderation), vegetables, whole grains, and less biscuits/chips. Regular toilet time after meals. Never punish for soiling.",
          te: "వయసుకు తగిన నీరు, పండ్లు (బొప్పాయి, బేరి), కూరగాయలు, తవుడు ధాన్యాలు; బిస్కెట్/చిప్స్ తగ్గించండి. భోజనం తర్వాత టాయిలెట్ సమయం. మలం కారితే శిక్ష వద్దు.",
        },
      },
      {
        q: {
          en: "When should I see the doctor?",
          te: "ఎప్పుడు డాక్టర్‌ను చూపించాలి?",
        },
        a: {
          en: "Constipation from early infancy, severe pain, vomiting, weight loss, blood mixed in stool, or no response to simple diet changes — get a paediatric review.",
          te: "చిన్నప్పటి నుంచి మలబద్ధకం, తీవ్ర నొప్పి, వాంతులు, బరువు తగ్గడం, మలంలో రక్తం, లేదా ఆహార మార్పులకు స్పందన లేకపోతే — పీడియాట్రిషన్ చూపించండి.",
        },
      },
    ],
  },
  {
    id: "tummy-pain",
    kind: "common-problem",
    group: "gut",
    emoji: "🤕",
    title: {
      en: "Recurrent tummy pain",
      te: "మళ్లీ మళ్లీ కడుపు నొప్పి",
    },
    intro: {
      en: "Many children get tummy aches from gas, constipation, stress, or mild infections. Red flags need same-day care.",
      te: "చాలా మంది పిల్లలకు గ్యాస్, మలబద్ధకం, ఒత్తిడి, తేలికపాటి ఇన్ఫెక్షన్‌తో కడుపు నొప్పి. హెచ్చరిక సైన్లకు అదే రోజు వైద్యం.",
    },
    items: [
      {
        q: {
          en: "What usually causes recurrent tummy pain?",
          te: "మళ్లీ మళ్లీ కడుపు నొప్పికి సాధారణ కారణాలు?",
        },
        a: {
          en: "Constipation, gas after junk food, school stress, acid reflux, worm infestation, or lactose intolerance. A calm history and exam matter more than many tests at first.",
          te: "మలబద్ధకం, జంక్ ఫుడ్ తర్వాత గ్యాస్, స్కూల్ ఒత్తిడి, యాసిడ్ రిఫ్లక్స్, పురుగులు, లాక్టోస్ అసహనం. మొదట చాలా టెస్టుల కంటే చరిత్ర, పరీక్ష ముఖ్యం.",
        },
      },
      {
        q: {
          en: "Home care while we wait for review?",
          te: "డాక్టర్ చూసే వరకు ఇంటి సంరక్షణ?",
        },
        a: {
          en: "Small soft meals, fluids, toilet routine, limit spicy/fried snacks. Note timing (school days vs holidays), fever, diarrhoea, or urine burning.",
          te: "చిన్న మెత్తని భోజనాలు, ద్రవాలు, టాయిలెట్ అలవాటు; కారం/వేపుడు తగ్గించండి. సమయం (స్కూల్ vs సెలవు), జ్వరం, విరేచనాలు, మూత్రం కాలడం రాసుకోండి.",
        },
      },
      {
        q: {
          en: "Danger signs with tummy pain?",
          te: "కడుపు నొప్పితో ప్రమాద సైన్లు?",
        },
        a: {
          en: "Severe constant pain, green or bloody vomit, swollen hard tummy, blood in stool, high fever, jaundice, pain with swelling of testes, or a child who will not walk — urgent care.",
          te: "తీవ్ర నిరంతర నొప్పి, పచ్చ/రక్త వాంతులు, ఉబ్బిన గట్టి కడుపు, మలంలో రక్తం, ఎక్కువ జ్వరం, కామెర్లు, వృషణాల ఉబ్బుతో నొప్పి, నడవలేని పిల్ల — అత్యవసరం.",
        },
      },
    ],
  },
  {
    id: "celiac",
    kind: "common-problem",
    group: "gut",
    emoji: "🌾",
    title: { en: "Celiac disease basics", te: "సీలియాక్ వ్యాధి — ప్రాథమికాలు" },
    intro: {
      en: "Celiac is an immune reaction to gluten (wheat, barley, rye). Diagnosis needs proper tests — do not start a lifelong gluten-free diet without medical advice.",
      te: "సీలియాక్‌లో గ్లూటెన్ (గోధుమ, బార్లీ, రై)కి రోగనిరోధక ప్రతిచర్య. సరైన పరీక్షలు అవసరం — డాక్టర్ లేకుండా జీవితాంతం గ్లూటెన్-ఫ్రీ మొదలుపెట్టవద్దు.",
    },
    items: [
      {
        q: {
          en: "What symptoms raise suspicion?",
          te: "ఏ లక్షణాలు అనుమానం కలిగిస్తాయి?",
        },
        a: {
          en: "Chronic diarrhoea, poor weight gain, bloating, anaemia, short stature, or family history of celiac / type 1 diabetes. Some children have mild or atypical signs.",
          te: "దీర్ఘకాల విరేచనాలు, బరువు పెరగకపోవడం, ఉబ్బు, రక్తహీనత, పొట్టితనం, కుటుంబంలో సీలియాక్ / టైప్ 1 డయాబెటిస్. కొందరిలో లక్షణాలు తక్కువగా ఉండవచ్చు.",
        },
      },
      {
        q: {
          en: "How is it diagnosed?",
          te: "ఎలా నిర్ధారిస్తారు?",
        },
        a: {
          en: "Blood tests (while still eating gluten) then often endoscopy as advised. Stopping gluten before testing can give false negatives.",
          te: "గ్లూటెన్ తింటూనే రక్త పరీక్షలు — అవసరమైతే ఎండోస్కోపీ. పరీక్షకు ముందు గ్లూటెన్ ఆపితే తప్పుడు నెగటివ్ రావచ్చు.",
        },
      },
      {
        q: {
          en: "If confirmed, what changes?",
          te: "నిర్ధారణైతే ఏమి మార్చాలి?",
        },
        a: {
          en: "Strict lifelong gluten-free diet with dietitian support. Rice, ragi, jowar, millets, and many South Indian foods can fit — read labels carefully.",
          te: "జీవితాంతం కఠిన గ్లూటెన్-ఫ్రీ ఆహారం — డైటీషియన్ సహాయం. బియ్యం, రాగి, జొన్న, చిరుధాన్యాలు సరిపోవచ్చు — లేబుల్ జాగ్రత్తగా చదవండి.",
        },
      },
    ],
  },
  {
    id: "fever-cough",
    kind: "common-problem",
    group: "infection",
    emoji: "🤧",
    title: {
      en: "Fever with cough / cold",
      te: "జ్వరంతో దగ్గు / జలుబు",
    },
    intro: {
      en: "Most colds are viral and settle in a few days. Comfort care helps; antibiotics are not for every cough.",
      te: "చాలా జలుబులు వైరల్ — కొన్ని రోజుల్లో తగ్గుతాయి. సౌకర్య సంరక్షణ సహాయం; ప్రతి దగ్గుకు యాంటీబయాటిక్ కాదు.",
    },
    items: [
      {
        q: {
          en: "What home care is safe?",
          te: "ఏ ఇంటి సంరక్షణ సురక్షితం?",
        },
        a: {
          en: "Fluids, rest, saline nose drops, humid air if helpful, weight-based paracetamol for discomfort. Honey only after 1 year of age. Avoid multi-ingredient cold syrups in young children unless prescribed.",
          te: "ద్రవాలు, విశ్రాంతి, సెలైన్ ముక్కు చుక్కలు, అవసరమైతే తేమ గాలి, అసౌకర్యానికి బరువు ప్రకారం పారాసిటమాల్. తేనె 1 సంవత్సరం తర్వాతే. చిన్నపిల్లలకు బహుళ-కాంపోనెంట్ కోల్డ్ సిరప్‌లు ప్రిస్క్రిప్షన్ లేకుండా వద్దు.",
        },
      },
      {
        q: {
          en: "When is cough with fever worrying?",
          te: "జ్వరంతో దగ్గు ఎప్పుడు ఆందోళన?",
        },
        a: {
          en: "Fast breathing, chest indrawing, blue lips, stridor, inability to drink, fever over 3 days, or any fever under 3 months — see When Should I Worry? and seek care.",
          te: "వేగపు ఊపిరి, ఛాతీ లోపలికి లాగడం, నీలి పెదవులు, స్ట్రైడర్, తాగలేకపోవడం, 3 రోజులకు మించి జ్వరం, 3 నెలల లోపు ఏ జ్వరమైనా — When Should I Worry? చూసి వైద్యం తీసుకోండి.",
        },
      },
      {
        q: {
          en: "Do we need antibiotics or a chest X-ray?",
          te: "యాంటీబయాటిక్ లేదా ఛాతీ ఎక్స్-రే అవసరమా?",
        },
        a: {
          en: "Often no for a short viral cold. The doctor decides based on exam — not every cough needs a film or antibiotic.",
          te: "చిన్న వైరల్ జలుబుకు తరచూ అవసరం లేదు. పరీక్ష ఆధారంగా డాక్టర్ నిర్ణయం — ప్రతి దగ్గుకు ఫిల్మ్ / యాంటీబయాటిక్ కాదు.",
        },
      },
    ],
  },
  {
    id: "recurrent-cough",
    kind: "common-problem",
    group: "infection",
    emoji: "🫁",
    title: { en: "Recurrent cough", te: "మళ్లీ మళ్లీ దగ్గు" },
    intro: {
      en: "Cough that keeps returning may be post-viral, allergy, asthma, reflux, or another cause — pattern and night symptoms help the doctor.",
      te: "మళ్లీ మళ్లీ వచ్చే దగ్గు వైరస్ తర్వాత, అలెర్జీ, ఆస్తమా, రిఫ్లక్స్ లేదా ఇతర కారణం కావచ్చు — నమూనా, రాత్రి లక్షణాలు డాక్టర్‌కు సహాయం.",
    },
    items: [
      {
        q: {
          en: "When is a cough “recurrent”?",
          te: "దగ్గు “మళ్లీ మళ్లీ” అంటే ఎప్పుడు?",
        },
        a: {
          en: "Several episodes a year, cough lasting weeks, or cough that worsens at night / with exercise / with colds. Keep a simple diary of triggers.",
          te: "సంవత్సరానికి చాలా ఎపిసోడ్లు, వారాల దగ్గు, లేదా రాత్రి / వ్యాయామం / జలుబుతో పెరిగే దగ్గు. ట్రిగ్గర్ల డైరీ ఉంచండి.",
        },
      },
      {
        q: {
          en: "Could it be asthma or allergy?",
          te: "ఆస్తమా లేదా అలెర్జీ కావచ్చా?",
        },
        a: {
          en: "Yes — especially with wheeze, family allergy history, or cough after running. Do not start inhalers from hearsay; get a proper plan.",
          te: "అవును — వీజ్, కుటుంబ అలెర్జీ, పరుగు తర్వాత దగ్గు ఉంటే. వినికిడితో ఇన్‌హేలర్లు మొదలుపెట్టవద్దు — సరైన ప్లాన్ తీసుకోండి.",
        },
      },
      {
        q: {
          en: "Home tips while awaiting review?",
          te: "డాక్టర్ వరకు ఇంటి చిట్కాలు?",
        },
        a: {
          en: "Smoke-free home, reduce dust if possible, treat blocked nose with saline, avoid dry air irritants. See doctor if breathing effort increases.",
          te: "పొగలేని ఇల్లు, సాధ్యమైతే దుమ్ము తగ్గించండి, ముక్కు మూసుకుంటే సెలైన్, పొడి గాలి ఉద్రేకాలు తగ్గించండి. ఊపిరి కష్టం పెరిగితే డాక్టర్.",
        },
      },
    ],
  },
  {
    id: "mosquito",
    kind: "common-problem",
    group: "infection",
    emoji: "🦟",
    title: {
      en: "Mosquito-borne illness prevention",
      te: "దోమల వ్యాధుల నివారణ",
    },
    intro: {
      en: "Dengue, malaria, and chikungunya spread by mosquitoes. Prevention at home matters as much as clinics.",
      te: "డెంగ్యూ, మలేరియా, చికున్‌గున్యా దోమల ద్వారా. క్లినిక్‌తో పాటు ఇంటి నివారణ ముఖ్యం.",
    },
    items: [
      {
        q: {
          en: "How do we reduce mosquito bites?",
          te: "దోమ కాట్లు ఎలా తగ్గించాలి?",
        },
        a: {
          en: "Empty water from pots, coolers, tyres weekly; use screens, full sleeves at dusk/dawn; age-appropriate repellents as advised. Nets for sleeping infants.",
          te: "కుండలు, కూలర్, టైర్ల నీరు వారం వారం ఖాళీ చేయండి; స్క్రీన్లు, సాయంత్రం/ఉదయం పూర్తి స్లీవ్స్; వయసుకు తగిన రిపెలెంట్. పాపలకు నెట్.",
        },
      },
      {
        q: {
          en: "Fever in monsoon — when to test?",
          te: "వర్షాకాల జ్వరం — ఎప్పుడు టెస్ట్?",
        },
        a: {
          en: "Fever with severe body pain, bleeding gums, persistent vomiting, or lethargy needs prompt medical review — do not self-medicate with many painkillers.",
          te: "జ్వరంతో తీవ్ర శరీర నొప్పి, చిగుళ్ల రక్తం, నిరంతర వాంతులు, అలసట ఉంటే త్వరగా వైద్యం — చాలా నొప్పి మందులు స్వయంగా వద్దు.",
        },
      },
      {
        q: {
          en: "Is there a vaccine for dengue?",
          te: "డెంగ్యూకు టీకా ఉందా?",
        },
        a: {
          en: "Availability and eligibility change — ask your paediatrician what is appropriate for your child’s age and area. Prevention of bites remains essential.",
          te: "అందుబాటు, అర్హత మారుతూ ఉంటాయి — వయసు, ప్రాంతం ప్రకారం డాక్టర్‌ను అడగండి. కాటు నివారణ ఇంకా అవసరం.",
        },
      },
    ],
  },
  {
    id: "allergic-rhinitis",
    kind: "common-problem",
    group: "breath-skin",
    emoji: "🌼",
    title: {
      en: "Allergic rhinitis (runny / blocked nose)",
      te: "అలర్జీ రినైటిస్ (ముక్కు కారడం / మూసుకోవడం)",
    },
    intro: {
      en: "Sneezing, itchy nose, and clear runny nose from dust, pollen, or mites are common. It is not always “sinus infection”.",
      te: "దుమ్ము, పూల పరాగం, పురుగు నుంచి తుమ్ములు, ముక్కు దురద, నీళ్లు కారడం సాధారణం. ఎల్లప్పుడూ “సైనస్ ఇన్ఫెక్షన్” కాదు.",
    },
    items: [
      {
        q: {
          en: "How is allergy different from a cold?",
          te: "అలెర్జీ, జలుబు తేడా ఏమిటి?",
        },
        a: {
          en: "Colds often have fever and last days. Allergy may last weeks/seasonally, with itchy eyes/nose, little or no fever, and sneezing fits.",
          te: "జలుబులో తరచూ జ్వరం, కొన్ని రోజులు. అలెర్జీ వారాలు/సీజన్‌లు ఉండవచ్చు — కళ్లు/ముక్కు దురద, జ్వరం తక్కువ, తుమ్ములు.",
        },
      },
      {
        q: {
          en: "What helps at home?",
          te: "ఇంట్లో ఏమి సహాయం?",
        },
        a: {
          en: "Saline rinses/drops, reduce dust (wet wipe, wash bedding), keep windows closed on high pollen days if advised. Antihistamines / nasal sprays only as prescribed for age.",
          te: "సెలైన్, దుమ్ము తగ్గించండి (తడి తుడుపు, బెడ్డింగ్ ఉతకడం). యాంటీహిస్టమిన్ / నాసల్ స్ప్రే వయసుకు ప్రిస్క్రిప్షన్ ప్రకారమే.",
        },
      },
      {
        q: {
          en: "When to see the doctor?",
          te: "ఎప్పుడు డాక్టర్?",
        },
        a: {
          en: "Breathing difficulty, one-sided thick discharge with facial pain, symptoms spoiling sleep/school, or suspected asthma overlap.",
          te: "ఊపిరి కష్టం, ఒక వైపు మందపాటి స్రావం + ముఖ నొప్పి, నిద్ర/స్కూల్ దెబ్బ, ఆస్తమా అనుమానం.",
        },
      },
    ],
  },
  {
    id: "skin-allergy",
    kind: "common-problem",
    group: "breath-skin",
    emoji: "🧴",
    title: {
      en: "Skin allergies & eczema",
      te: "చర్మ అలెర్జీలు & ఎక్జిమా",
    },
    intro: {
      en: "Dry, itchy patches are common in Indian climates with hard water and heat. Gentle skin care prevents many flares.",
      te: "భారత వాతావరణం, గట్టి నీరు, వేడితో పొడి దురద మచ్చలు సాధారణం. మృదువైన చర్మ సంరక్షణ మంటలను తగ్గిస్తుంది.",
    },
    items: [
      {
        q: {
          en: "Daily skin care basics?",
          te: "రోజువారీ చర్మ సంరక్షణ?",
        },
        a: {
          en: "Short lukewarm baths, fragrance-free moisturiser within 3 minutes of bathing, soft cotton clothes. Avoid harsh soaps and scrubbing.",
          te: "చిన్న గోరువెచ్చని స్నానం, స్నానం తర్వాత 3 నిమిషాల్లో సువాసన లేని మాయిశ్చరైజర్, మెత్తని కాటన్. కఠిన సబ్బులు, రాపిడి వద్దు.",
        },
      },
      {
        q: {
          en: "Steroid creams — are they dangerous?",
          te: "స్టిరాయిడ్ క్రీమ్‌లు ప్రమాదమా?",
        },
        a: {
          en: "When used as prescribed for the right strength and duration, they are standard treatment. Do not use strong adult creams on babies from a chemist without advice.",
          te: "సరైన బలం, వ్యవధితో ప్రిస్క్రిప్షన్ ప్రకారం వాడితే ప్రామాణిక చికిత్స. పాపలపై పెద్దల క్రీమ్‌లు సలహా లేకుండా వద్దు.",
        },
      },
      {
        q: {
          en: "When is a rash urgent?",
          te: "రాష్ ఎప్పుడు అత్యవసరం?",
        },
        a: {
          en: "Rash with fever and looking unwell, purple spots that do not blanch, swelling of lips/tongue, or widespread blistering — seek urgent care.",
          te: "జ్వరం + అస్వస్థతతో రాష్, నొక్కితే తెల్లబడని ఊదా మచ్చలు, పెదవులు/నాలుక ఉబ్బు, విస్తృత బొబ్బలు — అత్యవసరం.",
        },
      },
    ],
  },
  {
    id: "asthma-attack",
    kind: "common-problem",
    group: "breath-skin",
    emoji: "😮‍💨",
    title: {
      en: "Asthma attack — what to do",
      te: "ఆస్తమా దాడి — ఏమి చేయాలి",
    },
    intro: {
      en: "Know your child’s written action plan. Reliever inhaler technique and early help save lives.",
      te: "పిల్ల రాతపూర్వక యాక్షన్ ప్లాన్ తెలుసుకోండి. రిలీవర్ ఇన్‌హేలర్ సాంకేతికత, ముందస్తు సహాయం ప్రాణాలు కాపాడతాయి.",
    },
    items: [
      {
        q: {
          en: "First steps in an attack?",
          te: "దాడిలో మొదటి అడుగులు?",
        },
        a: {
          en: "Stay calm, sit the child upright, give the prescribed reliever (usually via spacer) as on the plan. Loosen tight clothes. Do not force lying flat if breathless.",
          te: "ప్రశాంతంగా, పిల్లను నిటారుగా కూర్చోబెట్టి, ప్లాన్ ప్రకారం రిలీవర్ (సాధారణంగా స్పేసర్‌తో) ఇవ్వండి. బిగుసు దుస్తులు విప్పండి. ఊపిరి కష్టంగా ఉంటే బలవంతంగా పడుకోబెట్టవద్దు.",
        },
      },
      {
        q: {
          en: "When is it an emergency?",
          te: "ఎప్పుడు అత్యవసరం?",
        },
        a: {
          en: "Cannot speak full sentences, lips blue, extreme tiredness, reliever not helping as per plan, or you are frightened — go to emergency / call help now.",
          te: "పూర్తి వాక్యాలు మాట్లాడలేకపోవడం, నీలి పెదవులు, అతి అలసట, ప్లాన్ ప్రకారం రిలీవర్ పని చేయకపోవడం, భయం — ఇప్పుడే ఎమర్జెన్సీ.",
        },
      },
      {
        q: {
          en: "Prevention between attacks?",
          te: "దాడుల మధ్య నివారణ?",
        },
        a: {
          en: "Use controller medicines daily if prescribed, smoke-free home, treat nose allergy, and review technique at clinic visits.",
          te: "ప్రిస్క్రైబ్ చేస్తే కంట్రోలర్ రోజూ, పొగలేని ఇల్లు, ముక్కు అలెర్జీ చికిత్స, క్లినిక్‌లో టెక్నిక్ రివ్యూ.",
        },
      },
    ],
  },
  {
    id: "anemia",
    kind: "common-problem",
    group: "breath-skin",
    emoji: "🩸",
    title: { en: "Anaemia — parent signs", te: "రక్తహీనత — తల్లిదండ్రుల సైన్లు" },
    intro: {
      en: "Iron deficiency is common in toddlers who drink excess milk and eat little iron-rich food. Blood tests confirm — do not start high-dose iron without advice.",
      te: "ఎక్కువ పాలు, తక్కువ ఇనుము ఆహారంతో టాడ్లర్లలో ఇనుము లోపం సాధారణం. రక్త పరీక్ష నిర్ధారణ — సలహా లేకుండా ఎక్కువ మోతాదు ఇనుము మొదలుపెట్టవద్దు.",
    },
    items: [
      {
        q: {
          en: "What might I notice?",
          te: "ఏమి కనిపించవచ్చు?",
        },
        a: {
          en: "Pallor (lips, inner eyelids), tiredness, poor appetite, pica (eating mud/ice), or slow growth. Not every pale child has anaemia — testing decides.",
          te: "తెల్లని రంగు (పెదవులు, కనురెప్పల లోపల), అలసట, ఆకలి తగ్గడం, పైకా (మట్టి/మంచు తినడం), నెమ్మది వృద్ధి. ప్రతి తెల్లని పిల్లకు రక్తహీనత కాదు — పరీక్ష నిర్ణయం.",
        },
      },
      {
        q: {
          en: "Food tips while under care?",
          te: "చికిత్సలో ఉండగా ఆహార చిట్కాలు?",
        },
        a: {
          en: "Limit milk to about 300–500 ml/day after infancy so solids fit. Offer dal, greens, ragi, egg, meat/fish if eaten, jaggery in moderation with meals.",
          te: "శిశువు తర్వాత పాలు సుమారు 300–500 ml/రోజు — ఘన ఆహారానికి చోటు. పప్పు, ఆకుకూరలు, రాగి, గుడ్డు, మాంసం/చేప, భోజనంతో కొద్ది బెల్లం.",
        },
      },
      {
        q: {
          en: "When is it urgent?",
          te: "ఎప్పుడు అత్యవసరం?",
        },
        a: {
          en: "Severe breathlessness, fainting, very fast heart rate, or known severe anaemia — seek care promptly.",
          te: "తీవ్ర శ్వాస కష్టం, స్పృహ కోల్పోవడం, చాలా వేగపు గుండె, తీవ్ర రక్తహీనత తెలిస్తే — త్వరగా వైద్యం.",
        },
      },
    ],
  },
  {
    id: "febrile-seizure",
    kind: "common-problem",
    group: "seizure-neuro",
    emoji: "⚡",
    title: {
      en: "Febrile seizure — what parents should do",
      te: "జ్వర మూర్ఛ — తల్లిదండ్రులు ఏమి చేయాలి",
    },
    intro: {
      en: "A brief seizure with fever in a previously well toddler is frightening but often not epilepsy. Stay calm and protect the airway.",
      te: "ముందు బాగున్న టాడ్లర్‌లో జ్వరంతో చిన్న మూర్ఛ భయంకరం — కానీ తరచూ ఎపిలెప్సీ కాదు. ప్రశాంతంగా శ్వాస మార్గం కాపాడండి.",
    },
    items: [
      {
        q: {
          en: "What should I do during the seizure?",
          te: "మూర్ఛ సమయంలో ఏమి చేయాలి?",
        },
        a: {
          en: "Place on the side, clear sharp objects, loosen clothes, time the episode. Do not put anything in the mouth or splash water on the face.",
          te: "పక్కకు పడుకోబెట్టి, పదును వస్తువులు దూరం, దుస్తులు విప్పి, సమయం చూడండి. నోట్లో ఏమీ పెట్టవద్దు, ముఖంపై నీరు చల్లవద్దు.",
        },
      },
      {
        q: {
          en: "When is emergency care needed?",
          te: "ఎప్పుడు అత్యవసరం?",
        },
        a: {
          en: "Seizure over 5 minutes, repeats in the same illness, first seizure ever, under 6 months, stiff neck, rash, or child not waking properly after — seek urgent care.",
          te: "5 నిమిషాలకు మించి, అదే అనారోగ్యంలో మళ్లీ, మొదటి మూర్ఛ, 6 నెలల లోపు, మెడ బిగుసు, రాష్, లేదా తర్వాత సరిగా మేల్కోకపోవడం — అత్యవసరం.",
        },
      },
      {
        q: {
          en: "Will this become epilepsy?",
          te: "ఇది ఎపిలెప్సీ అవుతుందా?",
        },
        a: {
          en: "Most simple febrile seizures do not. Your paediatrician will explain risk based on age, family history, and seizure type.",
          te: "చాలా సాధారణ జ్వర మూర్ఛలు కావు. వయసు, కుటుంబ చరిత్ర, రకం ఆధారంగా డాక్టర్ వివరిస్తారు.",
        },
      },
    ],
  },
  {
    id: "epilepsy-home",
    kind: "common-problem",
    group: "seizure-neuro",
    emoji: "🧠",
    title: {
      en: "Epilepsy & seizure first aid",
      te: "ఎపిలెప్సీ & మూర్ఛ ప్రథమ చికిత్స",
    },
    intro: {
      en: "Children on epilepsy treatment need regular medicines and a clear rescue plan. Never stop tablets suddenly.",
      te: "ఎపిలెప్సీ చికిత్సలో ఉన్న పిల్లలకు రెగ్యులర్ మందులు, స్పష్టమైన రెస్క్యూ ప్లాన్. మాత్రలు అకస్మాత్తుగా ఆపవద్దు.",
    },
    items: [
      {
        q: {
          en: "Daily safety tips?",
          te: "రోజువారీ భద్రత?",
        },
        a: {
          en: "Supervise baths/swimming, helmet for bikes as advised, inform school, keep rescue medicine available if prescribed, regular sleep.",
          te: "స్నానం/ఈత పర్యవేక్షణ, సలహా ప్రకారం హెల్మెట్, స్కూల్‌కు చెప్పండి, రెస్క్యూ మందు ఉంచండి, సరిగా నిద్ర.",
        },
      },
      {
        q: {
          en: "Missed a dose — what now?",
          te: "మోతాదు మిస్ అయితే?",
        },
        a: {
          en: "Follow your neurologist/paediatrician’s written advice. Do not double-dose unless told. Call the clinic if vomiting prevents doses.",
          te: "డాక్టర్ రాతపూర్వక సలహా పాటించండి. చెప్పకుండా రెండు మోతాదులు వద్దు. వాంతులతో మందు ఆగితే క్లినిక్‌కు కాల్ చేయండి.",
        },
      },
      {
        q: {
          en: "Emergency — when to go now?",
          te: "అత్యవసరం — ఎప్పుడు?",
        },
        a: {
          en: "Prolonged seizure, cluster seizures, injury during seizure, or not recovering as usual — emergency care.",
          te: "పొడవైన మూర్ఛ, వరుస మూర్ఛలు, గాయం, సాధారణంగా కోలుకోకపోవడం — ఎమర్జెన్సీ.",
        },
      },
    ],
  },
  {
    id: "thumb-pica",
    kind: "common-problem",
    group: "behaviour-dev",
    emoji: "👍",
    title: {
      en: "Thumb-sucking, tantrums & pica",
      te: "బొటనవేలు పీల్చడం, టాన్ట్రమ్స్ & పైకా",
    },
    intro: {
      en: "Habits and big feelings are part of early childhood. Gentle limits work better than shame.",
      te: "అలవాట్లు, పెద్ద భావాలు చిన్నవయసులో సహజం. సిగ్గుపెట్టడం కంటే మృదువైన పరిమితులు మేలు.",
    },
    items: [
      {
        q: {
          en: "When is thumb-sucking a problem?",
          te: "బొటనవేలు పీల్చడం ఎప్పుడు సమస్య?",
        },
        a: {
          en: "Common under 4 years. If it continues heavily after permanent teeth start, ask about dental effects. Avoid bitter nail paints without advice; offer comfort and distraction.",
          te: "4 ఏళ్ల లోపు సాధారణం. శాశ్వత పళ్లు వచ్చాక ఎక్కువగా కొనసాగితే దంత ప్రభావం అడగండి. సలహా లేకుండా చేదు పెయింట్లు వద్దు; ఓదార్పు, దృష్టి మళ్లింపు.",
        },
      },
      {
        q: {
          en: "Tantrums — what helps?",
          te: "టాన్ట్రమ్స్ — ఏమి సహాయం?",
        },
        a: {
          en: "Stay calm, keep child safe, do not give in to unsafe demands. Short clear limits after the storm. Hungry/tired children tantrum more — routines help.",
          te: "ప్రశాంతంగా, భద్రంగా ఉంచండి; ప్రమాదకర డిమాండ్లకు లొంగవద్దు. తర్వాత చిన్న స్పష్ట పరిమితులు. ఆకలి/అలసట ఉంటే ఎక్కువ — రొటీన్ సహాయం.",
        },
      },
      {
        q: {
          en: "What is pica?",
          te: "పైకా అంటే ఏమిటి?",
        },
        a: {
          en: "Eating non-food (mud, chalk, ice, paint). Needs medical review for anaemia, worms, and safety — not only scolding.",
          te: "ఆహారం కానివి తినడం (మట్టి, సున్నం, మంచు, పెయింట్). రక్తహీనత, పురుగులు, భద్రతకు వైద్యం — కేవలం తిట్టడం కాదు.",
        },
      },
    ],
  },
  {
    id: "bedwetting",
    kind: "common-problem",
    group: "behaviour-dev",
    emoji: "🛏️",
    title: { en: "Bedwetting (enuresis)", te: "రాత్రి మూత్రం (ఎన్యూరిసిస్)" },
    intro: {
      en: "Night wetting is common until school age. Shame makes it worse. Rule out daytime symptoms and constipation.",
      te: "స్కూల్ వయసు వరకు రాత్రి మూత్రం సాధారణం. సిగ్గు మరింత చెడు చేస్తుంది. పగటి లక్షణాలు, మలబద్ధకం చూడండి.",
    },
    items: [
      {
        q: {
          en: "When is bedwetting still “normal”?",
          te: "రాత్రి మూత్రం ఎప్పటి వరకు “సాధారణం”?",
        },
        a: {
          en: "Many children wet at night until 5–7 years, especially with family history. Daytime dryness usually comes first.",
          te: "కుటుంబ చరిత్ర ఉంటే 5–7 ఏళ్ల వరకు చాలా మంది రాత్రి తడుస్తారు. పగటి పొడితనం ముందు వస్తుంది.",
        },
      },
      {
        q: {
          en: "What can parents try?",
          te: "తల్లిదండ్రులు ఏమి ప్రయత్నించవచ్చు?",
        },
        a: {
          en: "Toilet before bed, ease evening fluids a little (not extreme), treat constipation, waterproof sheet, calm mornings. Avoid punishment.",
          te: "నిద్రకు ముందు టాయిలెట్, సాయంత్రం ద్రవాలు కొంచెం తగ్గించండి (అతి కాదు), మలబద్ధకం చికిత్స, వాటర్‌ప్రూఫ్ షీట్. శిక్ష వద్దు.",
        },
      },
      {
        q: {
          en: "When to see the doctor?",
          te: "ఎప్పుడు డాక్టర్?",
        },
        a: {
          en: "Daytime wetting, pain on urine, excessive thirst, new wetting after being dry for months, or constipation with soiling — medical review.",
          te: "పగటి తడి, మూత్రం నొప్పి, ఎక్కువ దాహం, నెలలు పొడిగా ఉన్న తర్వాత మళ్లీ తడి, మలబద్ధకంతో కాలుష్యం — వైద్యం.",
        },
      },
    ],
  },
  {
    id: "stammering",
    kind: "common-problem",
    group: "behaviour-dev",
    emoji: "🗣️",
    title: {
      en: "Stammering / stuttering",
      te: "నత్తి / స్టటరింగ్",
    },
    intro: {
      en: "Many preschoolers have short periods of dysfluency. Pressure and teasing make speech harder.",
      te: "చాలా ప్రీస్కూల్ పిల్లల్లో కొద్ది కాలం మాట అంతరాయం ఉంటుంది. ఒత్తిడి, ఎగతాళి మాటను కష్టతరం చేస్తాయి.",
    },
    items: [
      {
        q: {
          en: "How should I respond when my child stammers?",
          te: "నత్తి వచ్చినప్పుడు ఎలా స్పందించాలి?",
        },
        a: {
          en: "Listen patiently, keep eye contact, do not finish sentences, slow your own speech slightly, and reduce rapid questioning.",
          te: "ఓపికగా వినండి, కళ్లు చూడండి, వాక్యాలు పూర్తి చేయవద్దు, మీ మాట కొంచెం నెమ్మది, వేగపు ప్రశ్నలు తగ్గించండి.",
        },
      },
      {
        q: {
          en: "When to seek speech therapy?",
          te: "ఎప్పుడు స్పీచ్ థెరపీ?",
        },
        a: {
          en: "Stammering lasts over 6 months, worsens, child avoids talking, or there is family history of persistent stutter — ask for assessment.",
          te: "6 నెలలకు మించి, పెరుగుతుంటే, మాట్లాడటం నివారిస్తే, లేదా కుటుంబంలో నిలకడైన నత్తి — అంచనా అడగండి.",
        },
      },
      {
        q: {
          en: "Do home “exercises” from social media help?",
          te: "సోషల్ మీడియా “ఎక్సర్సైజ్‌లు” పని చేస్తాయా?",
        },
        a: {
          en: "Unverified drills can increase anxiety. Follow a qualified speech-language pathologist’s plan.",
          te: "నమ్మదగని డ్రిల్స్ ఆందోళన పెంచవచ్చు. అర్హులైన స్పీచ్ థెరపిస్ట్ ప్లాన్ పాటించండి.",
        },
      },
    ],
  },
  {
    id: "puberty-timing",
    kind: "common-problem",
    group: "behaviour-dev",
    emoji: "🌱",
    title: {
      en: "Early or late puberty",
      te: "ముందస్తు లేదా ఆలస్య యవ్వనం",
    },
    intro: {
      en: "Puberty timing varies. Very early or very late changes need a growth and hormone review.",
      te: "యవ్వన సమయం వ్యక్తిగతం. చాలా ముందు లేదా చాలా ఆలస్య మార్పులకు వృద్ధి, హార్మోన్ రివ్యూ అవసరం.",
    },
    items: [
      {
        q: {
          en: "What is early puberty concern?",
          te: "ముందస్తు యవ్వనం అనుమానం ఎప్పుడు?",
        },
        a: {
          en: "Breast development before ~8 years in girls, testicular enlargement before ~9 in boys, or rapid height with early pubic hair — ask your paediatrician.",
          te: "అమ్మాయిల్లో ~8కు ముందు రొమ్ము వికాసం, అబ్బాయిల్లో ~9కు ముందు వృషణ వృద్ధి, లేదా ముందస్తు రోమాలతో వేగపు ఎత్తు — డాక్టర్‌ను అడగండి.",
        },
      },
      {
        q: {
          en: "What about delayed puberty?",
          te: "ఆలస్య యవ్వనం గురించి?",
        },
        a: {
          en: "No breast development by ~13 in girls or no testicular enlargement by ~14 in boys — review growth charts and possible causes.",
          te: "అమ్మాయిల్లో ~13కల్లా రొమ్ము లేకపోవడం, అబ్బాయిల్లో ~14కల్లా వృషణ వృద్ధి లేకపోవడం — వృద్ధి చార్ట్, కారణాలు చూడండి.",
        },
      },
      {
        q: {
          en: "Should I use “height medicines” from ads?",
          te: "యాడ్‌ల “ఎత్తు మందులు” వాడాలా?",
        },
        a: {
          en: "No. Unregulated supplements can harm. Growth hormone is only for specific medical diagnoses under specialist care.",
          te: "వద్దు. నియంత్రణ లేని సప్లిమెంట్లు హాని చేయవచ్చు. గ్రోత్ హార్మోన్ కేవలం నిర్దిష్ట రోగ నిర్ధారణలకు నిపుణుల వద్దే.",
        },
      },
    ],
  },
  {
    id: "recurrent-uti",
    kind: "common-problem",
    group: "safety",
    emoji: "🚻",
    title: {
      en: "Recurrent urinary tract infection",
      te: "మళ్లీ మళ్లీ మూత్ర నాళ ఇన్ఫెక్షన్",
    },
    intro: {
      en: "Burning urine, frequency, fever with urine symptoms, or wetting again needs proper urine testing — not leftover antibiotics.",
      te: "మూత్రం కాలడం, తరచు మూత్రం, జ్వరంతో మూత్ర లక్షణాలు, మళ్లీ తడి — సరైన మూత్ర పరీక్ష అవసరం; మిగిలిన యాంటీబయాటిక్ వద్దు.",
    },
    items: [
      {
        q: {
          en: "Prevention tips?",
          te: "నివారణ చిట్కాలు?",
        },
        a: {
          en: "Good hydration, do not hold urine long, wipe front to back in girls, treat constipation, cotton underwear, avoid bubble baths if irritating.",
          te: "నీరు బాగా, మూత్రం ఎక్కువసేపు ఆపవద్దు, అమ్మాయిల్లో ముందు నుంచి వెనుకకు తుడవడం, మలబద్ధకం చికిత్స, కాటన్ అండర్‌వేర్.",
        },
      },
      {
        q: {
          en: "Why do some children get repeat UTIs?",
          te: "కొందరికి మళ్లీ మళ్లీ UTI ఎందుకు?",
        },
        a: {
          en: "Constipation, poor emptying, anatomical issues, or bladder habits. Imaging may be needed after confirmed infections — your doctor decides.",
          te: "మలబద్ధకం, సరిగా ఖాళీ కాకపోవడం, నిర్మాణ సమస్యలు, మూత్రాశయ అలవాట్లు. నిర్ధారిత ఇన్ఫెక్షన్ల తర్వాత స్కాన్ కావచ్చు — డాక్టర్ నిర్ణయం.",
        },
      },
      {
        q: {
          en: "Urgent signs?",
          te: "అత్యవసర సైన్లు?",
        },
        a: {
          en: "High fever with back/flank pain, vomiting, baby under 3 months with fever, or looking very unwell — seek care same day.",
          te: "వీపు నొప్పితో ఎక్కువ జ్వరం, వాంతులు, 3 నెలల లోపు జ్వరం, చాలా అస్వస్థత — అదే రోజు వైద్యం.",
        },
      },
    ],
  },
  {
    id: "dog-bite",
    kind: "common-problem",
    group: "safety",
    emoji: "🐕",
    title: {
      en: "Dog bite & rabies worry",
      te: "కుక్క కాటు & రేబీస్ ఆందోళన",
    },
    intro: {
      en: "Wash the wound immediately and get medical care for vaccine advice. Do not wait for symptoms of rabies.",
      te: "గాయాన్ని వెంటనే కడగండి; టీకా సలహాకు వైద్యం తీసుకోండి. రేబీస్ లక్షణాల కోసం ఆగవద్దు.",
    },
    items: [
      {
        q: {
          en: "First aid for a bite or scratch?",
          te: "కాటు / గాయానికి ప్రథమ చికిత్స?",
        },
        a: {
          en: "Wash with soap and running water for 15 minutes, apply antiseptic if available, do not bandage tightly over dirt, seek clinic for wound and rabies/tetanus advice.",
          te: "సబ్బు + నీటితో 15 నిమిషాలు కడగండి, అంటిసెప్టిక్, మట్టిపై గట్టి బ్యాండేజ్ వద్దు; గాయం, రేబీస్/టెటనస్ సలహాకు క్లినిక్.",
        },
      },
      {
        q: {
          en: "Do all bites need rabies vaccine?",
          te: "అన్ని కాట్లకు రేబీస్ టీకా?",
        },
        a: {
          en: "Depends on animal, wound severity, and vaccination status of the animal/child. A doctor classifies exposure — do not self-decide from internet charts alone.",
          te: "జంతువు, గాయం తీవ్రత, టీకా స్థితి మీద ఆధారపడి. డాక్టర్ ఎక్స్‌పోజర్ వర్గీకరిస్తారు — కేవలం ఇంటర్నెట్ చార్ట్‌తో నిర్ణయం వద్దు.",
        },
      },
      {
        q: {
          en: "What about pet dogs that are vaccinated?",
          te: "టీకాలు వేసిన పెంపుడు కుక్కల గురించి?",
        },
        a: {
          en: "Still wash and ask a clinician. Observation of the animal and booster advice may apply. Keep your child’s tetanus shots up to date.",
          te: "ఇంకా కడిగి డాక్టర్‌ను అడగండి. జంతువు పరిశీలన, బూస్టర్ సలహా రావచ్చు. పిల్ల టెటనస్ షాట్లు అప్‌డేట్ ఉంచండి.",
        },
      },
    ],
  },
  {
    id: "accident-prevention",
    kind: "common-problem",
    group: "safety",
    emoji: "🛡️",
    title: {
      en: "Accident & injury prevention",
      te: "ప్రమాదాలు & గాయాల నివారణ",
    },
    intro: {
      en: "Most childhood injuries happen at home or on the road. Simple locks and habits prevent emergencies.",
      te: "చాలా గాయాలు ఇంట్లో లేదా రోడ్డుపై. సాధారణ తాళాలు, అలవాట్లు అత్యవసరాలను నివారిస్తాయి.",
    },
    items: [
      {
        q: {
          en: "Top home hazards?",
          te: "ఇంటి ప్రధాన ప్రమాదాలు?",
        },
        a: {
          en: "Hot liquids, open buckets (drowning), medicines/cleaners at child height, loose wires, balcony gaps, and plastic bags. Keep a clear floor for toddlers.",
          te: "వేడి ద్రవాలు, తెరిచిన బకెట్లు (మునగడం), పిల్ల ఎత్తులో మందులు/క్లీనర్లు, వదులు వైర్లు, బాల్కనీ ఖాళీలు, ప్లాస్టిక్ బ్యాగులు.",
        },
      },
      {
        q: {
          en: "Road safety with children?",
          te: "పిల్లలతో రోడ్డు భద్రత?",
        },
        a: {
          en: "Age-appropriate car restraint / helmet on two-wheelers as law and safety allow, hold hands near traffic, reflective clothing at dusk.",
          te: "వయసుకు తగిన కార్ సీట్ / టూవీలర్‌పై హెల్మెట్ (నియమాల ప్రకారం), ట్రాఫిక్ దగ్గర చేయి పట్టుకోండి, సాయంత్రం రిఫ్లెక్టివ్ దుస్తులు.",
        },
      },
      {
        q: {
          en: "Burns and falls — quick response?",
          te: "కాలిన గాయాలు, పడిపోవడం — త్వర స్పందన?",
        },
        a: {
          en: "Cool burns under running water 20 minutes; do not apply toothpaste/oil. For head injury with vomiting or drowsiness — urgent review.",
          te: "కాలిన చోట నీటితో 20 నిమిషాలు చల్లబరచండి; పేస్ట్/నూనె వద్దు. తల గాయంతో వాంతులు లేదా మత్తు — అత్యవసరం.",
        },
      },
    ],
  },
  {
    id: "dental-care",
    kind: "common-problem",
    group: "safety",
    emoji: "😁",
    title: {
      en: "Dental care, diapers & clothing",
      te: "పళ్ల సంరక్షణ, డైపర్లు & దుస్తులు",
    },
    intro: {
      en: "Tooth decay starts early with night bottles and sugary snacks. Skin folds need dryness and breathable clothes.",
      te: "రాత్రి బాటిల్, తీపి స్నాక్స్‌తో పళ్లు క్షయం ముందే మొదలవుతుంది. చర్మ మడతలకు పొడితనం, ఊపిరి పీల్చే దుస్తులు.",
    },
    items: [
      {
        q: {
          en: "When to start brushing?",
          te: "బ్రషింగ్ ఎప్పుడు మొదలు?",
        },
        a: {
          en: "From the first tooth — smear of fluoride toothpaste as age-advised, twice daily. No bottle of milk/juice in bed. First dental visit by age 1 is useful.",
          te: "మొదటి పన్ను నుంచి — వయసు ప్రకారం ఫ్లోరైడ్ పేస్ట్ పలుచని పొర, రోజు రెండుసార్లు. పడకలో పాలు/జ్యూస్ బాటిల్ వద్దు. 1 ఏడాదికల్లా దంత పరీక్ష మంచిది.",
        },
      },
      {
        q: {
          en: "Diaper rash tips?",
          te: "డైపర్ రాష్ చిట్కాలు?",
        },
        a: {
          en: "Change often, gentle clean, air time, barrier cream. Persistent yeast-like rash needs medical cream — not only powder.",
          te: "తరచు మార్చండి, మృదువుగా శుభ్రం, గాలి సమయం, బ్యారియర్ క్రీమ్. యీస్ట్ లాంటి నిలకడ రాష్‌కు వైద్య క్రీమ్ — పౌడర్ మాత్రమే కాదు.",
        },
      },
      {
        q: {
          en: "Clothing in heat?",
          te: "వేడిలో దుస్తులు?",
        },
        a: {
          en: "Loose cotton, avoid overdressing babies, watch for heat rash in neck folds. Hats in strong sun; safe shade for infants.",
          te: "వదులు కాటన్, పాపలను ఎక్కువ కప్పవద్దు, మెడ మడతల్లో హీట్ రాష్ చూడండి. ఎండలో టోపీ; శిశువులకు నీడ.",
        },
      },
    ],
  },
  {
    id: "traveling",
    kind: "common-problem",
    group: "safety",
    emoji: "🧳",
    title: {
      en: "Travelling with children",
      te: "పిల్లలతో ప్రయాణం",
    },
    intro: {
      en: "Plan medicines, snacks, sleep, and motion-sickness. Keep vaccine records handy for longer trips.",
      te: "మందులు, స్నాక్స్, నిద్ర, మోషన్ సిక్‌నెస్ ప్లాన్. పొడవు ప్రయాణాలకు టీకా రికార్డు ఉంచండి.",
    },
    items: [
      {
        q: {
          en: "What to pack in a travel kit?",
          te: "ట్రావెల్ కిట్‌లో ఏమి?",
        },
        a: {
          en: "ORS, paracetamol (dose known), thermometer, saline drops, plasters, any regular medicines, hand sanitiser, spare clothes, favourite comfort item.",
          te: "ORS, పారాసిటమాల్ (మోతాదు తెలిసి), థర్మామీటర్, సెలైన్, ప్లాస్టర్లు, రెగ్యులర్ మందులు, శానిటైజర్, మార్పు బట్టలు, ఓదార్పు వస్తువు.",
        },
      },
      {
        q: {
          en: "Car / bus tips?",
          te: "కార్ / బస్ చిట్కాలు?",
        },
        a: {
          en: "Proper restraint, stops for movement and feeds, never leave a child alone in a parked vehicle.",
          te: "సరైన సీట్ బెల్ట్/సీట్, కదలిక & పాలు కోసం ఆగడం, పార్క్ చేసిన వాహనంలో పిల్లను ఒంటరిగా వదలవద్దు.",
        },
      },
      {
        q: {
          en: "Flying with infants?",
          te: "పాపలతో విమానం?",
        },
        a: {
          en: "Feed or pacifier during take-off/landing for ear comfort if advised, carry enough formula/water as airline rules allow, discuss premature or heart/lung issues with your doctor before flying.",
          te: "టేకాఫ్/ల్యాండింగ్‌లో పాలు/పేసిఫైయర్ (సలహా ప్రకారం), ఎయిర్‌లైన్ నియమాల్లో ఫార్ములా/నీరు, ప్రీమెచ్యూర్ లేదా గుండె/ఊపిరితిత్తుల సమస్య ఉంటే ముందు డాక్టర్‌ను అడగండి.",
        },
      },
    ],
  },
  {
    id: "down-syndrome",
    kind: "common-problem",
    group: "special",
    emoji: "💙",
    title: {
      en: "Down syndrome — parent orientation",
      te: "డౌన్ సిండ్రోమ్ — తల్లిదండ్రుల ఓరియంటేషన్",
    },
    intro: {
      en: "Children with Down syndrome thrive with early therapy, health checks, and loving routines. Your paediatrician coordinates screening.",
      te: "డౌన్ సిండ్రోమ్ పిల్లలు ముందస్తు థెరపీ, ఆరోగ్య పరీక్షలు, ప్రేమగల రొటీన్‌తో వృద్ధి చెందుతారు. పీడియాట్రిషన్ స్క్రీనింగ్ సమన్వయం చేస్తారు.",
    },
    items: [
      {
        q: {
          en: "What health checks are often needed?",
          te: "ఏ ఆరోగ్య పరీక్షలు తరచూ?",
        },
        a: {
          en: "Heart evaluation, hearing, vision, thyroid, growth monitoring, and developmental support. Follow the schedule your clinic gives.",
          te: "గుండె, వినికిడి, చూపు, థైరాయిడ్, వృద్ధి, వికాస మద్దతు. క్లినిక్ షెడ్యూల్ పాటించండి.",
        },
      },
      {
        q: {
          en: "What about learning and speech?",
          te: "నేర్చుకోవడం, మాట గురించి?",
        },
        a: {
          en: "Early intervention, speech and physio/occupational therapy as advised, inclusive schooling plans. Celebrate small gains.",
          te: "ముందస్తు ఇంటర్వెన్షన్, స్పీచ్ / ఫిజియో / OT, సమ్మిళిత స్కూలింగ్. చిన్న పురోగతిని జరుపుకోండి.",
        },
      },
      {
        q: {
          en: "Where can families get support?",
          te: "కుటుంబాలకు మద్దతు ఎక్కడ?",
        },
        a: {
          en: "Ask your paediatrician for local therapy centres and parent groups. Avoid unverified “cure” products online.",
          te: "స్థానిక థెరపీ కేంద్రాలు, పేరెంట్ గ్రూపులు డాక్టర్‌ను అడగండి. ఆన్‌లైన్ “క్యూర్” ఉత్పత్తులు నమ్మవద్దు.",
        },
      },
    ],
  },
];
