import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "src/hooks/useNotification";
import api from "src/api/axios";

export const CreateGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addErrorNotification } = useNotification();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>();

  const { mutate: createGroup, isPending } = useMutation({
    mutationFn: async (formValues: { name: string }) => {
      const response = await api.post("/groups", formValues);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      navigate("/");
    },
    onError: (error) => {
      addErrorNotification(error);
    },
  });

  return (
    <div className="min-h-screen justify-center text-white flex items-start">
      <form
        onSubmit={handleSubmit((formValues) => {
          createGroup(formValues);
        })}
        className="bg-gray-800 p-8 rounded-lg w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Create Group</h1>
        <input
          type="text"
          placeholder="Group Name"
          {...register("name", {
            required: "Group name is required",
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters",
            },
          })}
          // <--- 4. Add Conditional Styling (Red border on error)
          className={`w-full p-2 rounded bg-gray-700 border focus:outline-none focus:ring-2 ${
            errors.name
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-600 focus:ring-teal-500"
          }`}
        />
        {errors.name && (
          <div className="p-2 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm text-center">
            {errors.name.message}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-500 py-2 rounded font-bold cursor-pointer"
          disabled={isPending || !!errors.name}
        >
          {isPending ? "Creating Group..." : "Create Group"}
        </button>
      </form>
    </div>
  );
};
