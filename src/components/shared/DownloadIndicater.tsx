import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import { Download } from "lucide-react";
import { Link } from "react-router-dom";

const DownloadIndecator = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <Popover>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <div className="bg-indigo-50 p-[5px] rounded-md cursor-pointer">
                <Download className="text-slate-600 w-[25px] h-[25px]" />
              </div>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent className="bg-cyan-700">
            <p>Downloads</p>
          </TooltipContent>
          <PopoverContent className="flex flex-col gap-[20px] border shadow shadow-stone-500" align="end">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-slate-600">Download Task 1</p>
                <p>30%</p>
              </div>
              <Progress value={30} className="mt-[10px]" />
            </div>
            <Separator />
            <div>
              <div className="flex items-center justify-between">
                <p className="text-slate-600">Download Task 2</p>
                <p>90%</p>
              </div>
              <Progress value={90} className="mt-[10px]" />
            </div>
            <Separator />
            <div>
              <div className="flex items-center justify-between">
                <p className="text-slate-600">Download Task 3</p>
                <p>55%</p>
              </div>
              <Progress value={55} className="mt-[10px]" />
            </div>
            <Separator />
            <Link to={"#"} className="text-center text-cyan-600 text-[14px] hover:underline">See all downloads</Link>
          </PopoverContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DownloadIndecator;