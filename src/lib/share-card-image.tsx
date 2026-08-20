import { ImageResponse } from "next/og";
import type { StoryRecord } from "@/data/types";

export function createStoryShareImage(story: StoryRecord, download = false) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          background: "#121915",
          color: "#ece4d3",
          padding: "66px 72px",
        }}
      >
        <div style={{ position: "absolute", right: -110, top: -110, width: 410, height: 410, display: "flex", border: "2px solid rgba(184,134,59,.18)", borderRadius: 999 }} />
        <div style={{ position: "absolute", right: -42, top: -42, width: 270, height: 270, display: "flex", border: "2px solid rgba(184,134,59,.24)", borderRadius: 999 }} />
        <div style={{ display: "flex", color: "#b8863b", fontFamily: "Arial, sans-serif", fontSize: 20, letterSpacing: 4, textTransform: "uppercase" }}>
          The Reelspiration
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: story.reelspiration.length > 165 ? 40 : 48, fontStyle: "italic", lineHeight: 1.18 }}>
            “{story.reelspiration}”
          </div>
          <div style={{ width: 84, height: 3, display: "flex", background: "#b8863b", marginTop: 30 }} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderTop: "1px solid #33403a", paddingTop: 24 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 30 }}>{story.subject}</div>
            <div style={{ display: "flex", color: "#a79f8c", fontFamily: "Arial, sans-serif", fontSize: 16, letterSpacing: 3, marginTop: 8 }}>REELSPIRATION</div>
          </div>
          <div style={{ display: "flex", color: "#a79f8c", fontFamily: "Arial, sans-serif", fontSize: 15, letterSpacing: 1 }}>
            reelspiration.com/stories/{story.slug}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        ...(download
          ? { "Content-Disposition": `attachment; filename="reelspiration-${story.slug}.png"` }
          : {}),
      },
    },
  );
}
