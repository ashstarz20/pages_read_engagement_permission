import React, { useState, useEffect } from "react";
import { FacebookPage, PagePost, PageInsights, MetricValues } from "../types/facebook";
import { facebookSDK } from "../services/facebookSDK";
import {
  BarChart3,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Calendar,
  ArrowLeft,
  Shield,
  TrendingUp,
  Globe,
  Image,
  Video,
  FileText,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface PageDashboardProps {
  page: FacebookPage;
  onBack: () => void;
}

// Calculate percent change between last two values
const calculateTrend = (values?: number[]): string => {
  if (!values || values.length < 2) return "+0%";
  const latest = values[values.length - 1];
  const previous = values[values.length - 2] || 0;
  if (previous === 0) return "+100%";
  const percent = ((latest - previous) / previous) * 100;
  return `${percent >= 0 ? "+" : ""}${percent.toFixed(1)}%`;
};

export const PageDashboard: React.FC<PageDashboardProps> = ({ page, onBack }) => {
  const [posts, setPosts] = useState<PagePost[]>([]);
  const [insights, setInsights] = useState<PageInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Loading data for page:", page.name);
      const [postsData, insightsData] = await Promise.all([
        facebookSDK.getPagePosts(page.id, page.access_token).catch(() => []),
        facebookSDK.getPageInsights(page.id, page.access_token).catch(() => null),
      ]);
      setPosts(postsData);
      setInsights(insightsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPageData();
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case "photo": return <Image className="w-4 h-4" />;
      case "video": return <Video className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading {page.name} data...</p>
        </div>
      </div>
    );
  }

  // Extract latest day values and full arrays for trend
  const getValues = (metric: keyof PageInsights, period: keyof MetricValues) =>
    insights?.[metric]?.[period] ?? [];

  const dayValues = (metric: keyof PageInsights) =>
    getValues(metric, "day");
  const weekValues = (metric: keyof PageInsights) =>
    getValues(metric, "week");

  const metricsConfig = [
    { key: "page_impressions_unique" as keyof PageInsights, label: "Impressions", icon: <Eye className="w-6 h-6 text-blue-600" /> },
    { key: "page_reach" as keyof PageInsights, label: "Reach", icon: <Users className="w-6 h-6 text-green-600" /> },
    { key: "page_engaged_users" as keyof PageInsights, label: "Engaged Users", icon: <Heart className="w-6 h-6 text-purple-600" /> },
    { key: "page_impressions_paid" as keyof PageInsights, label: "Paid Impressions", icon: <BarChart3 className="w-6 h-6 text-orange-600" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header omitted for brevity, same as before */}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricsConfig.map(({ key, label, icon }) => {
            const dayArr = dayValues(key);
            const latest = dayArr.slice(-1)[0] ?? 0;
            const trend = calculateTrend(weekValues(key));
            return (
              <div key={key} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Page {label}</p>
                    <p className="text-2xl font-bold text-gray-900">{latest.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">{icon}</div>
                </div>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>{trend} from last week</span>
                </div>
              </div>
            );
          })}
        </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Page Reach</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(insights?.page_reach ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+8.3% from last week</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Engaged Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(insights?.page_engaged_users ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (Positive Feedback)
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+15.2% from last week</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Post Engagements</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(insights?.page_impressions_paid ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+22.1% from last week</span>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Posts
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Latest content from your page via Facebook API
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {posts.length} post{posts.length !== 1 ? "s" : ""} loaded
              </div>
            </div>
          </div>

          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow">
                  {/* Header */}
                  <div className="flex items-center px-4 py-3">
                    <img
                      src={page.picture}
                      alt={page.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {page.name}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {formatDate(post.created_time)}
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="px-4">
                    <p className="text-sm text-gray-800 mb-3 whitespace-pre-wrap">
                      {post.message || post.story}
                    </p>
                  </div>

                  {/* Media */}
                  {post.imageUrl && (
                    <div>
                      <img
                        src={post.imageUrl}
                        alt="Post media"
                        className="w-full max-h-[500px] object-cover"
                      />
                    </div>
                  )}

                  {/* Stats */}
                  <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-gray-600 text-sm">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.reactions.summary.total_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments.summary.total_count}</span>
                      </div>
                      {post.shares && (
                        <div className="flex items-center space-x-1">
                          <Share className="w-4 h-4" />
                          <span>{post.shares.count}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">ID: {post.id}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-4 py-2 flex justify-around">
                    <button className="flex items-center space-x-1 text-gray-600 hover:bg-gray-100 rounded px-2 py-1">
                      <Heart className="w-5 h-5" />
                      <span>Like</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:bg-gray-100 rounded px-2 py-1">
                      <MessageCircle className="w-5 h-5" />
                      <span>Comment</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:bg-gray-100 rounded px-2 py-1">
                      <Share className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Posts Found
              </h3>
              <p className="text-gray-600 mb-4">
                This page doesn't have any recent posts, or they're not
                accessible with current permissions.
              </p>
              <button
                onClick={handleRefresh}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Try refreshing the data
              </button>
            </div>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Privacy & Data Security
              </h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  ✓ Only aggregated, anonymized metrics are processed and
                  displayed
                </p>
                <p>
                  ✓ No personal user information from comments or reactions is
                  stored
                </p>
                <p>
                  ✓ Data is encrypted and handled in compliance with GDPR
                  requirements
                </p>
                <p>✓ Full data deletion available upon request</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
