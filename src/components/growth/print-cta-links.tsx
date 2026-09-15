import {
  GROWTH_LOGIN_URL,
  VACCINE_REMINDER_URL,
} from "@/lib/constants";

type PrintCtaLinksProps = {
  /** Show growth-login CTA (default true). */
  showGrowthLogin?: boolean;
  className?: string;
};

/**
 * Clickable absolute URLs that survive print → PDF (relative links often break).
 */
export function PrintCtaLinks({
  showGrowthLogin = true,
  className,
}: PrintCtaLinksProps) {
  return (
    <aside
      className={
        className ??
        "mt-6 space-y-3 border-t border-border pt-4 text-sm print:break-inside-avoid"
      }
    >
      <p className="font-display text-base font-semibold text-foreground">
        Continue on Dr Care for Kids
      </p>
      <ul className="space-y-2 text-muted-foreground">
        {showGrowthLogin ? (
          <li>
            <span className="text-foreground">Growth monitoring (login): </span>
            <a
              href={GROWTH_LOGIN_URL}
              className="font-medium text-primary underline underline-offset-2"
            >
              {GROWTH_LOGIN_URL}
            </a>
            <span className="block text-xs sm:inline sm:before:content-['—_']">
              Save visits over time and track charts with a free account.
            </span>
          </li>
        ) : null}
        <li>
          <span className="text-foreground">Vaccine reminder: </span>
          <a
            href={VACCINE_REMINDER_URL}
            className="font-medium text-primary underline underline-offset-2"
          >
            {VACCINE_REMINDER_URL}
          </a>
          <span className="block text-xs sm:inline sm:before:content-['—_']">
            Vaccine Buddy — schedule guide and free due-date reminders.
          </span>
        </li>
      </ul>
    </aside>
  );
}
