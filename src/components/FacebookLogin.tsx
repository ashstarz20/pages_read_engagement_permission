import React from "react";
import { AlertCircle } from "lucide-react";
import { facebookSDK } from "../services/facebookSDK";
import { FacebookPage, FacebookUser } from "../types/facebook";

interface FacebookGraphPage {
  id: string;
  name: string;
  category: string;
  followers_count?: number;
  fan_count?: number;
  access_token: string;
}

interface PictureResponse {
  data?: {
    url?: string;
  };
}

export const FacebookLogin: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<FacebookUser | null>(null);
  const [pages, setPages] = React.useState<FacebookPage[]>([]);
  const [pagesLoaded, setPagesLoaded] = React.useState(false);
  const [isLoadingPages, setIsLoadingPages] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { user, accessToken } = await facebookSDK.login();
      setUser(user);
      setAccessToken(accessToken);
      setPages([]); // Clear old pages
      setPagesLoaded(false); // Mark pages not loaded yet
    } catch (error) {
      console.error("Facebook login error:", error);
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadPages = async () => {
    if (!accessToken) return;
    setIsLoadingPages(true);
    setError(null);

    const fetchAllPages = async (
      token: string,
      nextUrl?: string,
      accumulatedPages: FacebookPage[] = []
    ): Promise<FacebookPage[]> => {
      const response = nextUrl
        ? await facebookSDK.fetchPaginatedPages(nextUrl)
        : await facebookSDK.getUserPages(token);

      if (!response || !Array.isArray(response.data)) {
        throw new Error(
          "Invalid response from Facebook API (data is missing or not an array)."
        );
      }

      const newPages: FacebookPage[] = await Promise.all(
        response.data.map(async (page: FacebookGraphPage) => {
          const picRes: PictureResponse = await new Promise((res) => {
            window.FB.api(
              `/${page.id}/picture`,
              "GET",
              {
                access_token: token,
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

      const allPages = [...accumulatedPages, ...newPages];

      if (response.paging?.next) {
        return fetchAllPages(token, response.paging.next, allPages);
      }

      return allPages;
    };

    try {
      const allPages = await fetchAllPages(accessToken);
      setPages(allPages);
      setPagesLoaded(true);
    } catch (error) {
      console.error("Error loading paginated pages:", error);
      setError(
        `Failed to load pages - ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoadingPages(false);
    }
  };

  const handleLogout = async () => {
    await facebookSDK.logout();
    setAccessToken(null);
    setUser(null);
    setPages([]);
    setPagesLoaded(false);
  };

  const handleDelete = () => {
    setAccessToken(null);
    setUser(null);
    setPages([]);
    setPagesLoaded(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Facebook Login</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              App ID
            </label>
            <select
              className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-sm cursor-not-allowed"
              disabled
            >
              <option>2446058352452818</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded transition-colors w-full sm:w-auto"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </div>
              ) : (
                <span>Login With Facebook</span>
              )}
            </button>
          </div>
        </div>

        <div className="mb-6 text-sm text-gray-600 space-y-1">
          <div>
            <strong>App Domains:</strong>{" "}
            https://pages-read-engagement-permission.vercel.app
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <strong>Login Error:</strong> {error}
              </div>
            </div>
          </div>
        )}

        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Facebook Accounts
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full table-auto text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Facebook_id</th>
                  <th className="px-4 py-2 border">app_id</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">access_token</th>
                  <th className="px-4 py-2 border">updated_at</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {user && accessToken ? (
                  <tr>
                    <td className="px-4 py-2 border">{user.id}</td>
                    <td className="px-4 py-2 border">2446058352452818</td>
                    <td className="px-4 py-2 border">{user.name}</td>
                    <td className="px-4 py-2 border">
                      {accessToken.slice(0, 20)}...
                    </td>
                    <td className="px-4 py-2 border">
                      {new Date().toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={handleLoadPages}
                          className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
                        >
                          Load Pages
                        </button>
                        <button
                          onClick={handleLogout}
                          className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                        >
                          Logout
                        </button>
                        <button
                          onClick={handleDelete}
                          className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-4">
                      Not logged in
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Facebook Pages
          </h3>
          <div className="overflow-x-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">
                Showing{" "}
                {Math.min((currentPage - 1) * pageSize + 1, pages.length)}–
                {Math.min(currentPage * pageSize, pages.length)} of{" "}
                {pages.length} pages
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Rows per page:</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1); // reset to first page when pageSize changes
                  }}
                >
                  {[10, 20, 30, 40, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <table className="w-full table-auto text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Facebook_id</th>
                  <th className="px-4 py-2 border">page_id</th>
                  <th className="px-4 py-2 border">Page_name</th>
                  <th className="px-4 py-2 border">Page_access_token</th>
                  <th className="px-4 py-2 border">Page_category_list</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingPages ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading pages...</span>
                      </div>
                    </td>
                  </tr>
                ) : pagesLoaded && pages.length > 0 ? (
                  pages
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((page) => (
                      <tr key={page.id}>
                        <td className="px-4 py-2 border">{user?.id || "--"}</td>
                        <td className="px-4 py-2 border">{page.id}</td>
                        <td className="px-4 py-2 border">{page.name}</td>
                        <td className="px-4 py-2 border">
                          {page.access_token.slice(0, 20)}...
                        </td>
                        <td className="px-4 py-2 border">{page.category}</td>
                        <td className="px-4 py-2 border text-blue-600 underline cursor-pointer">
                          Manage
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-4">
                      {pagesLoaded
                        ? "No pages available"
                        : "Click 'Load Pages' to view"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
              <div>
                Page {currentPage} of {Math.ceil(pages.length / pageSize)}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  ⬅ Back
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, Math.ceil(pages.length / pageSize))
                    )
                  }
                  disabled={currentPage >= Math.ceil(pages.length / pageSize)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next ➡
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs text-gray-500 text-center">
          By continuing, you agree to our Privacy Policy and Data Deletion
          procedures.
          <br />
          This demo requires a valid Facebook App ID in environment variables.
        </div>
      </div>
    </div>
  );
};
