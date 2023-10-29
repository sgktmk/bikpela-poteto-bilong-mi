---
template: post
title: Vue.js + Amplify で LIFF アプリ作ってみた
slug: 2023/10/29/vuejs-amplify-liff-app
draft: false
date: 2023-10-29T23:55:00.000Z
description: LIFF アプリを Vue.js で作って、Amplify でホスティングしてみました
category: programming
tags:
  - frontend
  - line
  - vuejs
  - aws
---

## Vue.js プロジェクト仮作成

下記の通り、Vue.js のプロジェクトを作成する。

```bash
$ npm create vue@latest

Vue.js - The Progressive JavaScript Framework

✔ Project name: … vuejs-amplify-liff-app
✔ Add TypeScript? … No / Yes
✔ Add JSX Support? … No / Yes
✔ Add Vue Router for Single Page Application development? … No / Yes
✔ Add Pinia for state management? … No / Yes
✔ Add Vitest for Unit Testing? … No / Yes
✔ Add an End-to-End Testing Solution? › No
✔ Add ESLint for code quality? … No / Yes
✔ Add Prettier for code formatting? … No / Yes

Scaffolding project in /home/sgktmk/project/vuejs-amplify-liff-app...

Done. Now run:

  cd vuejs-amplify-liff-app
  npm install
  npm run format
  npm run dev
```

そのあとは、言われたとおりにコマンドを叩いていくと、ローカルで Vue.js の Welcome 画面が表示できるようになる。

```bash
$ cd vuejs-amplify-liff-app
$ npm install
$ npm run format
$ npm run dev
```

![Vue.js の Welcome 画面](/static/images/blog/2023/10/29/vuejs-welcome.jpg)

いったんここまででコミットしておく。

```bash
$ git init
$ git status
$ git add . # 最初なので全部 add で
$ git commit -m "Create my Vue.js application"
```

Amplify にホスティングするために、GitHub に新しいリポジトリを作って、
![GitHub に新しいリポジトリを作成](/static/images/blog/2023/10/29/create-vuejs-repository.jpg)

すると GitHub の方で以下のようなことを言われるので、へいへいと従って push してくる。

> …or push an existing repository from the command line
>
> ```bash
> git remote add origin git@github.com:sgktmk/vuejs-amplify-liff-app.git
> git branch -M main
> git push -u origin main
> ```

以上で LIFF アプリの下地となるアプリケーションの作成は完了。

## Vue.js で作ったアプリケーションを Amplify でホスティング

LIFF アプリのエンドポイント URL として指定するために、まずは先ほど作ったアプリケーションを Amplify へホスティングする。  
Amplify へのホスティング方法は省略するが、ほぼほぼ画面の指示に従って GitHub のリポジトリを指定してやれば問題ない。

![Amplify にホスティング①](/static/images/blog/2023/10/29/add-vue-repository.jpg)

少し待つとこんな風にホスティングが完了し、`https://main.dx0c67aiiil0s.amplifyapp.com/` のような URL が払い出されて、インターネットに公開される。
![Amplify にホスティング②](/static/images/blog/2023/10/29/add-vue-repository2.png)

## LIFF アプリ作成

[公式の手順](https://developers.line.biz/ja/docs/liff/getting-started/#step-one-create-provider) に従って、**LINE ログイン用の LIFF アプリ** を作成する。そのときのエンドポイント URL に Amplify にホスティング完了したアプリケーションの URL を設定する。

## Vue.js プロジェクトに LIFF (LINE Front-end Framework) を追加

下記コマンドで、LIFF を追加する。

```bash
$ npm install --save @line/liff
```

LIFF の機能を使用してみるために、下記の通り `MyLineProfile` というコンポーネントファイルを作ってみる。

```ts
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import liff from "@line/liff";

type LiffState = {
  profile?: {
    userId: string;
    displayName: string;
    pictureUrl?: string;
    statusMessage?: string;
  };
};

export default defineComponent({
  setup() {
    const liffState = reactive<LiffState>({
      profile: undefined
    });

    const getProfile = async () => {
      const profile = await liff.getProfile();
      liffState.profile = profile;
    };

    onMounted(async () => {
      // LIFFアプリの初期化
      await liff.init({ liffId: '2001258142-JNl6a7XL' });

      // プロフィール情報の取得
      getProfile();
    });

    return {
      liffState,
    };
  }
});
</script>

<template>
    <div>
        <h1>{{ liffState.profile?.displayName ?? 'Unknown' }} さん！</h1>
        <p>
            今日の調子は {{ liffState.profile?.statusMessage ?? 'Unknown' }} だね。
            {{ liffState.profile?.userId }}
        </p>
        <h2>hoge</h2>
    </div>
</template>
```

そして `App.vue` にて下記の通り `MyLineProfile` をインポートして呼び出してやることで、LIFF で取得した情報を表示できるようになる。

```ts
<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import MyLineProfile from './components/MyLineProfile.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <MyLineProfile />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>
```

![LINE の情報が取得できない？](/static/images/blog/2023/10/29/line-unknown.jpg)

と、本当は LINE のプロフィールから名前を取得して表示しようとしたのだが、取得できていない様子。  
LINE から LINE 内蔵のブラウザで URL を開く必要があるらしい。

## ngrok を使用して、ローカルで動いている Vue.js プロジェクトを外部公開

LINE から開く必要があるということで、インターネットに公開されていた方が検証がしやすそうだった。そのため、ngrok というサービスを使用してローカルで動いている Vue.js プロジェクトを一時的に外部公開してみることにした。

```bash
$ sudo snap install ngrok # 持ってなかったので snap インストールして
$ ngrok config add-authtoken hogehoge # 正式なトークンはこちらで確認 https://dashboard.ngrok.com/get-started/setup/linux
$ ngrok http 5173 --host-header="localhost:5173" # ポート番号はローカルのポート使用状況に合わせて変更
```

すると URL が払い出されて、ローカルで動かしている Vue.js プロジェクトがインターネット経由でアクセスできるようになった！（初回のみ注意書きが出る。もちろんホットリロード対応。）
![ngrok 注意書き](/static/images/blog/2023/10/29/ngrok-warning.jpg)

この URL を、自分しかいないチャットグループ等でスマホに送信して開くと、自分のユーザ情報が取得できた。
![取得できた！](/static/images/blog/2023/10/29/get-line-profile.jpg)
