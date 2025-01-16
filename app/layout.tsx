import React from 'react'
import Footer from '../components/Footer'
import { Metadata } from 'next'
import './globals.css'
import ClientWrapper from './components/ClientWrapper'

export const metadata: Metadata = {
  title: '2GROW Investment App',
  description: 'Grow together, save smarter today - Invest in your Future today',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>
          <main className="flex-grow">
            {children}
          </main>
        </ClientWrapper>
        <Footer />
      </body>
    </html>
  )
}

