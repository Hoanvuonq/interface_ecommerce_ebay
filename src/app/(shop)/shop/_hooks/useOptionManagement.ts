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
  onOptionChange?: (groups: OptionConfig[]) => void
) => {
  const [optionGroups, setOptionGroups] = useState<OptionConfig[]>([]);
  const [addOptionModalOpen, setAddOptionModalOpen] = useState(false);
  const [newOptionName, setNewOptionName] = useState("");

  const handleOptionNameChange = useCallback(
    (index: number, value: string) => {
      const trimmed = (value || "").trim();

      if (
        trimmed &&
        optionGroups.some(
          (group, idx) => idx !== index && group.name.trim() === trimmed
        )
      ) {
        onWarning(
          "Tên nhóm phân loại phải khác nhau trong cùng một sản phẩm."
        );
        return;
      }

      const updated = optionGroups.map((group, idx) =>
        idx === index ? { ...group, name: value } : group
      );
      setOptionGroups(updated);
      onOptionChange?.(updated);
    },
    [optionGroups, onWarning, onOptionChange]
  );

  const handleOptionValueChange = useCallback(
    (groupIndex: number, valueIndex: number, value: string) => {
      const trimmed = (value || "").trim();

      const updated = optionGroups.map((group, idx) => {
        if (idx !== groupIndex) return group;

        if (
          trimmed &&
          group.values.some(
            (v, i) => i !== valueIndex && (v || "").trim() === trimmed
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
    [optionGroups, onWarning, onOptionChange]
  );

  const handleAddOptionValue = useCallback(
    (groupIndex: number) => {
      const targetGroup = optionGroups[groupIndex];
      if (!targetGroup) return;
      if (targetGroup.values.length >= MAX_OPTION_VALUES) {
        onWarning(
          `Mỗi phân loại chỉ được phép có tối đa ${MAX_OPTION_VALUES} tùy chọn.`
        );
        return;
      }
      const updated = optionGroups.map((group, idx) =>
        idx === groupIndex ? { ...group, values: [...group.values, ""] } : group
      );
      setOptionGroups(updated);
      onOptionChange?.(updated);
    },
    [optionGroups, onWarning, onOptionChange]
  );

  const handleRemoveOptionValue = useCallback(
    (groupIndex: number, valueIndex: number) => {
      const updated = optionGroups.map((group, idx) => {
        if (idx !== groupIndex) return group;
        if (group.values.length === 1) {
          const nextValues = [...group.values];
          nextValues[0] = "";
          return { ...group, values: nextValues };
        }
        const nextValues = group.values.filter((_, vIdx) => vIdx !== valueIndex);
        return { ...group, values: nextValues.length ? nextValues : [""] };
      });
      setOptionGroups(updated);
      onOptionChange?.(updated);
    },
    [optionGroups, onOptionChange]
  );

  const handleAddOptionColumn = useCallback(() => {
    if (optionGroups.length >= MAX_OPTION_GROUPS) {
      onWarning(`Đã đạt tối đa ${MAX_OPTION_GROUPS} nhóm phân loại.`);
      return;
    }
    setNewOptionName("");
    setAddOptionModalOpen(true);
  }, [optionGroups.length, onWarning]);

  const handleRemoveOptionColumn = useCallback(
    (index: number) => {
      const updatedGroups = optionGroups.filter((_, i) => i !== index);
      setOptionGroups(updatedGroups);
      onOptionChange?.(updatedGroups);
      onSuccess("Đã xóa phân loại");
    },
    [optionGroups, onSuccess, onOptionChange]
  );

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
    [optionGroups, onSuccess, onOptionChange]
  );

  const getOptionNames = () => {
    return optionGroups.map((group, index) => {
      const trimmed = group.name?.trim?.() || "";
      return trimmed || `Phân loại ${index + 1}`;
    });
  };

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
