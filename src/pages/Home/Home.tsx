import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { type GroupList } from "src/hooks/useGroups";
import { ErrorBoundary } from "react-error-boundary";
import { UsersIcon, GamepadIcon, ListIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { JoinGroupButton, Spinner } from "src/components";
import api from "src/api/axios";

const Content = () => {
  const { data: groups } = useSuspenseQuery({
    queryKey: ["myGroups"],
    queryFn: async () => {
      const { data } = await api.get<GroupList>("/groups");
      return data;
    },
  });

  if (groups.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <Link
          key={group.id}
          to={`/group/${group.id}`}
          className="group relative flex flex-col justify-between p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-teal-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300"
        >
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">
            {group.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UsersIcon className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500">
                {group.memberCount}{" "}
                {group.memberCount === 1 ? "member" : "members"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <GamepadIcon className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500">
                {group.gameCount} {group.gameCount === 1 ? "game" : "games"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ListIcon className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500">
                {group.matchCount}{" "}
                {group.matchCount === 1 ? "match" : "matches"}
              </p>
            </div>
          </div>
        </Link>
      ))}

      {/* "Add New" Card */}
      <Link
        to="/group/new"
        className="flex flex-col items-center justify-center p-6 bg-gray-900/50 border border-dashed border-gray-700 rounded-xl hover:bg-gray-800/50 hover:border-gray-500 transition-all cursor-pointer text-gray-500 hover:text-white"
      >
        <span className="text-4xl mb-2">+</span>
        <span className="font-medium">Create New Group</span>
      </Link>
    </div>
  );
};

export const Home = () => {
  return (
    <div className="space-y-8">
      <ErrorBoundary
        fallback={
          <div className="bg-gray-900 text-white p-4">Error loading groups</div>
        }
      >
        <Suspense fallback={<Spinner size="lg" />}>
          <Content />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-dashed border-gray-800">
    <h3 className="text-xl font-medium text-gray-300 mb-2">No groups yet</h3>
    <p className="text-gray-500 mb-6">
      Create a group to start tracking your ping pong matches!
    </p>
    <div className="flex items-center justify-center gap-2 h-10">
      <Link
        to="/group/new"
        className="inline-flex items-center justify-center p-2 rounded-lg bg-teal-600 font-bold text-white hover:bg-teal-500 transition-colors whitespace-nowrap"
      >
        Create Group
      </Link>
      <JoinGroupButton />
    </div>
  </div>
);
