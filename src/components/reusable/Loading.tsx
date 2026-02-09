import { CircularProgress } from '@mui/material'

interface LoadingProps {
  message?: string
  /** Use "minimal" for a smaller inline-style overlay (e.g. inside a card) */
  variant?: 'fullscreen' | 'minimal'
}

const Loading = ({ message = 'Please wait...', variant = 'fullscreen' }: LoadingProps) => {
  const isMinimal = variant === 'minimal'

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className={`
        flex justify-center items-center
        bg-white/80 backdrop-blur-sm
        transition-opacity duration-200 ease-out
        ${isMinimal ? 'absolute inset-0 z-10 rounded-lg' : 'fixed inset-0 z-[9999]'}
      `}
    >
      <div
        className={`
          flex items-center gap-4
          rounded-xl border border-slate-200/80
          bg-white/95 shadow-lg shadow-slate-200/50
          ${isMinimal ? 'px-4 py-3' : 'px-6 py-5'}
        `}
      >
       <CircularProgress size={isMinimal ? 20 : 30} sx={{color:"#04b0a8"}} />
        <span
          className={`
            font-medium text-slate-700
            ${isMinimal ? 'text-sm' : 'text-lg'}
          `}
        >
          {message}
        </span>
      </div>
    </div>
  )
}

export default Loading
