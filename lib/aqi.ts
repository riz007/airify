import { Language } from "./translations";

// Define the AQI levels and their corresponding data
const AQI_LEVELS = [
  { max: 50, color: "green-500", label: { en: "Good", th: "ดี" } },
  {
    max: 100,
    color: "yellow-500",
    label: { en: "Moderate", th: "ปานกลาง" },
  },
  {
    max: 150,
    color: "orange-500",
    label: { en: "Unhealthy for Sensitive Groups", th: "ไม่ดีต่อกลุ่มเสี่ยง" },
  },
  {
    max: 200,
    color: "red-500",
    label: { en: "Unhealthy", th: "ไม่ดีต่อสุขภาพ" },
  },
  {
    max: 300,
    color: "purple-500",
    label: { en: "Very Unhealthy", th: "ไม่ดีต่อสุขภาพมาก" },
  },
  {
    max: Infinity,
    color: "rose-900",
    label: { en: "Hazardous", th: "อันตราย" },
  },
];

/**
 * Get AQI color based on the AQI value.
 * @param {number} aqi - The AQI value.
 * @returns {string} - Tailwind-compatible color class for UI components.
 */
export const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return "#10B981"; // Green-500
  if (aqi <= 100) return "#FACC15"; // Yellow-500
  if (aqi <= 150) return "#F59E0B"; // Orange-500
  if (aqi <= 200) return "#E11D48"; // Red-600
  if (aqi <= 300) return "#6B21A8"; // Purple-600
  return "#B91C1C"; // Rose-700
};

/**
 * Get AQI level description based on the AQI value and language.
 * @param {number} aqi - The AQI value.
 * @returns {Record<Language, string>} - AQI level description for the provided language.
 */
export const getAQILevel = (aqi: number): Record<Language, string> => {
  if (aqi <= 50) return { en: "Good", th: "ดี" };
  if (aqi <= 100) return { en: "Moderate", th: "ปานกลาง" };
  if (aqi <= 150)
    return { en: "Unhealthy for Sensitive Groups", th: "ไม่ดีต่อกลุ่มเสี่ยง" };
  if (aqi <= 200) return { en: "Unhealthy", th: "ไม่ดีต่อสุขภาพ" };
  if (aqi <= 300) return { en: "Very Unhealthy", th: "ไม่ดีต่อสุขภาพมาก" };
  return { en: "Hazardous", th: "อันตราย" };
};
