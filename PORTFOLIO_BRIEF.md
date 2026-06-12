# Kotaro Nakata — Portfolio Implementation Brief

> このドキュメントはCodexへの実装指示書です。
> `[TODO]` マークは本人確認待ちの箇所。実装時はプレースホルダーのまま残してください。
> **実装はCodexが行う。このファイルは設計・コンテンツ仕様のみ。**

---

## 1. 概要・方針

- **形式**: 単一HTMLファイル（`index.html`）＋ CSS（`style.css`）＋ JS（`main.js`）
- **言語**: 日本語 / 英語 切替対応（右上固定ボタン JP | EN）
- **PDF対応**: 各セクションをA4幅に収まるよう設計。`@media print` で各セクションにpage-breakを付与
- **方針**: 「すごそうに見せる」より「話してみたい・頼みたい」と思わせる構成。親しみやすさ最優先

---

## 2. デザインシステム

### カラーパレット
```
--bg:         #F9F7F4   /* クリーム白（温かみ） */
--bg-alt:     #F0EDE8   /* セクション交互背景 */
--text:       #1A1A1A   /* メインテキスト */
--text-muted: #6B7280   /* サブテキスト */
--primary:    #2563EB   /* メインアクセント（信頼・テック感） */
--accent:     #F59E0B   /* サブアクセント（エネルギー・暖かさ） */
--border:     #E5E1DC
```

### タイポグラフィ
- 英語: `Inter` (Google Fonts)
- 日本語: `Noto Sans JP` (Google Fonts)
- ベースサイズ: 16px
- H1: 3rem / H2: 2rem / H3: 1.25rem

### レイアウト
- 最大幅: 860px（A4横幅に近い、PDF出力を考慮）
- セクション縦padding: 80px
- カードの角丸: 12px
- ドロップシャドウ: `0 2px 12px rgba(0,0,0,0.07)`

---

## 3. セクション仕様

### 3-1. Hero

**構成要素**:
- 左: プロフィール写真 `images/slush_profile.jpg`（円形クロップ、200x200px）
- 右:
  - 名前 (H1): `Kotaro Nakata` / `中田 光太郎`
  - ロールタグ（バッジ3つ）:
    - JP: `エンジニア` `起業家` `宇宙好き`
    - EN: `Engineer` `Entrepreneur` `Space Nerd`
  - キャッチコピー:
    - JP: `好奇心が、私のエンジンです。宇宙から起業まで、面白いと思ったら飛び込んできた。`
    - EN: `Curiosity is my engine. From space research to startups — I jump in when it's interesting.`
  - CTAボタン: `もっと知る` / `Learn More`（↓スクロール）

**ナビゲーション**: 上部固定、セクション名 + JP/ENトグル
- About / Works / Skills / Story / Contact

---

### 3-2. About Me

**構成要素**:
- メインテキスト（段落2〜3つ）:

  **JP版**:
  > 電気を学べば将来困らなさそう、という理由で高専に進みました。
  > そこで出会った「宇宙推進」の研究が、人生を大きく変えました。SFみたいで面白い。それだけで十分な理由でした。
  >
  > アールト大学で起業家たちと話すうちに、「作りたいものを作る」より「解くべき課題を見つける」ことの難しさに気づきました。
  > ビジョン先行で動いていた時期の失敗は、今の自分の土台になっています。
  >
  > 課題起点でものを作る。技術で人が本当に困っていることに応えたい。
  > テニスコーチとして、フィンランドで大人に教え続けているのも、そういう"人に直接関わる"感覚が好きだからだと思います。

  **EN版**:
  > I chose electrical engineering because it seemed practical. What I didn't expect was falling in love with space propulsion research — it felt like science fiction, and that was enough reason.
  >
  > At Aalto, surrounded by entrepreneurs, I learned the hard way that "having a vision" and "finding a real problem to solve" are very different things. That failure shaped how I think now.
  >
  > I want to build things that solve problems people genuinely have — using engineering and software. Outside of that, I coach tennis in Espoo, because I've always loved being directly useful to people.

- サイド写真: `images/vr_goggles.jpg`（小さめ、キャプション付き）
  - JP: `フィンランドで初めてVR体験。なんか口が開いた。`
  - EN: `First VR experience in Finland. Apparently my mouth opened.`

- キーワードタグ（人柄）:
  - JP: `愛情深い` `好奇心旺盛` `行動派` `課題解決思考` `国際派`
  - EN: `Caring` `Curious` `Bias for Action` `Problem-driven` `Cross-cultural`

---

### 3-3. Works

**レイアウト**: 2列グリッド（モバイルは1列）
各カード: タイトル / 期間 / 概要 / 使用技術タグ / 写真

---

#### Work 1: KOSEN-3 CubeSat Launch Project
- **期間**: Aug 2022 – Current
- **JP概要**: JAXAのロケットで2026年打ち上げ予定の超小型衛星（KOSEN-3）に搭載するパルスプラズマスラスタ（PPT）の開発に従事。磁気ノズルによる推力向上を研究。測定データをPythonで解析し、React+TypeScriptでスライドバー付きのインタラクティブな発表資料も開発。国際学会（ISTS・IAC Milan 2024）で発表、論文5本。
- **EN概要**: Developing a Pulsed Plasma Thruster (PPT) for KOSEN-3 CubeSat, launching on a JAXA rocket in 2026. Also built an interactive data analysis tool using React + TypeScript + Python for research presentations. Published 5 papers, presented at ISTS and IAC Milan 2024.
- **タグ**: `Space Propulsion` `Python` `React` `TypeScript` `JAXA` `Research`
- **バッジ**: 🚀 `2026 JAXA Launch`（目立たせる）
- **写真**: `images/kosen3_placeholder.jpg` → [TODO: KOSEN-3またはPPT関連の写真]

---

#### Work 2: 全国衛星模型コンテスト
- **正式名**: 6th National Satellite Model Making Contest
- **期間**: Oct 2022
- **JP概要**: 全国の高専・大学生が参加する衛星模型コンテストに出場し、優秀賞（Honorable Mention）を受賞。岐阜かかみがはら航空宇宙博物館にて実施。衛星の構造・機能・プレゼンテーションを総合評価される実践的な大会。
- **EN概要**: Competed in the 6th National Satellite Model Making Contest at the Gifu Kakamigahara Air and Space Museum, earning a Honorable Mention. The contest evaluates satellite structure, functionality, and presentation comprehensively.
- **タグ**: `Satellite` `Hardware` `CAD` `Award`
- **写真**: `images/satellite_placeholder.jpg` → [TODO: コンテスト時の写真]

---

#### Work 3: Aalto Space Association — NPO Co-founder & VP
- **期間**: Nov 2024 – Sep 2025（11ヶ月）
- **JP概要**: フィンランドでNPO法人を設立し、Vice-Presidentとして活動。PM・イベント運営・Webサイト制作をすべて英語で担当。Telegramコミュニティを約50名から約600名に拡大。WebサイトはReact/Next.js/TypeScript/Prisma/PostgreSQLで構築。
- **EN概要**: Co-founded an NPO in Finland and served as Vice-President. Handled project management, event operations, and website development — all in English. Grew the Telegram community from ~50 to ~600 members. Built the website with React / Next.js / TypeScript / Prisma / PostgreSQL.
- **タグ**: `PM` `Next.js` `TypeScript` `PostgreSQL` `Community` `Finland`
- **写真**: `images/aalto_space_1.jpg`（他: `aalto_space_2.jpg`, `aalto_space_3.jpg`）

---

#### Work 4: Tennis Coaching
- **期間**: May 2019 – Current（日本＋フィンランド）
- **JP概要**: 神戸（ノアインドアステージ、週8h）とフィンランド・エスポー（Tennis Tuomola、週6h）でテニスコーチとして5年以上継続。日本語でも英語でも、国を越えて「人に直接関わる」ことへのこだわり。
- **EN概要**: Tennis coach in both Kobe, Japan and Espoo, Finland for 5+ years. Teaching in Japanese and English, in two countries — because direct human connection never gets old.
- **タグ**: `Coaching` `Japan` `Finland` `5+ years` `English`
- **写真**: `images/tennis_placeholder.jpg` → [TODO: テニス指導中の写真]

---

#### Work 5: ハンダ付け体験ワークショップ
- **期間**: Aug 2024
- **JP概要**: 弟とその友達（小学生）に向けてハンダ付け体験を企画・実施。電子工作の楽しさを子どもたちに伝えるため、安全な道具の使い方から回路の仕組みまでを自分なりに伝えた。「愛情深い」が一番出た仕事かもしれない。
- **EN概要**: Organized and ran a hands-on soldering workshop for my younger brother and his elementary school friends. Taught everything from safe tool handling to basic circuit concepts. Probably the most "me" project on this list.
- **タグ**: `Workshop` `Education` `Electronics` `Kids`
- **写真**: `images/soldering_1.jpg`（他: `soldering_2.jpg`, `soldering_3.jpg`）

---

### 3-4. Skills

**UIパターン**: 3列カード。各カードに大きめアイコン + カテゴリ名 + スキルタグ群
スキルタグは「できる（A評価）」と「知ってる（B以下）」で視覚的に区別する（例: 塗りつぶし vs アウトライン）

---

#### 軸1: 🛰️ Engineering & Research
JP表示名: `エンジニアリング・研究`
```
[できる]
Space Propulsion (PPT / Plasma)
Electrical & Electronic Engineering
System Control Engineering
C / C++ / Python
Arduino / Raspberry Pi
CAD / 3D Printing / Laser Cutting
Linux

[知ってる]
Vacuum Engineering
Tig Welding
Robotics
Fortran
```

---

#### 軸2: 💻 Web Development & Software
JP表示名: `Web開発・ソフトウェア`
```
[できる]
TypeScript / JavaScript
React / Next.js
Python
Node.js
PostgreSQL
Tailwind CSS
GitHub
Docker
Vercel / Supabase
HTML / CSS

[知ってる]
AWS
Prisma
Framer Motion
Shopify Liquid
```

---

#### 軸3: 🌍 Leadership & Communication
JP表示名: `リーダーシップ・コミュニケーション`
```
要件定義〜保守運用（フルサイクル対応）
PM / プロジェクト管理
英語コミュニケーション（学会発表・NPO運営・クライアントワーク）
コミュニティ運営（50名→600名）
教育・コーチング（テニス・プログラミング・はんだ付け）
起業・事業開発（AG1 / AsuCapitals Residency）
Student Council President（2020–2022）
国際経験（FI / NZ / ID / JP）
```

---

**言語スキル（別枠で表示）**:
| 言語 | レベル |
|------|--------|
| 日本語 | Native |
| 英語 | Business / Academic（国際学会発表・NPO運営・海外クライアント対応） |

※フィンランド語は記載しない

---

### 3-5. Ex & Story (Timeline)

**UIパターン**: 縦タイムライン。左に年、右に出来事。★マークの転換点はprimaryカラーで強調

```
2017  神戸高専 入学（電気電子工学科）
      「電気を学べば困らなさそう」という直感で選択

2018  テニス部 部長就任
      テニスコーチのアルバイト開始（神戸）

2019  ニュージーランド オタゴ大学 交換留学（1ヶ月）

2020  神戸高専 生徒会長 就任
      Panasonic Connect インターン（3Dプリンタ・治具開発・BI改善）

2022  明石高専 専攻科 入学（機械・電子システム工学）
      ★ 全国衛星模型コンテスト 優秀賞受賞
      ★ KOSEN-3 CubeSat プロジェクト 参加（PPT開発開始）

2023  ガジャマダ大学（インドネシア）デジタル製造 短期留学
      Teaching Assistant @ 明石高専（起業家育成施設の立ち上げも担当）

2024  ★ 明石高専 GPA 4.0 で卒業 / KOSEN Advanced Course Research Forum 優秀賞
      ★ Aalto University 修士課程 入学（フィンランド・エスポー）
        専攻: Electronics & Nanotechnology / Space Science and Technology
      ハンダ付け体験ワークショップ 開催（弟＆小学生たち）
      Junction 2024 ボランティア（Helsinki）
      Slush 2024 ボランティア（Helsinki）
      Tennis Tuomola コーチ就任（エスポー）
      ★ Aalto Space Association NPO 設立・Vice-President 就任

2025  ★ 休学・起業
      ★ AG1 / AsuCapitals Residency 参加（現在進行形）
        ビジョン起点から課題起点へ——失敗を経て、今ここにいる

2026  KOSEN-3、JAXAロケットで打ち上げ予定 🚀
      IAC Milan 2024 発表（Pulsed Plasma Thruster）
```

---

### 3-6. Contact

**構成**:
- 一言メッセージ:
  - JP: `プロジェクトのご相談、コラボレーション、ちょっとした質問でも、お気軽にどうぞ。`
  - EN: `For project inquiries, collaborations, or just a chat — feel free to reach out.`
- メール: `kuriru.ksr@gmail.com`
- GitHub: `https://github.com/kotaro-nakata`
- LinkedIn: `https://www.linkedin.com/in/kotaro-nakata-52380a309/`
- 写真: `images/slush_meeting_area.jpg`（背景に薄く使うか、サイドに配置）
- [TODO: Twitter/X、Instagramなど他のSNSリンク]

---

## 4. 言語切替の実装仕様

```html
<!-- 全テキスト要素に data-ja / data-en 属性を付与 -->
<p data-ja="好奇心が、私のエンジンです。" data-en="Curiosity is my engine."></p>
```

```javascript
// main.js
function setLang(lang) {
  document.querySelectorAll('[data-ja]').forEach(el => {
    el.textContent = el.dataset[lang];
  });
  document.documentElement.lang = lang === 'ja' ? 'ja' : 'en';
  localStorage.setItem('lang', lang);
}
// 初期化: ブラウザ言語またはlocalStorageから読む
```

---

## 5. PDF出力対応

```css
@media print {
  nav, .lang-toggle, .cta-button { display: none; }
  section { page-break-before: always; }
  section:first-of-type { page-break-before: avoid; }
  body { background: white; font-size: 12pt; }
  .card { box-shadow: none; border: 1px solid #ddd; }
}
```

---

## 6. ファイル構成

```
Kotaro_portfolio/
├── index.html
├── style.css
├── main.js
├── images/
│   ├── slush_profile.jpg          ← Hero写真（Slush volunteer badge、笑顔）
│   ├── slush_meeting_area.jpg     ← Contact背景 or Story（Meeting Area看板）
│   ├── vr_goggles.jpg             ← About Meのユーモア写真
│   ├── aalto_space_1.jpg          ← Work 3: Aalto Space Association
│   ├── aalto_space_2.jpg
│   ├── aalto_space_3.jpg
│   ├── soldering_1.jpg            ← Work 5: ハンダ付け体験
│   ├── soldering_2.jpg
│   ├── soldering_3.jpg
│   ├── kosen3_placeholder.jpg     ← Work 1: [TODO] KOSEN-3写真
│   ├── satellite_placeholder.jpg  ← Work 2: [TODO] コンテスト写真
│   └── tennis_placeholder.jpg     ← Work 4: [TODO] テニス写真
├── skillsheet.xlsx                ← (参照用)
├── cv_page1.jpg〜cv_page3.jpg     ← (参照用、サイトには非掲載)
└── PORTFOLIO_BRIEF.md             ← このファイル
```

---

## 7. TODOリスト（Kotaro確認待ち）

- [ ] Work 1 (KOSEN-3) の写真
- [ ] Work 2 (衛星コンテスト) の写真
- [ ] Work 4 (テニス) の写真
- [ ] Work 1 の論文・JAXAリンク（あれば）
- [ ] Twitter/X、Instagram等のSNSリンク
- [x] フィンランド語スキル → 記載しない（確定）
- [ ] AG1 Residency の開始月（2025年何月？）
