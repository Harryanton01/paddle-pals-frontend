import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "src/api/axios";

export const CreateGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<{ name: string }>();
  const { mutate: createGroup } = useMutation({
    mutationFn: async (formValues: { name: string }) => {
      const response = await api.post("/groups", formValues);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      navigate("/");
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
          {...register("name")}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />
        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-500 py-2 rounded font-bold"
        >
          Create Group
        </button>
      </form>
    </div>
  );
};
