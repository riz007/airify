"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import AirQualityDisplay from "./AirQualityDisplay";
import {
  getAirQualityData,
  getGeoLocalizedData,
  searchStations,
} from "@/lib/api";
import { Language, translations } from "@/lib/translations";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import debounce from "lodash/debounce";

interface Station {
  uid: number;
  station: {
    name: string;
  };
  aqi: string;
}

interface AirQualityCheckerProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function AirQualityChecker({
  language,
  setLanguage,
}: AirQualityCheckerProps) {
  const [open, setOpen] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeolocationSupported, setIsGeolocationSupported] = useState(false);

  const translation = translations[language];

  useEffect(() => {
    setIsGeolocationSupported("geolocation" in navigator);
  }, []);

  const fetchGeoLocalizedData = useCallback(
    async (lat?: number, lon?: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getGeoLocalizedData(lat, lon);
        if (result.status === "ok") {
          setData(result);
          setStations([
            {
              uid: result.data.idx,
              station: { name: result.data.city.name },
              aqi: result.data.aqi,
            },
          ]);
          setSelectedStation({
            uid: result.data.idx,
            station: { name: result.data.city.name },
            aqi: result.data.aqi,
          });
        } else {
          throw new Error(result.data);
        }
      } catch (error) {
        setError((error as Error).message || translation.dataFetchError);
      } finally {
        setIsLoading(false);
      }
    },
    [translation.dataFetchError]
  );

  useEffect(() => {
    const getLocation = () => {
      if (isGeolocationSupported) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchGeoLocalizedData(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          () => {
            fetchGeoLocalizedData();
          }
        );
      } else {
        fetchGeoLocalizedData();
      }
    };

    // Only attempt to get location after client-side mount and geolocation check
    if (isGeolocationSupported !== false && !data) {
      getLocation();
    }
  }, [isGeolocationSupported, fetchGeoLocalizedData, data]);

  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      if (value?.length > 2) {
        setIsLoading(true);
        setError(null);
        try {
          const result = await searchStations(value);
          if (result.status === "ok") {
            setStations(result.data);
          } else {
            setStations([]);
            setError(translation.noResults);
          }
        } catch (error) {
          setError((error as Error).message || translation.searchError);
        } finally {
          setIsLoading(false);
        }
      }
    }, 300),
    [translation.noResults, translation.searchError]
  );

  const handleStationSelect = useCallback(
    async (station: Station) => {
      setSelectedStation(station);
      setOpen(false);
      setIsLoading(true);
      setError(null);
      try {
        const result = await getAirQualityData(station?.uid);
        if (result.status === "ok") {
          setData(result);
        } else {
          setError(result.data);
        }
      } catch (error) {
        setError((error as Error).message || translation.dataFetchError);
      } finally {
        setIsLoading(false);
      }
    },
    [translation.dataFetchError]
  );

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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between whitespace-normal">
                {selectedStation
                  ? `${selectedStation.station.name} - AQI: ${selectedStation.aqi}`
                  : translation.selectCity}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder={translation.searchPlaceholder}
                  onValueChange={(value) => {
                    if (value.length > 2) {
                      debouncedSearch(value);
                    }
                  }}
                />
                <CommandList>
                  <CommandEmpty>{translation.noResults}</CommandEmpty>
                  <CommandGroup>
                    {stations.map((station) => (
                      <CommandItem
                        key={station?.uid}
                        value={station?.station?.name}
                        onSelect={() => handleStationSelect(station)}>
                        {station?.station?.name} - AQI: {station?.aqi}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedStation?.uid === station?.uid
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center">
          <ReloadIcon className="h-8 w-8 animate-spin" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>{translation.error}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data && data.status === "ok" && (
        <AirQualityDisplay data={data.data} language={language} />
      )}
    </div>
  );
}
