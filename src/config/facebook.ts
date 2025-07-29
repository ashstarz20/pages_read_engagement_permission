// Facebook SDK Configuration
export const FACEBOOK_CONFIG = {
  appId: "2446058352452818",
  version: "v22.0",
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
  "business_management", // Manage business assets
  "leads_retrieval", // Retrieve leads from Facebook forms
  "pages_manage_metadata", // Manage page metadata
  "pages_manage_posts", // Manage posts on pages
  "pages_manage_engagement", // Manage engagement on pages
  "pages_manage_ads", // Manage ads on pages
  "ads_management", // Manage ads
];

export const FACEBOOK_SCOPES = FACEBOOK_PERMISSIONS.join(",");
