import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

// Rolling 72-hour countdown anchored to a stable user-local window
function useCountdown() {
  const [target] = useState<number>(() => {
    if (typeof window === "undefined") return Date.now() + 72 * 3600 * 1000;
    const key = "promo_target_v1";
    const stored = localStorage.getItem(key);
    if (stored) {
      const n = parseInt(stored, 10);
      if (!Number.isNaN(n) && n > Date.now()) return n;
    }
    const next = Date.now() + 72 * 3600 * 1000;
    localStorage.setItem(key, String(next));
    return next;
  });

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { hours, minutes, seconds };
}

function Cell({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-navy-dark/30 border border-gold/30 rounded-lg px-3 py-2 min-w-[3.5rem]">
        <span className="text-2xl sm:text-3xl font-bold text-gold tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-primary-foreground/70 mt-1">
        {label}
      </span>
    </div>
  );
}

export function CountdownPromo() {
  const { hours, minutes, seconds } = useCountdown();

  return (
    <section className="bg-gradient-to-r from-navy-dark via-navy to-navy-dark py-8 border-y border-gold/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 rounded-full px-3 py-1 mb-2">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="text-gold text-xs font-bold uppercase tracking-wider">
                Limited Time Offer
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-primary-foreground">
              Save <span className="text-gold">$50</span> on Any Package
            </h3>
            <p className="text-sm text-primary-foreground/70 mt-1">
              Use code <strong className="text-gold">LAUNCH50</strong> at checkout. Ends soon.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Cell value={hours} label="Hours" />
            <span className="text-gold text-2xl font-bold pb-4">:</span>
            <Cell value={minutes} label="Min" />
            <span className="text-gold text-2xl font-bold pb-4">:</span>
            <Cell value={seconds} label="Sec" />
          </div>

          <Link to="/pricing">
            <Button variant="gold" size="lg">
              Claim Offer →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
