export const NoteSection = ({ value, onChange }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 className="text-sm font-bold text-gray-800 mb-2">Ghi chú đơn hàng</h3>
    <textarea
      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all min-h-20 resize-none"
      placeholder="Lưu ý cho người bán..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
