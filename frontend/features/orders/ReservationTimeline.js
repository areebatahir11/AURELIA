"use client";

const TIMELINE = ["Pending", "Confirmed", "In Process", "Completed"];

export default function ReservationTimeline({ currentStatus }) {
  const currentIndex = TIMELINE.indexOf(currentStatus);

  return (
    <div className="space-y-5">
      {TIMELINE.map((status, index) => {
        const active = index <= currentIndex;

        return (
          <div key={status} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`h-3 w-3 rounded-full border transition-all duration-300 ${
                  active
                    ? "border-gold bg-gold"
                    : "border-hairline bg-transparent"
                }`}
              />

              {index !== TIMELINE.length - 1 && (
                <div
                  className={`mt-1 h-8 w-px ${
                    active ? "bg-gold/70" : "bg-hairline"
                  }`}
                />
              )}
            </div>

            <div>
              <p
                className={`font-body text-sm transition-colors ${
                  active ? "text-ivory" : "text-graphite"
                }`}
              >
                {status}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
