export type VaccineCoverage = "uip" | "private" | "both" | "endemic";

export type ScheduleVaccine = {
  id: string;
  label: string;
  coverage: VaccineCoverage;
  note?: string;
};

export type ScheduleVisit = {
  age: string;
  vaccines: ScheduleVaccine[];
};

export type VaccineDetail = {
  id: string;
  name: string;
  alsoCalled?: string;
  protectsAgainst: string;
  why: string;
  coverage: VaccineCoverage;
};

/** IAP-ACVIP Immunization Timetable 2023 (routine use). */
export const IAP_SCHEDULE_SOURCE =
  "IAP ACVIP Recommended Immunization Schedule (2023)";

export const IAP_SCHEDULE: ScheduleVisit[] = [
  {
    age: "Birth",
    vaccines: [
      { id: "bcg", label: "BCG", coverage: "uip", note: "Before discharge" },
      { id: "opv", label: "OPV-0", coverage: "uip", note: "As soon as possible after birth" },
      {
        id: "hepb",
        label: "Hepatitis B-1",
        coverage: "uip",
        note: "Within 24 hours of birth",
      },
    ],
  },
  {
    age: "6 weeks",
    vaccines: [
      { id: "dtp", label: "DTwP / DTaP-1", coverage: "both" },
      { id: "ipv", label: "IPV-1", coverage: "both", note: "Full-dose IM in IAP / private path" },
      { id: "hib", label: "Hib-1", coverage: "uip", note: "In UIP as Pentavalent" },
      { id: "hepb", label: "Hepatitis B-2", coverage: "uip" },
      { id: "rota", label: "Rotavirus-1", coverage: "uip" },
      { id: "pcv", label: "PCV-1", coverage: "uip" },
    ],
  },
  {
    age: "10 weeks",
    vaccines: [
      { id: "dtp", label: "DTwP / DTaP-2", coverage: "both" },
      { id: "ipv", label: "IPV-2", coverage: "both" },
      { id: "hib", label: "Hib-2", coverage: "uip" },
      { id: "hepb", label: "Hepatitis B-3", coverage: "uip" },
      {
        id: "rota",
        label: "Rotavirus-2",
        coverage: "uip",
        note: "RV1 (GSK): 2-dose series; most other brands: 3 doses",
      },
      { id: "pcv", label: "PCV-2", coverage: "uip" },
    ],
  },
  {
    age: "14 weeks",
    vaccines: [
      { id: "dtp", label: "DTwP / DTaP-3", coverage: "both" },
      { id: "ipv", label: "IPV-3", coverage: "both" },
      { id: "hib", label: "Hib-3", coverage: "uip" },
      {
        id: "hepb",
        label: "Hepatitis B-4",
        coverage: "both",
        note: "Extra dose allowed inside a combination vaccine",
      },
      { id: "rota", label: "Rotavirus-3", coverage: "uip" },
      { id: "pcv", label: "PCV-3", coverage: "uip" },
    ],
  },
  {
    age: "6 months",
    vaccines: [
      {
        id: "flu",
        label: "Influenza-1",
        coverage: "private",
        note: "0.5 mL; start annual flu shots",
      },
    ],
  },
  {
    age: "7 months",
    vaccines: [
      {
        id: "flu",
        label: "Influenza-2",
        coverage: "private",
        note: "Then yearly in the pre-monsoon period till 5 years",
      },
    ],
  },
  {
    age: "6–9 months",
    vaccines: [
      {
        id: "tcv",
        label: "Typhoid conjugate (TCV)",
        coverage: "private",
        note: "No routine booster recommended by IAP",
      },
    ],
  },
  {
    age: "9 months",
    vaccines: [
      {
        id: "mmr",
        label: "MMR-1",
        coverage: "private",
        note: "UIP gives MR (no mumps) free; IAP prefers MMR",
      },
    ],
  },
  {
    age: "12 months",
    vaccines: [
      {
        id: "hepa",
        label: "Hepatitis A",
        coverage: "private",
        note: "Live vaccine: 1 dose; inactivated: start 2-dose series",
      },
    ],
  },
  {
    age: "15 months",
    vaccines: [
      { id: "mmr", label: "MMR-2", coverage: "private" },
      { id: "var", label: "Varicella-1", coverage: "private" },
      { id: "pcv", label: "PCV booster", coverage: "both" },
    ],
  },
  {
    age: "16–18 months",
    vaccines: [
      { id: "dtp", label: "DTwP / DTaP booster-1", coverage: "both" },
      {
        id: "hib",
        label: "Hib booster",
        coverage: "private",
        note: "IAP booster; not a UIP booster visit",
      },
      { id: "ipv", label: "IPV booster-1", coverage: "both" },
    ],
  },
  {
    age: "18–19 months",
    vaccines: [
      {
        id: "hepa",
        label: "Hepatitis A-2",
        coverage: "private",
        note: "Only if inactivated Hep A was used",
      },
      {
        id: "var",
        label: "Varicella-2",
        coverage: "private",
        note: "3–6 months after dose 1",
      },
    ],
  },
  {
    age: "4–6 years",
    vaccines: [
      { id: "dtp", label: "DTwP / DTaP booster-2", coverage: "both" },
      { id: "ipv", label: "IPV booster-2", coverage: "both" },
      { id: "mmr", label: "MMR-3", coverage: "private" },
    ],
  },
  {
    age: "9–14 years",
    vaccines: [
      {
        id: "hpv",
        label: "HPV (2 doses)",
        coverage: "private",
        note: "0 and 6 months; girls and boys",
      },
    ],
  },
  {
    age: "10–12 years",
    vaccines: [
      {
        id: "tdap",
        label: "Tdap",
        coverage: "private",
        note: "Adolescent pertussis booster; UIP uses Td",
      },
    ],
  },
  {
    age: "15–18 years",
    vaccines: [
      {
        id: "hpv",
        label: "HPV (3 doses if starting late)",
        coverage: "private",
        note: "0–2–6 months if not given earlier",
      },
      {
        id: "td",
        label: "Td",
        coverage: "both",
        note: "IAP 2023: Td at 16–18 years",
      },
    ],
  },
];

export const VACCINE_DETAILS: VaccineDetail[] = [
  {
    id: "bcg",
    name: "BCG",
    alsoCalled: "Bacillus Calmette–Guérin",
    protectsAgainst: "Severe forms of tuberculosis (especially TB meningitis and miliary TB in young children)",
    why: "Given at birth so the immune system learns to fight TB before exposure. A small scar on the arm weeks later is expected.",
    coverage: "uip",
  },
  {
    id: "opv",
    name: "OPV",
    alsoCalled: "Oral polio vaccine",
    protectsAgainst: "Poliomyelitis (polio paralysis)",
    why: "Oral drops build gut immunity and help keep India polio-free. Birth and later doses matter even when IPV is also given.",
    coverage: "uip",
  },
  {
    id: "hepb",
    name: "Hepatitis B",
    protectsAgainst: "Hepatitis B virus — chronic liver infection, cirrhosis, liver cancer",
    why: "The birth dose within 24 hours blocks mother-to-child transmission. Later doses complete long-term protection.",
    coverage: "uip",
  },
  {
    id: "dtp",
    name: "DTwP / DTaP",
    alsoCalled: "Diphtheria, tetanus, pertussis",
    protectsAgainst: "Diphtheria, tetanus (lockjaw), and whooping cough (pertussis)",
    why: "Whooping cough is dangerous in young infants. Primary doses at 6, 10 and 14 weeks, then boosters, keep antibody levels up. DTwP is in UIP; DTaP (‘painless’) is a private option with fewer local reactions.",
    coverage: "both",
  },
  {
    id: "hib",
    name: "Hib",
    alsoCalled: "Haemophilus influenzae type b",
    protectsAgainst: "Hib meningitis, pneumonia, and epiglottitis",
    why: "Before Hib vaccine, bacterial meningitis left many children with deafness or brain injury. Primary series is in UIP Pentavalent; IAP also advises a booster around 16–18 months (usually private).",
    coverage: "both",
  },
  {
    id: "ipv",
    name: "IPV",
    alsoCalled: "Inactivated polio vaccine",
    protectsAgainst: "Polio",
    why: "Injectable IPV gives strong blood immunity. IAP uses full-dose IM at 6–10–14 weeks plus boosters. UIP uses fractional intradermal IPV with OPV — both paths protect; your paediatrician aligns the schedule if you switch.",
    coverage: "both",
  },
  {
    id: "rota",
    name: "Rotavirus",
    protectsAgainst: "Severe watery diarrhoea and dehydration from rotavirus",
    why: "Rotavirus was a leading cause of hospital diarrhoea in Indian infants. Oral drops are timed early (before the gut is heavily exposed).",
    coverage: "uip",
  },
  {
    id: "pcv",
    name: "PCV",
    alsoCalled: "Pneumococcal conjugate vaccine",
    protectsAgainst: "Pneumococcal pneumonia, meningitis, and blood infection",
    why: "Streptococcus pneumoniae is a common cause of serious childhood lung and brain infections. Primary series plus a booster closes the highest-risk window.",
    coverage: "uip",
  },
  {
    id: "mmr",
    name: "MMR",
    alsoCalled: "Measles, mumps, rubella",
    protectsAgainst: "Measles, mumps (including orchitis and meningitis), and rubella",
    why: "Measles spreads fast and can cause encephalitis. Rubella in pregnancy harms the baby. Mumps is why IAP prefers MMR over MR alone.",
    coverage: "private",
  },
  {
    id: "mr",
    name: "MR (UIP)",
    alsoCalled: "Measles–rubella",
    protectsAgainst: "Measles and rubella (no mumps)",
    why: "Free under UIP at about 9 months and 16–24 months. If only MR is given, ask about adding MMR so mumps is covered.",
    coverage: "uip",
  },
  {
    id: "var",
    name: "Varicella",
    alsoCalled: "Chickenpox vaccine",
    protectsAgainst: "Chickenpox and its complications (skin infection, pneumonia, encephalitis)",
    why: "Chickenpox is usually mild but can hospitalise children and leave scars. Two doses give strong, lasting protection. Not in UIP.",
    coverage: "private",
  },
  {
    id: "hepa",
    name: "Hepatitis A",
    protectsAgainst: "Hepatitis A — food- and water-borne liver infection",
    why: "Common where sanitation is uneven. One live dose or two inactivated doses prevent weeks of jaundice and school loss. Not in UIP.",
    coverage: "private",
  },
  {
    id: "tcv",
    name: "Typhoid conjugate (TCV)",
    protectsAgainst: "Typhoid fever",
    why: "Typhoid still circulates with contaminated food and water. One conjugate dose from 6–9 months gives durable protection. Not in routine UIP.",
    coverage: "private",
  },
  {
    id: "flu",
    name: "Influenza",
    alsoCalled: "Flu vaccine",
    protectsAgainst: "Seasonal influenza and related pneumonia",
    why: "Young children get severe flu more often. IAP advises starting at 6 months, two priming doses, then yearly till at least 5 years (and longer if high-risk).",
    coverage: "private",
  },
  {
    id: "hpv",
    name: "HPV",
    alsoCalled: "Human papillomavirus vaccine",
    protectsAgainst: "HPV cancers (cervical, and also oropharyngeal, anal, penile) and genital warts",
    why: "Best given before sexual exposure. IAP 2023 recommends it for girls and boys; 2 doses at 9–14 years, or 3 doses if started later.",
    coverage: "private",
  },
  {
    id: "tdap",
    name: "Tdap",
    protectsAgainst: "Tetanus, diphtheria, and pertussis in adolescents",
    why: "Antibody levels fall in the school years. Tdap at ~10–12 years boosts whooping-cough protection; UIP more often uses Td without pertussis.",
    coverage: "private",
  },
  {
    id: "td",
    name: "Td",
    protectsAgainst: "Tetanus and diphtheria",
    why: "IAP 2023 adds Td at 16–18 years because diphtheria still appears in older teens and young adults when boosters are missed.",
    coverage: "both",
  },
  {
    id: "je",
    name: "Japanese encephalitis (JE)",
    protectsAgainst: "Japanese encephalitis (brain infection)",
    why: "Given under UIP only in endemic districts. Ask if your area is covered; private JE may be advised for travel to endemic zones.",
    coverage: "endemic",
  },
];

export const PRIVATE_BEYOND_UIP: {
  id: string;
  title: string;
  detail: string;
}[] = [
  {
    id: "var",
    title: "Varicella (chickenpox)",
    detail: "Two doses — not part of free UIP. Strongly recommended by IAP.",
  },
  {
    id: "hepa",
    title: "Hepatitis A",
    detail: "Live (1 dose) or inactivated (2 doses). Protects against food/water jaundice.",
  },
  {
    id: "tcv",
    title: "Typhoid conjugate (TCV)",
    detail: "Usually one dose from 6–9 months. Important where typhoid is common.",
  },
  {
    id: "flu",
    title: "Influenza (annual)",
    detail: "Start at 6 months; yearly till 5 years (longer if high-risk).",
  },
  {
    id: "mmr",
    title: "MMR (for mumps)",
    detail:
      "UIP gives MR (measles + rubella only). MMR or an extra mumps-containing dose is needed privately for full IAP cover.",
  },
  {
    id: "hib-boost",
    title: "Hib booster (16–18 months)",
    detail: "Primary Hib is in UIP Pentavalent; the toddler booster is an IAP / private addition.",
  },
  {
    id: "dtap",
    title: "DTaP / hexavalent combinations",
    detail:
      "Same diseases as UIP, but private clinics often use DTaP (‘painless’) or 5-/6-in-1 shots with full-dose IPV. Cost is private; disease cover overlaps UIP.",
  },
  {
    id: "hpv",
    title: "HPV (girls and boys)",
    detail: "Adolescent cancer-prevention vaccine. Mostly private (some school/state programmes exist).",
  },
  {
    id: "tdap",
    title: "Tdap at 10–12 years",
    detail: "Adds pertussis boost; UIP adolescent visit is usually Td only.",
  },
];

export const COVERAGE_LABEL: Record<
  VaccineCoverage,
  { short: string; blurb: string }
> = {
  uip: {
    short: "UIP / free",
    blurb: "Routine government Universal Immunization Programme",
  },
  private: {
    short: "Private / IAP",
    blurb: "IAP-recommended; usually taken at a private clinic",
  },
  both: {
    short: "UIP + private options",
    blurb: "Disease covered in UIP; private brands or boosters may differ",
  },
  endemic: {
    short: "UIP if endemic",
    blurb: "Free under UIP in selected districts only",
  },
};
