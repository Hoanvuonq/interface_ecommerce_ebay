import React from "react";
import { MessageSquare } from "lucide-react";

interface CustomerNoteCardProps {
    note: string;
}

export const CustomerNoteCard: React.FC<CustomerNoteCardProps> = ({ note }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MessageSquare size={18} className="text-blue-600" />
                Ghi chú của khách
            </h3>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{note}</p>
            </div>
        </div>
    );
};

