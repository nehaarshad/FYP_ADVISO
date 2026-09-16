import React from 'react';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const isSameWeekday = (iso: string, targetDay: string) => {
  const d = new Date(iso + 'T00:00:00');
  return DAY_NAMES[d.getDay()] === targetDay;
};

interface Props {
  meetingDay: string;
  value: string | null;
  disabled?: boolean;
  onChange: (iso: string) => void;
}

export const MeetingDatePicker: React.FC<Props> = ({
  meetingDay,
  value,
  disabled,
  onChange,
}) => {
  const today = new Date();
  const min = today.toISOString().slice(0, 10);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (!v) return;
    if (!isSameWeekday(v, meetingDay)) {
      alert(`This meeting must be on a ${meetingDay}.`);
      return;
    }
    if (v < min) {
      alert('Cannot pick a past date.');
      return;
    }
    onChange(v);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        Meeting date (<span className="text-gray-500">{meetingDay}</span> only)
      </label>
      <input
        type="date"
        value={value ?? ''}
        min={min}
        disabled={disabled}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-gray-50"
      />
    </div>
  );
};