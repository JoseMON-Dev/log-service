import "reflect-metadata";

export const metadata = {
  title: 'Log Service Dashboard',
  description: 'Centralized logging system dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
