import { useGroup, type Group } from "src/context/GroupContext";
import { useUser } from "src/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "src/api/axios";
import { useNotification } from "src/hooks/useNotification";
import clsx from "clsx";

export const GroupSettings = () => {
  const { group } = useGroup();
  const queryClient = useQueryClient();
  const user = useUser();
  const navigate = useNavigate();
  const { addErrorNotification, addNotification } = useNotification();

  if (!group) return null;

  const { mutate: updateRole, isPending } = useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: number;
      role: "ADMIN" | "MEMBER";
    }) => {
      await api.patch(`/groups/${group.id}/members/${userId}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group"] });
    },
    onError: (error) => {
      addErrorNotification(error);
    },
  });

  const currentUserMembership = group.members.find(
    (m) => m.user.id === user.id
  );
  const isCurrentUserAdmin = currentUserMembership?.role === "ADMIN";

  // 2. Sorting: Admins first, then alphabetical
  const sortedMembers = [...group.members].sort((a, b) => {
    if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
    if (a.role !== "ADMIN" && b.role === "ADMIN") return 1;
    return a.user.username.localeCompare(b.user.username);
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Group Settings
          </h1>
          <p className="text-gray-400 mt-1">
            Manage members and permissions for{" "}
            <span className="text-teal-400 font-bold">{group.name}</span>
          </p>
        </div>
        <button
          onClick={() => navigate(`/group/${group.id}`)}
          className="text-gray-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          General Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Group Name
            </span>
            <span className="text-lg text-white font-medium">{group.name}</span>
          </div>
          <div
            className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 flex justify-between items-center group relative cursor-pointer hover:border-teal-500/30 transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(group.inviteCode || "");
              addNotification("Invite code copied to clipboard", "success");
            }}
          >
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Invite Code
              </span>
              <span className="text-lg text-teal-400 font-mono font-bold tracking-widest">
                {group.inviteCode}
              </span>
            </div>
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity absolute right-4">
              Click to Copy
            </span>
          </div>
        </div>
      </div>

      {/* Member Management List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Members ({group.members.length})
          </h2>
          {!isCurrentUserAdmin && (
            <span className="text-xs text-orange-400 bg-orange-400/10 px-2 py-1 rounded border border-orange-400/20">
              View Only (Admin Access Required)
            </span>
          )}
        </div>

        <div className="bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 p-4 border-b border-gray-700 bg-gray-900/50 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span>User</span>
            <span className="text-center w-[120px]">Role</span>
            <span className="text-right w-[60px]">Action</span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-700/50">
            {sortedMembers.map((member) => (
              <MemberRow
                key={member.user.id}
                member={member}
                currentUserId={user.id}
                isCurrentUserAdmin={isCurrentUserAdmin}
                onUpdateRole={(role: "ADMIN" | "MEMBER") =>
                  updateRole({ userId: member.user.id, role })
                }
                isUpdating={isPending}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MemberRow = ({
  member,
  currentUserId,
  isCurrentUserAdmin,
  onUpdateRole,
  isUpdating,
}: {
  member: Group["members"][number];
  currentUserId: number;
  isCurrentUserAdmin: boolean;
  onUpdateRole: (role: "ADMIN" | "MEMBER") => void;
  isUpdating: boolean;
}) => {
  const isSelf = member.user.id === currentUserId;
  const isTargetAdmin = member.role === "ADMIN";

  return (
    <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center p-4 hover:bg-gray-700/20 transition-colors">
      {/* User Info Column */}
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            "w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border",
            isTargetAdmin
              ? "bg-teal-900/30 text-teal-400 border-teal-500/30"
              : "bg-gray-800 text-gray-400 border-gray-700"
          )}
        >
          {member.user.username.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span
            className={clsx(
              "font-bold text-sm",
              isSelf ? "text-teal-400" : "text-gray-200"
            )}
          >
            {member.user.username} {isSelf && "(You)"}
          </span>
        </div>
      </div>

      {/* Role Dropdown Column */}
      <div className="w-[120px]">
        {isCurrentUserAdmin && !isSelf ? (
          <select
            value={member.role}
            onChange={(e) => onUpdateRole(e.target.value as "ADMIN" | "MEMBER")}
            disabled={isUpdating}
            className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs font-medium rounded-lg px-2 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none cursor-pointer hover:bg-gray-800 transition-colors"
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        ) : (
          <span
            className={clsx(
              "text-xs font-bold px-3 py-1.5 rounded-lg block text-center border w-full",
              isTargetAdmin
                ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                : "bg-gray-800 text-gray-400 border-gray-700"
            )}
          >
            {member.role === "ADMIN" ? "Admin" : "Member"}
          </span>
        )}
      </div>
    </div>
  );
};
