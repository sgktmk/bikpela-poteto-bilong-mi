import { visit } from 'unist-util-visit'
import sizeOf from 'image-size'
import fs from 'fs'
import { Node } from 'unist'

interface ImageNode extends Node {
  type: 'image' | 'mdxJsxFlowElement'
  url?: string
  alt?: string
  name?: string
  attributes?: Array<{
    type: string
    name: string
    value: any
  }>
}

interface ParagraphNode extends Node {
  type: 'paragraph' | 'div'
  children: Node[]
}

export default function remarkImgToJsx() {
  return (tree: Node) => {
    visit(
      tree,
      // only visit p tags that contain an img element
      (node: any): node is ParagraphNode =>
        node.type === 'paragraph' && node.children.some((n: any) => n.type === 'image'),
      (node: ParagraphNode) => {
        const imageNode = node.children.find((n: any) => n.type === 'image') as ImageNode

        if (!imageNode || !imageNode.url) return

        // only local files
        if (fs.existsSync(`${process.cwd()}/public${imageNode.url}`)) {
          const dimensions = sizeOf(`${process.cwd()}/public${imageNode.url}`)

          // Convert original node to next/image
          imageNode.type = 'mdxJsxFlowElement'
          imageNode.name = 'Image'
          imageNode.attributes = [
            { type: 'mdxJsxAttribute', name: 'alt', value: imageNode.alt },
            { type: 'mdxJsxAttribute', name: 'src', value: imageNode.url },
            { type: 'mdxJsxAttribute', name: 'width', value: dimensions.width },
            { type: 'mdxJsxAttribute', name: 'height', value: dimensions.height },
          ]

          // Change node type from p to div to avoid nesting error
          node.type = 'div'
          node.children = [imageNode]
        }
      }
    )
  }
}
