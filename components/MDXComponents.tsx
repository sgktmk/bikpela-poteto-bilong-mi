/* eslint-disable react/display-name */
import React, { useMemo } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import Image from './Image'
import CustomLink from './Link'
import TOCInline from './TOCInline'
import Pre from './Pre'
import { BlogNewsletterForm } from './NewsletterForm'

interface WrapperProps {
  components?: any
  layout: string
  [key: string]: any
}

interface MDXLayoutRendererProps {
  layout: string
  mdxSource: string
  [key: string]: any
}

export const MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  BlogNewsletterForm: BlogNewsletterForm,
  wrapper: ({ layout, ...rest }: WrapperProps) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Layout = require(`../layouts/${layout}`).default
    return <Layout {...rest} />
  },
}

export const MDXLayoutRenderer: React.FC<MDXLayoutRendererProps> = ({
  layout,
  mdxSource,
  ...rest
}) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])

  return <MDXLayout layout={layout} components={MDXComponents} {...rest} />
}
