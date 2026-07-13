

import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number;
  color: string;
  icon: LucideIcon;
}

function StatCard({ title, value, color, icon: Icon }: Props) {
  const topBorderClass = color.replace("bg-", "border-t-");

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E7E8F2] border-t-[3px] ${topBorderClass} p-5 relative overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 font-['Inter']`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6B7089] mb-3.5">
            {title}
          </p>

          <h2 className="font-['Space_Grotesk'] text-[34px] font-bold tracking-tight text-[#12142B] leading-none">
            {value}
          </h2>
        </div>

        <div
          className={`${color} w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 opacity-90`}
        >
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default StatCard;