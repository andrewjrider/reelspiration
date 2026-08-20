import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Notice",
  description: "How Reelspiration handles email addresses submitted for Weekly Proof.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-stamp text-xs uppercase tracking-[0.2em] text-brass mb-4">
        Privacy
      </p>
      <h1 className="font-serif text-4xl sm:text-5xl text-paper">Privacy Notice</h1>
      <p className="text-paper-dim mt-4">Last updated August 19, 2026</p>

      <div className="mt-12 space-y-10">
        <PrivacySection title="Weekly Proof email signup">
          When email signup is enabled, Reelspiration collects the email address
          you submit for the purpose of sending Weekly Proof and related service
          messages. The address is not used to create an account.
        </PrivacySection>
        <PrivacySection title="Service provider">
          Email delivery will be handled by the provider configured for the
          signup form. The provider name, retention terms, and international
          transfer details must be added here before production email capture is
          enabled.
        </PrivacySection>
        <PrivacySection title="Your choices">
          Every marketing email must include an unsubscribe method. A monitored
          privacy contact address must be added here before production email
          capture is enabled so subscribers can request access or deletion.
        </PrivacySection>
        <PrivacySection title="Site operation">
          Standard hosting logs may include technical information such as IP
          address, browser type, requested page, and request time for security
          and reliability purposes.
        </PrivacySection>
      </div>
    </article>
  );
}

function PrivacySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-stamp text-xs uppercase tracking-[0.15em] text-paper-dim">
        {title}
      </h2>
      <p className="text-paper leading-relaxed mt-3">{children}</p>
    </section>
  );
}
