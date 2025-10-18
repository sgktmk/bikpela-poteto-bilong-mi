import React from 'react'
import Mail from './mail.svg'
import Github from './github.svg'
import Facebook from './facebook.svg'
import Youtube from './youtube.svg'
import Linkedin from './linkedin.svg'
import Twitter from './twitter.svg'

// Icons taken from: https://simpleicons.org/

type SocialKind = 'mail' | 'github' | 'facebook' | 'linkedin' | 'twitter' | 'youtube'

interface SocialIconProps {
  kind: SocialKind
  href: string
  size?: string
}

const components = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
}

const SocialIcon: React.FC<SocialIconProps> = ({ kind, href, size = '8' }) => {
  if (!href || (kind === 'mail' && !href.includes('mailto:'))) return null

  const SocialSvg = components[kind]

  // Tailwindのサイズクラスを明示的に定義
  const sizeClasses = {
    '4': 'h-4 w-4',
    '5': 'h-5 w-5',
    '6': 'h-6 w-6',
    '7': 'h-7 w-7',
    '8': 'h-8 w-8',
    '10': 'h-10 w-10',
  }

  const sizeClass = sizeClasses[size as keyof typeof sizeClasses] || 'h-6 w-6'

  return (
    <a
      className="text-sm text-gray-500 transition hover:text-gray-600"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      <span className="sr-only">{kind}</span>
      <SocialSvg
        className={`fill-current text-gray-700 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400 ${sizeClass}`}
      />
    </a>
  )
}

export default SocialIcon
