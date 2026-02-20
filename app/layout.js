export const metadata = {
  title: 'PHX JAX Leasing Assistant',
  description: 'Phoenix Arts & Innovation District — Leasing Guide',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
