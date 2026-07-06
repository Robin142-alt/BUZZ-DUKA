export default function DashboardOverview() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Total Sales Today</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">KES 0</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Net Profit Today</h3>
          <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">KES 0</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Total Unpaid Debts</h3>
          <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">KES 0</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Sync Activity</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-500 dark:text-gray-400">
            Waiting for data from mobile devices...
          </p>
        </div>
      </div>
    </div>
  );
}
