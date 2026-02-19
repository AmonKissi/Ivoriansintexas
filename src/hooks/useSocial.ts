// src/hooks/useSocial.ts

// src/hooks/useSocial.ts
import { useState } from 'react';
import API, { ENDPOINTS } from '@/lib/api-configs';
import { useToast } from './use-toast';

export const useSocial = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [eventResults, setEventResults] = useState<any[]>([]);

  // --- SEARCH USERS ---
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

  // --- SEARCH EVENTS ---
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

  // --- FRIEND REQUESTS ---
  const sendRequest = async (targetId: string) => {
    try {
      setLoading(true);
      await API.post(`${ENDPOINTS.USERS.BASE}/request/${targetId}`);
      toast({ title: "Request Sent", description: "Waiting for approval." });
      
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

  // --- NEW: ACCEPT FRIEND REQUEST ---
  const acceptRequest = async (requestId: string) => {
    setLoading(true);
    try {
      await API.post(`${ENDPOINTS.USERS.BASE}/accept/${requestId}`);
      toast({ title: "Request Accepted", description: "You are now friends!" });
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Could not accept request." 
      });
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: REMOVE FRIEND ---
  const removeFriend = async (friendId: string) => {
    setLoading(true);
    try {
      await API.delete(`${ENDPOINTS.USERS.BASE}/friends/${friendId}`);
      toast({ title: "Friend Removed", description: "Connection updated." });
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Could not remove friend." 
      });
    } finally {
      setLoading(false);
    }
  };

  // --- SOCIAL ENGAGEMENT ---
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

  // CRITICAL: All functions must be included here for MemberDirectory to see them
  return { 
    sendRequest, 
    acceptRequest, // Added
    removeFriend,  // Added
    toggleLike, 
    searchUsers, 
    searchEvents,
    rsvpToEvent,
    searchResults, 
    eventResults,
    loading 
  };
};