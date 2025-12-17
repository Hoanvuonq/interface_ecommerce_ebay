export const ModalWrapper: React.FC<any> = ({
  open,
  onCancel,
  title,
  children,
  ...rest
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center transition-opacity duration-300 bg-black/40 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-2 my-2 sm:my-8 transform transition-transform duration-300 translate-y-0 max-h-[98vh] flex flex-col">
        <div className="p-3 sm:p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          {title}
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">{children}</div>
      </div>
    </div>
  );
};
