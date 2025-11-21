import { CourseCategory } from './types';

export const SCHOOL_NAME = "ELiF";

export const PRICING_DATA: CourseCategory[] = [
  {
    name: "Starter",
    themeColor: "bg-pink-400",
    textColor: "text-pink-600",
    borderColor: "border-pink-200",
    bgGradient: "from-pink-50 to-pink-100",
    levels: [
      { level: 1, pricePerTerm: 45, tablets: 130, software: 10, total: 185 },
      { level: 2, pricePerTerm: 45, tablets: 0, software: 10, total: 55 },
      { level: 3, pricePerTerm: 45, tablets: 0, software: 10, total: 55 },
      { level: 4, pricePerTerm: 45, tablets: 0, software: 10, total: 55 },
    ]
  },
  {
    name: "Jumper",
    themeColor: "bg-orange-400",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    bgGradient: "from-orange-50 to-orange-100",
    levels: [
      { level: 1, pricePerTerm: 50, tablets: 0, software: 10, total: 60 },
      { level: 2, pricePerTerm: 50, tablets: 0, software: 10, total: 60 },
      { level: 3, pricePerTerm: 50, tablets: 0, software: 10, total: 60 },
      { level: 4, pricePerTerm: 50, tablets: 0, software: 10, total: 60 },
    ]
  },
  {
    name: "Basic",
    themeColor: "bg-yellow-400",
    textColor: "text-yellow-600",
    borderColor: "border-yellow-200",
    bgGradient: "from-yellow-50 to-yellow-100",
    levels: [
      { level: 1, pricePerTerm: 55, tablets: 0, software: 10, total: 65 },
      { level: 2, pricePerTerm: 55, tablets: 0, software: 10, total: 65 },
      { level: 3, pricePerTerm: 55, tablets: 0, software: 10, total: 65 },
      { level: 4, pricePerTerm: 55, tablets: 0, software: 10, total: 65 },
    ]
  },
  {
    name: "Intermediate",
    themeColor: "bg-green-400",
    textColor: "text-green-600",
    borderColor: "border-green-200",
    bgGradient: "from-green-50 to-green-100",
    levels: [
      { level: 1, pricePerTerm: 60, tablets: 0, software: 10, total: 70 },
      { level: 2, pricePerTerm: 60, tablets: 0, software: 10, total: 70 },
      { level: 3, pricePerTerm: 60, tablets: 0, software: 10, total: 70 },
      { level: 4, pricePerTerm: 60, tablets: 0, software: 10, total: 70 },
    ]
  },
  {
    name: "Advanced",
    themeColor: "bg-blue-400",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    bgGradient: "from-blue-50 to-blue-100",
    levels: [
      { level: 1, pricePerTerm: 65, tablets: 0, software: 10, total: 75 },
      { level: 2, pricePerTerm: 65, tablets: 0, software: 10, total: 75 },
      { level: 3, pricePerTerm: 65, tablets: 0, software: 10, total: 75 },
      { level: 4, pricePerTerm: 65, tablets: 0, software: 10, total: 75 },
    ]
  },
  {
    name: "Elite",
    themeColor: "bg-purple-400",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    bgGradient: "from-purple-50 to-purple-100",
    levels: [
      { level: 1, pricePerTerm: 70, tablets: 0, software: 10, total: 80 },
      { level: 2, pricePerTerm: 70, tablets: 0, software: 10, total: 80 },
      { level: 3, pricePerTerm: 70, tablets: 0, software: 10, total: 80 },
      { level: 4, pricePerTerm: 70, tablets: 0, software: 10, total: 80 },
    ]
  },
];

export const SYSTEM_INSTRUCTION = `
You are a helpful and friendly academic advisor for ELiF School.
Your goal is to assist parents in understanding the school's tuition and fees.

Here is the official Price List Data:
${JSON.stringify(PRICING_DATA, null, 2)}

Key Rules:
1. Tone: Cheerful, professional, and encouraging. Suitable for a school environment.
2. Facts: ONLY use the provided JSON data for prices. Do not make up prices.
3. Specifics: Note that "Starter Level 1" is the only course with a $130 Tablet fee. All other courses have a $0 tablet fee.
4. Formatting: When listing prices, use a clean format.
5. If asked about "Term length", mention it is 45 hours per term.
6. Keep answers concise (under 100 words) unless detailed breakdown is requested.
`;
