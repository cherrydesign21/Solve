export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export function OgImageContent() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
        backgroundImage: "radial-gradient(circle at 75% 20%, rgba(217,255,0,0.22), rgba(0,0,0,0) 60%)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 132,
          fontWeight: 700,
          letterSpacing: -2,
          textTransform: "uppercase",
          color: "#f4f5ef",
        }}
      >
        <span>S</span>
        <span
          style={{
            display: "flex",
            width: 82,
            height: 82,
            borderRadius: "50%",
            border: "21px solid #d9ff00",
            margin: "0 8px",
          }}
        />
        <span>lve</span>
      </div>
      <div style={{ display: "flex", marginTop: 28, fontSize: 34, color: "rgba(255,255,255,0.6)" }}>
        Everyday calculators, solved instantly.
      </div>
    </div>
  );
}
