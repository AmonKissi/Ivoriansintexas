// src/hooks/useSocial.ts

import { useState } from 'react';
import { ENDPOINTS } from '@/lib/api-configs';
import { useToast } from './use-toast';
import API from '@/lib/api-configs'; // Assuming this is your axios instance

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
      // Backend now returns roleLabel and connectionStatus automatically
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
      const { data } = await API.post(`${ENDPOINTS.USERS.BASE}/request/${targetId}`);
      
      toast({ title: "Request Sent", description: "Waiting for approval." });
      
      // Update local search state so button changes to 'Pending' immediately
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

  return { 
    sendRequest, 
    toggleLike, 
    searchUsers, 
    searchEvents,
    rsvpToEvent,
    searchResults, 
    eventResults,
    loading 
  };
};