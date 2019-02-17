---
title: Node.jsとdiscord.jsのインストール
---

<!--
# Installing Node.js and discord.js
-->

# Node.jsとdiscord.jsのインストール

<!--
## Installing Node.js
-->

## Node.jsのインストール

<!--
To use discord.js, you'll need to install Node.js. You can do so by going to [the Node.js website](https://nodejs.org/).
-->

discord.jsを使用するには、Node.jsをインストールする必要があります。[Node.jsのWebサイト](https://nodejs.org/)からインストールできます。

<!--
### Installing on Windows
-->

### Windowsでのインストール

<!--
If you're developing on Windows, it's as simple as installing any other program. Go to [the Node.js website](https://nodejs.org/), download the latest version, open up the downloaded file, and follow the steps from the installer.
-->

Windowsで開発しているのなら、それは他のソフトをインストールするのと同じぐらい簡単です。[Node.jsのWebサイト](https://nodejs.org/)へ行き、最新版をダウンロードして、ダウンロードしたファイルを開いて、インストーラの手順に従ってください。

<!--
### Installing on macOS
-->

### macOSでのインストール

<!--
If you're developing on macOS, you have a few options. You can go to [the Node.js website](https://nodejs.org/), download the latest version, double click the package installer, and follow the instructions. Or you can use a package manager like [Homebrew](https://brew.sh/) with the command `brew install node`.
-->

macOSで開発しているのなら、いくつかの選択肢があります。[Node.jsのWebサイト](https://nodejs.org/)へ行き、最新版をダウンロードして、パッケージマネージャをダブルクリックし、支持に従うことができます。あるいは、 `brew install node`コマンドで[Homebrew](https://brew.sh/)のようなパッケージマネージャーを使うこともできます。

<!--
### Installing on Linux
-->

### Linuxでのインストール

<!--
If you're developing on Linux, you may consult [this page](https://nodejs.org/en/download/package-manager/) to determine how you should install Node.<br />On that note, there's a possibility that you may already have Node \(e.g. if you're using a VPS\). You can check by running the `node -v` command. If it outputs something like `v8.0.0` or higher, then you're good to go! Otherwise, take a look at the page linked above for instructions on installing Node on your OS.
-->

Linuxで開発しているのなら、どのようにNodeをインストールすべきかを決めるために[このページ](https://nodejs.org/en/download/package-manager/)を調べることができます。<br />注意として既にNodeがインストールされている可能性があります（例えば、あなたがVPSを使っている場合など）。`node -v`コマンドを実行して確認できます。もしそれが`v8.0.0`以上のバージョンを出力するなら、問題ないです！それ以外の場合は、上にリンクされているページを見て、あなたのOSにNodeをインストールしてください。

<!--
::: warning
If you _do_ have Node installed, but have an older version \(i.e. anything below 8.0.0\), you should upgrade to the latest version.
:::
-->

::: warning
Nodeをインストールしたが、古いバージョン（つまり8.0.0以下のもの）の場合は、最新のバージョンにアップグレードしてください。
:::

---

<!--
## Preparing the essentials
-->

## 必需品の準備

<!--
To install and use discord.js, you'll need to install it via npm \(Node's package manager\). npm comes with every Node installation, so you don't have to worry about installing that. However, before you install anything, you should set up a new project folder.
-->

discord.jsを使用するには、npmからインストールする必要があります（Nodeのパッケージマネージャ）。npmはすべてのNodeインストールに付属しているので、インストールすることを心配する必要はありません。ただし、何かをインストールする前には、新しいプロジェクトフォルダを設定する必要があります。

<!--
### Setting up a project folder
-->

### プロジェクトフォルダの設定

<!--
Like any other project, you should have a dedicated folder for this, in order to keep it organized and manageable.
-->

他のプロジェクトと同様に、整理して管理しやすくするために、このための専用フォルダを用意する必要があります。

<!--
Navigate to a place on your machine where it's be easy for find and open in the future, for convenience purposes. Create a new folder like you normally would (for Linux, you can use `mkdir project-name` inside your terminal). If you already have a name you want to use for your bot, you can use that as the folder name. Otherwise, you may name it something like `discord-bot` for the time being \(or anything else you have in mind\).
-->

利便性のために、パソコン上の簡単に開くことができる場所に移動します。通常どおりに新しいフォルダを作成します（Linuxの場合は、ターミナル内で `mkdir プロジェクト名`を使用できます）。ボットに使用したい名前がすでにある場合は、フォルダ名としてそれを使用することができます。そうでなければ、当面の間は `discord-bot`のような名前を付けても構いません（あるいは他に何か考えているもの）。

<!--
Once you're done making the folder, open it up (for Linux, you can use `cd project-name` inside your terminal).
-->

フォルダの作成が終わったら、それを開きます（Linuxの場合は、ターミナル内で `cd project-name`を使用できます）。

<!--
### Opening the command prompt
-->

### コマンドプロンプトを開く

<!--
If you're on Linux, you can quickly open up the terminal with `Ctrl + Alt + T`.
-->

Linuxを使用している場合は、 `Ctrl + Alt + T`で素早く端末を開くことができます。

<!--
If you're on Windows and aren't familiar with opening up the command prompt, simply do the following:
-->

Windowsを使用していて、コマンドプロンプトを開くことに慣れていない場合は、次の手順でできます：

<!--
1. Open your bot project folder.
2. Hold down the `Shift` key and right-click inside of the folder.
3. Choose the "Open command window here" option.
-->

1. ボットプロジェクトフォルダを開く
2. Shiftキーを押しながらフォルダの中を右クリックする
3. 「コマンド ウィンドウをここで開く」オプションを選択する

<!--
It should then open up a window with a black background. It's a bit unattractive, but we'll talk about using better, more powerful tools in a different part of the guide.
-->

すると黒い背景のウィンドウが開きます。少々魅力的ではありませんが、ガイドの別の部分で、より強力なツールの使用について説明します。

<!--
### Using the command prompt
-->

### コマンドプロンプトを使用する

<!--
With the command prompt open, run the `node -v` command to make sure you've successfully installed Node.js. If you see something like `v8.0.0`, great! If not, go back and try installing again.
-->

コマンドプロンプトを開いた状態で、`node -v`コマンドを実行してNode.jsが正常にインストールされたことを確認してください。`v8.0.0`のような何かを見たら、素晴らしい！そうでない場合は、戻ってインストールをやり直してください。

<!--
The next command you'll be running is `npm init`. This command creates a `package.json` file for you, which is what will be used to keep track of the dependencies your bot uses, as well as other info. If you're a bit confused by that, you can simply ignore it for the time being.
-->

次に実行するコマンドは`npm init`です。このコマンドは`package.json`ファイルを作成します。これはあなたのボットが使用する依存関係や他の情報を追跡するために使用されるものです。あなたがそれによって少し混乱しているならば、あなたは単に当面それを無視することができます。

<!--
The `npm init` command will ask you a sequence of questions - you should fill them out as you see fit. If you're not sure of something or just want to skip it as a whole, simply leave it blank and press enter.
-->

`npm init`コマンドは一連の質問をします（あなたは妥当だと思うものを記入するべきです）。よくわからない場合や、飛ばしたい場合は、空白のままEnterキーを押しても構いません。

<!--
::: tip
Want to get started quickly? Use `npm init -y` to have it fill out everything for you!
:::
-->

::: tip
すばやく始めたいですか？`npm init -y`を使って、すべてを記入してもらいましょう！
:::

<!--
Once you're done with that, you're ready to install discord.js!
-->

これでdiscord.jsをインストールする準備が整いました。

---

<!--
## Installing discord.js
-->

## discord.jsのインストール

<!--
Now that you've installed Node.js and know how to open up your console and run commands, you can finally install discord.js!
-->

Node.jsをインストールし、コンソールを開いてコマンドを実行する方法を理解したので、最後にdiscord.jsをインストールします。

<!--
To install discord.js, simply run the `npm install discord.js`. This can take a bit of time, but should be done fairly quickly.
-->

discord.jsをインストールするには、単に`npm install discord.js`と実行します。これには少し時間がかかりますが、すぐに終わるでしょう。

<!--
<p class="warning">Once the installation is complete, you'll see something like this:<br/>
![npm warnings](~@/images/BbcuyJ6.png)<br/>**This is perfectly normal and means that it worked.** You don't need to install any of the items listed in order to use discord.js; they are 100% optional.</p>
-->

<p class="warning">インストールが完了すると、次のようになります。<br/>
![npm warnings](~@/images/BbcuyJ6.png)<br/>**これは完全に正常であり、それが動作したことを意味します。**discord.jsを使用するために表示されている項目をインストールする必要はありません。それらは100％オプションです。</p>

<!--
And that's it! With all the necessities installed, you're almost ready to start coding your bot.
-->

以上です！必要なものがすべて揃ったら、ボットのコーディングを始める準備はほぼ整いました。

---

<!--
## Installing a linter
-->

## linterのインストール

<!--
While you are coding, you may find that you run into numerous syntax errors, or just code in an inconsistent style. It's highly urged that you install a linter to ease these troubles. While code editors generally are able to point out syntax errors, with a linter, you can coerce your coding to be in a specific style as you define in the configuration. While this is not required, it's strongly recommended. [Click here for the linter guide!](/preparations/setting-up-a-linter.md)
-->

コーディングしている間、多数の構文エラーに遭遇したり、単に矛盾したスタイルで書いていることに気付くかもしれません。これらの問題を解決するためにlinterをインストールすることを強くお勧めします。一般的に、コードエディタは構文エラーを指摘することができますが、リンターを使用すると、設定で定義したとおりにコーディングを特定のスタイルに強制することができます。これは必須ではありませんが、強くお勧めします。[リンターガイドはこちらをクリック！](/preparations/setting-up-a-linter.md)
