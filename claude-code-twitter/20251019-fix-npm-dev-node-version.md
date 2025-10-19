# npm run dev 失敗問題の解決

## セッション情報

- 日付: 2025 年 10 月 19 日
- ブランチ: main
- 作業概要: PRoot 環境での Next.js 開発サーバー起動失敗を解決

## 問題の背景

ユーザーから「おそらく環境的な要因で、npm run dev が成功しない」という報告があり、原因の深堀りと修正を依頼された。PRoot 環境という特殊な環境で動作させる必要があり、かつ通常環境でも動作する汎用的な解決策が求められた。

## 問題の調査

### 初期状態

```bash
$ node --version
v18.20.8

$ npm run dev
> next dev

NodeError [SystemError]: A system error occurred: uv_interface_addresses returned Unknown system error 13 (Unknown system error 13)
```

### 特定された問題

1. **Node.js バージョン不一致**

   - 現在: Node.js v18.20.8
   - 要求: Node.js >= 20.0.0 (package.json)
   - Next.js 15.2.4 は公式に Node 20 以上を要求

2. **PRoot 環境のネットワーク制限**

   - エラー: `uv_interface_addresses returned Unknown system error 13`
   - Next.js が`os.networkInterfaces()`を呼び出し、ネットワークホスト情報を取得しようとして失敗
   - PRoot-Distro 環境(コンテナ/chroot 的な環境)で権限エラーが発生

3. **環境情報**
   - OS: Ubuntu 24.04.2 LTS on PRoot-Distro (aarch64)
   - カーネル: Linux 6.2.1-PRoot-Distro
   - Node.js インストール元: NodeSource (dpkg)

## 解決策の検討

### 試行 1: NodeSource からのアップグレード

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install nodejs -y
```

結果: dpkg が superuser 権限を要求して失敗。PRoot 環境の制約。

### 試行 2: nvm のインストール

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

成功! ユーザー空間での Node.js 管理が可能に。

### 遭遇した障害: bash_profile の問題

nvm コマンド実行時に以下のエラーが発生:

```
/home/sgktmk/.bash_profile: line 18: /home/sgktmk/.keychain/localhost-sh: No such file or directory
```

原因: keychain の設定が存在しないパスを参照していた。
解決: 一時的にコメントアウトして nvm インストールを完了させた。

## 実装内容

### 1. package.json の修正

dev スクリプトに`-H localhost`フラグを追加し、ネットワーク公開用のスクリプトも追加:

```json
"scripts": {
  "dev": "next dev -H localhost",
  "dev:network": "next dev -H 0.0.0.0",
  // ...
}
```

**意図:**

- `dev`: localhost に固定バインドすることで、PRoot 環境でのネットワークインターフェース検出を回避
- `dev:network`: 必要時に同一ネットワーク内からアクセスしたい場合用(通常環境向け)

### 2. Node.js 20 のインストール

nvm を使用してユーザー空間に Node 20 をインストール:

```bash
bash << 'HEREDOC'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 20 && nvm alias default 20 && nvm use 20
HEREDOC
```

結果:

```
Downloading and installing node v20.19.5...
Now using node v20.19.5 (npm v10.8.2)
Creating default alias: default -> 20 (-> v20.19.5)
```

### 3. 動作確認

```bash
$ npm run dev
   ▲ Next.js 15.2.4
   - Local:        http://localhost:3000
   - Network:      http://localhost:3000

 ✓ Starting...
 ✓ Ready in 4.5s
```

成功! 🎉

## 技術的な学び

### PRoot 環境の特性

- PRoot-Distro は完全な仮想化ではなく、ユーザー空間での chroot 的な環境
- システムコール(特にネットワーク関連)に制約がある
- `os.networkInterfaces()`のような低レベル API が権限エラーを起こす
- dpkg/apt は superuser 権限を要求するが、nvm のようなユーザー空間ツールは動作可能

### Next.js 15 のホスト検出動作

- デフォルトで全ネットワークインターフェースを検出しようとする
- `-H localhost`フラグで特定のホストにバインドすると、ネットワーク検出をスキップ
- これにより PRoot 環境でも安定動作

### Node.js バージョン互換性

Node 18 で Next.js 15 を起動しようとすると以下のエラーが発生:

```
malloc(): corrupted top size
```

これはメモリ破損エラーで、Node 18 と Next.js 15 の根本的な互換性問題を示している。

### heredoc の活用

bash_profile の問題を回避するため、heredoc でスクリプトを実行:

```bash
bash << 'HEREDOC'
# nvmの初期化とコマンド実行
HEREDOC
```

この方法により、サブシェルで必要な環境変数を設定して実行できる。

## 遭遇した問題と解決

### 問題 1: dpkg の権限エラー

**エラー:** `dpkg: error: requested operation requires superuser privilege`
**解決:** nvm を使用してユーザー空間にインストール

### 問題 2: bash_profile の keychain 設定エラー

**エラー:** `/home/sgktmk/.keychain/localhost-sh: No such file or directory`
**解決:** 一時的にコメントアウト(作業完了後に復元)

### 問題 3: nvm コマンドが無出力

**エラー:** bash コマンドで nvm を実行しても出力が得られない
**解決:** heredoc を使用してサブシェルで実行することで正常に動作

## ベストプラクティス

### 環境非依存の設計

- `-H localhost`は通常環境でも問題なく動作
- PRoot 環境特有の問題を回避しつつ、ポータブルな設定を維持
- `dev:network`スクリプトで柔軟性も確保

### nvm の活用

- システムの Node.js に依存せず、プロジェクトごとにバージョン管理
- `.nvmrc`ファイルを追加すれば、チーム全体でバージョンを統一可能
- PRoot 環境のような制約のある環境でも動作

### package.json の明示的な要件

```json
"engines": {
  "node": ">=20.0.0"
}
```

この設定により、要求される Node.js バージョンが明確になる。

## 今後の改善案

### 1. .nvmrc ファイルの追加

プロジェクトルートに`.nvmrc`を追加:

```
20
```

これにより、`nvm use`で自動的に正しいバージョンに切り替わる。

### 2. README への環境セットアップ手順追加

PRoot 環境や制約のある環境でのセットアップ手順をドキュメント化。

### 3. CI/CD での Node 20 使用

GitHub Actions などの CI 環境でも Node 20 を明示的に指定。

## コミット情報

### 変更ファイル

- `package.json`: dev スクリプトの修正、dev:network スクリプトの追加
- `.bash_profile`: 一時的な修正(最終的に復元)

### 統計

- 修正ファイル数: 1 (package.json)
- 追加行数: 1 (dev:network script)
- 変更行数: 1 (dev script)

## 振り返り

### うまくいった点

- 問題の根本原因を正確に特定できた(Node 18 vs Next.js 15 の互換性)
- PRoot 環境の制約を理解し、適切な回避策(nvm)を選択できた
- 環境非依存な解決策(-H localhost)を提供できた

### 学んだこと

- PRoot 環境の特性とシステムコール制約
- Next.js 15 のネットワークホスト検出の仕組み
- Node.js バージョンとフレームワーク互換性の重要性
- heredoc を使ったシェルスクリプト実行テクニック

### 改善できる点

- 最初から nvm を試すべきだった(dpkg アプローチに時間を使いすぎた)
- bash_profile の問題をもっと早く発見すべきだった

## 雑談・気づき

PRoot 環境は初めて扱ったが、完全な仮想化ではなくユーザー空間での chroot 的な実装だと分かった。Android の proot-distro として使われているようで、モバイルデバイスで Linux 開発環境を提供する用途に使われているのが興味深い。

今回の問題は、モダンなフレームワーク(Next.js 15)が最新の Node.js バージョンを要求する一方で、特殊な環境ではバージョンアップグレードに制約があるという、現実的な開発環境の課題を浮き彫りにした。nvm のようなユーザー空間ツールの重要性を再認識した。

また、エラーメッセージの深読みの重要性も実感。`uv_interface_addresses`という Node.js 内部 API のエラーから、ネットワークインターフェース検出の問題を推測し、`-H localhost`という適切な回避策にたどり着けた。

## 参考資料

- Next.js CLI Documentation: https://nextjs.org/docs/api-reference/cli
- nvm GitHub: https://github.com/nvm-sh/nvm
- Node.js os.networkInterfaces(): https://nodejs.org/api/os.html#osnetworkinterfaces
- PRoot: https://proot-me.github.io/
