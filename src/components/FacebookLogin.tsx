// src/components/FacebookLogin.tsx

import React from "react";
import { AlertCircle } from "lucide-react";
import { facebookSDK } from "../services/facebookSDK";
import type { FacebookPage, FacebookUser } from "../types/facebook";
import { CreateAdWithLocation } from "../services/CreateAdWithLocation";

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

  const [selectedPage, setSelectedPage] = React.useState<FacebookPage | null>(
    null
  );

  // Restore session on mount
  React.useEffect(() => {
    const restoreSession = async () => {
      try {
        const status = await facebookSDK.getLoginStatus();
        if (status.status === "connected" && status.authResponse) {
          const { accessToken: token, userID } = status.authResponse;
          window.FB.api(
            "/me",
            { fields: "name,email" },
            (resp: { error?: any; name?: string; email?: string }) => {
              if (!resp || resp.error) return;
              const fbUser: FacebookUser = {
                id: userID,
                name: resp.name ?? "",
                email: resp.email ?? "",
              };
              setUser(fbUser);
              setAccessToken(token);
              localStorage.setItem("fb_user", JSON.stringify(fbUser));
              localStorage.setItem("fb_token", token);
            }
          );
        }
      } catch (e) {
        console.error("Failed to restore Facebook session:", e);
      }
    };
    restoreSession();
  }, []);

  // Login handler
  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: fbUser, accessToken: token } = await facebookSDK.login();
      setUser(fbUser);
      setAccessToken(token);
      localStorage.setItem("fb_user", JSON.stringify(fbUser));
      localStorage.setItem("fb_token", token);
      setPages([]);
      setPagesLoaded(false);
    } catch (e) {
      console.error("Facebook login error:", e);
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Load pages handler
  const handleLoadPages = async () => {
    if (!accessToken) return;
    setIsLoadingPages(true);
    setError(null);
    try {
      const resp = await facebookSDK.getUserPages(accessToken);
      setPages(resp.data ?? []);
      setPagesLoaded(true);
      setCurrentPage(1);
    } catch (e) {
      console.error("Error loading pages:", e);
      setError(
        `Failed to load pages – ${e instanceof Error ? e.message : "Unknown"}`
      );
    } finally {
      setIsLoadingPages(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await facebookSDK.logout();
    setUser(null);
    setAccessToken(null);
    setPages([]);
    setPagesLoaded(false);
    localStorage.removeItem("fb_user");
    localStorage.removeItem("fb_token");
  };

  // Delete session handler
  const handleDelete = () => {
    setUser(null);
    setAccessToken(null);
    setPages([]);
    setPagesLoaded(false);
    localStorage.removeItem("fb_user");
    localStorage.removeItem("fb_token");
  };

  // Render
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Facebook Login</h2>

        {/* Login Section */}
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
                "Login With Facebook"
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

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <strong>Error:</strong> {error}
              </div>
            </div>
          </div>
        )}

        {/* If a page is selected, show the CreateAdWithLocation flow */}
        {selectedPage ? (
          <CreateAdWithLocation page={selectedPage} />
        ) : (
          // Otherwise, show the pages table
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Facebook Pages
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
              {user && (
                <>
                  <button
                    onClick={handleLoadPages}
                    disabled={isLoadingPages}
                    className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
                  >
                    {isLoadingPages ? "Loading Pages…" : "Load Pages"}
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
                    Delete Session
                  </button>
                </>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">Page ID</th>
                    <th className="px-4 py-2 border">Page Name</th>
                    <th className="px-4 py-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {!pagesLoaded ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center text-gray-400 py-4"
                      >
                        {user
                          ? "Click “Load Pages” to view your pages"
                          : "Log in first"}
                      </td>
                    </tr>
                  ) : pages.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center text-gray-400 py-4"
                      >
                        No pages available
                      </td>
                    </tr>
                  ) : (
                    pages
                      .slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                      )
                      .map((page) => (
                        <tr key={page.id}>
                          <td className="px-4 py-2 border">{page.id}</td>
                          <td className="px-4 py-2 border">{page.name}</td>
                          <td className="px-4 py-2 border">
                            <button
                              onClick={() => setSelectedPage(page)}
                              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition"
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagesLoaded && pages.length > pageSize && (
              <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
                <div>
                  Page {currentPage} of {Math.ceil(pages.length / pageSize)}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    ⬅ Back
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(p + 1, Math.ceil(pages.length / pageSize))
                      )
                    }
                    disabled={
                      currentPage === Math.ceil(pages.length / pageSize)
                    }
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next ➡
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
