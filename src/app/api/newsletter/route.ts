import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const email =
    typeof payload === "object" && payload !== null && "email" in payload
      ? String(payload.email).trim().toLowerCase()
      : "";

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json(
      { message: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const signupUrl = process.env.NEWSLETTER_SIGNUP_URL;
  if (!signupUrl) {
    return NextResponse.json(
      {
        message:
          "Weekly Proof signup is temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    );
  }

  let endpoint: URL;
  try {
    endpoint = new URL(signupUrl);
  } catch {
    return NextResponse.json(
      { message: "Weekly Proof signup is temporarily unavailable." },
      { status: 503 },
    );
  }

  const localEndpoint = endpoint.hostname === "localhost" || endpoint.hostname === "127.0.0.1";
  if (endpoint.protocol !== "https:" && !localEndpoint) {
    return NextResponse.json(
      { message: "Weekly Proof signup is temporarily unavailable." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.NEWSLETTER_API_KEY
          ? { Authorization: `Bearer ${process.env.NEWSLETTER_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({ email, source: "reelspiration.com" }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "We could not complete your signup. Please try again later." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      message: "You’re on the list. Watch your inbox for Weekly Proof.",
    });
  } catch {
    return NextResponse.json(
      { message: "We could not reach the signup service. Please try again later." },
      { status: 502 },
    );
  }
}
