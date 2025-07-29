import React from "react";
import { AlertCircle } from "lucide-react";
import { facebookSDK } from "../services/facebookSDK";

interface FacebookLoginProps {
  onLogin: (user: unknown, accessToken: string) => void;
  loading?: boolean;
}

export const FacebookLogin: React.FC<FacebookLoginProps> = ({
  onLogin,
  loading = false,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { user, accessToken } = await facebookSDK.login();
      onLogin(user, accessToken);
    } catch (error) {
      console.error("Facebook login error:", error);
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Facebook Login Card */}
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Facebook Login
        </h2>

        {/* App ID Dropdown */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600 block mb-1">
            App ID
          </label>
          <select
            disabled
            className="w-full bg-gray-100 border border-gray-300 text-gray-700 rounded px-3 py-2 cursor-not-allowed"
          >
            <option>2446058352452818</option>
          </select>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading || loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition-all"
        >
          {isLoading || loading ? "Connecting..." : "Login With Facebook"}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
            <div>
              <strong>Login Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Static Details */}
        <div className="mt-4 text-sm text-gray-700 space-y-1">
          <p>
            <strong>App Domains:</strong>{" "}
            https://pages-read-engagement-permission.vercel.app
          </p>
          {/* <p>
            <strong>Valid OAuth Redirect URIs:</strong>{" "}
            https://pages-read-engagement-permission.vercel.app/facebook/callback/2862133497225149
          </p> */}
        </div>
      </div>

      {/* Facebook Accounts Table */}
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Facebook Accounts
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-gray-700">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2">Facebook_id</th>
                <th className="px-4 py-2">app_id</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">access_token</th>
                <th className="px-4 py-2">updated_at</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Placeholder row - replace with dynamic mapping if needed */}
              <tr className="border-t">
                <td className="px-4 py-2 text-gray-500">—</td>
                <td className="px-4 py-2 text-gray-500">—</td>
                <td className="px-4 py-2 text-gray-500">—</td>
                <td className="px-4 py-2 text-gray-500">—</td>
                <td className="px-4 py-2 text-gray-500">—</td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer">
                  —
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Facebook Pages Table */}
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Facebook Pages
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-gray-700">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2">Facebook_id</th>
                <th className="px-4 py-2">page_id</th>
                <th className="px-4 py-2">Page_name</th>
                <th className="px-4 py-2">Page_access_token</th>
                <th className="px-4 py-2">Page_category_list</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Placeholder row - replace with dynamic mapping if needed */}
              <tr className="border-t">
                <td className="px-4 py-2 text-gray-500">—</td>
                <td className="px-4 py-2 text-gray-500">—</td>
                <td className="px-4 py-2 text-gray-500">—</td>
                <td className="px-4 py-2 text-gray-500">—</td>
                <td className="px-4 py-2 text-gray-500">—</td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer">
                  —
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
