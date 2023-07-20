export interface Question {
  id: number;
  question_text: string;
  answer_set: Answer[];
}

export interface Answer {
  id: number;
  answer_text: string;
  chosen_count: number;
  slides: Slide[];
}

export interface Presentation {
  id: number;
  user: User;
  favorite: number[];
  title: string;
  slide_set: Slide[];
  topic: number;
  description: Description;
  privacy: number;
  date_created: string;
}

export interface User {
  id: number;
  username: string;
  last_name: string;
  first_name: string;
}

export interface Slide {
  id: number;
  name: string;
  ordering: number;
  question_id: null | number;
}

export interface Description {
  lead: BoolDictionary;
  views: {
    total_views: number;
  };
  favorite: object;
}

export interface Statistics {
  user_id: number;
  title: string;
  date_created: string;
  total_views: number;
  views: Dictionary;
  total_favorite: number;
  favorite: Dictionary;
  first_slide: Slide;
  leads: Lead[];
  questions: Question[];
}

export interface Dictionary {
  [key: string]: string;
}

export interface BoolDictionary {
  [key: string]: boolean;
}

export interface Lead {
  id: number;
  slide: Slide;
  email: string;
  first_name: string;
  last_name: string;
}