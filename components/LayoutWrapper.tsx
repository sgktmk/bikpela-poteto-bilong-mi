import React from 'react'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/bikpela-logo.svg'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'

interface LayoutWrapperProps {
  children: React.ReactNode
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <SectionContainer>
      <div className="flex min-h-screen flex-col justify-between">
        <header className="flex items-center justify-between py-8">
          <div className="flex flex-col space-y-2">
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Logo />
                </div>
                {typeof siteMetadata.headerTitle === 'string' ? (
                  <div className="text-2xl font-semibold leading-tight">
                    {siteMetadata.headerTitle}
                  </div>
                ) : (
                  siteMetadata.headerTitle
                )}
              </div>
            </Link>
            <p className="max-w-md text-base leading-6 text-gray-600 dark:text-gray-400">
              {siteMetadata.description}
            </p>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">
              {headerNavLinks.map((link) => (
                <Link key={link.title} href={link.href} className="header-nav-link">
                  {link.title}
                </Link>
              ))}
            </div>
            <ThemeSwitch />
            <MobileNav />
          </div>
        </header>
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
