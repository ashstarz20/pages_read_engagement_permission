// Facebook SDK Configuration
export const FACEBOOK_CONFIG = {
  appId: "2446058352452818",
  version: "v18.0",
  cookie: true,
  xfbml: true,
  status: true,
};

// Required permissions for pages_read_engagement Advanced Access
export const FACEBOOK_PERMISSIONS = [
  "pages_show_list", // Required to list user's pages
  "pages_read_engagement", // Advanced Access permission for reading engagement data
  "pages_read_user_content", // Read user-generated content on pages
  "read_insights", // Read page insights and analytics
];

export const FACEBOOK_SCOPES = FACEBOOK_PERMISSIONS.join(",");
