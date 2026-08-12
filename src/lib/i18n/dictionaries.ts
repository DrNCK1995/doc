/**
 * Lightweight i18n dictionary for English / Hindi / Telugu UI strings.
 * Wire with a locale context later; keys are ready for growth app chrome.
 */
export type Locale = "en" | "hi" | "te";

const dictionaries = {
  en: {
    growthHomeTitle: "Pediatric Growth Monitoring",
    registerChild: "Register Child",
    findPatient: "Find Patient",
    patientId: "Patient ID",
    downloadPdf: "Download PDF",
    addFollowUp: "Add Follow-up",
    nutritionalStatus: "Nutritional status",
  },
  hi: {
    growthHomeTitle: "बाल विकास निगरानी",
    registerChild: "बच्चे का पंजीकरण",
    findPatient: "मरीज़ खोजें",
    patientId: "मरीज़ आईडी",
    downloadPdf: "पीडीएफ डाउनलोड",
    addFollowUp: "फ़ॉलो-अप जोड़ें",
    nutritionalStatus: "पोषण स्थिति",
  },
  te: {
    growthHomeTitle: "శిశు వృద్ధి పర్యవేక్షణ",
    registerChild: "పిల్లను నమోదు చేయండి",
    findPatient: "రోగిని కనుగొనండి",
    patientId: "రోగి ఐడి",
    downloadPdf: "PDF డౌన్‌లోడ్",
    addFollowUp: "ఫాలో-అప్ జోడించండి",
    nutritionalStatus: "పోషక స్థితి",
  },
} as const;

export type DictionaryKey = keyof (typeof dictionaries)["en"];

export function t(locale: Locale, key: DictionaryKey): string {
  return dictionaries[locale][key] ?? dictionaries.en[key];
}

export { dictionaries };
