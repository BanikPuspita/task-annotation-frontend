interface Props {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

function DateSelector({
  selectedDate,
  onDateChange,
}: Props) {
  return (
    <div className="mb-6">
      <label className="block font-semibold mb-2">
        Select Date
      </label>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) =>
          onDateChange(e.target.value)
        }
        className="border rounded-lg p-2"
      />
    </div>
  );
}

export default DateSelector;