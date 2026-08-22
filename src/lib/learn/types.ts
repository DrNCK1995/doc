export type LearnLang = "en" | "te";

export type AgeBandId = "newborn" | "2-6m" | "6-12m" | "1-5y";

export type Bilingual = { en: string; te: string };

export type InfographicStep = {
  label: Bilingual;
  detail: Bilingual;
};

export type LearnTopic = {
  id: string;
  bandId: AgeBandId;
  title: Bilingual;
  minutes: number;
  explanation: Bilingual;
  infographic: InfographicStep[];
  seeDoctor: Bilingual[];
  image: {
    src: string;
    alt: Bilingual;
  };
};

export type AgeBand = {
  id: AgeBandId;
  label: Bilingual;
  range: Bilingual;
  accent: string;
  topics: string[];
};
