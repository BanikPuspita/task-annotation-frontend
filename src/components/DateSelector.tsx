
import { Calendar } from "lucide-react";

interface Props {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

function DateSelector({ selectedDate, onDateChange }: Props) {
  return (
    <div className="mb-4 sm:mb-5 font-['Inter']">
      <label className="block text-[11.5px] sm:text-[12.5px] font-semibold text-[#12142B] mb-1.5 sm:mb-2">
        Select Date
      </label>

      <div className="relative inline-flex items-center w-full sm:w-auto">
        <Calendar
          size={14}
          className="absolute left-3 sm:left-4 pointer-events-none text-[#6B7089]"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="border-[1.5px] border-[#E7E8F2] rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-[12.5px] sm:text-[13.5px] font-['JetBrains_Mono'] font-medium text-[#12142B] outline-none transition focus:border-[#5B5FEF] focus:ring-4 focus:ring-[#EEF0FE] bg-white w-full sm:w-auto"
        />
      </div>
    </div>
  );
}

export default DateSelector;