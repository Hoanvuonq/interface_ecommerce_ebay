import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import categoryService from "../_services/category.service";
import { useCategoryFormStore } from "../_store/categoryStore";
import { useToast } from "@/hooks/useToast";

export const useCategoryLogic = (onSuccess?: () => void) => {
  const { formData, setFormField, setSlug, setErrors, resetForm } =
    useCategoryFormStore();
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();

  // 1. Fetch danh mục cha (Server State)
  const {
    data: parentCategories = [],
    isLoading: loadingParents,
    error: errorParents,
  } = useQuery({
    queryKey: ["categories", "parents"],
    queryFn: async () => {
      const res = await categoryService.getAll(0, 1000);
      return _.get(res, "content") || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // 2. Mutation tạo danh mục
  const createMutation = useMutation({
    mutationFn: (data: any) => categoryService.create(data),
    onSuccess: () => {
      toastSuccess("Tạo danh mục thành công!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      resetForm();
      onSuccess?.();
    },
    onError: (err: any) => {
      const msg =
        _.get(err, "response.data.message") || err.message || "Lỗi hệ thống";
      toastError(msg);
    },
  });

  // 3. Handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormField("name", name);
    // Tự động gợi ý slug bằng lodash kebabCase
    setSlug(_.kebabCase(name));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (_.isEmpty(_.trim(formData.name)))
      newErrors.name = "Tên danh mục là bắt buộc";
    if (_.isEmpty(formData.imageAssetId))
      newErrors.imageAssetId = "Hình ảnh là bắt buộc";

    setErrors(newErrors);
    return _.isEmpty(newErrors);
  };

  const submitForm = () => {
    if (validate()) {
      createMutation.mutate(formData);
    }
  };

  return {
    parentCategories,
    loadingParents,
    errorParents: errorParents?.message,
    isCreating: createMutation.isPending,
    handleNameChange,
    submitForm,
  };
};
