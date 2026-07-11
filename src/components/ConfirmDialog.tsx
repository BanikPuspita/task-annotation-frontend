import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-[#0B0E1F]/55 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 font-['Inter']">
      <div className="bg-white rounded-[16px] sm:rounded-[20px] shadow-[0_30px_60px_-12px_rgba(11,14,31,0.4)] w-full max-w-[420px] p-5 sm:p-8">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[10px] sm:rounded-[12px] bg-[#FFEDED] text-[#E14545] flex items-center justify-center mb-3 sm:mb-4">
          <AlertTriangle size={18}/>
        </div>

        <h2 className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold text-[#12142B]">
          {title}
        </h2>

        <p className="text-[#6B7089] text-[13px] sm:text-[13.5px] mt-2 sm:mt-2.5 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-5 sm:mt-7">
          <button
            onClick={onCancel}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-[10px] border-[1.5px] border-[#E7E8F2] text-[#12142B] font-semibold text-[13px] hover:bg-[#F6F7FB] transition w-full sm:w-auto"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-[10px] bg-[#FF6B6B] hover:bg-[#E14545] text-white font-semibold text-[13px] transition w-full sm:w-auto"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;