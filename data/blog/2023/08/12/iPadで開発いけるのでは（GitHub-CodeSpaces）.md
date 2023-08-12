---
template: post
title: iPadで開発、全然いけるのでは
slug: 2023/08/12/ipad-with-codespaces
draft: false
date: 2023-08-12T00:00:00.000Z
description: 持ってはいるけどあまり活用できていないような気がする iPad mini 6 をもっと使いこなせるようになりたい記事です。
category: 開発
tags:
  - iPad
  - iPad mini
---

## iPad mini 6 を持ち腐れているような気がする

iPad mini 6 を持っている。発売前から気になっていて、でも高いし...とモゾモゾしているうちに突然 Amazon で 1 万円以上値上げして、急いでまだ定価販売していたヤマダの通販で購入した。

iPad を購入したらこんなことをやろう、というフワフワした妄想はしていた。だけど、日々の忙しさにかまけて、本当は探せば時間はいくらでもあるはずなのに何もしない日々が続いて、いつの間にか思い出したように充電して YouTube を見るための端末になっていた。

## Android なら仮想環境を入れてゴニョゴニョできるけど...

僕は一応システム開発系の仕事をしているので、iPad でプログラムが書ければいいなと思ったことはある。例えば、このブログのメンテとかが iPad からサクッと出来たらどれだけ素敵だろうか。

Android には `Termux` や `UserLAnd` といった素晴らしいアプリケーションが存在し、任意の Linux ディストリビューションをエミュレートして、簡単な開発環境を構築してプログラムを書くことができる。`Ubuntu` や `Kali Linux` といったディストリビューションの仮想環境を Android 端末上で作動させることができる。

iPad OS は制限がキツいのでそのような自由奔放なアプリはないと思って諦めていたが、とある日に `iSH` というアプリケーションを見つけた。これは、`Termux` や `UserLand` ほどの自由さは無いものの、iPad 上で `Alpine Linux` の仮想環境を作動させることができる。これはいい！と思って使ってみたが、あまり開発体験は良くなかった。

ということで、「なんだかんだ Windows Subsystem on Linux 最高！でもパソコン起動するの面倒くさいので結局何も生み出せない！」という日々が長らく続いていた。

## GitHub Codespaces との出会い

GitHub に Codespaces というものがあるらしい。確かに、そのような噂はたまに聞いていた。  
聞いていたし正直気になっていたけど、「それって、GitHub に置いてあるリポジトリを VSCode っぽいエディタ画面で編集できる機能でしょ？動作検証どうすんのよ...」と思って長らくスルーしてきた。

とある日、なんでか分からないけど偶然 GitHub Codespaces を開いてしまった。対応するリポジトリが VSCode っぽく編集できる画面に遷移した。ここまでは予想通り。するとおもむろにコンソールが開いて、`npm install` が走った。え、もしかして、このまま...

`npm run dev`

## これは ikeru

```bash
npm run dev

> tailwind-nextjs-starter-blog@1.5.6 dev
> next dev

ready - started server on 0.0.0.0:3000, url: http://localhost:3000
event - compiled client and server successfully in 2.4s (322 modules)
Browserslist: caniuse-lite is outdated. Please run:
  npx browserslist@latest --update-db
  Why you should do it regularly: https://github.com/browserslist/browserslist#browsers-data-updating
```

う、動いた...ブラウザでも画面が開けるしコンソールではある程度のコマンドも叩ける...

最強...？？

### しかも複数環境でも douki！

調べてみると、コードスペースを何個か作ることが出来て、使用する都度コンテナ環境が構築されるらしい。ということは、この iPad mini 以外からでもこのコードスペースに接続できる？と手元にあった Chromebook から接続を試みたところ、iPad mini で開いている状態そのままの VSCode の画面が出てきた。Chromebook からファイルを変更するとまもなく iPad mini 側に表示されているファイルも更新されて、はたまた iPad mini でコンソールにコマンドを入力すると Chromebook でもそのコマンドが表示される。

## おわりに

これは、スゴいものを見ているのかもしれない...  
ここまで手軽に開発環境が展開出来るとなると、もはや言い訳はできなくなった。極論、スマホでもブラウザから Codespaces にさえ入れば開発できてしまう。もう頑張るしかなくなった、ような気がする...

ちなみに、価格は無料枠があるので、その枠内で収めると料金もかからない。多分、個人で休日とか平日の夜に数時間いじる程度なら超えない範囲の無料枠な気がする。詳しくは [ここ](https://docs.github.com/ja/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts) を参照してください。

とにかく私は、頼れる小さき相棒 iPad mini 6 と一緒に、これからもいろんなことを頑張っていこう、そう決心しました。
