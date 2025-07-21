/* eslint-disable jsx-a11y/anchor-has-content */
import Link from 'next/link'
import OgpCard from './OgpCard'

const CustomLink = ({ href, children, ...rest }) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')
  const isEmbedLink =
    href && !isInternalLink && !isAnchorLink && typeof children === 'string' && children === href

  if (isInternalLink) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    )
  }

  if (isAnchorLink) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  }

  if (isEmbedLink) {
    return <OgpCard url={href} />
  }

  return (
    <a target="_blank" rel="noopener noreferrer" href={href} {...rest}>
      {children}
    </a>
  )
}

export default CustomLink
