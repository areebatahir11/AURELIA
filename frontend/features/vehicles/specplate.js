const SPEC_ROWS = [
  { label: "Horsepower", key: "horsepower", suffix: " hp" },
  { label: "0–60 mph", key: "zeroToSixty", suffix: " s" },
  { label: "Top speed", key: "topSpeed", suffix: " mph" },
  { label: "Transmission", key: "transmission" },
  { label: "Drivetrain", key: "drivetrain" },
  { label: "Exterior", key: "exteriorColor" },
  { label: "Interior", key: "interiorColor" },
  { label: "VIN", key: "vin" },
];

export default function SpecPlate({ vehicle }) {
  return (
    <div className="border border-hairline">
      <div className="border-b border-hairline px-6 py-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
          Build Specification
        </span>
      </div>
      <dl>
        {SPEC_ROWS.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between border-b border-hairline px-6 py-3 last:border-b-0"
          >
            <dt className="font-mono text-xs uppercase tracking-[0.1em] text-graphite">
              {row.label}
            </dt>
            <dd className="font-mono text-sm text-ivory">
              {vehicle[row.key]}
              {row.suffix || ""}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}