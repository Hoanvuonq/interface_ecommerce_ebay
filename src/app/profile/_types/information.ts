export interface InformationEditorProps {
  initialData: {
    username: string;
    email: string;
    fullName: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    status: string;
  };
  onSave: (data: any) => Promise<void>;
  isEditing: boolean;
  formId: string;
}