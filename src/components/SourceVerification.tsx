import { StoryRecord } from "@/data/types";
import {
  hasDocumentedVerification,
  isPublicSourceUrl,
  verificationLabel,
} from "@/data/public-content";

export default function SourceVerification({ story }: { story: StoryRecord }) {
  const verified = hasDocumentedVerification(story);
  const statusLabel = verificationLabel(story);
  const publishedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${story.publishedAt}T00:00:00Z`));

  return (
    <section className="mt-8 pt-6 border-t border-line" aria-labelledby="sources-heading">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2
            id="sources-heading"
            className="font-stamp text-[11px] uppercase tracking-[0.12em] text-paper-dim"
          >
            Sources &amp; Record Status
          </h2>
          <p className="text-xs text-paper-dim mt-2">
            Published <time dateTime={story.publishedAt}>{publishedDate}</time>
            {story.sourceId ? ` · Record ${story.sourceId}` : ""}
          </p>
        </div>
        <span
          className={`self-start font-stamp text-[9px] uppercase tracking-[0.12em] border px-2.5 py-1.5 ${
            verified
              ? "border-moss text-paper"
              : "border-line text-paper-dim"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      {verified && story.verification && (
        <p className="text-xs text-paper-dim mt-3">
          Reviewed {story.verification.verifiedAt}
          {story.verification.verifiedBy
            ? ` by ${story.verification.verifiedBy}`
            : ""}
          {story.verification.note ? ` — ${story.verification.note}` : ""}
        </p>
      )}

      <ul className="space-y-2 mt-4">
        {story.sources.map((source) => (
          <li key={`${source.label}-${source.url}`} className="text-sm text-paper-dim">
            {isPublicSourceUrl(source.url) ? (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line underline-offset-4 hover:text-brass hover:decoration-brass transition-colors"
              >
                {source.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <span>
                {source.label}{" "}
                <span className="font-stamp text-[9px] uppercase tracking-[0.1em] text-paper-dim">
                  — source link pending
                </span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
