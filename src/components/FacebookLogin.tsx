import React from "react";
import { Users, Eye, BarChart3, Shield, AlertCircle } from "lucide-react";
import { facebookSDK } from "../services/facebookSDK";
import { FACEBOOK_PERMISSIONS } from "../config/facebook";

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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-xl border border-gray-200 p-6">
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
              disabled={isLoading || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded transition-colors w-full sm:w-auto"
            >
              {isLoading || loading ? (
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
          {/* <div>
            <strong>Valid OAuth Redirect URIs:</strong>
            <br />
            https://pages-read-engagement-permission.vercel.app/facebook/callback/2862133497225149
          </div> */}
        </div>

        {/* Permissions Info */}
        {/* <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            Required Permissions
          </h3>
          <div className="space-y-2 text-sm">
            {FACEBOOK_PERMISSIONS.map((permission) => (
              <div key={permission} className="flex items-center text-blue-800">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                <code className="font-mono text-xs bg-blue-100 px-2 py-1 rounded">
                  {permission}
                </code>
              </div>
            ))}
          </div>
        </div> */}

        {/* Additional Info */}
        {/* <div className="space-y-3 text-sm mb-6">
          <div className="flex items-center text-gray-700">
            <Eye className="w-4 h-4 text-blue-600 mr-3" />
            <span>Read your page content and posts</span>
          </div>
          <div className="flex items-center text-gray-700">
            <BarChart3 className="w-4 h-4 text-green-600 mr-3" />
            <span>Access engagement insights and analytics</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Shield className="w-4 h-4 text-purple-600 mr-3" />
            <span>Secure, privacy-focused data handling</span>
          </div>
        </div> */}

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

        {/* Placeholder Tables */}
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
                <tr>
                  <td className="px-4 py-2 border text-gray-400">--</td>
                  <td className="px-4 py-2 border text-gray-400">--</td>
                  <td className="px-4 py-2 border text-gray-400">--</td>
                  <td className="px-4 py-2 border text-gray-400">--</td>
                  <td className="px-4 py-2 border text-gray-400">--</td>
                  <td className="px-4 py-2 border text-blue-600 underline cursor-pointer">
                    Manage
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Facebook Pages
          </h3>
          <div className="overflow-x-auto">
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
                <tr>
                  <td className="px-4 py-2 border text-gray-400">--</td>
                  <td className="px-4 py-2 border text-gray-400">--</td>
                  <td className="px-4 py-2 border text-gray-400">--</td>
                  <td className="px-4 py-2 border text-gray-400">--</td>
                  <td className="px-4 py-2 border text-gray-400">--</td>
                  <td className="px-4 py-2 border text-blue-600 underline cursor-pointer">
                    Manage
                  </td>
                </tr>
              </tbody>
            </table>
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
