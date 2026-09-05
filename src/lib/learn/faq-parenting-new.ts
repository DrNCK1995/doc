import type { FaqSection } from "./faq-types";

/** New parent FAQ topics (IAP-aligned). Existing sections live in faqs-core.ts */
export const NEW_PARENT_FAQ_SECTIONS: FaqSection[] = [
  {
    id: "sleep-activity",
    kind: "faq",
    group: "sleep-screens",
    emoji: "🏃",
    title: {
      en: "Sleep & physical activity",
      te: "నిద్ర & శారీరక క్రియాశీలత",
    },
    intro: {
      en: "Enough sleep and daily outdoor play protect mood, growth, and learning — screens cannot replace either.",
      te: "తగిన నిద్ర, రోజువారీ బయట ఆట — మూడ్, వృద్ధి, నేర్చుకోవడం కాపాడతాయి; స్క్రీన్ వీటికి బదులు కాదు.",
    },
    items: [
      {
        q: {
          en: "Rough sleep needs by age?",
          te: "వయసు ప్రకారం నిద్ర అవసరం?",
        },
        a: {
          en: "Infants sleep many short stretches; toddlers often 11–14 hours including naps; school-age about 9–12 hours. Quality and routine matter as much as the number.",
          te: "శిశువులు చిన్న విరామాల్లో ఎక్కువ; టాడ్లర్లు నాప్‌తో 11–14 గంటలు; స్కూల్ వయసు సుమారు 9–12. సంఖ్యతో పాటు నాణ్యత, రొటీన్ ముఖ్యం.",
        },
      },
      {
        q: {
          en: "How much active play?",
          te: "ఎంత క్రియాశీల ఆట?",
        },
        a: {
          en: "Aim for outdoor play most days — running, cycling, free play. Under-fives need lots of movement across the day, not only a single sports class.",
          te: "చాలా రోజులు బయట ఆట — పరుగు, సైకిల్, స్వేచ్ఛా ఆట. 5 ఏళ్ల లోపు రోజంతా కదలిక — ఒక్క స్పోర్ట్స్ క్లాస్ చాలదు.",
        },
      },
      {
        q: {
          en: "Bedtime screens?",
          te: "నిద్రకు ముందు స్క్రీన్?",
        },
        a: {
          en: "Avoid screens at least 1 hour before bed. Dim lights, story, and a fixed bedtime help more than late videos.",
          te: "నిద్రకు కనీసం 1 గంట ముందు స్క్రీన్ వద్దు. మందగించిన వెలుతురు, కథ, స్థిర నిద్ర సమయం — ఆలస్య వీడియోల కంటే మేలు.",
        },
      },
    ],
  },
  {
    id: "screen-time-faq",
    kind: "faq",
    group: "sleep-screens",
    emoji: "📱",
    title: { en: "Screen time — FAQs", te: "స్క్రీన్ టైమ్ — ప్రశ్నోత్తరాలు" },
    intro: {
      en: "Under 2 years, avoid screens except video calls with family. For older children, co-view and set clear limits.",
      te: "2 ఏళ్ల లోపు కుటుంబ వీడియో కాల్ తప్ప స్క్రీన్ వద్దు. పెద్ద పిల్లలకు కలిసి చూడటం, స్పష్ట పరిమితులు.",
    },
    items: [
      {
        q: {
          en: "Is YouTube ‘kids’ content okay daily?",
          te: "రోజూ YouTube కిడ్స్ సరేనా?",
        },
        a: {
          en: "Background TV and autoplay make limits hard. Prefer short chosen programmes, no device in the bedroom, and more real play than passive watching.",
          te: "నేపథ్య టీవీ, ఆటోప్లే పరిమితులు కష్టం. చిన్న ఎంచుకున్న కార్యక్రమాలు, పడక గదిలో డివైస్ వద్దు, చూడటం కంటే నిజ ఆట ఎక్కువ.",
        },
      },
      {
        q: {
          en: "School homework on tablets?",
          te: "టాబ్లెట్‌పై స్కూల్ హోమ్‌వర్క్?",
        },
        a: {
          en: "School-required use is different from entertainment. Keep entertainment time separate and limited; stretch eyes every 20–30 minutes.",
          te: "స్కూల్ అవసరం వేరు, వినోదం వేరు. వినోద సమయం వేరుగా పరిమితం; 20–30 నిమిషాలకు కళ్లు విశ్రాంతి.",
        },
      },
      {
        q: {
          en: "Signs of too much screen time?",
          te: "ఎక్కువ స్క్రీన్ సైన్లు?",
        },
        a: {
          en: "Sleep fights, irritability when device is removed, less outdoor play, mealtime screens, falling school interest — reset rules as a family.",
          te: "నిద్ర వివాదాలు, డివైస్ తీసేస్తే చిరాకు, బయట ఆట తగ్గడం, భోజనంలో స్క్రీన్, స్కూల్ ఆసక్తి తగ్గడం — కుటుంబంగా నియమాలు రీసెట్.",
        },
      },
    ],
  },
  {
    id: "vaccine-aefi",
    kind: "faq",
    group: "vaccines",
    emoji: "🩹",
    title: {
      en: "Vaccine side effects (AEFI)",
      te: "టీకా దుష్ప్రభావాలు (AEFI)",
    },
    intro: {
      en: "Mild fever and soreness are expected. Serious reactions are rare — know what needs urgent care.",
      te: "తేలికపాటి జ్వరం, నొప్పి సాధారణం. తీవ్ర ప్రతిచర్యలు అరుదు — అత్యవసరం ఏమిటో తెలుసుకోండి.",
    },
    items: [
      {
        q: {
          en: "What is normal after a shot?",
          te: "షాట్ తర్వాత సాధారణం ఏమిటి?",
        },
        a: {
          en: "Low fever, fussiness, and a sore arm/thigh for 1–2 days. Offer comfort, fluids, and weight-based paracetamol if miserable.",
          te: "తేలికపాటి జ్వరం, అలజడి, చేయి/తొడ నొప్పి 1–2 రోజులు. ఓదార్పు, ద్రవాలు, అసౌకర్యంగా ఉంటే బరువు ప్రకారం పారాసిటమాల్.",
        },
      },
      {
        q: {
          en: "What is NOT normal?",
          te: "ఏది సాధారణం కాదు?",
        },
        a: {
          en: "Difficulty breathing, swelling of face/lips, continuous crying over 3 hours, seizures, or very high fever — seek urgent care and report to the clinic.",
          te: "ఊపిరి కష్టం, ముఖం/పెదవులు ఉబ్బు, 3 గంటలకు మించి నిరంతర ఏడుపు, మూర్ఛ, చాలా ఎక్కువ జ్వరం — అత్యవసరం, క్లినిక్‌కు చెప్పండి.",
        },
      },
      {
        q: {
          en: "Should I skip the next dose after mild fever?",
          te: "తేలికపాటి జ్వరం తర్వాత తదుపరి మోతాదు వదలాలా?",
        },
        a: {
          en: "Usually no — mild reactions are not a reason to stop the schedule. Discuss true allergies with your paediatrician.",
          te: "సాధారణంగా వద్దు — తేలిక ప్రతిచర్యలు షెడ్యూల్ ఆపడానికి కారణం కావు. నిజమైన అలెర్జీలు డాక్టర్‌తో చర్చించండి.",
        },
      },
    ],
  },
  {
    id: "complementary-feeding-faq",
    kind: "faq",
    group: "feeding",
    emoji: "🥣",
    title: {
      en: "Complementary feeding (6–12 months)",
      te: "అనుబంధ ఆహారం (6–12 నెలలు)",
    },
    intro: {
      en: "From about 6 months, offer soft family foods while continuing milk feeds. Texture and iron-rich foods matter.",
      te: "సుమారు 6 నెలల నుంచి మెత్తని కుటుంబ ఆహారం — పాలు కొనసాగించండి. టెక్స్చర్, ఇనుము ఆహారం ముఖ్యం.",
    },
    items: [
      {
        q: {
          en: "How often should I offer solids?",
          te: "ఘన ఆహారం ఎన్నిసార్లు?",
        },
        a: {
          en: "Start 2–3 times a day and build up; by late infancy many children take 3–4 meals plus milk. Responsive feeding — never force.",
          te: "రోజుకు 2–3 సార్లు మొదలుపెట్టి పెంచండి; శిశువు చివరికి 3–4 భోజనాలు + పాలు. బలవంతం వద్దు.",
        },
      },
      {
        q: {
          en: "When can cow’s milk as a drink start?",
          te: "ఆవు పాలు పానీయంగా ఎప్పుడు?",
        },
        a: {
          en: "Usually after 1 year as a drink. Before that, milk feeds are breast milk/formula; dairy foods like curd/cheese can be introduced earlier as advised.",
          te: "పానీయంగా సాధారణంగా 1 సంవత్సరం తర్వాత. అంతకు ముందు తల్లిపాలు/ఫార్ములా; పెరుగు/చీజ్ సలహా ప్రకారం ముందు రావచ్చు.",
        },
      },
      {
        q: {
          en: "Water and honey?",
          te: "నీరు, తేనె?",
        },
        a: {
          en: "Small sips of water with solids after 6 months. No honey before 1 year (botulism risk).",
          te: "6 నెలల తర్వాత ఘన ఆహారంతో కొద్ది నీరు. 1 సంవత్సరానికి ముందు తేనె వద్దు (బోటులిజం ప్రమాదం).",
        },
      },
    ],
  },
  {
    id: "vitamins-supplements",
    kind: "faq",
    group: "feeding",
    emoji: "💊",
    title: {
      en: "Vitamins & supplements",
      te: "విటమిన్లు & సప్లిమెంట్లు",
    },
    intro: {
      en: "Food first. Vitamin D and iron are the supplements most often discussed — not random ‘tonics’ from ads.",
      te: "ముందు ఆహారం. విటమిన్ D, ఇనుము తరచూ చర్చ — యాడ్‌ల యాదృచ్ఛిక ‘టానిక్‌లు’ కావు.",
    },
    items: [
      {
        q: {
          en: "Does every child need a multivitamin?",
          te: "ప్రతి పిల్లకు మల్టీవిటమిన్?",
        },
        a: {
          en: "No. A balanced diet usually covers needs. Your doctor may advise vitamin D, iron, or others based on age, diet, and blood tests.",
          te: "లేదు. సమతుల్య ఆహారం చాలా ఉంటుంది. వయసు, ఆహారం, రక్త పరీక్షల ఆధారంగా విటమిన్ D, ఇనుము సలహా ఇవ్వవచ్చు.",
        },
      },
      {
        q: {
          en: "Are expensive ‘growth’ powders useful?",
          te: "ఖరీదైన ‘గ్రోత్’ పౌడర్లు ఉపయోగమా?",
        },
        a: {
          en: "Often sugar-heavy marketing. Home foods (dal, egg, milk, ragi, vegetables) are better value. Plot growth on charts instead of chasing powders.",
          te: "తరచూ చక్కెర ఎక్కువ మార్కెటింగ్. ఇంటి ఆహారం మేలు. పౌడర్ల కంటే వృద్ధి చార్ట్ చూడండి.",
        },
      },
      {
        q: {
          en: "Can supplements be harmful?",
          te: "సప్లిమెంట్లు హాని చేయవచ్చా?",
        },
        a: {
          en: "Yes — excess fat-soluble vitamins or iron without need can harm. Use prescribed doses only.",
          te: "అవును — అవసరం లేకుండా ఎక్కువ విటమిన్లు/ఇనుము హాని. ప్రిస్క్రైబ్ మోతాదే.",
        },
      },
    ],
  },
  {
    id: "obesity",
    kind: "faq",
    group: "feeding",
    emoji: "⚖️",
    title: {
      en: "Overweight & obesity",
      te: "ఎక్కువ బరువు & ఊబకాయం",
    },
    intro: {
      en: "Focus on habits for the whole family — not crash diets or shaming the child.",
      te: "కుటుంబ అలవాట్లపై దృష్టి — క్రాష్ డైట్ లేదా పిల్లను సిగ్గుపెట్టడం కాదు.",
    },
    items: [
      {
        q: {
          en: "When is weight a concern?",
          te: "బరువు ఎప్పుడు ఆందోళన?",
        },
        a: {
          en: "When BMI or weight-for-height is high on growth charts, or weight rises very fast. Your paediatrician interprets charts — not a single weighing scale moment.",
          te: "వృద్ధి చార్ట్‌లో BMI / ఎత్తుకు బరువు ఎక్కువ, లేదా బరువు చాలా వేగంగా పెరిగితే. చార్ట్ వివరణ డాక్టర్ — ఒక్కసారి తూకం కాదు.",
        },
      },
      {
        q: {
          en: "What changes help most?",
          te: "ఏ మార్పులు ఎక్కువ సహాయం?",
        },
        a: {
          en: "Cut sugary drinks and daily junk, fix meal times, more outdoor play, sleep routine, and parents modelling the same plate.",
          te: "చక్కెర డ్రింక్స్, రోజువారీ జంక్ తగ్గించండి; భోజన సమయాలు, బయట ఆట, నిద్ర రొటీన్; పెద్దలు అదే ప్లేట్.",
        },
      },
      {
        q: {
          en: "Should we put the child on a strict diet?",
          te: "కఠిన డైట్ పెట్టాలా?",
        },
        a: {
          en: "No extreme restriction that stunts growth. Aim for healthier swaps and activity under medical guidance.",
          te: "వృద్ధిని దెబ్బతీసే అతి నియంత్రణ వద్దు. వైద్య మార్గదర్శకంతో ఆరోగ్యకర మార్పులు, కదలిక.",
        },
      },
    ],
  },
  {
    id: "developmental-delay",
    kind: "faq",
    group: "behaviour-dev",
    emoji: "🧩",
    title: {
      en: "When to suspect developmental delay",
      te: "వికాస ఆలస్యం ఎప్పుడు అనుమానించాలి",
    },
    intro: {
      en: "Milestones are ranges, not exact days. Persistent lag or loss of skills needs early assessment — earlier help is better.",
      te: "మైలురాళ్లు పరిధులు — ఖచ్చిత రోజులు కావు. నిలకడ ఆలస్యం లేదా నైపుణ్యాలు పోవడం — ముందస్తు అంచనా మేలు.",
    },
    items: [
      {
        q: {
          en: "Examples of red flags?",
          te: "హెచ్చరిక ఉదాహరణలు?",
        },
        a: {
          en: "No social smile by 3 months, not sitting by 9 months, no meaningful words by 16–18 months, not walking by 18 months, or any loss of skills — discuss promptly.",
          te: "3 నెలలకు సామాజిక నవ్వు లేదు, 9కి కూర్చోలేదు, 16–18కి అర్థవంత మాటలు లేవు, 18కి నడవడం లేదు, నైపుణ్యాలు పోవడం — త్వరగా చర్చించండి.",
        },
      },
      {
        q: {
          en: "Is comparing with cousins useful?",
          te: "బంధువులతో పోల్చడం ఉపయోగమా?",
        },
        a: {
          en: "Roughly yes for concern, but charts and a clinician’s exam are better than WhatsApp advice.",
          te: "ఆందోళనకు స్థూలంగా అవును — కానీ WhatsApp సలహా కంటే చార్ట్, డాక్టర్ పరీక్ష మేలు.",
        },
      },
      {
        q: {
          en: "What should parents do while waiting?",
          te: "వేచి ఉండగా ఏమి చేయాలి?",
        },
        a: {
          en: "Talk, play face-to-face, read aloud, limit screens, keep hearing/vision checks up to date. Use this site’s Grow Right / screening tools as education, not a diagnosis.",
          te: "ముఖాముఖి ఆట, బిగ్గరగా చదవడం, స్క్రీన్ తగ్గించండి, వినికిడి/చూపు పరీక్షలు. Grow Right / స్క్రీనింగ్ విద్యకు — రోగ నిర్ధారణ కాదు.",
        },
      },
    ],
  },
  {
    id: "bullying",
    kind: "faq",
    group: "school-teens",
    emoji: "🛡️",
    title: {
      en: "Bullying — prepare & respond",
      te: "బుల్లింగ్ — సిద్ధం & స్పందన",
    },
    intro: {
      en: "Bullying is repeated hurtful behaviour. Listen first; blame the behaviour, not the child’s courage.",
      te: "బుల్లింగ్ అంటే మళ్లీ మళ్లీ హానికర ప్రవర్తన. ముందు వినండి; ధైర్యాన్ని కాదు — ప్రవర్తనను నిందించండి.",
    },
    items: [
      {
        q: {
          en: "Warning signs at home?",
          te: "ఇంట్లో హెచ్చరిక సైన్లు?",
        },
        a: {
          en: "School refusal, tummy aches on school days, sleep change, lost things, unexplained injuries, or sudden social withdrawal.",
          te: "స్కూల్ నిరాకరణ, స్కూల్ రోజుల కడుపు నొప్పి, నిద్ర మార్పు, వస్తువులు పోవడం, వివరించలేని గాయాలు, సామాజిక ఉపసంహరణ.",
        },
      },
      {
        q: {
          en: "What should I tell my child?",
          te: "పిల్లకు ఏమి చెప్పాలి?",
        },
        a: {
          en: "It is not their fault, they can tell a trusted adult, stay with friends, and practise calm assertive words. Physical fighting is not the first plan.",
          te: "వారి తప్పు కాదు; నమ్మకమైన పెద్దవారికి చెప్పవచ్చు; స్నేహితులతో ఉండండి; ప్రశాంత ధైర్యపు మాటలు. ముందు పంజా కాదు.",
        },
      },
      {
        q: {
          en: "Should I confront the other parent myself?",
          te: "ఇతర తల్లిదండ్రులను నేనే ఎదుర్కోవాలా?",
        },
        a: {
          en: "Usually work through school/teacher first. Document incidents. Seek help if safety is at risk.",
          te: "సాధారణంగా ముందు స్కూల్/టీచర్ ద్వారా. సంఘటనలు రాయండి. భద్రత ప్రమాదంలో ఉంటే సహాయం.",
        },
      },
    ],
  },
  {
    id: "child-safety-abuse",
    kind: "faq",
    group: "school-teens",
    emoji: "🔒",
    title: {
      en: "Child safety & abuse awareness",
      te: "పిల్లల భద్రత & దుర్వినియోగ అవగాహన",
    },
    intro: {
      en: "Gentle, age-appropriate body safety talks protect children. Believe disclosures and seek professional help.",
      te: "వయసుకు తగిన శరీర భద్రత చర్చ పిల్లలను కాపాడుతుంది. చెప్పినది నమ్మి నిపుణుల సహాయం తీసుకోండి.",
    },
    items: [
      {
        q: {
          en: "What body-safety rules can I teach?",
          te: "ఏ శరీర-భద్రత నియమాలు నేర్పాలి?",
        },
        a: {
          en: "Private parts have names; no one should touch them except for health/hygiene with a trusted adult; secrets that feel bad can be told; they can say no to unwanted hugs.",
          te: "గుప్త అవయవాలకు పేర్లు; ఆరోగ్య/శుభ్రత కోసం నమ్మకమైన పెద్దవారు తప్ప తాకరాదు; చెడు అనిపించే రహస్యాలు చెప్పవచ్చు; ఇష్టంలేని కౌగిలికి నో చెప్పవచ్చు.",
        },
      },
      {
        q: {
          en: "Signs that need urgent attention?",
          te: "అత్యవసర దృష్టి సైన్లు?",
        },
        a: {
          en: "Injury stories that do not match, fear of a specific person, sexualised behaviour unusual for age, sudden withdrawal, or a clear disclosure — seek medical and child-protection guidance.",
          te: "సరిపోని గాయ కథనాలు, ఒక వ్యక్తి పట్ల భయం, వయసుకు సరిపోని లైంగిక ప్రవర్తన, ఉపసంహరణ, స్పష్ట చెప్పడం — వైద్యం, చైల్డ్ ప్రొటెక్షన్ మార్గదర్శకం.",
        },
      },
      {
        q: {
          en: "Online safety?",
          te: "ఆన్‌లైన్ భద్రత?",
        },
        a: {
          en: "Know apps, disable stranger chat, no sharing of photos/location, devices in family spaces. Report grooming attempts.",
          te: "యాప్‌లు తెలుసుకోండి, అపరిచిత చాట్ ఆపండి, ఫోటో/లొకేషన్ షేర్ వద్దు, డివైస్‌లు కుటుంబ స్థలాల్లో. గ్రూమింగ్ రిపోర్ట్ చేయండి.",
        },
      },
    ],
  },
  {
    id: "school-readiness",
    kind: "faq",
    group: "school-teens",
    emoji: "🎒",
    title: {
      en: "School readiness & school stress",
      te: "స్కూల్ సిద్ధత & స్కూల్ ఒత్తిడి",
    },
    intro: {
      en: "Ready children need curiosity, separation comfort, and basic self-help — not only alphabet drills.",
      te: "సిద్ధ పిల్లలకు ఆసక్తి, వేరైనా ఓపిక, స్వయం సహాయం — కేవలం అక్షర డ్రిల్స్ కావు.",
    },
    items: [
      {
        q: {
          en: "Is my child ready for preschool?",
          te: "ప్రీస్కూల్‌కు సిద్ధమా?",
        },
        a: {
          en: "Can follow simple instructions, play near others, manage toilet with help, and separate with support? Academic pressure at 3 is not the goal.",
          te: "సాధారణ సూచనలు, ఇతరుల దగ్గర ఆట, సహాయంతో టాయిలెట్, వేరైనా ఓపిక? 3 ఏళ్లకు అకడమిక్ ఒత్తిడి లక్ష్యం కాదు.",
        },
      },
      {
        q: {
          en: "Homework stress — what helps?",
          te: "హోమ్‌వర్క్ ఒత్తిడి — ఏమి సహాయం?",
        },
        a: {
          en: "Fixed short slots, snack and play first, praise effort, talk to teachers if load is unrealistic. Sleep beats late-night studying.",
          te: "చిన్న స్థిర స్లాట్లు, ముందు స్నాక్/ఆట, ప్రయత్నాన్ని మెచ్చుకోండి; భారం అసాధ్యమైతే టీచర్‌తో మాట్లాడండి. ఆలస్య చదువు కంటే నిద్ర మేలు.",
        },
      },
      {
        q: {
          en: "Coaching from nursery — needed?",
          te: "నర్సరీ నుంచి కోచింగ్ అవసరమా?",
        },
        a: {
          en: "Usually no. Play, language, and outdoor time build stronger brains than early tuition piles.",
          te: "సాధారణంగా లేదు. ఆట, భాష, బయట సమయం — ముందస్తు ట్యూషన్ కుప్పల కంటే మెరుగైన మెదడు.",
        },
      },
    ],
  },
  {
    id: "toys-play-sports",
    kind: "faq",
    group: "school-teens",
    emoji: "⚽",
    title: {
      en: "Toys, play & sports",
      te: "బొమ్మలు, ఆట & స్పోర్ట్స్",
    },
    intro: {
      en: "Open-ended play builds brains. Expensive electronic toys are optional.",
      te: "స్వేచ్ఛా ఆట మెదడును పెంచుతుంది. ఖరీదైన ఎలక్ట్రానిక్ బొమ్మలు ఐచ్ఛికం.",
    },
    items: [
      {
        q: {
          en: "What toys are worth buying?",
          te: "ఏ బొమ్మలు కొనడం విలువ?",
        },
        a: {
          en: "Blocks, balls, books, crayons, pretend-play pots — safe and age-appropriate. Avoid small choke parts for under-3s.",
          te: "బ్లాకులు, బంతులు, పుస్తకాలు, క్రేయాన్లు, నటన వంటి సామాను — సురక్షితం, వయసుకు తగినవి. 3 ఏళ్ల లోపు చిన్న భాగాలు వద్దు.",
        },
      },
      {
        q: {
          en: "Competitive sports age?",
          te: "పోటీ స్పోర్ట్స్ వయసు?",
        },
        a: {
          en: "Emphasise fun and skills first. Specialise too early increases injury and burnout risk — variety is healthier.",
          te: "ముందు ఆనందం, నైపుణ్యాలు. చాలా ముందు స్పెషలైజ్ — గాయం, అలసట ప్రమాదం; వైవిధ్యం ఆరోగ్యకరం.",
        },
      },
      {
        q: {
          en: "Screen toys vs outdoor play?",
          te: "స్క్రీన్ బొమ్మలు vs బయట ఆట?",
        },
        a: {
          en: "Outdoor and social play win for fitness and friendship. Cap electronic toy time like other screens.",
          te: "ఫిట్‌నెస్, స్నేహానికి బయట/సామాజిక ఆట మేలు. ఎలక్ట్రానిక్ బొమ్మ సమయాన్ని స్క్రీన్‌లా పరిమితం చేయండి.",
        },
      },
    ],
  },
  {
    id: "early-childhood-dev",
    kind: "faq",
    group: "behaviour-dev",
    emoji: "🍼",
    title: {
      en: "Early childhood development at home",
      te: "ఇంట్లో ప్రారంభ వయసు వికాసం",
    },
    intro: {
      en: "Talking, singing, and responsive play are the best ‘programmes’ — free and powerful.",
      te: "మాట్లాడటం, పాట, స్పందన ఆట — ఉచితం, శక్తివంతం అయిన ఉత్తమ ‘ప్రోగ్రామ్‌లు’.",
    },
    items: [
      {
        q: {
          en: "Daily habits that boost development?",
          te: "వికాసానికి రోజువారీ అలవాట్లు?",
        },
        a: {
          en: "Face-to-face talk during feeds/baths, name objects, read picture books, tummy time for babies, outdoor exploration for toddlers.",
          te: "పాలు/స్నానంలో ముఖాముఖి మాట, వస్తువుల పేర్లు, చిత్ర పుస్తకాలు, పాపలకు టమ్మీ టైమ్, టాడ్లర్లకు బయట అన్వేషణ.",
        },
      },
      {
        q: {
          en: "Do flashcards make kids smarter?",
          te: "ఫ్లాష్‌కార్డులు తెలివి పెంచుతాయా?",
        },
        a: {
          en: "Warm interaction beats drilling. Over-scheduling classes can steal play and sleep.",
          te: "వెచ్చని సంభాషణ డ్రిల్‌ను మించుతుంది. ఎక్కువ క్లాసులు ఆట, నిద్రను తీసుకుంటాయి.",
        },
      },
      {
        q: {
          en: "When to worry about hearing/vision?",
          te: "వినికిడి/చూపు ఎప్పుడు ఆందోళన?",
        },
        a: {
          en: "No response to sound, not turning to name, eye wandering after early months, or holding things very close — ask for screening.",
          te: "శబ్దానికి స్పందన లేదు, పేరుకు తిరగడం లేదు, కళ్లు తిరగడం, వస్తువులు చాలా దగ్గర పెట్టుకోవడం — స్క్రీనింగ్ అడగండి.",
        },
      },
    ],
  },
  {
    id: "adolescent-mental-health",
    kind: "faq",
    group: "school-teens",
    emoji: "💭",
    title: {
      en: "Adolescent mental health",
      te: "యువత మానసిక ఆరోగ్యం",
    },
    intro: {
      en: "Mood swings happen; lasting sadness, withdrawal, or self-harm talk needs professional help — not scolding alone.",
      te: "మూడ్ మార్పులు ఉంటాయి; నిలకడ విచారం, ఉపసంహరణ, ఆత్మహాని మాటలకు నిపుణుల సహాయం — కేవలం తిట్టడం కాదు.",
    },
    items: [
      {
        q: {
          en: "When should we seek help?",
          te: "ఎప్పుడు సహాయం?",
        },
        a: {
          en: "Drop in school, sleep/appetite change for weeks, isolation, panic, substance use, or any talk of wanting to die — contact your doctor/mental health professional urgently.",
          te: "స్కూల్ పడిపోవడం, వారాల నిద్ర/ఆకలి మార్పు, ఒంటరితనం, పానిక్, మాదక ద్రవ్యాలు, చావు మాటలు — వెంటనే డాక్టర్/మానసిక ఆరోగ్య నిపుణులు.",
        },
      },
      {
        q: {
          en: "How can parents talk better?",
          te: "తల్లిదండ్రులు ఎలా మాట్లాడాలి?",
        },
        a: {
          en: "Listen without immediate lecture, validate feelings, keep phones away during talks, and stay curious not accusatory.",
          te: "వెంటనే ఉపన్యాసం లేకుండా వినండి, భావాలను గుర్తించండి, మాట్లాడేటప్పుడు ఫోన్ దూరం, నింద కాకుండా ఆసక్తి.",
        },
      },
      {
        q: {
          en: "Is this “just teenage”?",
          te: "ఇది “కేవలం టీనేజ్”నా?",
        },
        a: {
          en: "Some change is normal; impairment in daily life is not. When unsure, ask a professional early.",
          te: "కొంత మార్పు సహజం; రోజువారీ జీవితం దెబ్బతింటే కాదు. సందేహం ఉంటే ముందుగా నిపుణులను అడగండి.",
        },
      },
    ],
  },
  {
    id: "puberty-basics",
    kind: "faq",
    group: "school-teens",
    emoji: "🌿",
    title: { en: "Puberty basics", te: "యవ్వనం — ప్రాథమికాలు" },
    intro: {
      en: "Honest, calm talks beat myths from peers and the internet.",
      te: "స్నేహితులు, ఇంటర్నెట్ కథల కంటే నిజాయితీ, ప్రశాంత చర్చ మేలు.",
    },
    items: [
      {
        q: {
          en: "What changes are normal?",
          te: "ఏ మార్పులు సాధారణం?",
        },
        a: {
          en: "Growth spurt, body hair, voice change in boys, breast development and periods in girls, mood shifts, and more sweat/acne. Timing varies widely.",
          te: "ఎత్తు పెరుగుదల, రోమాలు, అబ్బాయిల్లో గొంతు, అమ్మాయిల్లో రొమ్ము/మాసికం, మూడ్, చెమట/మొటిమలు. సమయం వ్యక్తిగతం.",
        },
      },
      {
        q: {
          en: "When to prepare girls for periods?",
          te: "అమ్మాయిలను మాసికానికి ఎప్పుడు సిద్ధం చేయాలి?",
        },
        a: {
          en: "Before the first period — explain pads, hygiene, and that they can tell you. Keep supplies at home and school bag.",
          te: "మొదటి మాసికానికి ముందే — ప్యాడ్, శుభ్రత, మీతో చెప్పవచ్చని. ఇంట్లో, బ్యాగ్‌లో సామాగ్రి.",
        },
      },
      {
        q: {
          en: "Hygiene and privacy?",
          te: "శుభ్రత & గోప్యత?",
        },
        a: {
          en: "Daily bath, clean clothes, deodorant if needed, respect closed doors, and discuss online body-image pressure.",
          te: "రోజూ స్నానం, శుభ్ర దుస్తులు, అవసరమైతే డియో, తలుపు గౌరవం, ఆన్‌లైన్ శరీర చిత్ర ఒత్తిడి చర్చ.",
        },
      },
    ],
  },
  {
    id: "typhoid-hepatitis",
    kind: "faq",
    group: "vaccines",
    emoji: "🧼",
    title: {
      en: "Typhoid & viral hepatitis awareness",
      te: "టైఫాయిడ్ & వైరల్ హెపటైటిస్ అవగాహన",
    },
    intro: {
      en: "Clean water, handwashing, safe food, and vaccines (where advised) prevent many gut and liver infections.",
      te: "శుభ్ర నీరు, చేతులు కడగడం, సురక్షిత ఆహారం, సలహా ప్రకారం టీకాలు — చాలా కడుపు/కాలేయ ఇన్ఫెక్షన్లను నివారిస్తాయి.",
    },
    items: [
      {
        q: {
          en: "How do typhoid and hepatitis A spread?",
          te: "టైఫాయిడ్, హెపటైటిస్ A ఎలా వ్యాపిస్తాయి?",
        },
        a: {
          en: "Often contaminated food or water. Wash hands, peel fruit, avoid risky street ice/water, and discuss vaccines with your paediatrician.",
          te: "తరచూ కలుషిత ఆహారం/నీరు. చేతులు కడగండి, పండ్లు తొక్కు తీయండి, ప్రమాదకర స్ట్రీట్ ఐస్/నీరు వద్దు; టీకాలు డాక్టర్‌తో చర్చించండి.",
        },
      },
      {
        q: {
          en: "Symptoms that need review?",
          te: "ఏ లక్షణాలకు రివ్యూ?",
        },
        a: {
          en: "Prolonged fever, severe weakness, yellow eyes/urine (jaundice), persistent vomiting, or blood in stool — medical care.",
          te: "దీర్ఘ జ్వరం, తీవ్ర బలహీనత, పచ్చని కళ్లు/మూత్రం (కామెర్లు), నిరంతర వాంతులు, మలంలో రక్తం — వైద్యం.",
        },
      },
      {
        q: {
          en: "Antibiotics from a pharmacy for fever?",
          te: "జ్వరానికి ఫార్మసీ యాంటీబయాటిక్?",
        },
        a: {
          en: "No self-medication. Wrong antibiotics delay diagnosis and increase resistance.",
          te: "స్వయం మందులు వద్దు. తప్పు యాంటీబయాటిక్ నిర్ధారణ ఆలస్యం, రెసిస్టెన్స్ పెంచుతుంది.",
        },
      },
    ],
  },
  {
    id: "first-aid-kit",
    kind: "faq",
    group: "home-env",
    emoji: "🧰",
    title: {
      en: "Home first-aid kit",
      te: "ఇంటి ప్రథమ చికిత్స కిట్",
    },
    intro: {
      en: "A simple kit plus knowing when to go to hospital beats a cupboard full of unused syrups.",
      te: "సాధారణ కిట్ + ఎప్పుడు ఆసుపత్రికి వెళ్లాలో తెలుసుకోవడం — ఉపయోగించని సిరప్‌ల కప్బోర్డ్ కంటే మేలు.",
    },
    items: [
      {
        q: {
          en: "What should be in the kit?",
          te: "కిట్‌లో ఏమి ఉండాలి?",
        },
        a: {
          en: "Thermometer, ORS, sterile gauze, plasters, antiseptic, scissors, gloves, saline drops, prescribed inhaler/spacer if any, and written emergency numbers.",
          te: "థర్మామీటర్, ORS, గాజ్, ప్లాస్టర్లు, అంటిసెప్టిక్, కత్తెర, గ్లవ్స్, సెలైన్, ప్రిస్క్రైబ్డ్ ఇన్‌హేలర్/స్పేసర్, అత్యవసర నంబర్లు.",
        },
      },
      {
        q: {
          en: "Where to store medicines?",
          te: "మందులు ఎక్కడ ఉంచాలి?",
        },
        a: {
          en: "Locked or high cupboard, away from heat/humidity, check expiry dates every few months. Never store adult strong medicines in open reach.",
          te: "తాళం/ఎత్తైన కప్బోర్డ్, వేడి/తేమ దూరం, కొన్ని నెలలకు ఒకసారి ఎక్స్‌పైరీ. పెద్దల బలమైన మందులు చేతికి దూరం.",
        },
      },
      {
        q: {
          en: "ORS — when and how?",
          te: "ORS — ఎప్పుడు, ఎలా?",
        },
        a: {
          en: "For diarrhoea/vomiting risk of dehydration — mix as per packet with clean water. Small frequent sips. Seek care if unable to drink or lethargic.",
          te: "విరేచనాలు/వాంతులతో నిర్జలీకరణ ప్రమాదం — ప్యాకెట్ ప్రకారం శుభ్ర నీటితో. చిన్న చురుకు గుక్కలు. తాగలేకపోతే లేదా మత్తుగా ఉంటే వైద్యం.",
        },
      },
    ],
  },
  {
    id: "air-pollution",
    kind: "faq",
    group: "home-env",
    emoji: "🌫️",
    title: {
      en: "Air pollution & children",
      te: "వాయు కాలుష్యం & పిల్లలు",
    },
    intro: {
      en: "Children breathe faster and play outdoors — polluted air worsens asthma and infections. Practical steps still help.",
      te: "పిల్లలు వేగంగా ఊపిరి, బయట ఆడతారు — కాలుష్యం ఆస్తమా, ఇన్ఫెక్షన్లు పెంచుతుంది. సాధారణ చర్యలు సహాయం.",
    },
    items: [
      {
        q: {
          en: "What can families do on high-pollution days?",
          te: "ఎక్కువ కాలుష్య రోజుల్లో ఏమి?",
        },
        a: {
          en: "Limit intense outdoor play when AQI is poor, prefer morning/indoor activity, keep windows closed during peak smoke, and follow asthma plans.",
          te: "AQI చెడ్డగా ఉంటే తీవ్ర బయట ఆట తగ్గించండి; ఉదయం/లోపల కదలిక; పొగ ఎక్కువగా ఉన్నప్పుడు కిటికీలు మూయండి; ఆస్తమా ప్లాన్ పాటించండి.",
        },
      },
      {
        q: {
          en: "Masks for children?",
          te: "పిల్లలకు మాస్క్?",
        },
        a: {
          en: "Well-fitting masks may help older children outdoors in heavy pollution if they tolerate them. Babies should not wear tight masks — keep them indoors instead.",
          te: "పెద్ద పిల్లలు భరించగలిగితే బయట భారీ కాలుష్యంలో సరిపోయే మాస్క్ సహాయం. పాపలకు బిగుసు మాస్క్ వద్దు — లోపల ఉంచండి.",
        },
      },
      {
        q: {
          en: "Indoor smoke?",
          te: "ఇంటి పొగ?",
        },
        a: {
          en: "No smoking indoors/near children. Reduce incense/mosquito coil smoke in small rooms when possible; ventilate cooking smoke.",
          te: "పిల్లల దగ్గర/ఇంట్లో పొగ తాగడం వద్దు. సాధ్యమైతే అగరబత్తి/కాయిల్ పొగ తగ్గించండి; వంట పొగకు వెంటిలేషన్.",
        },
      },
    ],
  },
];
