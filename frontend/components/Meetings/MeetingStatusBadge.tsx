import React from 'react';
import { STATUS_LABEL, STATUS_STYLES } from './types';
import { MeetingStatus } from '@/src/models/batchMeetingModel';

export const MeetingStatusBadge: React.FC<{ status: MeetingStatus }> = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[status]}`}
  >
    {STATUS_LABEL[status]}
  </span>
);