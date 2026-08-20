"use client";

import { useState } from "react";

interface StoryShareActionsProps {
  subject: string;
  quote: string;
  storyUrl: string;
  downloadUrl: string;
}

export default function StoryShareActions({ subject, quote, storyUrl, downloadUrl }: StoryShareActionsProps) {
  const [message, setMessage] = useState("");
  const text = `${subject} — ${quote}`;
  const buttonClass = "border border-line px-3 py-2 font-stamp text-[10px] uppercase tracking-[0.12em] text-paper-dim transition-colors hover:border-brass hover:text-brass focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass";

  async function copyLink() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(storyUrl);
      } else {
        const input = document.createElement("textarea");
        input.value = storyUrl;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }
      setMessage("Story link copied.");
    } catch {
      setMessage("Could not copy automatically. Select the address from your browser.");
    }
  }

  async function shareStory() {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${subject} | Reelspiration`, text, url: storyUrl });
        setMessage("Share sheet opened.");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copyLink();
    setMessage("Native sharing is unavailable, so the story link was copied.");
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2" aria-label="Share this story">
        <button type="button" onClick={copyLink} className={buttonClass}>Copy link</button>
        <button type="button" onClick={shareStory} className={buttonClass}>Share</button>
        <a href={downloadUrl} download className={buttonClass}>Download card</a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(storyUrl)}`} target="_blank" rel="noreferrer" className={buttonClass} aria-label={`Share ${subject} on LinkedIn`}>LinkedIn</a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storyUrl)}`} target="_blank" rel="noreferrer" className={buttonClass} aria-label={`Share ${subject} on Facebook`}>Facebook</a>
        <a href={`https://x.com/intent/post?url=${encodeURIComponent(storyUrl)}&text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer" className={buttonClass} aria-label={`Share ${subject} on X`}>X</a>
      </div>
      <p className="mt-3 min-h-5 text-sm text-paper-dim" role="status" aria-live="polite">{message}</p>
    </div>
  );
}
