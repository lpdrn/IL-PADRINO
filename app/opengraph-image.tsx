import { ImageResponse } from "next/og";
import { PROMO_CODE } from "@/lib/config";

export const alt = `IL PADRINO — 2000 AED first-deposit bonus, promo code ${PROMO_CODE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded black & gold social share card (Latin/numeric — font-safe). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0b",
          backgroundImage:
            "radial-gradient(circle at 50% 14%, #1c1710, #0a0a0b 62%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 108,
            height: 108,
            borderRadius: 9999,
            alignItems: "center",
            justifyContent: "center",
            backgroundImage:
              "linear-gradient(180deg,#f4e5a3,#d4af37 55%,#8a6d1f)",
            marginBottom: 30,
          }}
        >
          <svg width="54" height="54" viewBox="0 0 24 24">
            <path
              d="M12 2.6c-.35 0-.66.17-.87.42C9.4 5.1 4.6 8.7 4.6 12.5c0 1.95 1.5 3.4 3.4 3.4.75 0 1.44-.24 2-.63-.2 1.5-.98 2.72-2.12 3.66-.3.25-.13.72.26.72h7.72c.4 0 .56-.47.26-.72-1.14-.94-1.92-2.16-2.12-3.66.56.4 1.25.63 2 .63 1.9 0 3.4-1.45 3.4-3.4 0-3.8-4.8-7.4-6.53-9.48A1.12 1.12 0 0 0 12 2.6Z"
              fill="#0a0a0b"
            />
          </svg>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 36,
            letterSpacing: 16,
            color: "#d4af37",
            fontWeight: 700,
            marginBottom: 22,
          }}
        >
          IL PADRINO
        </div>

        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <div
            style={{
              display: "flex",
              fontSize: 210,
              fontWeight: 800,
              color: "#d4af37",
              lineHeight: 1,
            }}
          >
            2000
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 58,
              color: "#d4af37",
              paddingBottom: 28,
              marginLeft: 16,
            }}
          >
            AED
          </div>
        </div>

        <div
          style={{ display: "flex", fontSize: 40, color: "#f5f1e6", marginTop: 10 }}
        >
          FIRST-DEPOSIT BONUS
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 38,
            border: "2px solid rgba(212,175,55,0.5)",
            borderRadius: 16,
            padding: "14px 30px",
            fontSize: 34,
          }}
        >
          <span style={{ color: "#a39f94", marginRight: 18 }}>PROMO CODE</span>
          <span style={{ color: "#d4af37", fontWeight: 700, letterSpacing: 8 }}>
            {PROMO_CODE}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
