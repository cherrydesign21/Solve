import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 64, fontWeight: 700, color: "#ffffff" }}>
          <span>S</span>
          <span
            style={{
              display: "flex",
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: "#d9ff00",
              margin: "0 3px",
            }}
          />
          <span>lve</span>
        </div>
      </div>
    ),
    size
  );
}
