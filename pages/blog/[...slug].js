import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import PageTitle from '@/components/PageTitle'
import generateRss from '@/lib/generate-rss'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { formatSlug, getAllFilesFrontMatter, getFileBySlug, getFiles } from '@/lib/mdx'

const DEFAULT_LAYOUT = 'PostLayout'

export async function getStaticPaths() {
  const posts = getFiles('blog')
  const allFrontMatter = await Promise.all(
    posts.map(async (p) => {
      const source = fs.readFileSync(path.join(process.cwd(), 'data', 'blog', p), 'utf8')
      const { data } = matter(source)
      return { slug: data.slug || formatSlug(p), filePath: p }
    })
  )
  return {
    paths: allFrontMatter.map((post) => ({
      params: {
        slug: post.slug.split('/'),
        filePath: post.filePath,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const allPosts = await getAllFilesFrontMatter('blog')
  const postIndex = allPosts.findIndex((post) => post.slug === params.slug.join('/'))
  const prev = allPosts[postIndex + 1] || null
  const next = allPosts[postIndex - 1] || null
  const posts = getFiles('blog')
  const filePath = posts.find((p) => {
    const source = fs.readFileSync(path.join(process.cwd(), 'data', 'blog', p), 'utf8')
    const { data } = matter(source)
    return (data.slug || formatSlug(p)) === params.slug.join('/')
  })
  if (!filePath) {
    throw new Error(`No file found for slug: ${params.slug.join('/')}`)
  }
  const post = await getFileBySlug('blog', formatSlug(filePath))
  const authorList = post.frontMatter.authors || ['default']
  const authorPromise = authorList.map(async (author) => {
    const authorResults = await getFileBySlug('authors', [author])
    return authorResults.frontMatter
  })
  const authorDetails = await Promise.all(authorPromise)

  // rss
  if (allPosts.length > 0) {
    const rss = generateRss(allPosts)
    fs.writeFileSync('./public/feed.xml', rss)
  }

  return { props: { post, authorDetails, prev, next } }
}

export default function Blog({ post, authorDetails, prev, next }) {
  const { mdxSource, toc, frontMatter } = post

  return (
    <>
      {frontMatter.draft !== true ? (
        <MDXLayoutRenderer
          layout={frontMatter.layout || DEFAULT_LAYOUT}
          toc={toc}
          mdxSource={mdxSource}
          frontMatter={frontMatter}
          authorDetails={authorDetails}
          prev={prev}
          next={next}
        />
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  )
}
