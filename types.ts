export interface CourseLevelData {
  level: number;
  pricePerTerm: number;
  tablets: number;
  software: number;
  total: number;
}

export interface CourseCategory {
  name: string;
  themeColor: string;
  textColor: string;
  borderColor: string;
  bgGradient: string;
  levels: CourseLevelData[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}