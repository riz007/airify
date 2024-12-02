"use client";

import { getAQIColor, getAQILevel } from "@/lib/aqi";
import { Language, translations } from "@/lib/translations";
import { format, parseISO } from "date-fns";
import { enUS, th } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface AirQualityDisplayProps {
  data: {
    aqi: number;
    city: {
      name: string;
      geo: [number, number];
    };
    iaqi: {
      [key: string]: { v: number };
    };
    dominentpol: string;
    time: {
      s: string;
      tz: string;
    };
    forecast: {
      daily: {
        pm25: Array<{ avg: number; day: string; max: number; min: number }>;
      };
    };
  };
  language: Language;
}

const pollutantInfo = {
  pm25: { name: "PM2.5", description: "Fine particulate matter" },
  pm10: { name: "PM10", description: "Respirable particulate matter" },
  o3: { name: "Ozone", description: "Ground-level ozone" },
  no2: { name: "Nitrogen Dioxide", description: "Toxic gas from combustion" },
  so2: {
    name: "Sulfur Dioxide",
    description: "Toxic gas from fossil fuel combustion",
  },
  co: {
    name: "Carbon Monoxide",
    description: "Toxic gas from incomplete combustion",
  },
};

export default function AirQualityDisplay({
  data,
  language,
}: AirQualityDisplayProps) {
  const { aqi, city, iaqi, dominentpol, time, forecast } = data;
  const aqiColor = getAQIColor(aqi);
  const aqiLevel = getAQILevel(aqi);
  const translation = translations[language];
  const dateLocale = language === "en" ? enUS : th;

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "PPp", { locale: dateLocale });
  };

  const chartData = forecast?.daily?.pm25?.map((day) => ({
    date: format(parseISO(day.day), "MMM d", { locale: dateLocale }),
    avg: day.avg,
    min: day.min,
    max: day.max,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl flex justify-between items-center">
            {city.name || translation.unknown}
            <Badge variant="outline" className="text-lg">
              {formatDate(time.s)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-7xl font-bold" style={{ color: aqiColor }}>
                {aqi}
              </p>
              <p className="text-xl mt-2">{translation.aqi}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold">
                {aqiLevel[language] ?? translation.unknown}
              </p>
              <p className="text-lg mt-2">{translation.level}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{translation.pm25}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold" style={{ color: aqiColor }}>
              {iaqi.pm25?.v || "N/A"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {translation.dominantPollutant}: {dominentpol}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{translation.otherPollutants}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(iaqi).map(
                ([key, value]) =>
                  key !== "pm25" && (
                    <TooltipProvider key={key}>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-muted p-3 rounded-lg cursor-help">
                            <p className="font-medium text-muted-foreground">
                              {key.toUpperCase()}
                            </p>
                            <p className="text-2xl font-semibold">{value.v}</p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {
                              pollutantInfo[key as keyof typeof pollutantInfo]
                                ?.name
                            }
                          </p>
                          <p>
                            {
                              pollutantInfo[key as keyof typeof pollutantInfo]
                                ?.description
                            }
                          </p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{translation.forecast}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="#3B82F6"
                  name={translation.avgPM25}
                />
                <Line
                  type="monotone"
                  dataKey="min"
                  stroke="#10B981"
                  name={translation.minPM25}
                />
                <Line
                  type="monotone"
                  dataKey="max"
                  stroke="#F59E0B"
                  name={translation.maxPM25}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
