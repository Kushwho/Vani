'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAxiosContext from '@/hooks/custom/useAxiosContext';
import useAuthContext from '@/hooks/custom/useAuthContext';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {  MessageCircle, Star, Play, Calendar, Sparkles } from 'lucide-react';
import { GetUserSessions, PostJoinSessionByRoomName } from '@/lib/apis/sessions/session-apis';
import { PostLiveKitRoom, PostLiveKitStudyRoom } from '@/lib/apis/learn/create-room';
import { UserSession } from '@/types/sessions';
import SessionFeedbackModal from '@/components/SessionFeedbackModal';
import GetFeedbackModal from './components/GetFeedbackModal';

const SessionsPage = () => {
  const axios = useAxiosContext();
  const auth = useAuthContext();
  const router = useRouter();
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningSession, setJoiningSession] = useState<string | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [getFeedbackModalOpen, setGetFeedbackModalOpen] = useState(false);
  const [selectedSessionForFeedback, setSelectedSessionForFeedback] = useState<UserSession | null>(null);

  useEffect(() => {
    console.log('Sessions page useEffect triggered:', {
      loggedIn: auth.config.loggedIn,
      userId: auth.config.id,
      authConfig: auth.config
    });

    if (auth.config.loggedIn && auth.config.id && auth.config.id.trim() !== '') {
      const fetchSessions = async () => {
        console.log('Starting to fetch sessions for user:', auth.config.id);
        setLoading(true);
        try {
          GetUserSessions({
            axios,
            userId: auth.config.id,
            onSuccess: (response) => {
              console.log('Sessions fetched successfully:', response);

              // Handle both cases: direct array or ApiResponse structure
              let sessionsData: UserSession[] = [];
              if (Array.isArray(response)) {
                // Direct array response
                sessionsData = response;
              } else if (response && typeof response === 'object' && 'data' in response) {
                // ApiResponse structure
                sessionsData = (response as { data: UserSession[] }).data || [];
              }

              setSessions(sessionsData);
              setLoading(false);
            },
            onError: (error) => {
              console.error('Error fetching sessions:', error);
              toast({ title: 'Error', description: 'Failed to fetch sessions.' });
              setSessions([]); // Ensure sessions is always an array
              setLoading(false);
            },
          });
        } catch (error) {
          console.error('Error in fetchSessions:', error);
          toast({ title: 'Error', description: 'An unexpected error occurred.' });
          setSessions([]); // Ensure sessions is always an array
          setLoading(false);
        }
      };

      fetchSessions();
    } else {
      console.log('Not fetching sessions - user not logged in or no user ID');
    }
  }, [axios, auth.config.loggedIn, auth.config.id, auth.config]);

  const handleCreateNewSessionFromPrevious = async (session: UserSession) => {
    try {
      if (session.sessionType === 'class') {
        // For class sessions, call the create study room API with continue session params
        if (session.standard && session.subject && session.chapter) {
          PostLiveKitStudyRoom({
            axios,
            data: {
              standard: session.standard,
              subject: session.subject,
              chapter: session.chapter,
              userId: auth.config.id || '',
              continueSession: true,
              sessionId: session._id
            },
            onSuccess: (response) => {
              // Store the token and navigate to learn-subject page
              sessionStorage.setItem('roomToken', response.data.token);
              router.push(`/learn-subject?sessionId=${response.data.sessionId}&roomName=${response.data.room.name}`);
              toast({
                title: 'Session Continued',
                description: `Continued ${session.subject} - ${session.chapter} session with previous context`
              });
            },
            onError: (error) => {
              console.error('Error continuing class session:', error);
              toast({
                title: 'Error',
                description: 'Failed to continue class session.'
              });
            }
          });
        } else {
          toast({
            title: 'Error',
            description: 'Previous class session is missing required information.'
          });
        }
      } else {
        // For regular learning sessions, call the create room API with continue session params
        PostLiveKitRoom({
          axios,
          data: {
            continueSession: true,
            sessionId: session._id
          },
          onSuccess: (response) => {
            // Store the token and navigate to learn page
            sessionStorage.setItem('roomToken', response.data.token);
            router.push(`/learn?sessionId=${response.data.sessionId}&roomName=${response.data.room.name}`);
            toast({
              title: 'Session Continued',
              description: 'Continued learning session with previous context'
            });
          },
          onError: (error) => {
            console.error('Error continuing learning session:', error);
            toast({
              title: 'Error',
              description: 'Failed to continue learning session.'
            });
          }
        });
      }
    } catch (error) {
      console.error('Error continuing session from previous:', error);
      toast({
        title: 'Error',
        description: 'Failed to continue session.'
      });
    } finally {
      setJoiningSession(null);
    }
  };

  const handleContinueSession = async (session: UserSession) => {
    setJoiningSession(session._id);

    try {
      if (session.status === 'active' && session.roomName) {
        // For active sessions, try to join the existing room
        PostJoinSessionByRoomName({
          axios,
          roomName: session.roomName,
          data: { roomName: session.roomName },
          onSuccess: (response) => {
            // Store the token in sessionStorage for the rejoined session
            sessionStorage.setItem('rejoinedSessionToken', response.data.token);
            // Navigate to learn page with the rejoined session
            router.push(`/learn?sessionId=${session._id}&roomName=${session.roomName}&rejoined=true`);
            toast({
              title: 'Rejoined Session',
              description: `Successfully rejoined your active session`
            });
          },
          onError: (error) => {
            console.error('Error rejoining session:', error);
            toast({
              title: 'Error',
              description: 'Failed to rejoin session. Starting a new one instead.'
            });
            // Fallback to creating new session
            handleCreateNewSessionFromPrevious(session);
          }
        });
      } else {
        // For completed sessions, create a new session with context from previous session
        handleCreateNewSessionFromPrevious(session);
      }
    } catch (error) {
      console.error('Error handling session:', error);
      toast({
        title: 'Error',
        description: 'Failed to continue session.'
      });
    } finally {
      setJoiningSession(null);
    }
  };

  

  const handleGetFeedback = (session: UserSession) => {
    setSelectedSessionForFeedback(session);
    setGetFeedbackModalOpen(true);
  };

  const handleFeedbackModalClose = () => {
    setFeedbackModalOpen(false);
    setSelectedSessionForFeedback(null);
  };

  const handleGetFeedbackModalClose = () => {
    setGetFeedbackModalOpen(false);
    setSelectedSessionForFeedback(null);
  };

  const getStatusColor = (status: UserSession['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // const formatDuration = (startTime: string, endTime?: string) => {
  //   const start = new Date(startTime);
  //   const end = endTime ? new Date(endTime) : new Date();
  //   const duration = Math.floor((end.getTime() - start.getTime()) / (1000 * 60)); // minutes

  //   if (duration < 60) {
  //     return `${duration}m`;
  //   } else {
  //     const hours = Math.floor(duration / 60);
  //     const minutes = duration % 60;
  //     return `${hours}h ${minutes}m`;
  //   }
  // };

  if (!auth.config.loggedIn) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">My Sessions</h1>
        <p className="text-muted-foreground">Please log in to view your sessions.</p>
        <Button
          onClick={() => router.push('/login')}
          className="mt-4"
        >
          Login
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Sessions</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Sessions</h1>
        <Button
          onClick={() => router.push('/learn')}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          Start New Session
        </Button>
      </div>

      {(sessions || []).length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
            <p className="text-muted-foreground mb-4">
              Start your first conversation with Vanii to see your sessions here.
            </p>
            <Button onClick={() => router.push('/learn')}>
              Start Learning
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(sessions || []).map((session) => (
            <Card key={session._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Session #{session._id.slice(-6)}
                    </CardTitle>
                    {session.roomName && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Room: {session.roomName}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {session.sessionType === 'class' ? '🎓 Class' : '📚 Learning'}
                      </Badge>
                    </div>
                  </div>
                  <Badge className={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(session.startTime).toLocaleDateString()}
                </div>

                {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Duration: {formatDuration(session.startTime, session.endTime)}
                </div> */}

                {session.chatHistory && session.chatHistory.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    {session.chatHistory.length} messages
                  </div>
                )}

                {session.feedback && session.feedback.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4" />
                    {session.feedback.length} feedback items
                  </div>
                )}

                <Button
                  onClick={() => handleContinueSession(session)}
                  disabled={joiningSession === session._id}
                  className="w-full"
                  variant={session.status === 'active' ? 'default' : 'outline'}
                >
                  {joiningSession === session._id ? (
                    session.status === 'active' ? 'Rejoining...' : 'Continuing...'
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      {session.status === 'active' ? 'Rejoin Session' : 'Continue Session'}
                    </>
                  )}
                </Button>

                {session.status === 'completed' && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Completed on {new Date(session.endTime!).toLocaleDateString()}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGetFeedback(session)}
                      className="w-full"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get AI Feedback
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Session Feedback Modal */}
      {selectedSessionForFeedback && (
        <SessionFeedbackModal
          isOpen={feedbackModalOpen}
          onClose={handleFeedbackModalClose}
          sessionId={selectedSessionForFeedback._id}
          onFeedbackSubmitted={() => {
            toast({
              title: "Thank you!",
              description: "Your session feedback has been submitted.",
            });
            handleFeedbackModalClose();
          }}
        />
      )}

      {/* Get AI Feedback Modal */}
      {selectedSessionForFeedback && (
        <GetFeedbackModal
          isOpen={getFeedbackModalOpen}
          onClose={handleGetFeedbackModalClose}
          session={selectedSessionForFeedback}
        />
      )}
    </div>
  );
};

export default SessionsPage;