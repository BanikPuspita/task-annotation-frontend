/**
 * Same font-link requirement as the other files — make sure this is in index.html once:
 * <link rel="preconnect" href="https://fonts.googleapis.com">
 * <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
 *
 * No logic/props changed — same Props interface (title, value, color, icon),
 * same destructuring, same component signature and export.
 *
 * The only new bit: `topBorderClass` derives the accent border color from the
 * existing `color` prop via string replace (e.g. "bg-[#5B5FEF]" -> "border-t-[#5B5FEF]"),
 * so Dashboard.tsx doesn't need any further changes.
 */

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