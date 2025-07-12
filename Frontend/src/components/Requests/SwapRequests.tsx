import React, { useState } from 'react';
import { Check, X, MessageCircle, Clock, User, Star, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { SwapRequest } from '../../types';

const SwapRequests: React.FC = () => {
  const { user } = useAuth();
  const { users, swapRequests, updateSwapRequest, addFeedback } = useApp();
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    comment: '',
  });

  if (!user) return null;

  const incomingRequests = swapRequests.filter(req => req.toUserId === user.id);
  const outgoingRequests = swapRequests.filter(req => req.fromUserId === user.id);

  const getUser = (userId: string) => users.find(u => u.id === userId);

  const handleAccept = (requestId: string) => {
    updateSwapRequest(requestId, 'accepted');
  };

  const handleReject = (requestId: string) => {
    updateSwapRequest(requestId, 'rejected');
  };

  const handleCancel = (requestId: string) => {
    updateSwapRequest(requestId, 'cancelled');
  };

  const handleComplete = (request: SwapRequest) => {
    updateSwapRequest(request.id, 'completed');
    setSelectedRequest(request);
    setShowFeedbackModal(true);
  };

  const submitFeedback = () => {
    if (!selectedRequest) return;

    const otherUserId = selectedRequest.fromUserId === user.id 
      ? selectedRequest.toUserId 
      : selectedRequest.fromUserId;

    addFeedback({
      swapRequestId: selectedRequest.id,
      fromUserId: user.id,
      toUserId: otherUserId,
      rating: feedbackForm.rating,
      comment: feedbackForm.comment,
    });

    setShowFeedbackModal(false);
    setSelectedRequest(null);
    setFeedbackForm({ rating: 5, comment: '' });
  };

  const getStatusColor = (status: SwapRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const RequestCard: React.FC<{ request: SwapRequest; isIncoming: boolean }> = ({ request, isIncoming }) => {
    const otherUser = getUser(isIncoming ? request.fromUserId : request.toUserId);
    if (!otherUser) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            {otherUser.profilePhoto && (
              <img 
                src={otherUser.profilePhoto} 
                alt={otherUser.name}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
              <p className="text-sm text-gray-500">
                {isIncoming ? 'Wants to learn from you' : 'You want to learn from them'}
              </p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              {isIncoming ? 'They offer' : 'You offer'}
            </h4>
            <p className="text-blue-800">{request.skillOffered}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-purple-900 mb-1">
              {isIncoming ? 'You teach' : 'You want'}
            </h4>
            <p className="text-purple-800">{request.skillWanted}</p>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <MessageCircle className="w-4 h-4 mr-1" />
            Message
          </h4>
          <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{request.message}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {new Date(request.createdAt).toLocaleDateString()}
          </span>
          {request.updatedAt !== request.createdAt && (
            <span>Updated {new Date(request.updatedAt).toLocaleDateString()}</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          {isIncoming && request.status === 'pending' && (
            <>
              <button
                onClick={() => handleAccept(request.id)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Accept
              </button>
              <button
                onClick={() => handleReject(request.id)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </button>
            </>
          )}

          {!isIncoming && request.status === 'pending' && (
            <button
              onClick={() => handleCancel(request.id)}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel Request
            </button>
          )}

          {request.status === 'accepted' && (
            <button
              onClick={() => handleComplete(request)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark as Completed
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Swap Requests</h1>
        <p className="text-gray-600">Manage your incoming and outgoing skill exchange requests</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`${
                activeTab === 'incoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Incoming Requests ({incomingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('outgoing')}
              className={`${
                activeTab === 'outgoing'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Outgoing Requests ({outgoingRequests.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Request Lists */}
      <div className="space-y-4">
        {activeTab === 'incoming' ? (
          incomingRequests.length > 0 ? (
            incomingRequests.map(request => (
              <RequestCard key={request.id} request={request} isIncoming={true} />
            ))
          ) : (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No incoming requests</h3>
              <p className="text-gray-500">When others send you swap requests, they'll appear here.</p>
            </div>
          )
        ) : (
          outgoingRequests.length > 0 ? (
            outgoingRequests.map(request => (
              <RequestCard key={request.id} request={request} isIncoming={false} />
            ))
          ) : (
            <div className="text-center py-12">
              <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No outgoing requests</h3>
              <p className="text-gray-500">Start browsing skills to send your first swap request!</p>
            </div>
          )
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Leave Feedback</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
                      className="transition-colors duration-200"
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          star <= feedbackForm.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={feedbackForm.comment}
                  onChange={(e) => setFeedbackForm({...feedbackForm, comment: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your experience with this skill exchange..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Skip
              </button>
              <button
                onClick={submitFeedback}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapRequests;