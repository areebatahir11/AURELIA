export default function Loader({ size = 24 }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-hairline border-t-gold"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}
