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

  async getLoginStatus(): Promise<any> {
    await this.initialize();

    return new Promise((resolve) => {
      window.FB.getLoginStatus((response: any) => {
        resolve(response);
      });
    });
  }

  async getUserPages(accessToken: string): Promise<FacebookPage[]> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      window.FB.api(
        "/me/accounts",
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

          try {
            const pages: FacebookPage[] = await Promise.all(
              response.data.map(async (page: any) => {
                // Fetch each page's profile picture
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
                console.log(`Picture response for ${page.name}:`, picRes);

                return {
                  id: page.id,
                  name: page.name,
                  category: page.category,
                  followers_count: page.followers_count || page.fan_count || 0,
                  fan_count: page.fan_count || 0,
                  access_token: page.access_token,
                  picture: picRes.data?.url || "", // JSON response with image URL
                };
              })
            );

            resolve(pages);
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
      reactions.summary(total_count),
      comments.summary(total_count),
      attachments{
        media, media_type, url, type, title, target
      },
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
            imageUrl: post.attachments?.data?.[0]?.media?.image?.src, // grabs the image URL from first attachment
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
      const metrics = [
        "page_impressions_unique",
        "page_impressions_paid",
        "page_reach",
        "page_engaged_users",
      ];

      window.FB.api(
        `/${pageId}/insights?metric=${metrics.join(",")}`,
        "GET",
        { access_token: accessToken },
        (response: any) => {
          console.log("Insights response:", response);

          if (response.error) {
            reject(
              new Error(`Failed to get insights: ${response.error.message}`)
            );
            return;
          }

          const insights: PageInsights = {
            page_impressions_unique: {},
            page_impressions_paid: {},
            page_reach: {},
            page_engaged_users: {},
          };

          response.data.forEach((metric: any) => {
            const name = metric.name as keyof PageInsights;
            const period = metric.period as keyof MetricValues;

            const values = metric.values.map((v: any) => Number(v.value));

            if (!insights[name][period]) {
              insights[name][period] = values;
            }
          });

          resolve(insights);
        }
      );
    });
  }

  async logout(): Promise<void> {
    await this.initialize();

    return new Promise((resolve) => {
      window.FB.logout(() => {
        resolve();
      });
    });
  }
}

export const facebookSDK = new FacebookSDKService();
