import { useState } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "src/api/axios";
import { useGroup } from "src/context/GroupContext";

type FormValues = {
  name: string;
};

export const CreateGameButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();
  const { group } = useGroup();

  const { mutate: createGame, isPending } = useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.post("/groups/game", {
        groupId: group.id,
        name,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", String(group.id)] });
    },
  });

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    createGame(data.name, {
      onSuccess: () => {
        setIsExpanded(false);
        reset();
      },
    });
  };

  const handleCancel = () => {
    setIsExpanded(false);
    reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div
      className={clsx(
        "transition-all duration-300 ease-in-out h-full flex items-center",
        isExpanded ? "w-full md:w-auto" : "w-auto"
      )}
    >
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="inline-flex items-center justify-center p-2 rounded-lg bg-teal-600 font-bold text-white hover:bg-teal-500 transition-colors whitespace-nowrap"
        >
          Create Game
        </button>
      ) : (
        <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="relative">
            <input
              autoFocus
              type="text"
              placeholder="Game name"
              {...register("name", { required: true })}
              onKeyDown={handleKeyDown}
              className={clsx(
                "w-32 sm:w-40 bg-gray-800 border text-white text-sm rounded-lg block p-2 outline-none focus:ring-2 ring-teal-500/50 transition-all"
              )}
            />
          </div>

          <button
            type="button" // Use onClick instead of type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="inline-flex items-center justify-center p-2 rounded-lg bg-teal-600 font-bold text-white hover:bg-teal-500 disabled:opacity-50 transition-colors text-sm whitespace-nowrap"
          >
            {isPending ? "..." : "Create"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-500 hover:text-white transition-colors px-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
