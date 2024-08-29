import { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
interface CustomTooltipProps {
  children: ReactNode;
  message: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  children,
  message,
  side = 'top',
  className = '',
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={`bg-teal-700 shadow ${className}`} side={side} onMouseEnter={(e)=>{e.preventDefault();e.stopPropagation()}} >
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
