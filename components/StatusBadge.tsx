import { EligibilityStatus } from '@/lib/types';
import { STATUS_BADGE_CLASS, STATUS_ICON, STATUS_LABEL } from '@/lib/status';

export default function StatusBadge({ status, size = 'md' }: { status: EligibilityStatus; size?: 'sm' | 'md' }) {
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold tracking-wide ${STATUS_BADGE_CLASS[status]} ${pad}`}
      title={STATUS_LABEL[status]}
    >
      <span aria-hidden="true">{STATUS_ICON[status]}</span>
      {STATUS_LABEL[status]}
    </span>
  );
}
