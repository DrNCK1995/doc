import type { AgeBand, AgeBandId, Bilingual, LearnTopic } from "./types";

function img(id: string, alt: Bilingual): LearnTopic["image"] {
  return { src: `/learn/${id}.png`, alt };
}

export const AGE_BANDS: AgeBand[] = [
  {
    id: "newborn",
    label: { en: "Newborn", te: "నవజాత శిశువు" },
    range: { en: "0–28 days", te: "0–28 రోజులు" },
    accent: "#34d399",
    topics: ["breastfeeding", "burping", "safe-sleep", "jaundice", "cord-care"],
  },
  {
    id: "2-6m",
    label: { en: "2–6 months", te: "2–6 నెలలు" },
    range: { en: "Infant", te: "శిశువు" },
    accent: "#60a5fa",
    topics: ["tummy-time", "vaccines-early", "fever-infant", "feeding-2-6"],
  },
  {
    id: "6-12m",
    label: { en: "6–12 months", te: "6–12 నెలలు" },
    range: { en: "Starting solids", te: "ఆహారం మొదలు" },
    accent: "#fbbf24",
    topics: ["complementary-feeding", "choking", "allergens", "milestones-6-12"],
  },
  {
    id: "1-5y",
    label: { en: "1–5 years", te: "1–5 సంవత్సరాలు" },
    range: { en: "Toddler & preschool", te: "టాడ్లర్ & ప్రీస్కూల్" },
    accent: "#fb7185",
    topics: ["picky-eating", "toilet-training", "tantrums", "screen-time", "speech"],
  },
];

export const LEARN_TOPICS: LearnTopic[] = [
  {
    id: "breastfeeding",
    bandId: "newborn",
    title: { en: "Breastfeeding", te: "తల్లిపాలు" },
    image: img("breastfeeding", {
      en: "Mother breastfeeding a newborn with a wide latch",
      te: "నవజాత శిశువుకు వెడల్పు లాచ్‌తో తల్లిపాలు",
    }),
    minutes: 2,
    explanation: {
      en: "In the first days, feed on demand — often 8–12 times in 24 hours. A good latch is wide-mouthed, chin to breast, with swallows you can hear. Wet nappies (6+ a day after day 4) and a content baby after feeds matter more than clock-watching. Night feeds keep milk supply. If feeding hurts throughout the feed, the latch needs help — pain that lasts is not “normal”.",
      te: "మొదటి రోజుల్లో అవసరమైనప్పుడు పాలు ఇవ్వండి — 24 గంటల్లో 8–12 సార్లు ఉండవచ్చు. నోరు వెడల్పుగా, గడ్డం రొమ్ముకు తగిలి, మింగుతున్న శబ్దం వినిపిస్తే లాచ్ బాగుంటుంది. 4వ రోజు తర్వాత రోజుకు 6+ తడి డైపర్లు, తిన్నాక ప్రశాంతంగా ఉండటం గడియారం కంటే ముఖ్యం. రాత్రి పాలు సరఫరాను కాపాడతాయి. మొత్తం పాలు సేపు నొప్పి ఉంటే లాచ్ సరిదిద్దాలి — నొప్పి సహజం కాదు.",
    },
    infographic: [
      { label: { en: "Wake & cue", te: "మెలకువ & సైన్" }, detail: { en: "Rooting, hand-to-mouth, fussing — feed before loud crying.", te: "నోరు వెతకడం, చేయి నోటికి, అలజడి — బిగ్గరగా ఏడ్చే ముందు పాలు." } },
      { label: { en: "Latch", te: "లాచ్" }, detail: { en: "Nose free, more areola below the mouth than above.", te: "ముక్కు స్వేచ్ఛగా, నోటి కింద అరియోలా ఎక్కువగా ఉండాలి." } },
      { label: { en: "Swallow", te: "మింగడం" }, detail: { en: "Listen for “kuh” swallows; switch sides when sucking slows.", te: "మింగే శబ్దం వినండి; పీల్చడం మెల్లబడితే వైపు మార్చండి." } },
      { label: { en: "Check nappies", te: "డైపర్ చూడండి" }, detail: { en: "Day 5 onward: several wet and at least 3 yellow stools a day is typical.", te: "5వ రోజు నుంచి: చాలా తడి డైపర్లు, రోజుకు కనీసం 3 పసుపు మలం సాధారణం." } },
    ],
    seeDoctor: [
      { en: "Baby is too sleepy to feed, or has fewer than 4 wet nappies after day 5.", te: "పాప నిద్రగా ఉండి తినడం లేదు, లేదా 5వ రోజు తర్వాత తడి డైపర్లు 4 కంటే తక్కువ." },
      { en: "Fever, jaundice deepening, or weight not back toward birth weight by 2 weeks.", te: "జ్వరం, కామెర్లు పెరగడం, 2 వారాలకు బరువు పుట్టినంతకు రాకపోవడం." },
      { en: "Cracked nipples with fever in the mother, or a red painful breast patch.", te: "తల్లికి చన్ను పగుళ్లు + జ్వరం, లేదా రొమ్ము ఎర్రగా నొప్పిగా ఉండటం." },
    ],
  },
  {
    id: "burping",
    bandId: "newborn",
    title: { en: "Burping", te: "తేమ తీయడం (బర్పింగ్)" },
    image: img("burping", {
      en: "Parent holding a newborn upright on the shoulder to burp",
      te: "నవజాత శిశువును భుజం మీద నిటారుగా పట్టుకుని తేమ తీయడం",
    }),
    minutes: 2,
    explanation: {
      en: "Newborns swallow air. A pause mid-feed and at the end, held upright against your chest or sitting on your lap with the jaw supported, helps wind come up. A few gentle back pats are enough — no hard thumping. Not every feed produces a burp. If the baby is calm, you can settle. Spit-up of a teaspoon after feeds is common; projectile vomiting is not.",
      te: "నవజాత శిశువులు గాలి మింగుతారు. పాలు మధ్యలో, చివరన నిటారుగా ఛాతీపై లేదా ఒడిలో కూర్చోబెట్టి దవడను పట్టుకుంటే గాలి వస్తుంది. మెల్లగా వీపు తట్టడం చాలు — గట్టిగా కొట్టవద్దు. ప్రతి సారి తేమ రావాల్సిన అవసరం లేదు. ప్రశాంతంగా ఉంటే పడుకోబెట్టవచ్చు. ఒక చెంచా ఉమ్మి సాధారణం; దూరంగా కొట్టే వాంతి కాదు.",
    },
    infographic: [
      { label: { en: "Upright", te: "నిటారు" }, detail: { en: "Head on your shoulder, tummy against your chest.", te: "తల మీ భుజం మీద, పొట్ట మీ ఛాతీకి తగిలి." } },
      { label: { en: "Pat", te: "తట్టండి" }, detail: { en: "Open palm, slow pats from low back toward the shoulder.", te: "చేతి అరచేతితో మెల్లగా నడుము నుంచి భుజం వైపు." } },
      { label: { en: "Lap sit", te: "ఒడిలో" }, detail: { en: "Sit the baby, lean slightly forward, support the chin — never the throat.", te: "కూర్చోబెట్టి కాస్త ముందుకు వంచి, గడ్డం పట్టుకోండి — గొంతు కాదు." } },
      { label: { en: "Then rest", te: "తర్వాత విశ్రాంతి" }, detail: { en: "Keep upright 10 minutes if spit-up is frequent.", te: "ఉమ్మి ఎక్కువైతే 10 నిమిషాలు నిటారుగా పట్టుకోండి." } },
    ],
    seeDoctor: [
      { en: "Green or bloody vomit, or vomiting that shoots across the room.", te: "పచ్చని లేదా రక్తపు వాంతి, గది అవతలికి కొట్టే వాంతి." },
      { en: "Poor weight gain, or crying in pain that is not settled by winding.", te: "బరువు పెరగకపోవడం, గాలి తీసినా తీరని నొప్పి ఏడుపు." },
      { en: "A swollen hard belly, or no stool and persistent vomiting.", te: "గట్టిగా ఉబ్బిన పొట్ట, మలం రాకుండా వాంతులు కొనసాగడం." },
    ],
  },
  {
    id: "safe-sleep",
    bandId: "newborn",
    title: { en: "Safe sleep", te: "సురక్షిత నిద్ర" },
    image: img("safe-sleep", {
      en: "Newborn sleeping on the back in a bare crib",
      te: "ఖాళీ కాట్‌లో వీపుపై నిద్రిస్తున్న నవజాత శిశువు",
    }),
    minutes: 2,
    explanation: {
      en: "Put the baby on the back for every sleep, on a firm flat surface, in your room but on a separate cot or bassinet. No pillows, stuffed toys, loose blankets, or bumper pads. A fitted sheet only. Avoid the sofa, recliner, and sharing a soft mattress. Swaddles should not cover the face and should stop once the baby can roll. Smoke-free air and breastfeeding also lower risk of sleep-related death.",
      te: "ప్రతి నిద్రకు పాపను వీపుపై, గట్టి చదునైన ఉపరితలంపై పడుకోబెట్టండి. మీ గదిలోనే, కానీ వేరే కాట్/బాసినెట్‌లో. దిండు, బొమ్మలు, వదులుగా ఉన్న దుప్పటి, బంపర్లు వద్దు. సరిపోయే షీట్ చాలు. సోఫా, రిక్లైనర్, మెత్తని మంచం పంచుకోవద్దు. చుట్టేటప్పుడు ముఖం కప్పవద్దు; పొర్లగలిగితే చుట్టడం ఆపండి. పొగ లేని గాలి, తల్లిపాలు కూడా ప్రమాదాన్ని తగ్గిస్తాయి.",
    },
    infographic: [
      { label: { en: "Back", te: "వీపు" }, detail: { en: "Back to sleep, tummy only when awake and watched.", te: "నిద్రకు వీపు. పొట్టపై — మెలకువగా, చూస్తూ ఉన్నప్పుడు మాత్రమే." } },
      { label: { en: "Bare cot", te: "ఖాళీ కాట్" }, detail: { en: "Firm mattress, fitted sheet, nothing else in the cot.", te: "గట్టి తలుపు, సరిపోయే షీట్ — కాట్‌లో మరేమీ వద్దు." } },
      { label: { en: "Own space", te: "స్వంత స్థలం" }, detail: { en: "Same room as you; not the same sleep surface.", te: "మీ గదిలోనే; మీ మంచం మీద కాదు." } },
      { label: { en: "Cool & clear", te: "చల్లగా, క్లియర్" }, detail: { en: "Light clothes. No hat indoors. No smoke.", te: "తేలికపాటి బట్టలు. ఇంట్లో టోపీ వద్దు. పొగ వద్దు." } },
    ],
    seeDoctor: [
      { en: "Pauses in breathing, blue lips, or a baby who is hard to wake.", te: "ఊపిరి ఆగడం, నీలి పెదవులు, లేదా లేపడం కష్టం." },
      { en: "Fever in the first 3 months, or unusual floppy / stiff body.", te: "మొదటి 3 నెలల్లో జ్వరం, అసాధారణంగా వదులు లేదా బిగుసుకున్న శరీరం." },
    ],
  },
  {
    id: "jaundice",
    bandId: "newborn",
    title: { en: "Jaundice", te: "కామెర్లు" },
    image: img("jaundice", {
      en: "Parent checking a newborn’s eyes for jaundice in daylight",
      te: "పగటి వెలుతురులో నవజాత శిశువు కళ్లలో కామెర్లు చూడటం",
    }),
    minutes: 2,
    explanation: {
      en: "Many babies look yellow from day 2–4 because the liver is still catching up. Face yellowing that fades in a week with good feeding is often physiologic. Jaundice on day 1, yellow palms/soles, poor feeding, or a sleepy baby is not “wait and watch” at home. Frequent breastfeeds help. Phototherapy in hospital is common and safe when levels are high — it is not a failure of parenting.",
      te: "చాలా పాపలు 2–4 రోజులకు పసుపుగా కనిపిస్తారు — కాలేయం ఇంకా అలవాటు అవుతోంది. ముఖం పసుపు, బాగా తింటూ వారంలో తగ్గితే తరచుగా ఫిజియోలాజిక్. మొదటి రోజే కామెర్లు, అరచేతులు/అరికాళ్లు పసుపు, తినకపోవడం, నిద్రగా ఉండటం — ఇంట్లో ఆగవద్దు. తరచుగా తల్లిపాలు సహాయపడతాయి. లెవెల్స్ ఎక్కువైతే ఆసుపత్రిలో లైట్ థెరపీ సాధారణం, సురక్షితం.",
    },
    infographic: [
      { label: { en: "Watch the eyes", te: "కళ్లు చూడండి" }, detail: { en: "Yellow in the white of the eye is easier to see in daylight.", te: "పగటి వెలుతురులో కంటి తెలుపు పసుపుగా ఉందా చూడండి." } },
      { label: { en: "Feed often", te: "తరచుగా పాలు" }, detail: { en: "8–12 feeds; jaundice worsens if milk is low.", te: "8–12 సార్లు; పాలు తక్కువైతే కామెర్లు పెరుగుతాయి." } },
      { label: { en: "Day-1 rule", te: "1వ రోజు నియమం" }, detail: { en: "Yellow in the first 24 hours always needs a doctor.", te: "మొదటి 24 గంటల్లో పసుపు — తప్పనిసరిగా డాక్టర్." } },
      { label: { en: "Body map", te: "శరీరం" }, detail: { en: "Face only is milder; chest, then legs, then palms is more.", te: "ముఖం మాత్రమే తక్కువ; ఛాతీ, కాళ్లు, అరచేతులు అయితే ఎక్కువ." } },
    ],
    seeDoctor: [
      { en: "Jaundice on day 1 of life, or yellow palms and soles.", te: "పుట్టిన మొదటి రోజే కామెర్లు, అరచేతులు/అరికాళ్లు పసుపు." },
      { en: "Poor suck, high-pitched cry, arching, or extreme sleepiness.", te: "పీల్చలేకపోవడం, పలుచని ఏడుపు, వంగడం, అతి నిద్ర." },
      { en: "Jaundice lasting beyond 2 weeks, especially if stools are pale.", te: "2 వారాలకు మించి కామెర్లు, ముఖ్యంగా మలం తెల్లగా/లేతగా ఉంటే." },
    ],
  },
  {
    id: "cord-care",
    bandId: "newborn",
    title: { en: "Cord care", te: "బొడ్డు తాడు సంరక్షణ" },
    image: img("cord-care", {
      en: "Nappy folded below a newborn’s navel so the stump stays dry",
      te: "బొడ్డు మొన పొడిగా ఉండేలా డైపర్ కిందికి మడవడం",
    }),
    minutes: 2,
    explanation: {
      en: "Keep the stump clean and dry. Fold the nappy below it. Clean with water if soiled, then pat dry. No cow dung, ash, turmeric paste, or spirit unless your hospital specifically advised a product. The stump usually falls between day 5 and 15. A little dried blood on the nappy is common. Smell, spreading redness, or fever is not.",
      te: "బొడ్డు మొనను శుభ్రంగా, పొడిగా ఉంచండి. డైపర్‌ను దాని కిందికి మడవండి. మురికైతే నీటితో కడిగి తుడవండి. పేడ, బూడిద, పసుపు ముద్ద, స్పిరిట్ వేయవద్దు — ఆసుపత్రి చెప్పినది తప్ప. సాధారణంగా 5–15 రోజుల్లో రాలుతుంది. డైపర్‌పై కొంచెం ఎండిన రక్తం సాధారణం. కంపు, వ్యాపిస్తున్న ఎరుపు, జ్వరం కాదు.",
    },
    infographic: [
      { label: { en: "Air", te: "గాలి" }, detail: { en: "Leave it open to air when you can; no tight binders.", te: "సాధ్యమైతే బయట పెట్టండి; గట్టి కట్టు వద్దు." } },
      { label: { en: "Dry", te: "పొడి" }, detail: { en: "Pat dry after a sponge. No soaking baths until it falls.", te: "స్నానం తర్వాత తుడవండి. రాలే వరకు నానబెట్టి స్నానం వద్దు." } },
      { label: { en: "Nappy fold", te: "డైపర్" }, detail: { en: "Keep urine off the stump.", te: "మూత్రం మొనకు తగలకుండా డైపర్ మడవండి." } },
      { label: { en: "Falls off", te: "రాలుతుంది" }, detail: { en: "Do not pull. A tiny bit of ooze can last a day or two.", te: "లాగవద్దు. ఒకటి రెండు రోజులు కొంచెం తేమ ఉండవచ్చు." } },
    ],
    seeDoctor: [
      { en: "Red skin spreading from the stump, pus, or a foul smell.", te: "మొన నుంచి వ్యాపించే ఎరుపు, చీము, దుర్వాసన." },
      { en: "Fever, poor feeding, or a swelling that looks like a bulge at the navel.", te: "జ్వరం, తినకపోవడం, బొడ్డు వద్ద ఉబ్బు." },
      { en: "Bleeding that soaks the nappy, or the stump still attached after 3 weeks.", te: "డైపర్ తడిసేంత రక్తం, లేదా 3 వారాలకు ఇంకా రాలకపోవడం." },
    ],
  },
  {
    id: "tummy-time",
    bandId: "2-6m",
    title: { en: "Tummy time", te: "పొట్టపై ఆట (టమ్మీ టైమ్)" },
    image: img("tummy-time", {
      en: "Awake baby on the tummy, parent on the floor face to face",
      te: "మెలకువగా పొట్టపై పాప, ముఖం ముఖానికి తల్లి/తండ్రి",
    }),
    minutes: 2,
    explanation: {
      en: "Start with a few minutes on the tummy while the baby is awake and you are watching. It builds neck and shoulder strength and helps motor milestones. Chest-to-chest on your body counts. A crying baby can take a break — short, frequent sessions beat one long struggle. Always back to sleep afterward. If the head is always turned one way, vary the side you approach from.",
      te: "పాప మెలకువగా, మీరు చూస్తూ ఉన్నప్పుడు పొట్టపై కొన్ని నిమిషాలు మొదలుపెట్టండి. మెడ, భుజాల బలం, మోటార్ మైలురాళ్లకు పనికి వస్తుంది. మీ ఛాతీపై పాప ఛాతీ కూడా లెక్క. ఏడిస్తే విరామం — చిన్న చిన్న సార్లు మంచివి. తర్వాత నిద్రకు వీపు. తల ఎప్పుడూ ఒక వైపే ఉంటే, మీరు దగ్గరకు వచ్చే వైపు మార్చండి.",
    },
    infographic: [
      { label: { en: "Awake only", te: "మెలకువ మాత్రమే" }, detail: { en: "Never tummy-sleep unsupervised.", te: "ఒంటరిగా పొట్టపై నిద్రపెట్టవద్దు." } },
      { label: { en: "Start small", te: "చిన్నగా" }, detail: { en: "1–2 minutes, a few times a day, then build toward 15–30 minutes total by 3–4 months.", te: "రోజుకు కొన్నిసార్లు 1–2 నిమిషాలు; 3–4 నెలలకు మొత్తం 15–30 నిమిషాలు." } },
      { label: { en: "Face to face", te: "ముఖం ముఖానికి" }, detail: { en: "Get on the floor. A mirror or your voice keeps interest.", te: "నేలపై కూర్చోండి. అద్దం లేదా మీ గొంతు ఆసక్తి పెడతాయి." } },
      { label: { en: "Roll path", te: "పొర్లడం" }, detail: { en: "By 4–6 months many babies roll. Clear the space.", te: "4–6 నెలలకు చాలా మంది పొర్లుతారు. చుట్టూ ఖాళీ ఉంచండి." } },
    ],
    seeDoctor: [
      { en: "By 4 months the head still flops and cannot lift in tummy time.", te: "4 నెలలకు మెడ ఇంకా వాలిపోతుంది, పొట్టపై తల ఎత్తలేరు." },
      { en: "Always using only one arm, or a very stiff / very floppy body.", te: "ఎప్పుడూ ఒక చేయి మాత్రమే, లేదా చాలా బిగువు / చాలా వదులు." },
      { en: "A flat spot on the head that is getting worse, or an eye that turns in.", te: "తలపై చదును పెరగడం, కన్ను లోనికి తిరగడం." },
    ],
  },
  {
    id: "vaccines-early",
    bandId: "2-6m",
    title: { en: "Vaccines", te: "టీకాలు" },
    image: img("vaccines-early", {
      en: "Parent holding an infant in a calm clinic for vaccines",
      te: "క్లినిక్‌లో టీకాల కోసం శిశువును పట్టుకున్న తల్లిదండ్రులు",
    }),
    minutes: 2,
    explanation: {
      en: "Infant vaccines protect before the baby meets germs in the wider world. Mild fever, fussiness, and a sore thigh for a day or two are common. Paracetamol is for comfort if needed — not as a routine “before every shot” unless your doctor said so. Keep the record card. Delaying without a medical reason leaves gaps. After shots, feed as usual and watch for rare allergic reactions in the first 30 minutes at the clinic.",
      te: "శిశు టీకాలు బయటి క్రిములకు ముందే రక్షణ ఇస్తాయి. తేలికపాటి జ్వరం, అలజడి, తొడ నొప్పి ఒకటి రెండు రోజులు సాధారణం. పారాసిటమాల్ అవసరమైతే — ప్రతి షాట్‌కు ముందు అలవాటుగా కాదు, డాక్టర్ చెప్పితే తప్ప. కార్డు దాచుకోండి. కారణం లేకుండా ఆలస్యం ఖాళీలు పెడుతుంది. టీకా తర్వాత సాధారణంగా తినిపించండి; మొదటి 30 నిమిషాలు క్లినిక్‌లో అరుదైన అలర్జీ చూడండి.",
    },
    infographic: [
      { label: { en: "On time", te: "సమయానికి" }, detail: { en: "6, 10, 14 weeks are key IAP/NIS visits — plus birth doses already given.", te: "6, 10, 14 వారాలు ముఖ్యం — పుట్టినప్పటి టీకాలతో పాటు." } },
      { label: { en: "Aftercare", te: "తర్వాత" }, detail: { en: "Feed, extra cuddles, cool cloth on the thigh if swollen.", te: "పాలు, ఒడి, వాపు ఉంటే తొడపై గోరువెచ్చని గుడ్డ." } },
      { label: { en: "Fever", te: "జ్వరం" }, detail: { en: "Low fever 24 hours is common. See dosage calculator for ml if advised.", te: "24 గంటల తేలికపాటి జ్వరం సాధారణం. మోతాదు కావాలంటే డోసేజ్ కాలిక్యులేటర్." } },
      { label: { en: "Record", te: "రికార్డు" }, detail: { en: "Photograph the card. Enrol for email reminders on this site.", te: "కార్డు ఫోటో తీయండి. ఈ సైట్‌లో ఈమెయిల్ రిమైండర్లు పెట్టుకోండి." } },
    ],
    seeDoctor: [
      { en: "Rash with swelling of lips, wheeze, or collapse after a vaccine.", te: "టీకా తర్వాత పెదవులు ఉబ్బడం, రాష్, ఊపిరి శబ్దం, కుప్పకూలడం." },
      { en: "Fever in a baby under 3 months, or fever lasting more than 2 days after shots.", te: "3 నెలల లోపు జ్వరం, లేదా టీకా తర్వాత 2 రోజులకు మించి జ్వరం." },
      { en: "A seizure, or a thigh that is extremely red, hot, and spreading.", te: "మూర్ఛ, లేదా తొడ అతి ఎరుపు, వేడి, వ్యాపిస్తూ ఉండటం." },
    ],
  },
  {
    id: "fever-infant",
    bandId: "2-6m",
    title: { en: "Fever", te: "జ్వరం" },
    image: img("fever-infant", {
      en: "Parent checking an infant’s temperature, dressed in one light layer",
      te: "తేలికపాటి బట్టల్లో శిశువు ఉష్ణోగ్రత చూడటం",
    }),
    minutes: 2,
    explanation: {
      en: "Feel the chest or back, not just the hands. Use a thermometer if you can. Fever is a symptom, not a diagnosis. Under 3 months, any fever is a same-day clinic visit. Older infants can have extra fluids and light clothes; do not wrap in many layers. Paracetamol only as advised for weight. Do not alternate medicines unless your paediatrician taught you how. Watch alertness and urine more than the exact number on the thermometer.",
      te: "చేతులు కాదు — ఛాతీ లేదా వీపు తాకండి. ఉంటే థర్మామీటర్ వాడండి. జ్వరం లక్షణం, వ్యాధి పేరు కాదు. 3 నెలల లోపు ఏ జ్వరమైనా అదే రోజు క్లినిక్. పెద్ద శిశువులకు ద్రవాలు, తేలికపాటి బట్టలు; పొరలు పొరలు కప్పవద్దు. పారాసిటమాల్ బరువుకు తగ్గట్టు. డాక్టర్ నేర్పితే తప్ప మందులు మార్చి మార్చి వేయవద్దు. సంఖ్య కంటే మెలకువ, మూత్రం ముఖ్యం.",
    },
    infographic: [
      { label: { en: "<3 months", te: "3 నెలల లోపు" }, detail: { en: "Any fever → clinic today. Do not wait for “one more dose”.", te: "ఏ జ్వరమైనా → ఈరోజే క్లినిక్. మరో మోతాదు కోసం ఆగవద్దు." } },
      { label: { en: "Fluids", te: "ద్రవాలు" }, detail: { en: "Breastfeed more often. Offer cooled boiled water only if already on it after 6 months.", te: "తల్లిపాలు ఎక్కువసార్లు. 6 నెలల తర్వాత అలవాటు ఉంటే చల్లని ఉడికించిన నీరు." } },
      { label: { en: "Dress light", te: "తేలికగా" }, detail: { en: "One layer. Lukewarm sponge if very uncomfortable — not ice.", te: "ఒక పొర. అసౌకర్యం అయితే గోరువెచ్చని స్పాంజ్ — మంచు కాదు." } },
      { label: { en: "Watch", te: "గమనించండి" }, detail: { en: "Smile, eye contact, wet nappies = usually managing.", te: "నవ్వు, కంటి చూపు, తడి డైపర్లు = సాధారణంగా సరిపోతోంది." } },
    ],
    seeDoctor: [
      { en: "Any fever under 3 months of age.", te: "3 నెలల లోపు ఏ జ్వరమైనా." },
      { en: "Lethargy, rash, fast breathing, poor feeding, or a seizure.", te: "నీరసం, రాష్, వేగంగా ఊపిరి, తినకపోవడం, మూర్ఛ." },
      { en: "Fever more than 3 days, or a soft spot on the head that is bulging.", te: "3 రోజులకు మించి జ్వరం, తలపై మెత్తని భాగం ఉబ్బడం." },
    ],
  },
  {
    id: "feeding-2-6",
    bandId: "2-6m",
    title: { en: "Feeding", te: "ఆహారం / పాలు" },
    image: img("feeding-2-6", {
      en: "Exclusive breastfeeding in the first six months",
      te: "మొదటి ఆరు నెలలు తల్లిపాలు మాత్రమే",
    }),
    minutes: 2,
    explanation: {
      en: "Exclusive breastfeeding until 6 months is the goal: no water, no “top” milk, no honey, no cereals in the bottle unless a doctor prescribed formula. Growth, wet nappies, and alert periods tell you supply is enough — not how “empty” the breast feels. Formula, if used, is mixed exactly as labelled. Night feeds still matter. Complementary food starts at 6 months, not at 3–4 months because elders insist.",
      te: "6 నెలల వరకు తల్లిపాలు మాత్రమే లక్ష్యం: నీరు, అదనపు పాలు, తేనె, సీసాలో జావ — డాక్టర్ ఫార్ములా చెప్పితే తప్ప. ఎదుగుదల, తడి డైపర్లు, మెలకువ సమయాలు సరఫరా చాలని చెబుతాయి — రొమ్ము “ఖాళీ” అనిపించడం కాదు. ఫార్ములా వాడితే లేబుల్ ప్రకారమే. రాత్రి పాలు ఇంకా ముఖ్యం. ఘనాహారం 6 నెలలకు — పెద్దలు చెప్పినంత మాత్రాన 3–4 నెలలకు కాదు.",
    },
    infographic: [
      { label: { en: "Milk only", te: "పాలు మాత్రమే" }, detail: { en: "Breast or prescribed formula. No extra water needed.", te: "తల్లిపాలు లేదా చెప్పిన ఫార్ములా. అదనపు నీరు అవసరం లేదు." } },
      { label: { en: "Cues", te: "సైన్లు" }, detail: { en: "Feed on hunger cues, not a strict 4-hour clock.", te: "ఆకలి సైన్లకు పాలు — ఖచ్చితమైన 4 గంటల గడియారం కాదు." } },
      { label: { en: "Vitamin D", te: "విటమిన్ డి" }, detail: { en: "400 IU daily is often advised — check your drop strength.", te: "రోజుకు 400 IU తరచుగా సూచిస్తారు — డ్రాప్స్ స్ట్రెంత్ చూడండి." } },
      { label: { en: "Wait for 6", te: "6 వరకు" }, detail: { en: "Thick mashed food starts at six months, sitting with support.", te: "మెత్తని ఆహారం ఆరు నెలలకు, సపోర్ట్‌తో కూర్చుని." } },
    ],
    seeDoctor: [
      { en: "Poor weight gain, or a baby who is always exhausted after feeds.", te: "బరువు పెరగకపోవడం, తిన్నాక అలసిపోయి ఉండటం." },
      { en: "Choking, coughing, or colour change during feeds.", te: "తినేటప్పుడు ఉక్కిరిబిక్కిరి, దగ్గు, రంగు మారడం." },
      { en: "Blood in stool, or vomiting that is forceful and frequent.", te: "మలంలో రక్తం, తరచుగా బలమైన వాంతి." },
    ],
  },
  {
    id: "complementary-feeding",
    bandId: "6-12m",
    title: { en: "Complementary feeding", te: "అనుబంధ ఆహారం" },
    image: img("complementary-feeding", {
      en: "Baby sitting up, offered thick porridge on a spoon",
      te: "కూర్చున్న పాపకు స్పూన్‌తో గట్టి జావ",
    }),
    minutes: 2,
    explanation: {
      en: "At 6 months, milk alone is not enough. Start thick foods — khichdi, ragi porridge, mashed dal-rice with a little ghee — not watery dal water. Offer 2–3 meals, building to 3 meals and 1–2 snacks by 9–12 months. Continue breast milk. No added salt or sugar in the first year. Honey is unsafe under 12 months. Sit the baby, use a spoon, and let mess happen. Iron-rich foods (dal, egg yolk, ragi, meat if the family eats it) matter.",
      te: "6 నెలలకు పాలు మాత్రమే చాలవు. గట్టి/మెత్తని ఆహారం మొదలుపెట్టండి — ఖిచిడీ, రాగి జావ, పప్పు-అన్నం + కొంచెం నెయ్యి — పలుచని పప్పు నీళ్లు కాదు. 2–3 పూటలు, 9–12 నెలలకు 3 పూటలు + 1–2 టిఫిన్లు. తల్లిపాలు కొనసాగించండి. మొదటి ఏడాది ఉప్పు, చక్కెర వద్దు. 12 నెలల లోపు తేనె ప్రమాదం. కూర్చోబెట్టి స్పూన్; మురికి అవ్వనివ్వండి. ఇనుము ఉన్న ఆహారం (పప్పు, గుడ్డు కోడి, రాగి, మాంసం) ముఖ్యం.",
    },
    infographic: [
      { label: { en: "Thick, not thin", te: "గట్టిగా" }, detail: { en: "Stays on the spoon. Mash, then soft pieces.", te: "స్పూన్‌పై నిలబడాలి. మెత్తగా, తర్వాత మెత్తని ముక్కలు." } },
      { label: { en: "Add energy", te: "శక్తి" }, detail: { en: "½ tsp ghee or oil in the bowl.", te: "గిన్నెలో అర చెంచా నెయ్యి లేదా నూనె." } },
      { label: { en: "Milk stays", te: "పాలు ఉంచండి" }, detail: { en: "Foods add on; they do not replace milk overnight.", te: "ఆహారం అదనం; ఒక్కరోజులో పాల స్థానంలో రావు." } },
      { label: { en: "Family plate", te: "ఇంటి ఆహారం" }, detail: { en: "By 10–12 months, soft versions of what you eat.", te: "10–12 నెలలకు మీరు తినేదాని మెత్తని రూపం." } },
    ],
    seeDoctor: [
      { en: "Not sitting, or not taking any solids by 8–9 months.", te: "కూర్చోలేకపోవడం, 8–9 నెలలకు ఏ ఘనాహారం తినకపోవడం." },
      { en: "Choking, colour change, or refusing all textures with weight faltering.", te: "ఉక్కిరిబిక్కిరి, రంగు మారడం, అన్ని రకాల ఆహారం తిరస్కరించి బరువు తగ్గడం." },
      { en: "Blood in stool, chronic diarrhoea, or a swollen belly.", te: "మలంలో రక్తం, నిదానమైన విరేచనాలు, ఉబ్బిన పొట్ట." },
    ],
  },
  {
    id: "choking",
    bandId: "6-12m",
    title: { en: "Choking prevention", te: "ఉక్కిరిబిక్కిరి నివారణ" },
    image: img("choking", {
      en: "Grapes cut lengthwise and banana strips, baby sitting to eat",
      te: "ద్రాక్ష పొడవుగా కోసి, అరటి చారలు, కూర్చుని తినడం",
    }),
    minutes: 2,
    explanation: {
      en: "Sit the child upright to eat. Stay within arm’s reach. Cut food into short strips, not round coins. Whole nuts, whole grapes, raw carrot rounds, popcorn, and hard sweets are not for this age. Peanut can be offered as a smooth paste mixed into food if there is no allergy plan against it. Toys with small parts stay off the floor. If the child is coughing loudly, let them cough. If they are silent, blue, or cannot breathe, that is an emergency.",
      te: "తినేటప్పుడు నిటారుగా కూర్చోబెట్టండి. చేయి చేరే దూరంలో ఉండండి. ఆహారం నాణెం లాగా కాదు, చిన్న ముక్కలు/చారలు. మొత్తం గింజలు, ద్రాక్ష గెల, పచ్చి క్యారెట్ రౌండ్లు, పాప్‌కార్న్, గట్టి మిఠాయి ఈ వయసుకు వద్దు. పల్లీని మెత్తని పేస్ట్‌గా ఆహారంలో కలపవచ్చు (అలర్జీ ప్రణాళిక లేకుంటే). చిన్న బొమ్మ ముక్కలు నేలపై వదలవద్దు. బిగ్గరగా దగ్గుతుంటే దగ్గనివ్వండి. మౌనం, నీలం, ఊపిరి లేకపోతే అత్యవసరం.",
    },
    infographic: [
      { label: { en: "Sit", te: "కూర్చోండి" }, detail: { en: "Never eat while crawling, in a car seat on the move, or lying down.", te: "పాకుతూ, కదిలే కార్ సీటులో, పడుకుని తినిపించవద్దు." } },
      { label: { en: "Shape", te: "ఆకారం" }, detail: { en: "Long strips of banana/roti. Halve grapes lengthwise.", te: "అరటి/రొట్టె చారలు. ద్రాక్ష పొడవుగా కోయండి." } },
      { label: { en: "Watch", te: "చూడండి" }, detail: { en: "Phones down during meals.", te: "భోజనంలో ఫోన్ కింద పెట్టండి." } },
      { label: { en: "If silent", te: "మౌనమైతే" }, detail: { en: "Call emergency help. Back blows / infant first aid if you are trained.", te: "అత్యవసర సహాయం. నేర్చుకుని ఉంటే వీపు దెబ్బలు / శిశు ఫస్ట్ ఎయిడ్." } },
    ],
    seeDoctor: [
      { en: "A choking episode with colour change — even if it “got better”.", te: "రంగు మారిన ఉక్కిరిబిక్కిరి — తర్వాత బాగున్నా చూపించండి." },
      { en: "Ongoing cough, wheeze, or drooling after a suspected swallowed object.", te: "వస్తువు మింగిన అనుమానంతో దగ్గు, ఊపిరి శబ్దం, లాలాజలం." },
      { en: "You cannot see the object and the child cannot cry or cough.", te: "వస్తువు కనిపించదు, పిల్ల ఏడవలేరు / దగ్గలేరు." },
    ],
  },
  {
    id: "allergens",
    bandId: "6-12m",
    title: { en: "Allergens", te: "అలర్జీ కారకాలు" },
    image: img("allergens", {
      en: "Small amounts of egg, peanut paste, and wheat offered to a sitting baby",
      te: "కూర్చున్న పాపకు గుడ్డు, పల్లీ పేస్ట్, గోధుమ కొంచెం",
    }),
    minutes: 2,
    explanation: {
      en: "Once complementary feeding has started, common allergens (egg, peanut as paste, wheat, fish if the family eats it) can be introduced one at a time, in the morning, in a small amount. Delaying peanut and egg does not prevent allergy in most babies. If there is severe eczema or a known food allergy in the child, make a plan with your paediatrician first. Watch for hives, swelling, vomiting, or wheeze — not just a little redness around the mouth from the food touching the skin.",
      te: "ఘనాహారం మొదలైన తర్వాత సాధారణ అలర్జీ ఆహారాలు (గుడ్డు, పల్లీ పేస్ట్, గోధుమ, కుటుంబం తింటే చేప) ఒకేసారి ఒకటి, ఉదయం, కొంచెం. పల్లీ, గుడ్డు ఆలస్యం చేయడం చాలా మందిలో అలర్జీని ఆపదు. తీవ్రమైన ఎగ్జిమా లేదా తెలిసిన ఫుడ్ అలర్జీ ఉంటే ముందు పీడియాట్రిషియన్‌తో ప్లాన్. గవదబిళ్లలు, ఉబ్బు, వాంతి, ఊపిరి శబ్దం చూడండి — నోటి చుట్టూ ఆహారం తగిలి కొంచెం ఎరుపు మాత్రమే కాదు.",
    },
    infographic: [
      { label: { en: "One new food", te: "ఒక కొత్తది" }, detail: { en: "Wait a day or two before the next new allergen.", te: "మరో కొత్త అలర్జెన్‌కు ఒకటి రెండు రోజులు ఆగండి." } },
      { label: { en: "Paste, not whole", te: "పేస్ట్" }, detail: { en: "Smooth peanut mixed into porridge — never whole nuts.", te: "జావలో మెత్తని పల్లీ — మొత్తం గింజలు కాదు." } },
      { label: { en: "Keep giving", te: "కొనసాగించండి" }, detail: { en: "If tolerated, offer that food regularly.", te: "తట్టుకుంటే ఆ ఆహారాన్ని తరచుగా ఇవ్వండి." } },
      { label: { en: "Know the signs", te: "సైన్లు" }, detail: { en: "Hives, swell, vomit, cough, floppy — stop and get help.", te: "గవదబిళ్లలు, ఉబ్బు, వాంతి, దగ్గు, వదులు — ఆపి సహాయం." } },
    ],
    seeDoctor: [
      { en: "Swelling of lips or tongue, wheeze, or sudden sleepiness after a food.", te: "ఆహారం తర్వాత పెదవులు/నాలుక ఉబ్బు, ఊపిరి శబ్దం, అకస్మాత్తు నిద్ర." },
      { en: "Repeated vomiting or widespread hives.", te: "పదే పదే వాంతి లేదా వ్యాపించిన గవదబిళ్లలు." },
      { en: "Severe eczema before starting solids — plan introduction in clinic guidance.", te: "ఘనాహారం ముందే తీవ్ర ఎగ్జిమా — క్లినిక్ సలహాతో మొదలుపెట్టండి." },
    ],
  },
  {
    id: "milestones-6-12",
    bandId: "6-12m",
    title: { en: "Developmental milestones", te: "వికాస మైలురాళ్లు" },
    image: img("milestones-6-12", {
      en: "Baby sitting and passing a toy from hand to hand",
      te: "కూర్చుని బొమ్మను చేతులు మార్చుకుంటున్న పాప",
    }),
    minutes: 2,
    explanation: {
      en: "Around this age many babies sit, pass toys from hand to hand, babble, respond to name, and start to pull to stand. Crawling style varies — some bottom-shuffle. Pointing and showing you a toy is social gold. Loss of a skill the baby already had is always a reason to be seen. Screens do not teach sitting or speech. Play on the floor, talk in your language, and use the development screen on this site if you are unsure.",
      te: "ఈ వయసులో చాలా మంది కూర్చుంటారు, బొమ్మలు చేతులు మార్చుకుంటారు, బాబుల్ చేస్తారు, పేరుకు తిరుగుతారు, నిలబడటానికి లాగుకుంటారు. పాకే విధానం వేరు — కొందరు పిరుదులపై జారతారు. చూపించడం, బొమ్మ చూపించడం సామాజికంగా ముఖ్యం. ఉన్న నైపుణ్యం పోవడం తప్పనిసరిగా చూపించాలి. స్క్రీన్ కూర్చోవడం/మాట నేర్పవు. నేలపై ఆట, మీ భాషలో మాట. సందేహమైతే ఈ సైట్ డెవలప్‌మెంట్ స్క్రీన్ వాడండి.",
    },
    infographic: [
      { label: { en: "Sit", te: "కూర్చోవడం" }, detail: { en: "Without support by about 8–9 months for most.", te: "చాలా మందికి 8–9 నెలలకు సపోర్ట్ లేకుండా." } },
      { label: { en: "Hands", te: "చేతులు" }, detail: { en: "Transfer, bang, early pincer on crumbs.", te: "మార్చడం, కొట్టడం, ముక్కల్ని పట్టే పిన్సర్." } },
      { label: { en: "Sounds", te: "శబ్దాలు" }, detail: { en: "Mama/dada, babble strings, looks when called.", te: "మమ్మ/దాదా, బాబుల్, పేరు పిలిస్తే చూడటం." } },
      { label: { en: "Share", te: "పంచుకోవడం" }, detail: { en: "Peekaboo, waving, showing a toy.", te: "పీకాబూ, బై చేయడం, బొమ్మ చూపించడం." } },
    ],
    seeDoctor: [
      { en: "Not sitting by 10 months, or not babbling by 9 months.", te: "10 నెలలకు కూర్చోకపోవడం, 9 నెలలకు బాబుల్ లేకపోవడం." },
      { en: "Does not respond to name by 12 months, or has lost eye contact / words.", te: "12 నెలలకు పేరుకు స్పందించకపోవడం, కంటి చూపు/మాటలు పోవడం." },
      { en: "Very floppy or stiff, or using only one side of the body.", te: "చాలా వదులు లేదా బిగువు, ఒక వైపు మాత్రమే వాడటం." },
    ],
  },
  {
    id: "picky-eating",
    bandId: "1-5y",
    title: { en: "Picky eating", te: "తినడంలో వూసలాట" },
    image: img("picky-eating", {
      en: "Toddler at the family table with the same home food",
      te: "ఇంటి భోజనంతో కుటుంబ టేబుల్ వద్ద టాడ్లర్",
    }),
    minutes: 2,
    explanation: {
      en: "Toddlers have small tummies and big opinions. Offer the family meal, including one food they usually accept. You decide what and when; the child decides how much. No separate restaurant for every meal. Limit milk to about a cup or two a day so it does not replace food. Keep mealtimes to 20–30 minutes, without screens or force. Growth on the chart matters more than yesterday’s plate. It can take 10+ calm exposures before a new food is tasted.",
      te: "టాడ్లర్లకు పొట్ట చిన్నది, అభిప్రాయం పెద్దది. ఇంటి భోజనం పెట్టండి, వాళ్లు తినే ఒక అంశం ఉంచండి. ఏమి ఎప్పుడు మీరు; ఎంత తినాలో పిల్ల. ప్రతి పూట వేరే మెనూ వద్దు. పాలు రోజుకు ఒకటి రెండు కప్పులు — భోజనం స్థానంలో రాకూడదు. 20–30 నిమిషాలు, స్క్రీన్ లేకుండా, బలవంతం లేకుండా. నిన్నటి ప్లేట్ కంటే గ్రోత్ చార్టు ముఖ్యం. కొత్త ఆహారానికి 10+ ప్రశాంత అవకాశాలు పట్టవచ్చు.",
    },
    infographic: [
      { label: { en: "Same table", te: "ఒకే టేబుల్" }, detail: { en: "Family food, less spice. No short-order cook.", te: "ఇంటి ఆహారం, తక్కువ కారం. వేరే కుక్ వద్దు." } },
      { label: { en: "Milk cap", te: "పాల పరిమితి" }, detail: { en: "About 300–400 ml/day after age 1.", te: "1 ఏడు తర్వాత రోజుకు 300–400 మి.లీ." } },
      { label: { en: "No pressure", te: "ఒత్తిడి వద్దు" }, detail: { en: "No “one more bite” battles. Praise sitting, not finishing.", te: "“ఇంకో ముక్క” యుద్ధం వద్దు. కూర్చోవడాన్ని మెచ్చుకోండి, ఖాళీ ప్లేట్‌ను కాదు." } },
      { label: { en: "Snack plan", te: "టిఫిన్" }, detail: { en: "Two snacks, not grazing all afternoon.", te: "రెండు టిఫిన్లు — మధ్యాహ్నమంతా నమలడం కాదు." } },
    ],
    seeDoctor: [
      { en: "Weight faltering, or drinking only milk and almost no solids.", te: "బరువు తగ్గడం, పాలు మాత్రమే తాగి ఘనాహారం లేకపోవడం." },
      { en: "Choking, gagging on all textures, or a very restricted diet with few food groups.", te: "అన్ని టెక్స్చర్లకు ఉక్కిరిబిక్కిరి, చాలా తక్కువ రకాల ఆహారం." },
      { en: "Pain on swallowing, chronic constipation, or pale tired child.", te: "మింగేటప్పుడు నొప్పి, నిదాన మలబద్ధకం, తెల్లబారిన అలసిన పిల్ల." },
    ],
  },
  {
    id: "toilet-training",
    bandId: "1-5y",
    title: { en: "Toilet training", te: "టాయిలెట్ అలవాటు" },
    image: img("toilet-training", {
      en: "Toddler on a small pot with a parent reading nearby",
      te: "చిన్న పాటీపై పిల్ల, పక్కన పుస్తకం చదువుతున్న తల్లి/తండ్రి",
    }),
    minutes: 2,
    explanation: {
      en: "Most children are ready between 2 and 3 years: they stay dry for a stretch, tell you, and can pull pants. Start when life is calm. A small pot after meals, praise for sitting, no punishment for accidents. Night dryness comes later than day. Constipation makes training fail — treat that first. If the child is afraid, pause and retry in a few weeks. Boys and girls both can start with sitting.",
      te: "చాలా మంది 2–3 ఏళ్లకు సిద్ధం: కాసేపు పొడిగా ఉండటం, చెప్పడం, ప్యాంటు దించగలగడం. ప్రశాంత సమయంలో మొదలుపెట్టండి. భోజనం తర్వాత చిన్న పాటీ, కూర్చోవడానికి మెచ్చుకోండి, ప్రమాదాలకు శిక్ష వద్దు. రాత్రి పొడి పగలు కంటే ఆలస్యం. మలబద్ధకం అలవాటును పాడుచేస్తుంది — ముందు దాన్ని చూడండి. భయమైతే ఆపి కొన్ని వారాలు తర్వాత మళ్లీ. కూర్చోవడంతోనే మొదలు పెట్టవచ్చు.",
    },
    infographic: [
      { label: { en: "Ready signs", te: "సిద్ధం" }, detail: { en: "Walks to pot, hides to poo, copies you.", te: "పాటీ దగ్గరకు నడవడం, మలానికి దాక్కోవడం, మిమ్మల్ని చూసి చేయడం." } },
      { label: { en: "After meals", te: "భోజనం తర్వాత" }, detail: { en: "Sit 3–5 minutes. Books, not screens.", te: "3–5 నిమిషాలు కూర్చోండి. పుస్తకం, స్క్రీన్ కాదు." } },
      { label: { en: "Clothes", te: "బట్టలు" }, detail: { en: "Easy pants. Skip belts and complicated dungarees.", te: "తేలికగా దించే ప్యాంటు. బెల్టులు కష్టం." } },
      { label: { en: "Accidents", te: "ప్రమాదాలు" }, detail: { en: "Clean calmly. Shame slows learning.", te: "ప్రశాంతంగా శుభ్రం. సిగ్గు నేర్పును ఆలస్యం చేస్తుంది." } },
    ],
    seeDoctor: [
      { en: "Painful hard stools, or withholding with a swollen belly.", te: "నొప్పిగా గట్టి మలం, పొట్ట ఉబ్బి ఆపుకోవడం." },
      { en: "Day wetting still at 5 years, or sudden loss of dryness after being trained.", te: "5 ఏళ్లకు పగలు తడిచిపోవడం, అలవాటు తర్వాత మళ్లీ తడి." },
      { en: "Burning urine, blood, or a child who never signals and is beyond 4 years.", te: "మూత్రం మంట, రక్తం, 4 ఏళ్లు దాటినా సైన్ ఇవ్వకపోవడం." },
    ],
  },
  {
    id: "tantrums",
    bandId: "1-5y",
    title: { en: "Tantrums", te: "కోపపు ఆవేశాలు (టాన్ట్రమ్స్)" },
    image: img("tantrums", {
      en: "Parent sitting calmly beside an upset toddler",
      te: "కోపంగా ఉన్న టాడ్లర్ పక్కన ప్రశాంతంగా కూర్చున్న తల్లి/తండ్రి",
    }),
    minutes: 2,
    explanation: {
      en: "Tantrums peak when language is still behind big feelings. Stay close, stay boring, keep the child safe. Do not argue while they are screaming. After the storm, name the feeling and the limit in one short sentence. Hunger, sleep, and screens make tantrums worse. Hitting you is stopped calmly — not with hitting back. Praise the quiet recovery. If every hour is a rage with injury to self or others, that is more than a typical tantrum.",
      te: "మాట కంటే భావాలు పెద్దవైనప్పుడు టాన్ట్రమ్స్ ఎక్కువ. దగ్గరుండండి, ప్రశాంతంగా, సురక్షితంగా. అరుస్తూ ఉండగా వాదించవద్దు. తర్వాత ఒక చిన్న వాక్యంలో భావం + హద్దు చెప్పండి. ఆకలి, నిద్రలేమి, స్క్రీన్ మరింత చెడుగుతాయి. కొట్టడాన్ని ప్రశాంతంగా ఆపండి — తిరిగి కొట్టవద్దు. ప్రశాంతం తిరిగి వచ్చినప్పుడు మెచ్చుకోండి. ప్రతి గంటా రేగి తనను/ఇతరులను గాయపరుస్తే అది సాధారణం కాదు.",
    },
    infographic: [
      { label: { en: "Safety", te: "సేఫ్టీ" }, detail: { en: "Move sharp things. Hold gently if they may run into a road.", te: "కారు వస్తువులు తీయండి. రోడ్డుకు పరుగెత్తితే మెల్లగా పట్టుకోండి." } },
      { label: { en: "Low voice", te: "లో గొంతు" }, detail: { en: "You are the thermostat. Fewer words.", te: "మీరు ఉష్ణోగ్రత. తక్కువ మాటలు." } },
      { label: { en: "After", te: "తర్వాత" }, detail: { en: "“You were angry. Hitting is not okay. Here is a hug.”", te: "“కోపం వచ్చింది. కొట్టడం కాదు. ఇదిగో కౌగిలి.”" } },
      { label: { en: "Prevent", te: "ముందు" }, detail: { en: "Sleep, snacks, give two choices, warn before leaving the park.", te: "నిద్ర, టిఫిన్, రెండు ఎంపికలు, పార్కు వదిలే ముందు చెప్పండి." } },
    ],
    seeDoctor: [
      { en: "Daily rages with biting, head-banging, or injury after age 4–5.", te: "4–5 ఏళ్ల తర్వాత ప్రతిరోజూ కాటు, తల కొట్టుకోవడం, గాయాలు." },
      { en: "No language by 2, or tantrums with loss of social smile / play.", te: "2 ఏళ్లకు మాట లేదు, నవ్వు/ఆట పోయి ఆవేశాలు." },
      { en: "You feel unsafe or unable to cope — ask for help early.", te: "మీరు అసురక్షితంగా / తట్టుకోలేకపోతే ముందే సహాయం అడగండి." },
    ],
  },
  {
    id: "screen-time",
    bandId: "1-5y",
    title: { en: "Screen time", te: "స్క్రీన్ టైమ్" },
    image: img("screen-time", {
      en: "Parent and toddler with a book and blocks, phone face down",
      te: "పుస్తకం, బ్లాక్స్‌తో తల్లి/తండ్రి మరియు టాడ్లర్, ఫోన్ కింద",
    }),
    minutes: 2,
    explanation: {
      en: "Under 2 years, screens do not teach language the way your face does. A short video call with grandparents is different from YouTube in the background. For 2–5 years, if used at all, keep it brief, together, and never during meals or the hour before sleep. Background TV still steals play. Offer blocks, books, outside time first. Your phone at the table teaches the child that screens win.",
      te: "2 ఏళ్ల లోపు స్క్రీన్ మీ ముఖం లాగా భాష నేర్పదు. తాత/అమమ్మ వీడియో కాల్ వేరు, నేపథ్యంలో YouTube వేరు. 2–5 ఏళ్లకు వాడితే కొద్దిగా, కలిసి, భోజనం/నిద్రకు ఒక గంట ముందు కాదు. నేపథ్య టీవీ కూడా ఆటను తీసుకుంటుంది. ముందు బ్లాక్స్, పుస్తకాలు, బయట. మీరు టేబుల్ వద్ద ఫోన్ చూస్తే పిల్లకు స్క్రీనే గెలుస్తుంది.",
    },
    infographic: [
      { label: { en: "Under 2", te: "2 లోపు" }, detail: { en: "No solo scrolling. Co-view only if needed, very short.", te: "ఒంటరిగా స్క్రోల్ వద్దు. అవసరమైతే కలిసి, చాలా కొద్ది సేపు." } },
      { label: { en: "2–5 years", te: "2–5 ఏళ్లు" }, detail: { en: "Aim well under 1 hour, high-quality, you sitting there.", te: "1 గంట లోపు, మంచి కంటెంట్, మీరు పక్కన." } },
      { label: { en: "No-screen zones", te: "స్క్రీన్ వద్దు" }, detail: { en: "Meals, bedroom, last hour of the day.", te: "భోజనం, పడకగది, రోజు చివరి గంట." } },
      { label: { en: "Swap", te: "మార్చండి" }, detail: { en: "Outside play, story, kitchen help instead of “one more episode”.", te: "బయట ఆట, కథ, వంటలో సహాయం — “ఇంకో ఎపిసోడ్” బదులు." } },
    ],
    seeDoctor: [
      { en: "Almost no play except screens, or speech delay with heavy daily viewing.", te: "స్క్రీన్ తప్ప ఆట లేదు, రోజంతా చూసి మాట ఆలస్యం." },
      { en: "Sleep is broken, or the child is aggressive when the screen stops.", te: "నిద్ర పాడవడం, స్క్రీన్ ఆపితే తీవ్ర కోపం." },
      { en: "You cannot reduce time despite trying — ask for a family plan in clinic.", te: "ప్రయత్నించినా తగ్గించలేకపోతే క్లినిక్‌లో కుటుంబ ప్లాన్ అడగండి." },
    ],
  },
  {
    id: "speech",
    bandId: "1-5y",
    title: { en: "Speech development", te: "మాట వికాసం" },
    image: img("speech", {
      en: "Parent and toddler pointing at a picture book, talking face to face",
      te: "బొమ్మల పుస్తకం చూపిస్తూ ముఖం ముఖానికి మాట్లాడటం",
    }),
    minutes: 2,
    explanation: {
      en: "By 1 year many children say 1–3 words and point. By 2, two-word phrases (“want milk”) and a burst of words. By 3, short sentences family can understand. Talk in your home language, wait for a turn, and avoid testing (“What is this?” all day). Two languages do not cause delay. Less background TV. If you are the only one who understands a 3-year-old, or there is no pointing by 18 months, come in — earlier help is easier.",
      te: "1 ఏడుకు చాలా మంది 1–3 మాటలు, చూపిస్తారు. 2కి రెండు-మాటల జోడి (“పాలు కావాలి”), మాటల పెరుగుదల. 3కి చిన్న వాక్యాలు కుటుంబానికి అర్థమవుతాయి. ఇంటి భాషలో మాట్లాడండి, వంతు కోసం ఆగండి, రోజంతా పరీక్షించవద్దు. రెండు భాషలు ఆలస్యం కావు. నేపథ్య టీవీ తగ్గించండి. 3 ఏళ్ల పిల్లను మీరు మాత్రమే అర్థం చేసుకుంటే, 18 నెలలకు చూపు లేకపోతే రండి — ముందు సహాయం సులభం.",
    },
    infographic: [
      { label: { en: "18 months", te: "18 నెలలు" }, detail: { en: "Pointing, showing, some meaningful words.", te: "చూపించడం, కొన్ని అర్థవంతమైన మాటలు." } },
      { label: { en: "2 years", te: "2 ఏళ్లు" }, detail: { en: "Two-word combos. Follows a simple request.", te: "రెండు మాటలు కలపడం. చిన్న అభ్యర్థన పాటించడం." } },
      { label: { en: "3–4 years", te: "3–4 ఏళ్లు" }, detail: { en: "Strangers understand more and more of the speech.", te: "పరాయివారికి మాట ఎక్కువగా అర్థమవుతుంది." } },
      { label: { en: "How to help", te: "ఎలా" }, detail: { en: "Comment, don’t quiz. Read pictures. Pause for their turn.", te: "వ్యాఖ్య చెప్పండి, ప్రశ్నల జల్లు కాదు. బొమ్మలు. వంతు కోసం ఆగండి." } },
    ],
    seeDoctor: [
      { en: "No pointing by 18 months, or no two-word phrases by 2 years.", te: "18 నెలలకు చూపు లేదు, 2 ఏళ్లకు రెండు-మాటల జోడి లేదు." },
      { en: "Lost words or social smile. Does not respond to name.", te: "మాటలు/నవ్వు పోవడం. పేరుకు స్పందించకపోవడం." },
      { en: "Speech very unclear at 4 years, or stuttering with struggle / facial tension.", te: "4 ఏళ్లకు మాట అస్పష్టం, లేదా నత్తి + ముఖం బిగుసుకోవడం." },
    ],
  },
];

export function isAgeBandId(value: string | null): value is AgeBandId {
  return AGE_BANDS.some((band) => band.id === value);
}

export function topicsForBand(bandId: AgeBandId): LearnTopic[] {
  const band = AGE_BANDS.find((b) => b.id === bandId);
  if (!band) return [];
  return band.topics
    .map((id) => LEARN_TOPICS.find((t) => t.id === id))
    .filter((t): t is LearnTopic => Boolean(t));
}
