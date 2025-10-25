# ABCJSカスタマイズ: gchord音価拡張機能の実装

## セッション情報
- **日付**: 2025年10月25日
- **ブランチ**: `20251025/abcjs-gchord-duration`
- **作業概要**: ABCJSの`%%MIDI gchord`パターンで数字接尾辞をサポートし、4分音符以上の長さのコード伴奏を実現

## 背景と課題

### きっかけ
ユーザーから「ABCJSでコードバッキングトラックの音価を制御したい」という要望があった。具体的には：
- `%%MIDI gchord c2z2c2z2` のような記法で、2単位分（4分音符相当）の長さを持つコードを発音したい
- コードネーム（`"C"`, `"G7"`など）で記述したい
- 既存の`gchord`では全て8分音符相当で発音されてしまう

### 問題の発見
ABCJSのソースコード `/home/sgktmk/tmp/abcjs/src/synth/chord-track.js:430` を確認したところ：

```javascript
case '2' : pattern.push(''); break; // TODO-PER: This should extend the last note, but that's a small effect
```

**数字接尾辞は未実装だった！** TODOコメントで「いつか実装すべき」とされていたが、優先度が低く放置されていた。

### abc2midiとの比較
本来のABC仕様（abc2midi）では、数字接尾辞で相対的な長さの比率を指定できるはずだが、ABCJSでは実装されていなかった。

## 実装方針

### アプローチの検討

最初に以下の選択肢を検討：

1. **別ボイスで明示的にコード伴奏を記述** - 和音を個別の音符で書く（自由度高いが記述が冗長）
2. **gchordパターンの工夫** - `cccc`で4回発音など（疑似的な延長）
3. **ABCJSをカスタマイズ** - 根本的解決だが開発工数大

→ ユーザーの要望「コードネームで書きたい」「4分音符以上の長さ」を満たすため、**3番を選択**

### 統合方法の決定

- **本家へのPRは出さない**（プロジェクト内のみで使用）
- **ローカルパッケージ方式**を採用（`package.json`で`file:./lib/abcjs-custom`を参照）
- ビルド済みファイルをプロジェクトに含める

## 実装内容

### 1. parseGChord関数の拡張 (`chord-track.js:423-478`)

**変更前:**
```javascript
for (var i = 0; i < gchord.length; i++) {
    var ch = gchord[i]
    switch(ch) {
        case 'z' : pattern.push(''); break;
        case '2' : pattern.push(''); break; // TODO
        case 'c' : pattern.push('chick'); break;
        // ...
    }
}
```

**変更後:**
```javascript
var i = 0
while (i < gchord.length) {
    var ch = gchord[i]
    var duration = 1

    // 数字接尾辞の検出（複数桁対応）
    if (i + 1 < gchord.length && /\d/.test(gchord[i + 1])) {
        var numStr = ''
        var j = i + 1
        while (j < gchord.length && /\d/.test(gchord[j])) {
            numStr += gchord[j]
            j++
        }
        duration = parseInt(numStr, 10)
        i = j - 1
    }

    switch(ch) {
        case 'z':
            for (var d = 0; d < duration; d++) pattern.push('');
            break;
        case 'c':
            pattern.push('chick');
            for (var d = 1; d < duration; d++) pattern.push('chick-hold');
            break;
        case 'f':
            pattern.push('boom');
            for (var d = 1; d < duration; d++) pattern.push('boom-hold');
            break;
        // ...
    }
    i++
}
```

**ポイント:**
- 数字を検出したら、その分だけ`-hold`マーカーを追加
- 複数桁の数字に対応（`c12`なども可能）
- 最初の1つだけ実際の音符、残りは持続マーカー

### 2. resolveChords関数の修正 (`chord-track.js:336-380`)

**変更箇所:**
```javascript
for (var p = 0; p < minLength; p++) {
    // ...
    var type = thisPattern[p]

    // CUSTOM: -holdマーカーはスキップ
    if (type && type.indexOf('-hold') >= 0) {
        continue
    }

    // CUSTOM: 後続のholdマーカーをカウントして音価を延長
    var extraDuration = 0
    for (var h = p + 1; h < minLength; h++) {
        if (thisPattern[h] && thisPattern[h].indexOf('-hold') >= 0) {
            extraDuration += 0.125  // 8分音符1つ分
        } else {
            break
        }
    }
    var actualNoteLength = noteLength + extraDuration

    // ...
    this.writeNote(pitches[oo],
        0.125,
        isBoom || newBass ? this.boomVolume : this.chickVolume,
        p,
        actualNoteLength,  // ← 延長された長さを使用
        isBoom || newBass ? this.bassInstrument : this.chordInstrument
    )
}
```

**ポイント:**
- `-hold`マーカーを見つけたら、その位置では音符を生成しない
- 代わりに直前の音符の`duration`を延長
- 8分音符単位（0.125）で加算

### 3. プロジェクト統合

**ディレクトリ構成:**
```
~/projects/bikpela-poteto-bilong-mi/
├── lib/abcjs-custom/           # 新規作成
│   ├── package.json            # v6.5.2-custom.1
│   ├── CUSTOM_CHANGES.md       # カスタマイズ記録
│   ├── index.js               # エントリーポイント
│   ├── dist/                   # ビルド済みファイル
│   └── types/                  # TypeScript型定義
└── package.json                # abcjs: "file:./lib/abcjs-custom"
```

**ビルド手順:**
```bash
# ABCJSのソース修正
cd ~/tmp/abcjs
vim src/synth/chord-track.js

# ビルド
npm install
npm run build

# bikpela-poteto-bilong-miへコピー
cp index.js ~/projects/bikpela-poteto-bilong-mi/lib/abcjs-custom/
cp -r dist ~/projects/bikpela-poteto-bilong-mi/lib/abcjs-custom/
cp -r types ~/projects/bikpela-poteto-bilong-mi/lib/abcjs-custom/

# プロジェクトに統合
cd ~/projects/bikpela-poteto-bilong-mi
npm install
```

## 技術的な学び

### 1. ABCJSのアーキテクチャ理解

**パターン生成の流れ:**
```
parseGChord → pattern配列 → resolveChords → MIDI note生成
```

- `parseGChord`: gchord文字列をパターン配列に変換
- `resolveChords`: パターンに従ってMIDI音符を生成
- 8分音符単位で処理（1小節 = 8つの位置）

### 2. ホールドマーカーの設計

既存のコードは各パターン要素を独立して処理していたため、「音符の延長」という概念がなかった。そこで：

- 新しいパターンタイプ `chick-hold`, `boom-hold` を導入
- `resolveChords`でholdマーカーを検出して前の音符を延長

この設計により、既存の処理フローを大きく変えずに機能追加できた。

### 3. JavaScriptの数値パース

複数桁の数字を読み取るため、whileループで連続する数字を検出：

```javascript
var numStr = ''
while (j < gchord.length && /\d/.test(gchord[j])) {
    numStr += gchord[j]
    j++
}
duration = parseInt(numStr, 10)
```

これにより`c2`, `c4`, `c12`などに対応。

### 4. ローカルnpmパッケージ

`package.json`で`file:`プロトコルを使うことで、ローカルディレクトリをパッケージとして参照できる：

```json
{
  "dependencies": {
    "abcjs": "file:./lib/abcjs-custom"
  }
}
```

メリット:
- npm installだけで依存関係が解決
- Vercelなどのデプロイ環境でも動作
- git管理が明確（ソースと分離）

## 遭遇した問題と解決

### 問題1: 数字の扱い

**問題:** 元のコードでは`case '2':`が単独で処理されており、「直前の音符を延長する」ロジックがなかった

**解決:** ループ構造をforからwhileに変更し、数字を読み取った後に`i`を調整することで、数字を接尾辞として扱えるようにした

### 問題2: 音符の重複発音

**問題:** 最初の実装では、holdマーカーでもMIDI音符が生成されてしまい、同じコードが連続して鳴ってしまった

**解決:** `resolveChords`の先頭で`-hold`パターンを検出し、`continue`で処理をスキップ

### 問題3: ビルド時間

**問題:** ABCJSのビルドに約30秒かかる

**解決:**
- 一度ビルドすれば、ソースを修正しない限り再ビルド不要
- ビルド済みファイルをgitにコミットすることも検討可能

## 使用例

### 基本的な使い方

```abc
X:1
T:Long Duration Chord Test
M:4/4
L:1/8
K:C
%%staves (melody backing)
V:melody
C4 E4 | G4 c4 |
V:backing
%%MIDI chordprog 88  % Pad音色推奨（サステインが長い）

% 全音符（8単位）
%%MIDI gchord c8
"C"x8 |

% 2分音符×2（4単位ずつ）
%%MIDI gchord c4z4
"F"x4 "G"x4 |

% 4分音符×4（2単位ずつ）
%%MIDI gchord c2z2c2z2
"C"x8 |

% ベース+コード
%%MIDI gchord f2c2z4
"G7"x8 |
```

### 実践例: バラード風伴奏

```abc
V:backing
%%MIDI chordprog 88
%%MIDI gchord c4c4
"C"x4 "Am"x4 | "F"x4 "G"x4 |
```

## ベストプラクティス

### 1. 音色選び
長い音価を活かすため、サステインの長い音色を推奨：
- Program 88-95: Pad系
- Program 52: Choir Aahs
- Program 89: Warm Pad

### 2. パターンの設計
- `c8`: 全音符風（最初だけ発音）
- `c4z4`: 2分音符×2
- `c2c2c2c2`: 4分音符×4（ストローク風）

### 3. 後方互換性
数字なしパターンは従来通り動作：
- `fzczfzcz` → 8分音符×8
- `fzcz` → 4分音符×4（実質）

## 今後の改善案

### 1. gchorddurationディレクティブの実装
現在は音符の長さだけ延長できるが、音量（velocity）の制御も欲しい

### 2. レガート/スタッカート制御
`-hold`の実装に加えて、`-staccato`や`-legato`フラグも考慮

### 3. 本家へのコントリビューション
動作が安定したら、本家ABCJSにプルリクエストを出すことも検討

### 4. .gitignore設定
現在はビルド済みファイルもコミットしているが、容量を考慮して除外することも検討：

```gitignore
lib/abcjs-custom/dist/
lib/abcjs-custom/*.js
!lib/abcjs-custom/package.json
```

## 振り返り

### うまくいった点
✅ ユーザーの要望（コードネームで長い音価）を実現
✅ 既存コードへの影響を最小限に抑えた設計
✅ ローカルパッケージで管理しやすい構成
✅ 詳細なドキュメント化（CUSTOM_CHANGES.md）

### 改善できる点
⚠️ テストの自動化がない（手動確認のみ）
⚠️ 複雑なパターンでのエッジケース検証が不十分
⚠️ パフォーマンスへの影響を測定していない

### 学び
🎓 オープンソースライブラリのカスタマイズ手法
🎓 ABCJSの内部アーキテクチャ理解
🎓 ローカルnpmパッケージの実践的な使い方
🎓 音楽記譜法（ABC notation）とMIDIの関係

## コミット履歴

```bash
git log --oneline
# (これから作成予定)
```

## 補足: ABC記法とMIDI gchordの仕様

### ABC記法の基本
- `X:`: 曲番号
- `T:`: タイトル
- `M:`: 拍子
- `L:`: デフォルト音符長
- `K:`: 調
- `%%MIDI`: MIDI関連ディレクティブ

### gchordパターンの記号
- `f`: fundamental (基音)
- `c`: chord (和音)
- `z`: rest (休符)
- `b`: bass+chord
- `g-k`, `G-K`: アルペジオ用個別音符

### 数字接尾辞の意味（今回実装）
- 数字なし: 1単位（8分音符相当）
- `2`: 2単位（4分音符相当）
- `4`: 4単位（2分音符相当）
- `8`: 8単位（全音符相当）

---

**実装完了日**: 2025年10月25日
**次のステップ**: ユーザーによる動作確認とフィードバック収集
