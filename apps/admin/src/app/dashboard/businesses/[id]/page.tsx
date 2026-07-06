"use client";

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

interface BusinessDetail {
  id: string;
  business_name: string;
  business_category: string | null;
  location: string | null;
  status: string;
  created_at: string;
  users: any[];
  devices: any[];
  licenses: any[];
}

export default function BusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState<BusinessDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadBusiness(params.id as string);
    }
  }, [params.id]);

  async function loadBusiness(id: string) {
    try {
      setLoading(true);
      const data = await fetchApi(`/admin/businesses/${id}`);
      setBusiness(data);
    } catch (err: any) {
      setError('Could not load business details.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading business details...</div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <p className="text-yellow-800 dark:text-yellow-200 text-sm">{error || 'Business not found.'}</p>
        <button
          onClick={() => router.push('/dashboard/businesses')}
          className="mt-4 text-blue-600 hover:text-blue-500 text-sm font-medium"
        >
          ← Back to Businesses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/businesses')}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{business.business_name}</h1>
          <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
            business.status === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {business.status}
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Registered: {new Date(business.created_at).toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Info */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">General Information</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">ID</dt>
              <dd className="text-gray-900 dark:text-white font-mono">{business.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Category</dt>
              <dd className="text-gray-900 dark:text-white">{business.business_category || 'Not specified'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Location</dt>
              <dd className="text-gray-900 dark:text-white">{business.location || 'Not specified'}</dd>
            </div>
          </dl>
        </div>

        {/* License Info */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Subscription</h2>
          {business.licenses && business.licenses.length > 0 ? (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Plan</dt>
                <dd className="text-gray-900 dark:text-white capitalize">{business.licenses[0].plan_tier}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Status</dt>
                <dd className="text-gray-900 dark:text-white capitalize">{business.licenses[0].status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Valid Until</dt>
                <dd className="text-gray-900 dark:text-white">{new Date(business.licenses[0].valid_until).toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Device Limit</dt>
                <dd className="text-gray-900 dark:text-white">{business.licenses[0].device_limit}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No active subscription found.</p>
          )}
        </div>
      </div>

      {/* Users */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Registered Users</h2>
        </div>
        {business.users && business.users.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {business.users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.phone_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-sm text-gray-500 dark:text-gray-400">No users registered for this business.</div>
        )}
      </div>
    </div>
  );
}
