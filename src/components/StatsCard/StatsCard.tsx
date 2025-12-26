import type { ReactNode } from "react";

interface StatsCardProps {
  title: ReactNode;
  value: ReactNode;
  description: ReactNode;
  icon: ReactNode;
}

export const StatsCard = ({
  title,
  value,
  icon,
  description,
}: StatsCardProps) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
      <div className="flex justify-between items-start p-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        <div className="p-2 rounded-lg bg-teal-500/10">{icon}</div>
      </div>
    </div>
  );
};
