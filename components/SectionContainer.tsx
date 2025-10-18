import React from 'react'

interface SectionContainerProps {
  children: React.ReactNode
}

const SectionContainer: React.FC<SectionContainerProps> = ({ children }) => {
  return <div className="mx-auto max-w-4xl px-4 sm:px-6 xl:max-w-6xl xl:px-8">{children}</div>
}

export default SectionContainer
