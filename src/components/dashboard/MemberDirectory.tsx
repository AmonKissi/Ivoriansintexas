import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ENDPOINTS } from "@/lib/api-configs";
import { useSocial } from "@/hooks/useSocial";

const MemberDirectory = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const { sendRequest } = useSocial();

  const fetchMembers = async (query = "") => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${ENDPOINTS.USERS}/search?query=${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setMembers(data);
  };

  useEffect(() => { fetchMembers(search); }, [search]);

  return (
    <div className="space-y-6">
      <Input 
        placeholder="Search Ivorians in Texas by name or city..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-lg mx-auto bg-white"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member: any) => (
          <div key={member._id} className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-orange-400">
                <AvatarImage src={member.profileImage} />
                <AvatarFallback>{member.firstName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-slate-800">{member.firstName} {member.lastName}</p>
                <p className="text-xs text-slate-500">{member.city}, TX</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => sendRequest(member._id)}>
              Add Friend
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberDirectory;