import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const font = fetch(
  new URL(
    '../../../node_modules/@fontsource/inter/files/inter-all-700-normal.woff',
    import.meta.url
  )
).then((res) => res.arrayBuffer())

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'Bikpela Poteto Bilong Mi'
  const fontData = await font
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#f8f8f8',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          justifyContent: 'space-between',
          fontFamily: 'Inter',
        }}
      >
        <div style={{ textAlign: 'center', fontSize: 40 }}>Bikpela Poteto Bilong Mi</div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: 80,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        <div style={{ alignSelf: 'flex-end', fontSize: 32 }}>sgktmk</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  )
}
