import React from 'react';
import { FacebookPage } from '../types/facebook';
import { Users, ChevronRight, Globe, CheckCircle } from 'lucide-react';

interface PageSelectorProps {
  pages: FacebookPage[];
  onSelectPage: (page: FacebookPage) => void;
  onBack: () => void;
  loading?: boolean;
}

export const PageSelector: React.FC<PageSelectorProps> = ({ pages, onSelectPage, onBack, loading = false }) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your Facebook Pages...</p>
          <p className="text-sm text-gray-500 mt-1">Fetching pages with pages_show_list permission</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Select Your Facebook Page</h1>
            <p className="text-blue-100">Choose a page to view analytics and manage content</p>
          </div>

          <div className="p-6">
            {/* Permission Status */}
            <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Permissions Granted</span>
              </div>
              <div className="text-sm text-green-800">
                Successfully authenticated with <code className="bg-green-100 px-2 py-1 rounded font-mono">pages_show_list</code> permission.
                Found {pages.length} page{pages.length !== 1 ? 's' : ''} you can manage.
              </div>
            </div>

            <div className="grid gap-4">
              {pages.map((page) => (
                <div
                  key={page.id}
                  onClick={() => onSelectPage(page)}
                  className="group p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {page.name}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600">{page.category}</span>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {page.followers_count > 0 ? page.followers_count.toLocaleString() : 'N/A'} followers
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>

            {pages.length === 0 && (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pages Found</h3>
                <p className="text-gray-600 mb-4">
                  You don't have any Facebook Pages to manage, or the pages don't have the required permissions.
                </p>
                <p className="text-sm text-gray-500">
                  Make sure you're an admin of at least one Facebook Page to use this application.
                </p>
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-sm text-blue-800">
                <strong>Active Permissions:</strong> pages_show_list, pages_read_engagement, read_insights
                <br />
                <strong>Data Usage:</strong> Only aggregated, anonymized metrics are collected. No personal user data is retained.
              </div>
            </div>

            <button
              onClick={onBack}
              className="mt-6 px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};