import React, { useState } from 'react';
import { Users, MessageSquare, BarChart3, Shield, Download, Ban, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { users, swapRequests, feedback, banUser, deleteUser } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'swaps' | 'reports'>('overview');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{ type: 'ban' | 'delete', userId: string } | null>(null);

  if (!user?.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-900 mb-2">Access Denied</h2>
          <p className="text-red-700">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const regularUsers = users.filter(u => !u.isAdmin);
  const activeUsers = regularUsers.filter(u => !u.isBanned);
  const bannedUsers = regularUsers.filter(u => u.isBanned);
  const pendingSwaps = swapRequests.filter(req => req.status === 'pending').length;
  const completedSwaps = swapRequests.filter(req => req.status === 'completed').length;

  const confirmAction = (type: 'ban' | 'delete', userId: string) => {
    setSelectedAction({ type, userId });
    setShowConfirmModal(true);
  };

  const executeAction = () => {
    if (!selectedAction) return;

    if (selectedAction.type === 'ban') {
      banUser(selectedAction.userId);
    } else {
      deleteUser(selectedAction.userId);
    }

    setShowConfirmModal(false);
    setSelectedAction(null);
  };

  const downloadReport = () => {
    const reportData = {
      users: users.length,
      activeUsers: activeUsers.length,
      bannedUsers: bannedUsers.length,
      totalSwaps: swapRequests.length,
      pendingSwaps,
      completedSwaps,
      totalFeedback: feedback.length,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillswap-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'swaps', label: 'Swaps', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: Download },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, monitor platform activity, and generate reports</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{activeUsers.length}</p>
                  <p className="text-gray-600">Active Users</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <MessageSquare className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{completedSwaps}</p>
                  <p className="text-gray-600">Completed Swaps</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{pendingSwaps}</p>
                  <p className="text-gray-600">Pending Swaps</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{bannedUsers.length}</p>
                  <p className="text-gray-600">Banned Users</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {swapRequests.slice(-5).reverse().map((swap) => {
                const fromUser = users.find(u => u.id === swap.fromUserId);
                const toUser = users.find(u => u.id === swap.toUserId);
                return (
                  <div key={swap.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{fromUser?.name}</span> requested to swap{' '}
                        <span className="font-medium">{swap.skillOffered}</span> for{' '}
                        <span className="font-medium">{swap.skillWanted}</span> with{' '}
                        <span className="font-medium">{toUser?.name}</span>
                      </p>
                      <p className="text-xs text-gray-500">{new Date(swap.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      swap.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {swap.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {regularUsers.map((targetUser) => (
                  <tr key={targetUser.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {targetUser.profilePhoto && (
                          <img 
                            src={targetUser.profilePhoto} 
                            alt={targetUser.name}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{targetUser.name}</div>
                          <div className="text-sm text-gray-500">{targetUser.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        Offers: {targetUser.skillsOffered.length} skills
                      </div>
                      <div className="text-sm text-gray-500">
                        Wants: {targetUser.skillsWanted.length} skills
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{targetUser.rating.toFixed(1)}</div>
                      <div className="text-sm text-gray-500">{targetUser.reviewCount} reviews</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        targetUser.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {targetUser.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {!targetUser.isBanned ? (
                        <>
                          <button
                            onClick={() => confirmAction('ban', targetUser.id)}
                            className="text-red-600 hover:text-red-700 transition-colors duration-200"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmAction('delete', targetUser.id)}
                            className="text-red-600 hover:text-red-700 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => confirmAction('delete', targetUser.id)}
                          className="text-red-600 hover:text-red-700 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Swaps Tab */}
      {activeTab === 'swaps' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Swap Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exchange</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {swapRequests.map((swap) => {
                  const fromUser = users.find(u => u.id === swap.fromUserId);
                  const toUser = users.find(u => u.id === swap.toUserId);
                  return (
                    <tr key={swap.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {fromUser?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {toUser?.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {swap.skillOffered} ↔ {swap.skillWanted}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          swap.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {swap.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(swap.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Reports</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">User Activity Report</h4>
                  <p className="text-sm text-gray-600">Download comprehensive user statistics and activity data</p>
                </div>
                <button
                  onClick={downloadReport}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">User Statistics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Users:</span>
                  <span className="font-medium">{users.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Users:</span>
                  <span className="font-medium">{activeUsers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Banned Users:</span>
                  <span className="font-medium">{bannedUsers.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Swap Statistics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Swaps:</span>
                  <span className="font-medium">{swapRequests.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium">{completedSwaps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending:</span>
                  <span className="font-medium">{pendingSwaps}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-900">
              Confirm {selectedAction.type === 'ban' ? 'Ban' : 'Delete'} User
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to {selectedAction.type} this user? 
              {selectedAction.type === 'delete' && ' This action cannot be undone.'}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                {selectedAction.type === 'ban' ? 'Ban User' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;