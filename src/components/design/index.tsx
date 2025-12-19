"use-client";

export const Design = () => {
  return (
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-48 h-48 md:w-72 md:h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob bg-blue-200 dark:bg-blue-900"></div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 md:w-72 md:h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 bg-purple-200 dark:bg-purple-900"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-72 md:h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000 bg-pink-200 dark:bg-pink-900"></div>
      </div>
  )
}
