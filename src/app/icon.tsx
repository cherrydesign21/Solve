import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "5px solid #d9ff00",
          }}
        />
      </div>
    ),
    size
  );
}
