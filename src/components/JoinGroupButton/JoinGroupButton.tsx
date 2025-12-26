import { useState } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";

type FormValues = {
  inviteCode: string;
};

export const JoinGroupButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: joinGroup, isPending } = useMutation({
    mutationFn: async (inviteCode: string) => {
      const { data } = await api.post("/groups/join", { inviteCode });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    joinGroup(data.inviteCode, {
      onSuccess: () => {
        setIsExpanded(false);
        reset();
      },
      onError: () => {
        setError("inviteCode", {
          type: "manual",
          message: "Invalid code",
        });
      },
    });
  };

  const handleCancel = () => {
    setIsExpanded(false);
    reset();
  };

  return (
    <div
      className={clsx(
        "transition-all duration-300 ease-in-out h-full flex items-center", // Force alignment
        isExpanded ? "w-full md:w-auto" : "w-auto"
      )}
    >
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="inline-flex items-center justify-center p-2 rounded-lg bg-teal-600 font-bold text-white hover:bg-teal-500 transition-colors whitespace-nowrap"
        >
          Join Group
        </button>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="relative">
            <input
              autoFocus
              type="text"
              placeholder="Invite Code"
              {...register("inviteCode", { required: true })}
              className={clsx(
                "w-32 sm:w-40 bg-gray-800 border text-white text-sm rounded-lg block p-2 outline-none focus:ring-2 ring-teal-500/50 transition-all",
                errors.inviteCode
                  ? "border-red-500 placeholder-red-400"
                  : "border-gray-600 placeholder-gray-500"
              )}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center p-2 rounded-lg bg-teal-600 font-bold text-white hover:bg-teal-500 disabled:opacity-50 transition-colors text-sm whitespace-nowrap"
          >
            {isPending ? "Joining..." : "Join"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-500 hover:text-white transition-colors px-1"
          >
            ✕
          </button>
        </form>
      )}
    </div>
  );
};
