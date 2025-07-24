import React from 'react';
import { Users, Shield, Eye, BarChart3, AlertCircle } from 'lucide-react';
import { facebookSDK } from '../services/facebookSDK';
import { FACEBOOK_PERMISSIONS } from '../config/facebook';

interface FacebookLoginProps {
  onLogin: (user: any, accessToken: string) => void;
  loading?: boolean;
}

export const FacebookLogin: React.FC<FacebookLoginProps> = ({ onLogin, loading = false }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, accessToken } = await facebookSDK.login();
      onLogin(user, accessToken);
    } catch (error) {
      console.error('Facebook login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Analytics Pro</h1>
          <p className="text-gray-600">Connect your Facebook Pages for advanced analytics</p>
        </div>

        {/* Required Permissions Display */}
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Required Permissions</h3>
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
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center text-sm text-gray-700">
            <Eye className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0" />
            <span>Read your page content and posts</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <BarChart3 className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
            <span>Access engagement insights and analytics</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <Shield className="w-4 h-4 text-purple-600 mr-3 flex-shrink-0" />
            <span>Secure, privacy-focused data handling</span>
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

        <button
          onClick={handleLogin}
          disabled={isLoading || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading || loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <span>Continue with Facebook</span>
          )}
        </button>

        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-green-800">
              <strong>Privacy Protected:</strong> We only collect aggregated, anonymized data. 
              No personal information or private content is stored.
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          By continuing, you agree to our Privacy Policy and Data Deletion procedures.
          <br />
          This demo requires a valid Facebook App ID in environment variables.
        </div>
      </div>
    </div>
  );
};