// src/hooks/useSocial.ts
import { useState, useCallback } from 'react';
import API, { ENDPOINTS } from '@/lib/api-configs';
import { useToast } from './use-toast';

export const useSocial = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [eventResults, setEventResults] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  // --- 1. SEARCH USERS ---
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.get(`${ENDPOINTS.USERS.SEARCH}?query=${query}`);
      setSearchResults(data);
    } catch (err: any) {
      console.error("User search failed", err);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. SEARCH EVENTS ---
  const searchEvents = async (query: string) => {
    if (!query.trim()) {
      setEventResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.get(`${ENDPOINTS.EVENTS.SEARCH}?query=${query}`);
      setEventResults(data);
    } catch (err: any) {
      console.error("Event search failed", err);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. FETCH PENDING REQUESTS ---
  const fetchPendingRequests = useCallback(async () => {
    setLoading(true);
    try {
      // Calls the new route we added: /api/users/requests/pending
      const { data } = await API.get(`${ENDPOINTS.USERS.BASE}/requests/pending`);
      setPendingRequests(data);
    } catch (err) {
      console.error("Failed to fetch pending requests", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 4. SEND FRIEND REQUEST ---
  const sendRequest = async (targetId: string) => {
    try {
      setLoading(true);
      await API.post(`${ENDPOINTS.USERS.BASE}/request/${targetId}`);
      toast({ title: "Request Sent", description: "Waiting for approval." });
      
      // Update search results locally so the button changes to "Pending"
      setSearchResults(prev => prev.map(u => 
        u._id === targetId ? { ...u, connectionStatus: 'pending_sent' } : u
      ));
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: err.response?.data?.message || "Could not send request" 
      });
    } finally {
      setLoading(false);
    }
  };

  // --- 5. ACCEPT FRIEND REQUEST ---
  const acceptRequest = async (requestId: string) => {
    setLoading(true);
    try {
      await API.post(`${ENDPOINTS.USERS.BASE}/accept/${requestId}`);
      
      // Remove from local pending list immediately
      setPendingRequests(prev => prev.filter(r => r._id !== requestId));
      
      toast({ title: "Connected! 🇨🇮", description: "You are now friends!" });
      return true;
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Could not accept request." 
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- 6. DECLINE FRIEND REQUEST ---
  const declineRequest = async (requestId: string) => {
    setLoading(true);
    try {
      await API.post(`${ENDPOINTS.USERS.BASE}/decline/${requestId}`);
      
      // Remove from local pending list immediately
      setPendingRequests(prev => prev.filter(r => r._id !== requestId));
      
      toast({ title: "Request Declined", description: "The request was removed." });
      return true;
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Could not decline request." 
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- 7. REMOVE FRIEND (UNFRIEND) ---
  const removeFriend = async (friendId: string) => {
    setLoading(true);
    try {
      // Matches the backend DELETE /connection/:targetUserId
      await API.delete(`${ENDPOINTS.USERS.BASE}/connection/${friendId}`);
      toast({ title: "Friend Removed", description: "Connection updated." });
      return true;
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Could not remove friend." 
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- 8. SOCIAL ENGAGEMENT ---
  const toggleLike = async (postId: string) => {
    try {
      await API.put(`${ENDPOINTS.POSTS.BASE}/${postId}/like`);
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const rsvpToEvent = async (eventId: string) => {
    try {
      const { data } = await API.post(`${ENDPOINTS.EVENTS.BASE}/${eventId}/rsvp`);
      toast({ title: "RSVP Success", description: "You are now attending this event!" });
      return data;
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "RSVP Failed", 
        description: err.response?.data?.message || "Could not join event" 
      });
    }
  };

  return { 
    sendRequest, 
    acceptRequest, 
    declineRequest, // Added
    fetchPendingRequests, // Added
    removeFriend, 
    toggleLike, 
    searchUsers, 
    searchEvents,
    rsvpToEvent,
    searchResults, 
    eventResults,
    pendingRequests, // Added
    loading 
  };
};