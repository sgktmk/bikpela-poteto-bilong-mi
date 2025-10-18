# TypeScript 移行計画書

## 概要

現在 JavaScript（React/Next.js）で構築されている Bikpela Poteto Bilong Mi ブログを、TypeScript ベースに安全に移行するための詳細実装計画書。

## 現状分析

### 技術スタック

- **フレームワーク**: Next.js 15.2.4 + React 19.1.0
- **スタイリング**: Tailwind CSS + CSS Modules
- **MDX 処理**: mdx-bundler + 豊富な remark/rehype プラグイン
- **音楽記譜**: ABCJS（独自の MusicScore/MusicPlayer コンポーネント）
- **パッケージマネージャー**: npm
- **リンター**: ESLint + Prettier

### 主要ファイル構成（移行対象）

```
📁 components/ (22個のJSファイル)
📁 layouts/ (4個のJSファイル)
📁 pages/ (14個のJSファイル + APIルート)
📁 lib/ (8個のJSファイル + utilities)
📁 data/ (設定ファイル)
```

## 移行計画

### **フェーズ 1: TypeScript 環境構築**

#### 1.1 依存関係追加

```json
"devDependencies": {
  "typescript": "^5.0.0",
  "@types/node": "^20.0.0",
  "@types/react": "^18.0.0",
  "@types/react-dom": "^18.0.0",
  "@typescript-eslint/eslint-plugin": "^6.0.0",
  "@typescript-eslint/parser": "^6.0.0"
}
```

#### 1.2 tsconfig.json 作成

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false, // 初期段階では false
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
  "exclude": ["node_modules"]
}
```

#### 1.3 Next.js 設定更新

```javascript
// next.config.js
module.exports = withBundleAnalyzer({
  // 既存設定...
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // 既存設定...
})
```

#### 1.4 ESLint 設定更新

```json
{
  "extends": ["next/core-web-vitals", "@typescript-eslint/recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

### **フェーズ 2: 型定義とカスタムプラグイン対応**

#### 2.1 外部ライブラリ型定義

```typescript
// types/abcjs.d.ts
declare module 'abcjs' {
  export function renderAbc(elementId: string, abcString: string, options?: any): void

  export function startAnimation(outputElement: Element, abcOutput: any, options?: any): void
}
```

#### 2.2 MDX 関連型定義

```typescript
// types/mdx.d.ts
declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element
  export default MDXComponent
}

// カスタムプラグイン型定義
// types/remark-plugins.d.ts
declare module './lib/remark-extract-frontmatter' {
  const plugin: any
  export default plugin
}
```

#### 2.3 サイトメタデータ型定義

```typescript
// types/site.ts
export interface SiteMetadata {
  title: string
  author: string
  headerTitle: string
  description: string
  language: string
  theme: 'light' | 'dark' | 'system'
  siteUrl: string
  // ... 他のプロパティ
}
```

### **フェーズ 3: 段階的ファイル移行**

#### 3.1 低リスクファイルから開始

**優先度 1: ユーティリティ関数**

- `lib/utils/formatDate.js` → `formatDate.ts`
- `lib/utils/kebabCase.js` → `kebabCase.ts`
- `lib/utils/htmlEscaper.js` → `htmlEscaper.ts`

**優先度 2: 設定ファイル**

- `data/siteMetadata.js` → `siteMetadata.ts`
- `data/headerNavLinks.js` → `headerNavLinks.ts`

#### 3.2 コアコンポーネント移行

**音楽関連コンポーネント（重要）**

```typescript
// components/MusicScore.tsx
import abcjs from 'abcjs'
import React, { useEffect } from 'react'

interface MusicScoreProps {
  code: string
}

const MusicScore: React.FC<MusicScoreProps> = ({ code }) => {
  useEffect(() => {
    abcjs.renderAbc('musicNotation', code)
  }, [code])

  return <div id="musicNotation"></div>
}

export default MusicScore
```

**レイアウトコンポーネント**

- `components/LayoutWrapper.js` → `LayoutWrapper.tsx`
- `layouts/PostLayout.js` → `PostLayout.tsx`

#### 3.3 複雑な機能の移行

**MDX パイプライン（最重要）**

```typescript
// lib/mdx.ts
import { bundleMDX } from 'mdx-bundler'
import type { BundleMDXOptions } from 'mdx-bundler'

export interface FrontMatter {
  title: string
  date: string
  slug?: string
  draft?: boolean
  tags?: string[]
  // ... 他のフィールド
}

export async function getFileBySlug(
  type: string,
  slug: string
): Promise<{
  mdxSource: string
  toc: any[]
  frontMatter: FrontMatter
}> {
  // 既存実装をTypeScript化
}
```

**Next.js ページ**

- `pages/_app.js` → `_app.tsx`
- `pages/blog/[...slug].js` → `[...slug].tsx`
- API ルート → 型安全な API エンドポイント

### **フェーズ 4: 厳格性向上と最適化**

#### 4.1 TypeScript 設定厳格化

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

#### 4.2 型チェック統合

```json
// package.json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "npm run type-check -- --watch",
    "build": "npm run type-check && next build && node ./scripts/generate-sitemap",
    "lint": "next lint --fix --dir pages --dir components --dir lib --dir layouts --dir scripts && npm run type-check"
  }
}
```

## 安全性確保策

### 検証ポイント

1. **ビルド成功確認**: 各フェーズで `npm run build` 実行
2. **音楽機能テスト**: ABCJS による楽譜レンダリング動作確認
3. **MDX ページ表示**: ブログ記事の正常表示確認
4. **Preact エイリアス**: 本番環境での Preact 置換動作確認

### ロールバック戦略

- 各フェーズごとに Git コミット
- 問題発生時は前フェーズに戻る
- JS と TS ファイルの並行運用期間を設ける

## リスク評価

### 高リスク要素

1. **ABCJS 統合**: 型定義が公式に存在しない
2. **カスタム remark/rehype プラグイン**: 型定義が複雑
3. **MDX パイプライン**: 多数のプラグインチェーン

### 中リスク要素

1. **Preact エイリアス**: TypeScript 設定との競合可能性
2. **動的 import**: Next.js の動的ルーティング型対応

### 低リスク要素

1. **UI コンポーネント**: 比較的標準的な React コンポーネント
2. **ユーティリティ関数**: 単純な関数群

## 推定スケジュール

| フェーズ   | 期間         | 主要作業       |
| ---------- | ------------ | -------------- |
| フェーズ 1 | 2-3 日       | 環境構築・設定 |
| フェーズ 2 | 3-4 日       | 型定義作成     |
| フェーズ 3 | 7-10 日      | ファイル移行   |
| フェーズ 4 | 2-3 日       | 厳格化・最適化 |
| **合計**   | **2-3 週間** |                |

## 成功基準

1. ✅ 全 JS ファイルの TS 化完了
2. ✅ ビルドエラーなし
3. ✅ 音楽記譜機能の完全動作
4. ✅ ブログ記事表示の正常動作
5. ✅ パフォーマンス劣化なし
6. ✅ 開発体験の向上（型補完・エラー検出）

---

**最終更新**: 2025 年 10 月 18 日  
**作成者**: Claude Code  
**対象プロジェクト**: Bikpela Poteto Bilong Mi
