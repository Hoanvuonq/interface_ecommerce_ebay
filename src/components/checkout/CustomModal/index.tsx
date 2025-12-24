import {X} from "lucide-react";

export const CustomModal = ({isOpen, onClose, title, children, footer} : any) => {
    if (!isOpen) 
        return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X size={20}/></button>
                </div>
                <div className="p-6">{children}</div>
                {footer && <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">{footer}</div>}
            </div>
        </div>
    );
};