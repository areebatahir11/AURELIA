"use client";
//reservationCountdown
import { useEffect, useState } from "react";

const RETRY_INTERVAL_MS = 4000;

function formatRemaining(ms) {
  if (ms <= 0) return "Expired";
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Renders "Reservation expires in: Xh Ym" and ticks down every second.
 *
 * Once it crosses zero it calls onExpire() to ask the parent to refetch —
 * but because the client clock and server clock (datetime.utcnow()) are
 * never perfectly in sync, the backend may not have flipped the order's
 * status yet on the first refetch. So instead of firing once and giving up,
 * it keeps retrying onExpire() every few seconds until this component is
 * unmounted (which happens naturally once the parent stops rendering it,
 * i.e. once order.status is no longer "Pending").
 */
export default function ReservationCountdown({ expiresAt, onExpire }) {
  const [remaining, setRemaining] = useState(() => new Date(expiresAt).getTime() - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(new Date(expiresAt).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  useEffect(() => {
    if (remaining > 0) return;

    // Fire immediately on crossing zero, then keep retrying — the backend
    // will eventually agree it's expired even if clocks are slightly skewed.
    // This effect (and the interval) is automatically cleaned up once the
    // parent stops rendering this component (status no longer "Pending").
    onExpire?.();
    const retry = setInterval(() => {
      onExpire?.();
    }, RETRY_INTERVAL_MS);

    return () => clearInterval(retry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining <= 0, expiresAt]);

  return (
    <p className="font-mono text-xs uppercase tracking-[0.1em] text-graphite">
      Reservation expires in: <span className="text-gold">{formatRemaining(remaining)}</span>
    </p>
  );
}