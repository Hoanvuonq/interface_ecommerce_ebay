export interface OptionGroup {
  id: string;
  name: string;
  values: string[];
}

export interface ProductClassificationSectionProps {
  optionGroups: OptionGroup[];
  onAddGroup: () => void;
  onRemoveGroup: (index: number) => void;
  onUpdateGroupName: (index: number, value: string) => void;
  onAddValue: (groupIndex: number) => void;
  onRemoveValue: (groupIndex: number, valueIndex: number) => void;
  onUpdateValue: (
    groupIndex: number,
    valueIndex: number,
    value: string
  ) => void;
  maxGroups?: number;
}