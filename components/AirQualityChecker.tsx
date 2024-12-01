"use client";

import { Language, translations } from "@/lib/translations";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import AirQualityDisplay from "./AirQualityDisplay";
import {
  getAirQualityData,
  getGeoLocalizedData,
  searchStations,
} from "@/lib/api";

const cities = [
  "Bangkok",
  "Chiang Mai",
  "Pattaya",
  "Phuket",
  "Hat Yai",
  "London",
  "New York",
  "Tokyo",
  "Sydney",
  "Beijing",
];

interface Station {
  uid: number;
  station: {
    name: string;
  };
  aqi: number;
}

export default function AirQualityChecker() {
  const [selectedCity, setSelectedCity] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [searchResults, setSearchResults] = useState<Station[]>([]);
  const [language, setLanguage] = useState<Language>("en");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translation = translations[language];

  useEffect(() => {
    const fetchGeoLocalizedData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getGeoLocalizedData();
        setData(result);
      } catch (error) {
        setError(
          (error as Error).message || "Failed to fetch default location data."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchGeoLocalizedData();
  }, []);

  const handleSearch = async () => {
    if (!customCity && !selectedCity) {
      setError("Please select a city or enter a custom search.");
      return;
    }

    const cityToSearch = customCity || selectedCity;
    setIsLoading(true);
    setError(null);
    setSearchResults([]);
    try {
      const result = await searchStations(cityToSearch);
      if (result?.status === "ok") {
        setSearchResults(result.data);
      } else {
        setError("No stations found for the search query.");
      }
    } catch (error) {
      setError((error as Error).message || "Error fetching search results.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectStation = async (stationId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAirQualityData(stationId);
      setData(result);
    } catch (error) {
      setError((error as Error).message || "Error fetching station data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {translation.checkAirQuality}
            <Select
              value={language}
              onValueChange={(value: Language) => setLanguage(value)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="th">ไทย</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={selectedCity || "none"}
            onValueChange={(value) => {
              if (value === "none") {
                setSelectedCity("");
              } else {
                setSelectedCity(value);
              }
              setCustomCity("");
            }}>
            <SelectTrigger>
              <SelectValue placeholder={translation.selectCity} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{translation.none}</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex space-x-2">
            <Input
              placeholder={translation.enterCustomCity}
              value={customCity}
              onChange={(e) => {
                setCustomCity(e.target.value);
                setSelectedCity("");
              }}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? (
                <ReloadIcon className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">
                {isLoading ? translation.loading : translation.search}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>{translation.error}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {searchResults.length > 0 && (
        <div>
          <h3>{translation.searchResults}</h3>
          <ul>
            {searchResults.map((station) => (
              <li key={station.uid}>
                <button
                  onClick={() => handleSelectStation(station.uid)}
                  className="text-blue-500">
                  {station.station.name} - AQI: {station.aqi}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data && <AirQualityDisplay data={data.data} language={language} />}
    </div>
  );
}
