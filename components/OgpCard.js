import { useEffect, useState } from 'react'
import Image from './Image'

const OgpCard = ({ url }) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!url) return
    const controller = new AbortController()
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 'success') {
          const { title, description, image, url: finalUrl } = json.data
          setData({
            title,
            description,
            image: image?.url,
            url: finalUrl,
          })
        }
      })
      .catch(() => {})
    return () => controller.abort()
  }, [url])

  if (!data) return null

  return (
    <a href={data.url} target="_blank" rel="noopener noreferrer" className="block my-4">
      <div className="flex overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
        {data.image && (
          <div className="relative w-32 h-20 flex-shrink-0">
            <Image src={data.image} alt="og image" fill className="object-cover" />
          </div>
        )}
        <div className="p-2 text-sm">
          <p className="font-semibold line-clamp-2">{data.title}</p>
          {data.description && (
            <p className="text-gray-500 dark:text-gray-400 line-clamp-2">{data.description}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">{new URL(data.url).host}</p>
        </div>
      </div>
    </a>
  )
}

export default OgpCard
