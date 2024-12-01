import { rateLimit } from "./rateLimit";

export const getGeoLocalizedData = async () => {
  await rateLimit();
  const response = await fetch(
    `${process.env.PUBLIC_API_URL}/feed/here/?token=${process.env.WAQI_API_TOKEN}`
  );
  return response.json();
};

export const searchStations = async (keyword: string) => {
  await rateLimit();
  const response = await fetch(
    `${process.env.PUBLIC_API_URL}/search/?keyword=${keyword}&token=${process.env.WAQI_API_TOKEN}`
  );
  return response.json();
};

export const getAirQualityData = async (stationId: number) => {
  await rateLimit();
  const response = await fetch(
    `${process.env.PUBLIC_API_URL}/feed/@${stationId}/?token=${process.env.WAQI_API_TOKEN}`
  );
  return response.json();
};
