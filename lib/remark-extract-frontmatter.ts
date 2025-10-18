import { visit } from 'unist-util-visit'
import { load } from 'js-yaml'
import { Node } from 'unist'
import { VFile } from 'vfile'

interface YamlNode extends Node {
  type: 'yaml'
  value: string
}

interface VFileWithData extends VFile {
  data: {
    frontmatter?: any
    [key: string]: any
  }
}

export default function extractFrontmatter() {
  return (tree: Node, file: VFileWithData) => {
    visit(tree, 'yaml', (node: YamlNode) => {
      file.data.frontmatter = load(node.value)
    })
  }
}
