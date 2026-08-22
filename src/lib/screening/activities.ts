import type {
  LocalizedText,
  MilestoneDomain,
  ScreeningLang,
  ScreeningResult,
} from "./types";
import { pickText } from "./types";
import { DOMAIN_LABELS } from "./questions";
import { CLINIC_NAME, DOCTOR_NAME } from "@/lib/constants";

export type ActivityAgeBand =
  | "0-6m"
  | "6-12m"
  | "1-2y"
  | "preschool"
  | "school"
  | "adolescent";

export type ActivityFocus =
  | MilestoneDomain
  | "adhd"
  | "autism"
  | "general";

export type ActivityItem = {
  focus: ActivityFocus;
  title: LocalizedText;
  steps: LocalizedText[];
};

export type ActivityGroup = {
  focus: ActivityFocus;
  label: string;
  title: string;
  steps: string[];
};

export type ConsultDoctorAdvice = {
  urgent: boolean;
  title: string;
  body: string;
  doctorLine: string;
};

export function activityAgeBand(ageMonths: number): ActivityAgeBand {
  if (ageMonths < 6) return "0-6m";
  if (ageMonths < 12) return "6-12m";
  if (ageMonths < 24) return "1-2y";
  if (ageMonths < 60) return "preschool";
  if (ageMonths < 144) return "school";
  return "adolescent";
}

const BAND_LABEL: Record<ActivityAgeBand, LocalizedText> = {
  "0-6m": { en: "0–6 months", te: "0–6 నెలలు" },
  "6-12m": { en: "6–12 months", te: "6–12 నెలలు" },
  "1-2y": { en: "1–2 years", te: "1–2 సంవత్సరాలు" },
  preschool: { en: "Preschool (2–5 years)", te: "ప్రీస్కూల్ (2–5 సం)" },
  school: { en: "School age", te: "పాఠశాల వయసు" },
  adolescent: { en: "Adolescent", te: "కౌమారం" },
};

const FOCUS_LABEL: Record<ActivityFocus, LocalizedText> = {
  ...DOMAIN_LABELS,
  adhd: { en: "Attention & activity", te: "దృష్టి & చలనం" },
  autism: { en: "Social communication", te: "సామాజిక సంభాషణ" },
  general: { en: "Everyday play", te: "రోజువారీ ఆట" },
};

/** Age-banded home activities by developmental focus (parent practice between visits). */
const ACTIVITIES: Record<
  ActivityAgeBand,
  Partial<Record<ActivityFocus, { title: LocalizedText; steps: LocalizedText[] }>>
> = {
  "0-6m": {
    gross_motor: {
      title: {
        en: "Tummy and head-control play",
        te: "పొట్ట మీద & తల నియంత్రణ ఆట",
      },
      steps: [
        {
          en: "2–3 short tummy-time sessions when awake — start with 1–2 minutes on your chest or a firm mat.",
          te: "మెలకువగా ఉన్నప్పుడు 2–3 చిన్న పొట్ట-టైమ్ సెషన్లు — ఛాతీపై లేదా గట్టి మాట్‌పై 1–2 నిమిషాలు మొదలు.",
        },
        {
          en: "Hold baby upright against your shoulder so the head practices steadying.",
          te: "భుజం మీద నిటారుగా పట్టుకుని తల స్థిరం కావడానికి అభ్యాసం ఇవ్వండి.",
        },
        {
          en: "Place a high-contrast toy slightly above eye level to encourage lifting the head.",
          te: "కళ్ల కొంచెం పైన రంగురంగుల బొమ్మ పెట్టి తల ఎత్తడానికి ప్రోత్సహించండి.",
        },
      ],
    },
    fine_motor: {
      title: { en: "Hand opening and batting", te: "చేతులు తెరవడం & బొమ్మ కొట్టడం" },
      steps: [
        {
          en: "Gently open fisted hands and stroke the palms during calm moments.",
          te: "ప్రశాంతంగా ఉన్నప్పుడు పిడికిలి మెల్లగా తెరిచి అరచేతులు తాకండి.",
        },
        {
          en: "Hang a soft toy within arm’s reach so baby can bat at it.",
          te: "చేతి చేరువలో మెత్తని బొమ్మ వేలాడదీసి కొట్టేలా చేయండి.",
        },
        {
          en: "Offer a rattle briefly; help bring hands toward the midline.",
          te: "రాటిల్ కొంతసేపు ఇవ్వండి; చేతులు మధ్యకు తీసుకురావడంలో సహాయం చేయండి.",
        },
      ],
    },
    language: {
      title: { en: "Talk, sing, and face time", te: "మాట్లాడండి, పాడండి, ముఖం చూపండి" },
      steps: [
        {
          en: "Hold baby face-to-face and copy coos — wait for a pause, then respond.",
          te: "ముఖాముఖి పట్టుకుని కూస్ అనుకరించండి — విరామం ఇచ్చి స్పందించండి.",
        },
        {
          en: "Narrate care: “Now we change the nappy… now milk.”",
          te: "సంరక్షణ చెబుతూ: “ఇప్పుడు డైపర్… ఇప్పుడు పాలు.”",
        },
        {
          en: "Sing the same short song daily so rhythm becomes familiar.",
          te: "ప్రతిరోజు అదే చిన్న పాట పాడండి — లయ అలవాటు అవుతుంది.",
        },
      ],
    },
    social: {
      title: { en: "Social smile and bonding", te: "సామాజిక నవ్వు & బంధం" },
      steps: [
        {
          en: "Smile and talk when baby looks at your face; pause so they can reply with a smile.",
          te: "ముఖం చూసినప్పుడు నవ్వి మాట్లాడండి; నవ్వుతో స్పందించేలా విరామం ఇవ్వండి.",
        },
        {
          en: "Keep one main caregiver for feeds when possible to build recognition.",
          te: "సాధ్యమైతే పాలు ఒకే సంరక్షకుడితో — గుర్తింపు పెరుగుతుంది.",
        },
        {
          en: "Reduce long phone use during face-to-face play.",
          te: "ముఖాముఖి ఆట సమయంలో ఫోన్ వాడకం తగ్గించండి.",
        },
      ],
    },
    cognitive: {
      title: { en: "Watching and tracking", te: "చూడటం & అనుసరించడం" },
      steps: [
        {
          en: "Slowly move a toy side to side so eyes can follow.",
          te: "బొమ్మను మెల్లగా ఇటు అటు కదిలించి కళ్లు అనుసరించేలా చేయండి.",
        },
        {
          en: "Show baby their hands; gently clap them together.",
          te: "చేతులు చూపించి మెల్లగా కలపండి / చప్పట్లు కొట్టండి.",
        },
        {
          en: "Use bright but simple objects — one at a time.",
          te: "ప్రకాశవంతమైన సాధారణ వస్తువులు — ఒకసారి ఒకటి మాత్రమే.",
        },
      ],
    },
  },
  "6-12m": {
    gross_motor: {
      title: { en: "Sitting, rolling, and moving", te: "కూర్చోవడం, తిరగడం, కదలడం" },
      steps: [
        {
          en: "Practice supported sitting on your lap, then on the floor with pillows nearby — never leave unattended.",
          te: "ఒడిలో ఆసరాతో కూర్చోబెట్టి, తర్వాత నేలపై దిండ్ల దగ్గర అభ్యాసం — ఒంటరిగా వదలవద్దు.",
        },
        {
          en: "Encourage rolling by placing a toy just out of reach to the side.",
          te: "పక్కన చేరని దూరంలో బొమ్మ పెట్టి తిరగడానికి ప్రోత్సహించండి.",
        },
        {
          en: "Allow safe floor time to crawl or bottom-shuffle — avoid long periods in a walker.",
          te: "సురక్షిత నేల సమయం ఇవ్వండి — వాకర్‌లో ఎక్కువసేపు ఉంచవద్దు.",
        },
      ],
    },
    fine_motor: {
      title: { en: "Reach, transfer, and pincer start", te: "చాచడం, మార్చడం, పింసర్ మొదలు" },
      steps: [
        {
          en: "Offer a soft block to transfer from one hand to the other.",
          te: "మెత్తని బ్లాక్ ఇచ్చి ఒక చేతి నుంచి మరొక చేతికి మార్చేలా చేయండి.",
        },
        {
          en: "Put a few large soft pieces in a bowl for raking / picking practice.",
          te: "పెద్ద మెత్తని ముక్కలు గిన్నెలో పెట్టి ఎత్తే అభ్యాసం ఇవ్వండి.",
        },
        {
          en: "Let baby bang safe cups together for cause-and-effect fun.",
          te: "సురక్షిత కప్పులు కొట్టుకునేలా ఇవ్వండి — కారణం-పరిణామం నేర్చుకుంటారు.",
        },
      ],
    },
    language: {
      title: { en: "Babble games and name response", te: "బాబుల్ ఆటలు & పేరు స్పందన" },
      steps: [
        {
          en: "Repeat baby’s ba/da sounds and add a simple word: “ba-ba… ball!”",
          te: "బా/డా శబ్దాలు అనుకరించి సాధారణ పదం చేర్చండి: “బా-బా… బంతి!”",
        },
        {
          en: "Call the child’s name from 1–2 metres away and celebrate when they turn.",
          te: "1–2 మీటర్ల నుంచి పేరు పిలిచి తిరిగితే సంబరం చేయండి.",
        },
        {
          en: "Point to objects and name them once — keep it short.",
          te: "వస్తువులు చూపి పేరు చెప్పండి — చిన్నగా ఉంచండి.",
        },
      ],
    },
    social: {
      title: { en: "Peekaboo and caregiver games", te: "పీకాబూ & సంరక్షక ఆటలు" },
      steps: [
        {
          en: "Play peekaboo with a cloth; wait for eye contact before revealing.",
          te: "గుడ్డతో పీకాబూ — కంటి సంపర్కం తర్వాత చూపించండి.",
        },
        {
          en: "Wave bye-bye and clap; help baby imitate with your hands over theirs.",
          te: "బై-బై, చప్పట్లు — మీ చేతులతో సహాయంగా అనుకరింపజేయండి.",
        },
        {
          en: "Practice short separations in the same room so stranger wariness feels safer.",
          te: "అదే గదిలో చిన్న విడిపోవడాలు — అపరిచిత భయం తగ్గుతుంది.",
        },
      ],
    },
    cognitive: {
      title: { en: "Find the hidden toy", te: "దాచిన బొమ్మ వెతకడం" },
      steps: [
        {
          en: "Partly cover a toy with a cloth and help uncover it together.",
          te: "బొమ్మను గుడ్డతో కొంత దాచి కలిసి తీయండి.",
        },
        {
          en: "Drop a toy into a wide container and let baby reach in.",
          te: "వెడల్పు డబ్బాలో బొమ్మ వేసి లోపలికి చేతి చాచేలా చేయండి.",
        },
        {
          en: "Show “give me” with an open hand and praise any attempt.",
          te: "చేయి చాచి “ఇవ్వు” చూపించి ప్రయత్నానికి ప్రశంసించండి.",
        },
      ],
    },
  },
  "1-2y": {
    gross_motor: {
      title: { en: "Walking, climbing, and kicking", te: "నడక, ఎక్కడం, తన్నడం" },
      steps: [
        {
          en: "Hold both hands, then one hand, then encourage short independent walks between furniture.",
          te: "రెండు చేతులు, తర్వాత ఒక చేయి, తర్వాత ఫర్నిచర్ మధ్య చిన్న నడకలు.",
        },
        {
          en: "Practice stepping onto a low sturdy step with you spotting.",
          te: "తక్కువ గట్టి మెట్టుపై అడుగు — మీరు పక్కన ఉండండి.",
        },
        {
          en: "Roll a soft ball for kicking / chasing in a clear space.",
          te: "ఖాళీ స్థలంలో మెత్తని బంతి తన్నడం / వెంబడించడం.",
        },
      ],
    },
    fine_motor: {
      title: { en: "Scribble, stack, and spoon", te: "గీయడం, పేర్చడం, స్పూన్" },
      steps: [
        {
          en: "Offer thick crayons and paper for scribbling — model a few strokes.",
          te: "మందపాటి క్రేయాన్లు, కాగితం — కొన్ని గీతలు చూపించండి.",
        },
        {
          en: "Stack 2–4 large blocks together; let the child knock them down.",
          te: "2–4 పెద్ద బ్లాకులు కలిసి పేర్చి, పడేయనివ్వండి.",
        },
        {
          en: "Practice spoon to mouth with thick soft food; expect spills.",
          te: "మందపాటి ఆహారంతో స్పూన్ అభ్యాసం — చిందులు సహజం.",
        },
      ],
    },
    language: {
      title: { en: "Words, pointing, and two-word tries", te: "పదాలు, చూపడం, రెండు పదాలు" },
      steps: [
        {
          en: "Name body parts and pictures; wait for the child to point.",
          te: "శరీర భాగాలు / చిత్రాలు పేరు చెప్పి చూపేలా వేచి ఉండండి.",
        },
        {
          en: "Expand one word into two: child says “milk” → you say “want milk”.",
          te: "ఒక పదాన్ని రెండుగా: “పాలు” → “పాలు కావాలి”.",
        },
        {
          en: "Read the same picture book daily and point as you talk.",
          te: "ప్రతిరోజు అదే చిత్ర పుస్తకం — చూపుతూ మాట్లాడండి.",
        },
      ],
    },
    social: {
      title: { en: "Share interest and pretend starts", te: "ఆసక్తి పంచుకోవడం & నటన మొదలు" },
      steps: [
        {
          en: "When the child shows a toy, look at it together and comment: “Wow, red car!”",
          te: "బొమ్మ చూపితే కలిసి చూసి చెప్పండి: “వావ్, ఎర్ర కారు!”",
        },
        {
          en: "Offer a toy phone / cup for simple pretend; copy the child’s idea.",
          te: "టాయ్ ఫోన్ / కప్పు ఇచ్చి నటన — పిల్ల ఆలోచనను అనుసరించండి.",
        },
        {
          en: "Arrange short parallel play near another child with similar toys.",
          te: "మరో పిల్ల దగ్గర ఒకేలాంటి బొమ్మలతో సమాంతర ఆట.",
        },
      ],
    },
    cognitive: {
      title: { en: "Simple pretend and two-step play", te: "సాధారణ నటన & రెండు దశల ఆట" },
      steps: [
        {
          en: "Hide a toy under two cups and take turns finding it.",
          te: "రెండు కప్పుల కింద బొమ్మ దాచి వంతులు తీసుకుని వెతకండి.",
        },
        {
          en: "Give a two-step request with gesture: “Take the block and give it to me.”",
          te: "సంజ్ఞతో రెండు దశలు: “బ్లాక్ తీసుకుని నాకు ఇవ్వు.”",
        },
        {
          en: "Feed a doll / soft toy after “cooking” with a bowl.",
          te: "గిన్నెతో “వంట” చేసి బొమ్మకు తినిపించండి.",
        },
      ],
    },
  },
  preschool: {
    gross_motor: {
      title: { en: "Jump, pedal, and playground practice", te: "దూకడం, పెడల్, ప్లేగ్రౌండ్" },
      steps: [
        {
          en: "Practice jumping down from a low step and hopping in place holding hands.",
          te: "తక్కువ మెట్టు నుంచి దూకడం, చేతులు పట్టుకుని ఒక చోట దూకడం.",
        },
        {
          en: "Use a ride-on or tricycle in a safe open area for 10 minutes daily.",
          te: "సురక్షిత స్థలంలో రైడ్-ఆన్ / ట్రైసైకిల్ రోజుకు 10 నిమిషాలు.",
        },
        {
          en: "Play catch with a large soft ball at short distance.",
          te: "దగ్గర నుంచి పెద్ద మెత్తని బంతి పట్టుకోవడం.",
        },
      ],
    },
    fine_motor: {
      title: { en: "Drawing, beads, and buttons", te: "గీయడం, పూసలు, బటన్లు" },
      steps: [
        {
          en: "Copy a circle / cross together; keep sessions short and fun.",
          te: "వృత్తం / క్రాస్ కలిసి అనుకరించండి — చిన్న, సరదా సెషన్లు.",
        },
        {
          en: "String large beads or pasta; sort by colour.",
          te: "పెద్ద పూసలు / పాస్తా దారంలో పెట్టి రంగు వారీగా వేరు చేయండి.",
        },
        {
          en: "Practice large buttons on a spare shirt while you supervise.",
          te: "మీ పర్యవేక్షణలో పెద్ద బటన్లు వేసే అభ్యాసం.",
        },
      ],
    },
    language: {
      title: { en: "Sentences, questions, and stories", te: "వాక్యాలు, ప్రశ్నలు, కథలు" },
      steps: [
        {
          en: "Ask open questions: “What happened?” and wait longer than feels natural.",
          te: "తెరిచిన ప్రశ్నలు: “ఏమైంది?” — సహనంగా వేచి ఉండండి.",
        },
        {
          en: "Retell a short daily story together (“First park, then snack…”).",
          te: "రోజు చిన్న కథ కలిసి: “ముందు పార్క్, తర్వాత టిఫిన్…”",
        },
        {
          en: "Limit background TV during talk time so speech is clearer to hear.",
          te: "మాట్లాడే సమయంలో నేపథ్య TV తగ్గించండి.",
        },
      ],
    },
    social: {
      title: { en: "Turns, friends, and sharing practice", te: "వంతులు, స్నేహం, పంచుకోవడం" },
      steps: [
        {
          en: "Play a simple turn-taking game with a timer (“my turn / your turn”).",
          te: "టైమర్‌తో వంతుల ఆట (“నా వంతు / నీ వంతు”).",
        },
        {
          en: "Arrange short playdates with one peer and similar toys.",
          te: "ఒక స్నేహితుడితో చిన్న ప్లేడేట్ — ఒకేలాంటి బొమ్మలు.",
        },
        {
          en: "Praise sharing and waiting specifically: “You waited — that helped.”",
          te: "పంచుకోవడం / వేచి ఉండడం ప్రత్యేకంగా ప్రశంసించండి.",
        },
      ],
    },
    cognitive: {
      title: { en: "Sort, count, and role play", te: "వేరు చేయడం, లెక్క, పాత్ర ఆట" },
      steps: [
        {
          en: "Sort spoons/cups by size or colour for 5 minutes.",
          te: "స్పూన్లు / కప్పులు పరిమాణం లేదా రంగు వారీగా 5 నిమిషాలు.",
        },
        {
          en: "Count snacks aloud together up to 5–10.",
          te: "టిఫిన్ ముక్కలు కలిసి 5–10 వరకు లెక్కించండి.",
        },
        {
          en: "Play doctor / shop with real labels and pretend money.",
          te: "డాక్టర్ / షాప్ ఆట — లేబుల్స్, నటన డబ్బు.",
        },
      ],
    },
  },
  school: {
    gross_motor: {
      title: { en: "Balance, sports, and outdoor play", te: "సమతుల్యం, క్రీడలు, బయట ఆట" },
      steps: [
        {
          en: "Practice standing on one foot for a few seconds each side, holding a wall if needed.",
          te: "ఒక కాలిపై కొన్ని సెకన్లు — అవసరమైతే గోడ పట్టుకోండి.",
        },
        {
          en: "Join a regular outdoor game (catch, skipping, cycling with trainers).",
          te: "రెగ్యులర్ బయట ఆట (బంతి, స్కిప్పింగ్, ట్రైనర్లతో సైకిల్).",
        },
        {
          en: "Keep PE / park time daily even on busy school days — 20–30 minutes.",
          te: "బిజీ రోజుల్లో కూడా రోజుకు 20–30 నిమిషాలు పార్క్ / PE.",
        },
      ],
    },
    fine_motor: {
      title: { en: "Writing and hand skills", te: "రాత & చేతి నైపుణ్యాలు" },
      steps: [
        {
          en: "Short daily handwriting practice (5–10 minutes) with correct pencil grip modelling.",
          te: "రోజు 5–10 నిమిషాలు రాత — సరైన పెన్సిల్ పట్టు చూపించండి.",
        },
        {
          en: "Practice buttons, zips, and tying with slow demonstration.",
          te: "బటన్లు, జిప్పులు, కట్టడం — మెల్లగా చూపించి అభ్యాసం.",
        },
        {
          en: "Craft cutting / pasting once or twice a week for hand strength.",
          te: "వారానికి 1–2 సార్లు కత్తిరించడం / అతికించడం.",
        },
      ],
    },
    language: {
      title: { en: "Classroom talk and clear sentences", te: "తరగతి మాట & స్పష్ట వాక్యాలు" },
      steps: [
        {
          en: "Ask the child to retell the school day in 3 sentences.",
          te: "స్కూల్ రోజు 3 వాక్యాల్లో చెప్పమనండి.",
        },
        {
          en: "Practice following 2–3 step instructions at home (pack bag, shoes, water).",
          te: "ఇంట్లో 2–3 దశల సూచనలు (బ్యాగ్, షూస్, నీళ్లు).",
        },
        {
          en: "Read aloud together and ask “why / what if” questions.",
          te: "కలిసి బిగ్గరగా చదివి “ఎందుకు / అయితే ఏమి” అడగండి.",
        },
      ],
    },
    social: {
      title: { en: "Friendships and rules", te: "స్నేహాలు & నియమాలు" },
      steps: [
        {
          en: "Role-play joining a game: “Can I play?” and accepting “not now”.",
          te: "ఆటలో చేరడం రోల్-ప్లే: “నేను ఆడవచ్చా?” — “ఇప్పుడు కాదు” అంగీకరించడం.",
        },
        {
          en: "Agree 2–3 simple home rules and review them calmly after breaks.",
          te: "2–3 సాధారణ ఇంటి నియమాలు — ఉల్లంఘన తర్వాత ప్రశాంతంగా చర్చ.",
        },
        {
          en: "Arrange one predictable weekly play / club with peers.",
          te: "వారానికి ఒక స్థిరమైన స్నేహితుల ఆట / క్లబ్.",
        },
      ],
    },
    cognitive: {
      title: { en: "Homework habits and problem solving", te: "హోంవర్క్ అలవాట్లు & సమస్య పరిష్కారం" },
      steps: [
        {
          en: "Use a visual checklist for homework steps; tick together.",
          te: "హోంవర్క్ దశల చెక్‌లిస్ట్ — కలిసి టిక్ చేయండి.",
        },
        {
          en: "Break tasks into 10-minute chunks with a short movement break.",
          te: "10 నిమిషాల ముక్కలుగా పని — మధ్యలో చిన్న కదలిక విరామం.",
        },
        {
          en: "Solve one everyday “what if” together (missed pencil, rain).",
          te: "రోజువారీ “అయితే ఏమి” ఒకటి కలిసి పరిష్కరించండి.",
        },
      ],
    },
  },
  adolescent: {
    gross_motor: {
      title: { en: "Fitness with peers", te: "స్నేహితులతో ఫిట్‌నెస్" },
      steps: [
        {
          en: "Pick one enjoyable activity (walking, cycling, team sport) 4 days a week.",
          te: "ఇష్టమైన ఒక కార్యకలాపం వారానికి 4 రోజులు (నడక, సైకిల్, జట్టు క్రీడ).",
        },
        {
          en: "Focus on coordination games rather than comparison with peers.",
          te: "పోలిక కంటే సమన్వయ ఆటలపై దృష్టి.",
        },
        {
          en: "Stretch after screen-heavy study blocks.",
          te: "ఎక్కువ స్క్రీన్ చదువు తర్వాత స్ట్రెచ్.",
        },
      ],
    },
    fine_motor: {
      title: { en: "Practical hand skills", te: "ఆచరణాత్మక చేతి నైపుణ్యాలు" },
      steps: [
        {
          en: "Practice typing / note-taking in short timed sessions if handwriting is hard.",
          te: "రాత కష్టమైతే చిన్న సమయాల్లో టైపింగ్ / నోట్స్ అభ్యాసం.",
        },
        {
          en: "Involve the teen in cooking steps that need hand control (chopping soft items with supervision).",
          te: "వంటలో చేతి నియంత్రణ దశలు (పర్యవేక్షణతో మెత్తని కూరగాయలు).",
        },
        {
          en: "Keep craft / music / drawing as low-pressure fine-motor practice.",
          te: "క్రాఫ్ట్ / సంగీతం / డ్రాయింగ్ ఒత్తిడి లేకుండా.",
        },
      ],
    },
    language: {
      title: { en: "Explain and discuss", te: "వివరించడం & చర్చ" },
      steps: [
        {
          en: "Ask for a 1-minute summary of a lesson or news story.",
          te: "పాఠం / వార్త 1 నిమిషం సారాంశం చెప్పమనండి.",
        },
        {
          en: "Practice polite disagreement and asking for help at school.",
          te: "మర్యాదగా విభేదించడం, స్కూల్‌లో సహాయం అడగడం అభ్యాసం.",
        },
        {
          en: "Reduce overlapping conversations; one speaker at a time at dinner.",
          te: "డిన్నర్‌లో ఒకసారి ఒకరు మాట్లాడే అలవాటు.",
        },
      ],
    },
    social: {
      title: { en: "Responsibility and empathy", te: "బాధ్యత & సానుభూతి" },
      steps: [
        {
          en: "Assign one real home responsibility with a clear weekly check-in.",
          te: "ఒక నిజమైన ఇంటి బాధ్యత — వారం చెక్-ఇన్.",
        },
        {
          en: "Talk through a friendship conflict with “what they might feel”.",
          te: "స్నేహ సమస్యను “వారు ఎలా అనుభవించి ఉంటారు”తో చర్చించండి.",
        },
        {
          en: "Encourage one group activity (club, sport, volunteering) with support.",
          te: "ఒక సమూహ కార్యకలాపం (క్లబ్, క్రీడ, సేవ) — మీ మద్దతుతో.",
        },
      ],
    },
    cognitive: {
      title: { en: "Planning and “what if” thinking", te: "ప్లానింగ్ & “అయితే ఏమి”" },
      steps: [
        {
          en: "Plan the next day together the night before (bag, deadlines, rest).",
          te: "ముందు రాత్రి తర్వాతి రోజు ప్లాన్ (బ్యాగ్, డెడ్‌లైన్లు, విశ్రాంతి).",
        },
        {
          en: "Use a simple planner app or paper diary for one subject first.",
          te: "ముందు ఒక సబ్జెక్ట్‌కు ప్లానర్ / డైరీ.",
        },
        {
          en: "Practice one problem-solving script: stop, options, choose, review.",
          te: "సమస్య పరిష్కారం: ఆగు, ఎంపికలు, ఎంచుకో, సమీక్ష.",
        },
      ],
    },
  },
};

const ADHD_ACTIVITIES: Record<
  ActivityAgeBand,
  { title: LocalizedText; steps: LocalizedText[] }
> = {
  "0-6m": {
    title: { en: "Calm attention routines", te: "ప్రశాంత దృష్టి రొటీన్లు" },
    steps: [
      {
        en: "Keep play short and one toy at a time.",
        te: "ఆట చిన్నగా — ఒకసారి ఒక బొమ్మ.",
      },
    ],
  },
  "6-12m": {
    title: { en: "Short focus games", te: "చిన్న దృష్టి ఆటలు" },
    steps: [
      {
        en: "Roll a ball back and forth for 1–2 minutes, then stop while it is still fun.",
        te: "1–2 నిమిషాలు బంతి — ఆనందంగా ఉండగానే ఆపండి.",
      },
    ],
  },
  "1-2y": {
    title: { en: "Move then focus", te: "కదిలి తర్వాత దృష్టి" },
    steps: [
      {
        en: "Give a movement break, then a 2-minute tidy-up or stacking game.",
        te: "కదలిక విరామం తర్వాత 2 నిమిషాలు పేర్చడం / జోడించడం.",
      },
      {
        en: "Use clear one-step instructions with eye contact.",
        te: "కంటి సంపర్కంతో ఒక దశ సూచనలు.",
      },
    ],
  },
  preschool: {
    title: { en: "Attention & waiting games", te: "దృష్టి & వేచి ఉండే ఆటలు" },
    steps: [
      {
        en: "Play “freeze dance” and short turn-taking with a timer.",
        te: "“ఫ్రీజ్ డాన్స్” మరియు టైమర్‌తో వంతులు.",
      },
      {
        en: "Homework-style tasks in 5-minute blocks with praise for finishing.",
        te: "5 నిమిషాల ముక్కలు — పూర్తయ్యాక ప్రశంస.",
      },
      {
        en: "Reduce background screens during focused play.",
        te: "దృష్టి ఆట సమయంలో నేపథ్య స్క్రీన్లు తగ్గించండి.",
      },
    ],
  },
  school: {
    title: { en: "Home focus plan", te: "ఇంటి దృష్టి ప్రణాళిక" },
    steps: [
      {
        en: "Clear desk, one subject at a time, phone away during the block.",
        te: "శుభ్రమైన టేబుల్, ఒక సబ్జెక్ట్, ఫోన్ దూరం.",
      },
      {
        en: "Use a checklist and movement break every 15–20 minutes.",
        te: "చెక్‌లిస్ట్ + ప్రతి 15–20 నిమిషాలకు కదలిక విరామం.",
      },
      {
        en: "Agree morning/evening routines so belongings are less often lost.",
        te: "ఉదయం/సాయంత్రం రొటీన్ — వస్తువులు తక్కువగా పోతాయి.",
      },
    ],
  },
  adolescent: {
    title: { en: "Self-monitoring habits", te: "స్వీయ పర్యవేక్షణ అలవాట్లు" },
    steps: [
      {
        en: "Plan study blocks with a visible timer and written priorities.",
        te: "కనిపించే టైమర్ + రాత ప్రాధాన్యతలతో స్టడీ బ్లాక్స్.",
      },
      {
        en: "Practice “start within 2 minutes” for disliked tasks.",
        te: "ఇష్టంలేని పనులు 2 నిమిషాల్లో మొదలుపెట్టే అభ్యాసం.",
      },
      {
        en: "Review what worked at the end of the week with a parent/mentor.",
        te: "వారం చివర ఏది పనిచేసిందో తల్లిదండ్రులతో సమీక్ష.",
      },
    ],
  },
};

const AUTISM_ACTIVITIES: Record<
  ActivityAgeBand,
  { title: LocalizedText; steps: LocalizedText[] }
> = {
  "0-6m": {
    title: { en: "Face and voice connection", te: "ముఖం & స్వరం అనుసంధానం" },
    steps: [
      {
        en: "Hold baby at eye level and talk softly; pause for any look or sound.",
        te: "కళ్ల స్థాయిలో పట్టుకుని మెల్లగా మాట్లాడండి — చూపు/శబ్దానికి విరామం.",
      },
    ],
  },
  "6-12m": {
    title: { en: "Name and show games", te: "పేరు & చూపించే ఆటలు" },
    steps: [
      {
        en: "Call name, wait, then show a favourite toy when they look.",
        te: "పేరు పిలిచి వేచి, చూసినప్పుడు ఇష్టమైన బొమ్మ చూపించండి.",
      },
      {
        en: "Point to something interesting and look back at baby’s eyes.",
        te: "ఆసక్తికరమైనది చూపి మళ్లీ పాప కళ్లు చూడండి.",
      },
    ],
  },
  "1-2y": {
    title: { en: "Pointing and pretend together", te: "వేలు చూపడం & కలిసి నటన" },
    steps: [
      {
        en: "Practice pointing to request (“want ball”) then celebrate sharing the look.",
        te: "కోరికకు వేలు (“బంతి కావాలి”) — కలిసి చూసినందుకు సంబరం.",
      },
      {
        en: "Simple pretend with a cup/phone; keep your face in view.",
        te: "కప్పు/ఫోన్ నటన — మీ ముఖం కనిపించేలా.",
      },
      {
        en: "Keep routines predictable; preview small changes with a picture or word.",
        te: "రొటీన్ స్థిరం — చిన్న మార్పులు ముందుగా చిత్రం/పదంతో చెప్పండి.",
      },
    ],
  },
  preschool: {
    title: { en: "Back-and-forth and flexible play", te: "మాట్లాడుకోవడం & మార్పు సహనం" },
    steps: [
      {
        en: "Build short conversation turns: comment, wait, respond.",
        te: "చిన్న మాట్లాడుకోలు: చెప్పు, వేచి, స్పందించు.",
      },
      {
        en: "Practice one tiny routine change daily with warning (“after this song, shoes”).",
        te: "రోజు ఒక చిన్న మార్పు — ముందస్తు హెచ్చరికతో.",
      },
      {
        en: "Join the child’s interest first, then gently add your idea.",
        te: "ముందు పిల్ల ఆసక్తిలో చేరి, తర్వాత మీ ఆలోచన మెల్లగా చేర్చండి.",
      },
    ],
  },
  school: {
    title: { en: "Friends and sensory comfort", te: "స్నేహం & సెన్సరీ సౌకర్యం" },
    steps: [
      {
        en: "Practice social scripts for recess (“Can I play?”).",
        te: "విరామం సామాజిక స్క్రిప్ట్‌లు (“నేను ఆడవచ్చా?”).",
      },
      {
        en: "Agree a quiet break plan for loud / crowded places.",
        te: "గోల / గుంపు స్థలాలకు నిశ్శబ్ద విరామ ప్రణాళిక.",
      },
      {
        en: "Use visual schedules for morning and homework.",
        te: "ఉదయం & హోంవర్క్‌కు దృశ్య షెడ్యూల్.",
      },
    ],
  },
  adolescent: {
    title: { en: "Conversation and self-advocacy", te: "సంభాషణ & స్వీయ వాదన" },
    steps: [
      {
        en: "Practice explaining needs to a teacher in 2–3 clear sentences.",
        te: "ఉపాధ్యాయునికి 2–3 వాక్యాల్లో అవసరాలు చెప్పే అభ్యాసం.",
      },
      {
        en: "Role-play reading facial cues and asking “Are you busy?”",
        te: "ముఖ సంకేతాలు & “మీరు బిజీగా ఉన్నారా?” రోల్-ప్లే.",
      },
      {
        en: "Keep special interests as strengths while scheduling flexible family time.",
        te: "ప్రత్యేక ఆసక్తులను బలంగా ఉంచి, కుటుంబ సమయాన్ని కూడా ప్లాన్ చేయండి.",
      },
    ],
  },
};

function localizeActivity(
  focus: ActivityFocus,
  pack: { title: LocalizedText; steps: LocalizedText[] },
  lang: ScreeningLang,
): ActivityGroup {
  return {
    focus,
    label: pickText(FOCUS_LABEL[focus], lang),
    title: pickText(pack.title, lang),
    steps: pack.steps.map((s) => pickText(s, lang)),
  };
}

export function buildActivityGroups(result: {
  ageMonths: number;
  lang: ScreeningLang;
  domainResults: ScreeningResult["domainResults"];
  adhd: ScreeningResult["adhd"];
  autism: ScreeningResult["autism"];
}): ActivityGroup[] {
  const band = activityAgeBand(result.ageMonths);
  const lang = result.lang;
  const groups: ActivityGroup[] = [];
  const seen = new Set<ActivityFocus>();

  for (const domain of result.domainResults) {
    const needsPractice =
      domain.status === "red_flag" ||
      domain.missed.length > 0 ||
      domain.redFlags.length > 0;
    if (!needsPractice) continue;
    const pack = ACTIVITIES[band][domain.domain];
    if (!pack || seen.has(domain.domain)) continue;
    seen.add(domain.domain);
    groups.push(localizeActivity(domain.domain, pack, lang));
  }

  if (result.adhd.requireAssessment) {
    groups.push(localizeActivity("adhd", ADHD_ACTIVITIES[band], lang));
  }
  if (result.autism.requireAssessment) {
    groups.push(localizeActivity("autism", AUTISM_ACTIVITIES[band], lang));
  }

  return groups;
}

export function buildConsultDoctorAdvice(
  result: {
    lang: ScreeningLang;
    verdict: ScreeningResult["verdict"];
    adhd: ScreeningResult["adhd"];
    autism: ScreeningResult["autism"];
    domainResults: ScreeningResult["domainResults"];
  },
): ConsultDoctorAdvice {
  const lang = result.lang;
  const urgent =
    result.verdict === "NEEDS_DEVELOPMENT_ASSESSMENT" ||
    result.adhd.requireAssessment ||
    result.autism.requireAssessment;

  const delayed = result.domainResults
    .filter((d) => d.status === "red_flag")
    .map((d) => d.label);

  if (lang === "te") {
    return {
      urgent,
      title: urgent ? "వైద్యుని సలహా తీసుకోండి" : "తదుపరి సందర్శనలో చర్చించండి",
      body: urgent
        ? delayed.length > 0
          ? `ఈ స్క్రీన్‌లో ఆందోళనలు కనిపించాయి (${delayed.join(", ")}). ఇది నిర్ధారణ కాదు — వయసు-ఆధారిత అంచనా కోసం పీడియాట్రిషియన్‌ను కలవండి. కింది ఆటలు ఇంట్లో సాధనకు మాత్రమే.`
          : "ఈ స్క్రీన్‌లో అంచనా సిఫారసు ఉంది. ఇది నిర్ధారణ కాదు — వీలైనంత త్వరగా పీడియాట్రిషియన్‌ను కలవండి. కింది ఆటలు ఇంట్లో సాధనకు మాత్రమే."
        : "మైలురాళ్లు ఈ స్క్రీన్‌లో సాధారణంగా కనిపిస్తున్నాయి. ఏదైనా ఆందోళన ఉంటే లేదా నైపుణ్యం పోతే వెంటనే డాక్టర్‌ను కలవండి.",
      doctorLine: `${DOCTOR_NAME} · ${CLINIC_NAME}`,
    };
  }

  return {
    urgent,
    title: urgent ? "Please consult your doctor" : "Discuss at your next visit",
    body: urgent
      ? delayed.length > 0
        ? `This screen suggests concerns in ${delayed.join(", ")}. It is not a diagnosis — see a paediatrician for an age-based assessment. The activities below are home practice only, not a substitute for clinical care.`
        : "This screen suggests a professional assessment. It is not a diagnosis — please see a paediatrician soon. The activities below are home practice only, not a substitute for clinical care."
      : "Milestones look age-appropriate on this screen. Still tell your paediatrician if you have any worry, or if a skill is lost.",
    doctorLine: `${DOCTOR_NAME} · ${CLINIC_NAME}`,
  };
}

export function bandLabelForActivities(
  ageMonths: number,
  lang: ScreeningLang,
): string {
  return pickText(BAND_LABEL[activityAgeBand(ageMonths)], lang);
}
