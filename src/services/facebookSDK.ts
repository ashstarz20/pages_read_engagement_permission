import { FACEBOOK_CONFIG, FACEBOOK_SCOPES } from "../config/facebook";
import {
  FacebookPage,
  PagePost,
  PageInsights,
  MetricValues,
  FacebookUser,
} from "../types/facebook";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

interface FacebookAPIResponse<T> {
  data: T[];
  paging?: any;
}

interface FacebookAuthResponse {
  accessToken: string;
  expiresIn: number;
  signedRequest: string;
  userID: string;
}

interface FacebookLoginStatus {
  status: "connected" | "not_authorized" | "unknown";
  authResponse?: FacebookAuthResponse;
}

class FacebookSDKService {
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      // Check if SDK is already loaded
      if (window.FB) {
        this.initializeSDK();
        resolve();
        return;
      }

      // Wait for SDK to load
      window.fbAsyncInit = () => {
        try {
          this.initializeSDK();
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      // Timeout fallback
      setTimeout(() => {
        if (!this.isInitialized) {
          reject(new Error("Facebook SDK failed to load"));
        }
      }, 10000);
    });

    return this.initPromise;
  }

  private initializeSDK(): void {
    window.FB.init({
      appId: FACEBOOK_CONFIG.appId,
      cookie: FACEBOOK_CONFIG.cookie,
      xfbml: FACEBOOK_CONFIG.xfbml,
      version: FACEBOOK_CONFIG.version,
      status: FACEBOOK_CONFIG.status,
    });
    this.isInitialized = true;
    console.log("Facebook SDK initialized successfully");
  }

  async login(): Promise<{ user: FacebookUser; accessToken: string }> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      window.FB.login(
        (response: any) => {
          console.log("Facebook login response:", response);

          if (response.authResponse) {
            const { accessToken, userID } = response.authResponse;

            // Get user info
            window.FB.api(
              "/me",
              { fields: "name,email" },
              (userResponse: any) => {
                if (userResponse.error) {
                  reject(
                    new Error(
                      `Failed to get user info: ${userResponse.error.message}`
                    )
                  );
                  return;
                }

                const user: FacebookUser = {
                  id: userID,
                  name: userResponse.name,
                  email: userResponse.email || "",
                };

                resolve({ user, accessToken });
              }
            );
          } else {
            reject(
              new Error("User cancelled login or did not fully authorize.")
            );
          }
        },
        {
          scope: FACEBOOK_SCOPES,
          return_scopes: true,
          auth_type: "rerequest",
        }
      );
    });
  }

  async getLoginStatus(): Promise<FacebookLoginStatus> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      window.FB.getLoginStatus((response: any) => {
        if (!response) {
          reject(new Error("No response from Facebook SDK"));
          return;
        }

        const { status, authResponse } = response;

        if (status === "connected" && authResponse?.accessToken) {
          resolve({
            status: "connected",
            authResponse: {
              accessToken: authResponse.accessToken,
              expiresIn: authResponse.expiresIn,
              signedRequest: authResponse.signedRequest,
              userID: authResponse.userID,
            },
          });
        } else {
          resolve({
            status,
          });
        }
      });
    });
  }

  async getUserPages(
    accessToken: string
  ): Promise<FacebookAPIResponse<FacebookPage>> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      window.FB.api(
        "/me/accounts?limit=2", // Limit to 2 pages directly
        "GET",
        {
          access_token: accessToken,
          fields:
            "id,name,category,followers_count,fan_count,access_token,tasks",
        },
        async (response: any) => {
          console.log("Pages response:", response);

          if (response.error) {
            reject(new Error(`Failed to get pages: ${response.error.message}`));
            return;
          }

          const pagesToFetch = response.data.slice(0, 2); // just 2 pages max
          try {
            const pages: FacebookPage[] = await Promise.all(
              pagesToFetch.map(async (page: any) => {
                const picRes: any = await new Promise((res) => {
                  window.FB.api(
                    `/${page.id}/picture`,
                    "GET",
                    {
                      access_token: accessToken,
                      type: "large",
                      redirect: false,
                    },
                    res
                  );
                });

                return {
                  id: page.id,
                  name: page.name,
                  category: page.category,
                  followers_count: page.followers_count || page.fan_count || 0,
                  fan_count: page.fan_count || 0,
                  access_token: page.access_token,
                  picture: picRes?.data?.url || "",
                };
              })
            );

            resolve({ data: pages, paging: null });
          } catch (err) {
            reject(new Error(`Failed fetching page pictures: ${err}`));
          }
        }
      );
    });
  }

  async getPagePosts(pageId: string, accessToken: string): Promise<PagePost[]> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      window.FB.api(
        `/${pageId}/posts`,
        "GET",
        {
          access_token: accessToken,
          fields: `id,
      message,
      story,
      created_time,
      full_picture, 
      reactions.summary(total_count),
      comments.summary(total_count),
      attachments{media,media_type},
      permalink_url`,
          limit: 10,
        },
        (response: any) => {
          console.log("Posts response:", response);

          if (response.error) {
            reject(new Error(`Failed to get posts: ${response.error.message}`));
            return;
          }

          const posts: PagePost[] = response.data.map((post: any) => ({
            id: post.id,
            message: post.message || post.story || "",
            story: post.story,
            created_time: post.created_time,
            type: post.type || "status",
            reactions: {
              summary: {
                total_count: post.reactions?.summary?.total_count || 0,
              },
            },
            comments: {
              summary: {
                total_count: post.comments?.summary?.total_count || 0,
              },
            },
            shares: post.shares ? { count: post.shares.count } : undefined,
            imageUrl: post.full_picture, // grabs the image URL from first attachment
          }));

          resolve(posts);
        }
      );
    });
  }

  async getPageInsights(
    pageId: string,
    accessToken: string
  ): Promise<PageInsights> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      window.FB.api(
        `/${pageId}/insights?metric=page_impressions_unique,page_impressions_paid`,
        "GET",
        {
          access_token: accessToken,
        },
        (response: any) => {
          console.log("Insights response:", response);

          if (response.error) {
            reject(
              new Error(`Failed to get insights: ${response.error.message}`)
            );
            return;
          }

          // Initialize every metric with empty arrays for each period
          const insights: PageInsights = {
            page_impressions_unique: { day: [], week: [], days_28: [] },
            page_impressions_paid: { day: [], week: [], days_28: [] },
            page_reach: { day: [], week: [], days_28: [] },
            page_engaged_users: { day: [], week: [], days_28: [] },
          };

          response.data.forEach((metric: any) => {
            const name = metric.name as keyof PageInsights;
            const period = metric.period as keyof MetricValues;
            // extract all numeric values for that period
            const values: number[] = metric.values.map((v: any) =>
              Number(v.value)
            );
            // assign into the matching array
            insights[name][period] = values;
          });

          resolve(insights);
        }
      );
    });
  }

  async createAdCampaign(
    pageId: string,
    pageAccessToken: string,
    adText: string,
    budget: string
  ): Promise<unknown> {
    const adAccountId = "act_1235074641280538"; // ✅ Replace with your real ad account ID
    const campaignName = `Quick Boost - ${new Date().toISOString()}`;

    // 1. Create Campaign
    const campaignRes = await fetch(
      `https://graph.facebook.com/v19.0/${adAccountId}/campaigns`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          name: campaignName,
          objective: "OUTCOME_LEADS", // or POST_ENGAGEMENT / REACH etc.
          status: "PAUSED",
          special_ad_categories: JSON.stringify([]),
          access_token: pageAccessToken,
        }),
      }
    );

    const campaign = await campaignRes.json();
    if (campaign.error)
      throw new Error(`Campaign Error: ${campaign.error.message}`);

    const campaignId = campaign.id;

    // 2. Create Ad Set
    const adSetRes = await fetch(
      `https://graph.facebook.com/v23.0/${adAccountId}/adsets`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          name: `Ad Set – ${campaignName}`,
          campaign_id: campaignId,
          lifetime_budget: (parseFloat(budget) * 100).toString(),
          bid_strategy: "LOWEST_COST_WITHOUT_CAP", // 👈 auto-bidding
          billing_event: "IMPRESSIONS",
          optimization_goal: "LEAD_GENERATION",
          promoted_object: JSON.stringify({ page_id: pageId }),
          targeting: JSON.stringify({
            facebook_positions: ["feed"],
            geo_locations: { countries: ["IN"] },
            publisher_platforms: ["facebook", "audience_network"],
          }),
          start_time: new Date(Date.now() + 60_000).toISOString(),
          end_time: new Date(Date.now() + 86_400_000).toISOString(),
          status: "PAUSED",
          access_token: pageAccessToken,
        }),
      }
    );

    console.log(await adSetRes.json());

    const adSet = await adSetRes.json();
    if (adSet.error) throw new Error(`Ad Set Error: ${adSet.error.message}`);

    const adSetId = adSet.id;

    // 3. Create Ad Creative
    const creativeRes = await fetch(
      `https://graph.facebook.com/v19.0/${adAccountId}/adcreatives`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          name: `Creative - ${campaignName}`,
          object_story_spec: JSON.stringify({
            page_id: pageId,
            link_data: {
              message: adText,
              link: "https://facebook.com", // 👈 Optional link
            },
          }),
          access_token: pageAccessToken,
        }),
      }
    );

    const creative = await creativeRes.json();
    if (creative.error)
      throw new Error(`Creative Error: ${creative.error.message}`);

    const creativeId = creative.id;

    // 4. Create the Ad
    const adRes = await fetch(
      `https://graph.facebook.com/v19.0/${adAccountId}/ads`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          name: `Ad - ${campaignName}`,
          adset_id: adSetId,
          creative: JSON.stringify({ creative_id: creativeId }),
          status: "PAUSED",
          access_token: pageAccessToken,
        }),
      }
    );

    const ad = await adRes.json();
    if (ad.error) throw new Error(`Ad Error: ${ad.error.message}`);

    return {
      campaignId,
      adSetId,
      creativeId,
      adId: ad.id,
    };
  }

  async logout(): Promise<void> {
    await this.initialize();

    return new Promise((resolve) => {
      window.FB.logout(() => {
        resolve();
      });
    });
  }

  async fetchPaginatedPages(url: string): Promise<any> {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch paginated pages");
    }
    return await res.json();
  }
}

export const facebookSDK = new FacebookSDKService();
