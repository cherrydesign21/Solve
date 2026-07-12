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
          backgroundColor: "#0b0c0a",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 94,
            height: 94,
            borderRadius: "50%",
            border: "24px solid #d9ff00",
          }}
        />
      </div>
    ),
    size
  );
}
