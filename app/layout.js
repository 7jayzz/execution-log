import "./globals.css";

export const metadata = {
  title: { default: "The Execution Log — trading journal", template: "%s · The Execution Log" },
  description: "Your trades already tell the story. We help you read it. The trading journal for prop and retail traders: real lot sizes, MT5-matched costs, goals and discipline tracking.",
};

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0A0E18" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700;800&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
