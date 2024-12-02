import { rateLimit } from "./rateLimit";

export const getGeoLocalizedData = async (lat?: number, lon?: number) => {
  await rateLimit();
  let url = "/api/geo-localized";
  if (lat && lon) {
    url += `?lat=${lat}&lon=${lon}`;
  }
  const response = await fetch(url);
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
