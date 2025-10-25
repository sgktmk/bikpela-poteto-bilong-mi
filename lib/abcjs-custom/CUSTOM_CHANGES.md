# ABCJS Custom Build Changes

## Base Version
- abcjs v6.5.2

## Modifications

### 1. gchord Duration Extension Support

**目的:** `%%MIDI gchord`パターンで数字接尾辞を使用して、4分音符以上の長さのコード伴奏を実現

**変更ファイル:** `src/synth/chord-track.js`

#### 変更1: parseGChord関数 (line 423-478)

**変更内容:**
- 数字接尾辞（例：c2, f4, z3）を検出して音価として解釈
- 最初の音符 + (duration-1)個の`-hold`マーカーを生成
- 複数桁の数字をサポート（例：c12）

**実装例:**
```javascript
// 入力: "c4z4"
// 出力: ["chick", "chick-hold", "chick-hold", "chick-hold", "", "", "", ""]
```

#### 変更2: resolveChords関数 (line 336-380)

**変更内容:**
- `-hold`マーカーを検出してスキップ（重複発音を防止）
- 後続の`-hold`マーカーをカウントして音符の長さを延長
- `actualNoteLength`として計算された長さを`writeNote`に渡す

**実装例:**
```javascript
// パターン: ["chick", "chick-hold", "chick-hold", "chick-hold"]
// 結果: 最初の"chick"のみ発音、duration = noteLength + 0.125*3
```

## 使用例

```abc
X:1
T:Long Duration Test
M:4/4
L:1/8
K:C
%%staves (melody backing)
V:melody
C4 E4 | G4 c4 |
V:backing
%%MIDI chordprog 88
%%MIDI gchord c4z4
"C"x4 "F"x4 |
%%MIDI gchord f2c2z4
"G7"x8 |
```

## テスト状況
- ✅ 数字なしパターン（後方互換性）
- ✅ 2単位長（c2, f2）
- ✅ 4単位長（c4, f4）
- ✅ 8単位長（c8 - 全音符相当）
- ✅ 既存記事（Donna Lee）の正常動作

## Build Date
2025-10-25

## ビルドコマンド
```bash
cd ~/tmp/abcjs
npm install
npm run build
```

## 注意事項
- 本家abcjsにプルリクエストは出していません
- bikpela-poteto-bilong-miプロジェクト内でのみ使用
- 本家のバージョンアップ時は差分を再適用する必要があります
