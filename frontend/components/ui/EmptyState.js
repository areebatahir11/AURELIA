import Button from "./Button";

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <h3 className="font-display text-2xl text-ivory mb-3">{title}</h3>
      {description && <p className="text-graphite font-body max-w-md mb-8">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
