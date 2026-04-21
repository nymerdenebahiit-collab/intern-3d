type StatusBadgeType = 'open' | 'full' | 'pending' | 'approved';

const styles: Record<StatusBadgeType, string> = {
  open: 'bg-green-100 text-green-800',
  full: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-800',
};

export const StatusBadge = ({
  type,
  text,
}: {
  type: StatusBadgeType;
  text: string;
}) => {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${styles[type]}`}
    >
      {text}
    </span>
  );
};
