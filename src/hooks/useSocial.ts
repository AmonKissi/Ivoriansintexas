import { useState } from 'react';
import { ENDPOINTS } from '@/lib/api-configs';
import { useToast } from './use-toast';

export const useSocial = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const sendRequest = async (targetId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${ENDPOINTS.USERS}/request/${targetId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast({ title: "Success", description: "Friend request sent!" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const toggleLike = async (postId: string) => {
    const token = localStorage.getItem('token');
    await fetch(`${ENDPOINTS.POSTS}/${postId}/like`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  return { sendRequest, toggleLike, loading };
};