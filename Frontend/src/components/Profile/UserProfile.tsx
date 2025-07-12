import React, { useState } from 'react';
import { Edit2, Save, X, Plus, Trash2, Star, Calendar, MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

const UserProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { feedback } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    location: user?.location || '',
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
    availability: user?.availability || [],
    isPublic: user?.isPublic ?? true,
  });
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [newAvailability, setNewAvailability] = useState('');

  const userFeedback = feedback.filter(f => f.toUserId === user?.id);

  const handleSave = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      location: user?.location || '',
      skillsOffered: user?.skillsOffered || [],
      skillsWanted: user?.skillsWanted || [],
      availability: user?.availability || [],
      isPublic: user?.isPublic ?? true,
    });
    setIsEditing(false);
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim()) {
      setEditForm({
        ...editForm,
        skillsOffered: [...editForm.skillsOffered, newSkillOffered.trim()]
      });
      setNewSkillOffered('');
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim()) {
      setEditForm({
        ...editForm,
        skillsWanted: [...editForm.skillsWanted, newSkillWanted.trim()]
      });
      setNewSkillWanted('');
    }
  };

  const addAvailability = () => {
    if (newAvailability.trim()) {
      setEditForm({
        ...editForm,
        availability: [...editForm.availability, newAvailability.trim()]
      });
      setNewAvailability('');
    }
  };

  const removeSkillOffered = (index: number) => {
    setEditForm({
      ...editForm,
      skillsOffered: editForm.skillsOffered.filter((_, i) => i !== index)
    });
  };

  const removeSkillWanted = (index: number) => {
    setEditForm({
      ...editForm,
      skillsWanted: editForm.skillsWanted.filter((_, i) => i !== index)
    });
  };

  const removeAvailability = (index: number) => {
    setEditForm({
      ...editForm,
      availability: editForm.availability.filter((_, i) => i !== index)
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {user.profilePhoto && (
                <img 
                  src={user.profilePhoto} 
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white mr-6"
                />
              )}
              <div className="text-white">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                {user.location && (
                  <p className="flex items-center mt-1 opacity-90">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user.location}
                  </p>
                )}
                <p className="flex items-center mt-1 opacity-90">
                  <Calendar className="w-4 h-4 mr-1" />
                  Member since {new Date(user.joinDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Privacy Setting */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {editForm.isPublic ? (
                  <Eye className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-600 mr-2" />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">Profile Visibility</h3>
                  <p className="text-sm text-gray-600">
                    {editForm.isPublic 
                      ? 'Your profile is public and visible to other users' 
                      : 'Your profile is private and hidden from other users'
                    }
                  </p>
                </div>
              </div>
              {isEditing && (
                <button
                  onClick={() => setEditForm({...editForm, isPublic: !editForm.isPublic})}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    editForm.isPublic 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {editForm.isPublic ? 'Make Private' : 'Make Public'}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="City, State"
                      />
                    ) : (
                      <p className="text-gray-900">{user.location || 'Not specified'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills Offered */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills I Can Teach</h2>
                <div className="space-y-2">
                  {editForm.skillsOffered.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                      <span className="text-blue-800">{skill}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeSkillOffered(index)}
                          className="text-red-600 hover:text-red-700 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newSkillOffered}
                        onChange={(e) => setNewSkillOffered(e.target.value)}
                        placeholder="Add a skill you can teach"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                      />
                      <button
                        onClick={addSkillOffered}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills Wanted */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills I Want to Learn</h2>
                <div className="space-y-2">
                  {editForm.skillsWanted.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between bg-purple-50 px-3 py-2 rounded-lg">
                      <span className="text-purple-800">{skill}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeSkillWanted(index)}
                          className="text-red-600 hover:text-red-700 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newSkillWanted}
                        onChange={(e) => setNewSkillWanted(e.target.value)}
                        placeholder="Add a skill you want to learn"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                      />
                      <button
                        onClick={addSkillWanted}
                        className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Availability */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
                <div className="space-y-2">
                  {editForm.availability.map((time, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                      <span className="text-green-800">{time}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeAvailability(index)}
                          className="text-red-600 hover:text-red-700 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newAvailability}
                        onChange={(e) => setNewAvailability(e.target.value)}
                        placeholder="Add availability (e.g., Weekends)"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && addAvailability()}
                      />
                      <button
                        onClick={addAvailability}
                        className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Rating & Reviews */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Rating & Reviews</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Star className="w-8 h-8 text-yellow-400 fill-current" />
                    <div className="ml-3">
                      <p className="text-2xl font-bold text-gray-900">{user.rating.toFixed(1)}</p>
                      <p className="text-sm text-gray-600">{user.reviewCount} reviews</p>
                    </div>
                  </div>
                  
                  {userFeedback.length > 0 ? (
                    <div className="space-y-3">
                      {userFeedback.slice(0, 3).map((review) => (
                        <div key={review.id} className="border-t pt-3">
                          <div className="flex items-center mb-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No reviews yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Save/Cancel buttons */}
          {isEditing && (
            <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;