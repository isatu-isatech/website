// app/api/verify-turnstile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

interface VerifyRequestBody {
  token: string;
}

interface CloudflareSiteVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  // Get the secret key from validated environment variables.
  const cloudflareTurnstileSecretKey = env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  try {
    const { token }: VerifyRequestBody = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Turnstile token is missing." },
        { status: 400 },
      );
    }

    // Prepare form data for Cloudflare's verification API
    const formData = new FormData();
    formData.append("secret", cloudflareTurnstileSecretKey);
    formData.append("response", token);

    const ip: string | null = request.headers.get("CF-Connecting-IP");
    if (ip) {
      formData.append("remoteip", ip);
    }

    const url: string =
      "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const response: Response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data: CloudflareSiteVerifyResponse = await response.json();

    if (data.success) {
      console.log("Turnstile verification successful:", data);
      return NextResponse.json({
        success: true,
        message: "Form submitted successfully! Turnstile verified.",
      });
    } else {
      console.error("Turnstile verification failed:", data["error-codes"]);
      return NextResponse.json(
        {
          success: false,
          message: "Turnstile verification failed.",
          errors: data["error-codes"],
        },
        { status: 403 },
      );
    }
  } catch (error: unknown) {
    console.error("Error verifying Turnstile token:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      {
        success: false,
        message: `Internal server error during verification: ${errorMessage}`,
      },
      { status: 500 },
    );
  }
}
