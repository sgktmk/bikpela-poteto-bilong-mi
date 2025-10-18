# 実装日記: 楽譜と ABC 記法の切り替え機能

**日付**: 2025-10-18
**ブランチ**: `20251018/toggle-sheets`
**実装者**: Claude Code + sgktmk

## 概要

ブログ記事内の楽譜表示に、五線譜と ABC 記法をトグルで切り替えられる機能を実装しました。

## 実装の背景

### 課題

- 既存のブログ記事では、`MusicPlayer`コンポーネントで五線譜を表示した後に、手動で ABC 記法のコードブロックを追加していた
- コードの重複が発生し、メンテナンスが煩雑
- ユーザーは楽譜と ABC 記法の両方を同時に見ることができるが、画面スペースを多く使う

### 要件

1. 楽譜と ABC 記法を切り替えられるトグルボタン
2. デフォルトは五線譜表示
3. トグルボタンは控えめなデザインで下部に配置
4. 音楽再生中に切り替えても状態を維持
5. ABC 記法表示時はコピー機能付き

## 実装内容

### 1. 新規コンポーネント: `MusicPlayerWithToggle.tsx`

#### 初回実装

```typescript
// components/MusicPlayerWithToggle.tsx
const MusicPlayerWithToggle: React.FC<MusicPlayerWithToggleProps> = ({ abcNotation }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('score')
  const [copied, setCopied] = useState(false)

  // 初回は条件分岐で実装
  return (
    <div className="music-player-with-toggle">
      {displayMode === 'score' ? <MusicPlayer abcNotation={abcNotation} /> : <div>ABC記法表示</div>}
    </div>
  )
}
```

**問題点**: 表示モードを切り替えると`MusicPlayer`がアンマウント → 再マウントされ、再生状態がリセットされる

#### 改善版（CSS 表示切り替え）

```typescript
// 両方を常にマウント、CSSで表示/非表示を切り替え
return (
  <div className="music-player-with-toggle">
    <div className={displayMode === 'score' ? 'block' : 'hidden'}>
      <MusicPlayer abcNotation={abcNotation} />
    </div>
    <div className={displayMode === 'notation' ? 'block' : 'hidden'}>
      <div>ABC記法表示</div>
    </div>
  </div>
)
```

**解決**: コンポーネントが常にマウントされたままになり、再生状態が維持される

### 2. UI デザインの変遷

#### 初回デザイン

- タブ形式で上部に配置
- `px-4 py-2`の大きめサイズ
- ボーダー下線でアクティブ表示

#### 最終デザイン

- 小さなボタン（`px-2 py-1 text-xs`）で下部に配置
- 右寄せ（`justify-end`）で控えめに
- 背景色でアクティブ状態を明示
- テキストも簡潔に（「楽譜」「ABC 記法」）

### 3. 既存記事の移行

#### 対象記事（9 件）

1. 2025/07/07/たなばた.mdx（テスト用）
2. 2025/05/03/Devin を使ってみた.mdx
3. 2025/07/14/MonstersInc.mdx
4. 2025/06/28/アラカルト記事 20250628.mdx
5. 2025/05/05/ABCJS の練習.mdx
6. 2024/09/28/キキョウシティ.mdx
7. 2024/09/22/ABC.js の練習.mdx
8. 2024/09/21/ゲームキューブ起動音を耳コピした.mdx
9. 2024/05/25/abcjs を使ってみた（再生できるようにしてみた編）.mdx

#### 移行手順

```bash
# import文の置き換え
import MusicPlayer from '@/components/MusicPlayer'
↓
import MusicPlayerWithToggle from '@/components/MusicPlayerWithToggle'

# コンポーネント名の置き換え
<MusicPlayer abcNotation={`...`} />
↓
<MusicPlayerWithToggle abcNotation={`...`} />
```

### 4. 重複コードの削除

#### 削除対象

- 手動で追加していた ABC 記法のコードブロック（5 ファイル）
- 合計 177 行を削減

#### 特殊ケース

- **ゲームキューブ起動音を耳コピした.mdx**: `<details>`タグで囲まれた「おまけ」セクション全体を削除

## 技術的な学び

### 1. React のマウント/アンマウント問題

**問題**: 条件分岐（三項演算子）で表示を切り替えると、コンポーネントが DOM から削除される

```typescript
// ❌ 状態がリセットされる
{
  displayMode === 'score' ? <MusicPlayer /> : <ABCNotation />
}
```

**解決**: CSS の `display` プロパティで表示/非表示を切り替える

```typescript
// ✅ 状態が維持される
<div className={displayMode === 'score' ? 'block' : 'hidden'}>
  <MusicPlayer />
</div>
<div className={displayMode === 'notation' ? 'block' : 'hidden'}>
  <ABCNotation />
</div>
```

### 2. Tailwind CSS の活用

- `block` / `hidden`: 表示/非表示の切り替え
- `text-xs`: 小さなテキスト
- `justify-end`: フレックスボックスの右寄せ
- `dark:` プレフィックス: ダークモード対応

### 3. コピー機能の実装

```typescript
const onCopy = () => {
  setCopied(true)
  if (textRef.current) {
    navigator.clipboard.writeText(abcNotation)
  }
  setTimeout(() => {
    setCopied(false)
  }, 2000)
}
```

- `navigator.clipboard.writeText()` でクリップボードにコピー
- 2 秒後に自動的に「コピー済み」状態をリセット

### 4. 既存コンポーネントの再利用

- `MusicPlayer`: そのまま使用（変更なし）
- `Pre`: コードブロックのスタイルを参考

## コミット履歴

```
8ea360d refactor: ブログ記事から重複するABC記法コードブロックを削除
a0bf70f refactor: 全ブログ記事をMusicPlayerWithToggleに移行
b86744b fix: 表示モード切り替え時のコンポーネント状態を維持
04ffe16 refactor: トグルボタンのサイズと配置を改善
85ab3a1 feat: 楽譜とABC記法の切り替え機能を実装
```

## 成果物の統計

### 変更ファイル

- **新規**: `components/MusicPlayerWithToggle.tsx` (+113 行)
- **更新**: 9 つのブログ記事
- **削除**: 重複コードブロック (-177 行)
- **純増**: -63 行（コードが減った！）

### 機能の追加

- ✅ 楽譜と ABC 記法のトグル切り替え
- ✅ 再生状態の維持
- ✅ ABC 記法のコピー機能
- ✅ ダークモード対応
- ✅ レスポンシブデザイン

## 学んだベストプラクティス

### 1. UI の段階的改善

- まず動く実装を作る
- ユーザーフィードバックを受けて改善
- 今回: 大きなタブ → 小さなボタン

### 2. 状態管理の重要性

- コンポーネントのライフサイクルを理解する
- マウント/アンマウントが状態に与える影響を考慮
- 必要に応じて DOM 要素を保持する設計

### 3. 既存コードの重複排除

- DRY 原則（Don't Repeat Yourself）
- 同じ内容が複数箇所にあるとメンテナンスが困難
- 1 箇所で管理できるように設計

### 4. 後方互換性の維持

- `MusicPlayer`コンポーネントは変更なし
- 必要に応じて段階的に移行可能
- 既存の使い方も継続して利用可能

## 今後の改善案

### 1. エディタ機能の追加

- Devin を使ってみた.mdx に記載されていた「次にやりたいこと」
  - ✅ 楽譜とコードを読者が切り替えられるようにする（完了）
  - ❌ コードをその場で書き替えて遊べる（未実装）

### 2. 共有機能

- ABC 記法を URL パラメータで共有
- SNS への共有ボタン

### 3. エクスポート機能

- MIDI ファイルのダウンロード
- PNG 画像としてエクスポート

## 振り返り

### うまくいった点

- 計画的な実装（プランモードの活用）
- 段階的なコミット（5 つの論理的なコミット）
- ユーザーフィードバックに基づく改善
- 既存コードとの統合がスムーズ

### 改善できる点

- 最初から状態維持の問題を予測できなかった
- UI デザインを最初から確定できなかった
- テストコードがない（手動テストのみ）

### 学び

- React のライフサイクルをより深く理解
- CSS による表示制御の重要性
- ユーザー体験を考慮した UI 設計の重要性
- コードの重複排除がもたらすメンテナンス性の向上

## 備考

### プルリクエスト作成

- タイトル: `feat: 楽譜とABC記法の切り替え機能を実装`
- 概要: 詳細な変更内容、技術的実装、メリットを記載
- レビューポイント: 状態維持の実装、UI デザイン、既存記事への影響

### 次のステップ

1. プルリクエストの作成
2. レビュー対応
3. main ブランチへのマージ
4. 本番環境へのデプロイ

---

**所感**:
このセッションでは、単なる機能追加だけでなく、ユーザー体験の向上、コードのリファクタリング、重複の排除など、多角的な改善を行えました。特に、React の状態管理やライフサイクルについての理解が深まり、より良い設計ができるようになったと感じています。
