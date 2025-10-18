// 共通型定義ファイル

// ブログ記事関連の型定義
export interface FrontMatter {
  title: string
  date: string
  tags?: string[]
  lastmod?: string
  draft?: boolean
  summary?: string
  images?: string[]
  authors?: string[]
  layout?: string
  slug?: string
  fileName?: string
  canonicalUrl?: string
  readingTime?: {
    text: string
    minutes: number
    time: number
    words: number
  }
}

// 作者情報の型定義
export interface AuthorDetails {
  name: string
  avatar?: string
  occupation?: string
  company?: string
  email?: string
  twitter?: string
  linkedin?: string
  github?: string
}

// プロジェクトデータの型定義（既存のものを移動）
export interface ProjectData {
  title: string
  description: string
  imgSrc: string
  href: string
}

// 音楽記譜法関連の型定義
export interface ABCJSRenderOptions {
  responsive?: 'resize' | string
  expandToWidest?: boolean
  add_classes?: boolean
}

export interface ABCJSVisualObject {
  millisecondsPerMeasure(): number
}

// ABCJS外部ライブラリの型定義
export interface ABCJSSynthController {
  load(elementId: string, cursorControl: any, options: any): void
  setTune(visualObj: ABCJSVisualObject, userAction: boolean, options: any): void
}

export interface ABCJSCreateSynth {
  init(options: {
    visualObj: ABCJSVisualObject
    audioContext: AudioContext
    millisecondsPerMeasure: number
    options: any
  }): Promise<void>
  prime(options: { audioContext: AudioContext; options: any }): Promise<void>
}

export interface ABCJSSynth {
  supportsAudio(): boolean
  SynthController: new () => ABCJSSynthController
  CreateSynth: new () => ABCJSCreateSynth
}

export interface ABCJSLib {
  renderAbc(
    elementId: string | HTMLElement,
    abcString: string,
    options?: ABCJSRenderOptions
  ): ABCJSVisualObject[]
  synth: ABCJSSynth
}

declare global {
  const ABCJS: ABCJSLib
}

// MDX関連の型定義
export interface MDXFrontMatter extends FrontMatter {
  toc?: any[]
  mdxSource?: string
}

// ナビゲーション関連の型定義
export interface NavLink {
  href: string
  title: string
}

// テーマ関連の型定義
export type Theme = 'light' | 'dark' | 'system'

// コメントシステムの型定義
export interface CommentConfig {
  provider: 'giscus' | 'utterances' | 'disqus'
  [key: string]: any
}
