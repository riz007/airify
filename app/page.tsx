"use client";

import AirQualityChecker from "@/components/AirQualityChecker";
import { ApiCredits } from "@/components/ApiCredits";
import { Language, translations } from "@/lib/translations";
import { useState } from "react";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [language, setLanguage] = useState<Language>("en");
  const translation = translations[language];
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center text-foreground">
          Airify
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-center text-muted-foreground">
          {translation.title}
        </p>
        <AirQualityChecker language={language} setLanguage={setLanguage} />
        <ApiCredits />
      </div>
    </main>
  );
}
