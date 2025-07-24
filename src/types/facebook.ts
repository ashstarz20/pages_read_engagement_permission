export interface FacebookPage {
  id: string;
  name: string;
  picture: string; // URL to the page's profile picture
  category: string;
  followers_count: number;
  fan_count: number;
  access_token: string;
}

// src/types/facebook.ts
export interface PagePost {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  type: "photo" | "video" | "status" | "link";
  reactions: { summary: { total_count: number } };
  comments: { summary: { total_count: number } };
  shares?: { count: number };
  imageUrl?: string; // <-- New property for media
  permalink_url: string;
}

export interface PageInsights {
  page_impressions: number;
  page_reach: number;
  page_engaged_users: number;
  page_post_engagements: number;
}

export interface FacebookUser {
  id: string;
  name: string;
  email: string;
}
