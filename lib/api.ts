import { rateLimit } from "./rateLimit";

export const getGeoLocalizedData = async () => {
  await rateLimit();
  const response = await fetch("/api/geo-localized");
  return response.json();
};

export const searchStations = async (keyword: string) => {
  await rateLimit();
  const response = await fetch(
    `/api/search?keyword=${encodeURIComponent(keyword)}`
  );
  return response.json();
};

export const getAirQualityData = async (stationId: number) => {
  await rateLimit();
  const response = await fetch(`/api/air-quality?stationId=${stationId}`);
  return response.json();
};
