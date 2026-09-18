
import React from 'react';
import { STATUS_LABEL, STATUS_STYLES } from './types';
import { MeetingStatus } from '@/src/models/batchMeetingModel';

export const MeetingStatusBadge: React.FC<{ status: MeetingStatus }> = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider border shadow-sm ${STATUS_STYLES[status]}`}
  >
    {STATUS_LABEL[status]}
  </span>
);