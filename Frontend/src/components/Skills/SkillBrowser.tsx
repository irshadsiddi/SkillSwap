import React, { useState, useMemo } from 'react';
import { Search, MapPin, Star, Users, Send, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { User } from '../../types';

interface SkillBrowserProps {
  onNavigate: (page: string) => void;
}

const SkillBrowser: React.FC<SkillBrowserProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { users, createSwapRequest } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapForm, setSwapForm] = useState({
    skillOffered: '',
    skillWanted: '',
    message: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.id !== user?.id && 
      u.isPublic && 
      !u.isBanned &&
      !u.isAdmin &&
      (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       u.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
       u.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [users, user?.id, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handleSwapRequest = (targetUser: User) => {
    setSelectedUser(targetUser);
    setSwapForm({
      skillOffered: user?.skillsOffered[0] || '',
      skillWanted: targetUser.skillsOffered[0] || '',
      message: `Hi ${targetUser.name}! I'd love to exchange skills with you.`,
    });
    setShowSwapModal(true);
  };

  const submitSwapRequest = () => {
    if (!user || !selectedUser) return;

    createSwapRequest({
      fromUserId: user.id,
      toUserId: selectedUser.id,
      skillOffered: swapForm.skillOffered,
      skillWanted: swapForm.skillWanted,
      message: swapForm.message,
      status: 'pending',
    });

    setShowSwapModal(false);
    setSelectedUser(null);
    setSwapForm({ skillOffered: '', skillWanted: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Skills</h1>
        <p className="text-gray-600">Discover talented people and find your next skill exchange partner</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, skills offered, or skills wanted..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'} found
        </p>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedUsers.map((targetUser) => (
          <div key={targetUser.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-4">
              {targetUser.profilePhoto && (
                <img 
                  src={targetUser.profilePhoto} 
                  alt={targetUser.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
              )}
              <div>
                <h3 className="font-semibold text-gray-900">{targetUser.name}</h3>
                {targetUser.location && (
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {targetUser.location}
                  </p>
                )}
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">
                    {targetUser.rating.toFixed(1)} ({targetUser.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Offered</h4>
              <div className="flex flex-wrap gap-1">
                {targetUser.skillsOffered.slice(0, 3).map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
                {targetUser.skillsOffered.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{targetUser.skillsOffered.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Wanted</h4>
              <div className="flex flex-wrap gap-1">
                {targetUser.skillsWanted.slice(0, 3).map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
                {targetUser.skillsWanted.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{targetUser.skillsWanted.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Availability</h4>
              <div className="flex flex-wrap gap-1">
                {targetUser.availability.map((time, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {time}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSwapRequest(targetUser)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Request Skill Swap
            </button>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search terms or check back later for new members.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 border rounded-lg transition-colors duration-200 ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Swap Request Modal */}
      {showSwapModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              Request Skill Swap with {selectedUser.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Skill to Offer
                </label>
                <select
                  value={swapForm.skillOffered}
                  onChange={(e) => setSwapForm({...swapForm, skillOffered: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {user?.skillsOffered.map((skill, index) => (
                    <option key={index} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill You Want to Learn
                </label>
                <select
                  value={swapForm.skillWanted}
                  onChange={(e) => setSwapForm({...swapForm, skillWanted: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {selectedUser.skillsOffered.map((skill, index) => (
                    <option key={index} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={swapForm.message}
                  onChange={(e) => setSwapForm({...swapForm, message: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Introduce yourself and explain what you'd like to learn..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSwapModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={submitSwapRequest}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillBrowser;