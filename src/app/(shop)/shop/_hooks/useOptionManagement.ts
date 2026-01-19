import { useState, useCallback } from "react";

export interface OptionConfig {
  id: string;
  name: string;
  values: string[];
}

const MAX_OPTION_GROUPS = 2;
const MAX_OPTION_VALUES = 20;

export const useOptionManagement = (
  onWarning: (message: string) => void,
  onSuccess: (message: string) => void,
  onOptionChange?: (groups: OptionConfig[]) => void,
) => {
  const [optionGroups, setOptionGroups] = useState<OptionConfig[]>([]);
  const [addOptionModalOpen, setAddOptionModalOpen] = useState(false);
  const [newOptionName, setNewOptionName] = useState("");

  /**
   * Cập nhật tên nhóm (VD: Màu sắc, Kích thước)
   * Giữ nguyên logic kiểm tra trùng tên nhóm của bro
   */
  const handleOptionNameChange = useCallback(
    (index: number, value: string) => {
      const trimmed = (value || "").trim();

      // Kiểm tra trùng tên với các nhóm khác
      if (
        trimmed &&
        optionGroups.some(
          (group, idx) =>
            idx !== index && (group.name || "").trim() === trimmed,
        )
      ) {
        onWarning("Tên nhóm phân loại phải khác nhau trong cùng một sản phẩm.");
        return;
      }

      const updated = optionGroups.map((group, idx) =>
        idx === index ? { ...group, name: value } : group,
      );
      setOptionGroups(updated);
      onOptionChange?.(updated);
    },
    [optionGroups, onWarning, onOptionChange],
  );

  /**
   * Cập nhật giá trị phân loại (VD: Đỏ, Xanh, XL)
   * Giữ nguyên logic kiểm tra trùng giá trị trong cùng một nhóm
   */
  const handleOptionValueChange = useCallback(
    (groupIndex: number, valueIndex: number, value: string) => {
      const trimmed = (value || "").trim();

      const updated = optionGroups.map((group, idx) => {
        if (idx !== groupIndex) return group;

        // Nếu giá trị nhập vào đã tồn tại trong nhóm này (trừ chính nó) thì báo cảnh báo
        if (
          trimmed &&
          group.values.some(
            (v, i) => i !== valueIndex && (v || "").trim() === trimmed,
          )
        ) {
          onWarning("Giá trị phân loại trong cùng một nhóm phải khác nhau.");
          return group;
        }

        const nextValues = [...group.values];
        nextValues[valueIndex] = value;
        return { ...group, values: nextValues };
      });

      setOptionGroups(updated);
      onOptionChange?.(updated);
    },
    [optionGroups, onWarning, onOptionChange],
  );

  /**
   * Thêm một ô giá trị mới vào nhóm
   */
  const handleAddOptionValue = useCallback(
    (groupIndex: number) => {
      const targetGroup = optionGroups[groupIndex];
      if (!targetGroup) return;

      if (targetGroup.values.length >= MAX_OPTION_VALUES) {
        onWarning(
          `Mỗi phân loại chỉ được phép có tối đa ${MAX_OPTION_VALUES} tùy chọn.`,
        );
        return;
      }

      const updated = optionGroups.map((group, idx) =>
        idx === groupIndex
          ? { ...group, values: [...group.values, ""] }
          : group,
      );
      setOptionGroups(updated);
      onOptionChange?.(updated);
    },
    [optionGroups, onWarning, onOptionChange],
  );

  /**
   * Xóa một giá trị.
   * Giữ logic của bro: Nếu là giá trị cuối cùng thì reset về chuỗi rỗng thay vì xóa hẳn mảng.
   */
  const handleRemoveOptionValue = useCallback(
    (groupIndex: number, valueIndex: number) => {
      const updated = optionGroups.map((group, idx) => {
        if (idx !== groupIndex) return group;

        // Nếu chỉ còn 1 giá trị, reset nó về rỗng
        if (group.values.length === 1) {
          return { ...group, values: [""] };
        }

        const nextValues = group.values.filter(
          (_, vIdx) => vIdx !== valueIndex,
        );
        // Đảm bảo mảng luôn có ít nhất 1 phần tử
        return { ...group, values: nextValues.length ? nextValues : [""] };
      });

      setOptionGroups(updated);
      onOptionChange?.(updated);
    },
    [optionGroups, onOptionChange],
  );

  /**
   * Mở modal thêm nhóm mới (Màu sắc/Size)
   */
  const handleAddOptionColumn = useCallback(() => {
    if (optionGroups.length >= MAX_OPTION_GROUPS) {
      onWarning(`Đã đạt tối đa ${MAX_OPTION_GROUPS} nhóm phân loại.`);
      return;
    }
    setNewOptionName("");
    setAddOptionModalOpen(true);
  }, [optionGroups.length, onWarning]);

  /**
   * Xóa nguyên một nhóm phân loại
   */
  const handleRemoveOptionColumn = useCallback(
    (index: number) => {
      const updatedGroups = optionGroups.filter((_, i) => i !== index);
      setOptionGroups(updatedGroups);
      onOptionChange?.(updatedGroups);
      onSuccess("Đã xóa phân loại");
    },
    [optionGroups, onSuccess, onOptionChange],
  );

  /**
   * Xác nhận thêm nhóm từ Modal
   */
  const confirmAddOption = useCallback(
    (name: string) => {
      const newGroup: OptionConfig = {
        id: `group-${Date.now()}`,
        name: name,
        values: [""],
      };
      const updatedGroups = [...optionGroups, newGroup];
      setOptionGroups(updatedGroups);
      onOptionChange?.(updatedGroups);
      setAddOptionModalOpen(false);
      onSuccess(`Đã thêm nhóm: ${name}`);
    },
    [optionGroups, onSuccess, onOptionChange],
  );

  /**
   * Lấy danh sách tên các nhóm (Dùng cho Header của Table)
   */
  const getOptionNames = useCallback(() => {
    return optionGroups.map((group, index) => {
      const trimmed = group.name?.trim() || "";
      return trimmed || `Phân loại ${index + 1}`;
    });
  }, [optionGroups]);

  return {
    optionGroups,
    setOptionGroups,
    addOptionModalOpen,
    setAddOptionModalOpen,
    newOptionName,
    setNewOptionName,
    handleOptionNameChange,
    handleOptionValueChange,
    handleAddOptionValue,
    handleRemoveOptionValue,
    handleAddOptionColumn,
    handleRemoveOptionColumn,
    confirmAddOption,
    getOptionNames,
    MAX_OPTION_GROUPS,
    MAX_OPTION_VALUES,
  };
};
