# CONTRIBUTING — 執筆ガイド

このサイトを長期メンテしやすく保つための最小ルールです。自分用の備忘録でもあります。

## 1. ファイル配置

```
docs/<学年>/<単元スラッグ>/
    ├── plan.md        # 単元の見通し（授業前）
    ├── do-check.md    # 実施記録＋中間振り返り（授業中〜直後）
    └── action.md      # 深化・改善・次単元への橋渡し（授業後）
```

- **スラッグ規則**: 英小文字＋ハイフン。日本語・空白・キャメルケース禁止。例: `mono-no-tokekata`, `unit10`
- 画像・資料は同じフォルダの `assets/` に配置し、相対パスで参照する

## 2. 新単元の作り方

1. `.\scripts\new-unit.ps1 -Grade 5 -Slug foo -Title "単元名"` で雛形生成
2. `mkdocs.yml` の `nav:` に 3 ファイルを登録
3. `docs/index.md` の PDCA ダッシュボード表に行を追加
4. `docs/<学年>/index.md` の学期別・領域別テーブルに追加
5. `.\scripts\check.ps1` で strict ビルド
6. コミット: `git commit -m "docs(<学年>): add <単元名> unit"`

## 3. Markdown ルール

### 見出し
- ページ先頭は `# 単元名 ― Plan` / `― Do & Check` / `― Action` で統一
- `##` から開始（`#` はページに一つだけ）

### 記録待ちの表現
```markdown
!!! warning "記録待ち"
    実施後に記録します。
```

### 相対リンク（重要）
- 同じフォルダ: `[Plan](plan.md)`
- 親フォルダを遡る: `[トップ](../index.md)`、`[6年へ](../6nen/index.md)`
- **絶対パス `/5nen/...` は禁止**（MkDocs が info 警告を出す＋将来 baseurl 変更時に壊れる）

### 表組み
- GFM テーブル（`| A | B |`）を使う。装飾が必要なときは HTML テーブルでも良いが、行頭を `<table markdown>` にして `markdown` 属性を付ける

### 略語（abbr）
- `docs/includes/abbreviations.md` に定義を追記すると全ページで `*[CP]: 確認` のような略語ツールチップが自動で効く

## 4. コミット規約

[Conventional Commits](https://www.conventionalcommits.org/) を簡略化した形。

| prefix | 用途 |
|--------|------|
| `docs(5nen):` / `docs(6nen):` | 単元コンテンツの追加・修正 |
| `docs(research):` | 校内研究ページ |
| `style:` | CSS 変更のみ |
| `feat:` | 機能追加（JS, mkdocs 設定） |
| `fix:` | バグ修正（リンク切れ含む） |
| `chore:` | CI, 依存更新, ビルド設定 |
| `refactor:` | ページ構成変更 |

例: `docs(5nen): tenki-no-henka の Do&Check を更新`

## 5. プルリクエスト（自分で PR を作る場合）

- `main` 直 push でも良いが、大きな変更は `feat/xxx` ブランチで PR を立てて CI を通す
- CI（Actions）が失敗したまま main にマージしない

## 6. 避けるべきこと

- ❌ 生徒の個人情報・写真を直に push（`docs/` に置かない。別途 OneDrive 等）
- ❌ 画像を base64 で埋め込む（リポジトリが肥大化する）
- ❌ `site/` ディレクトリをコミット（`.gitignore` で弾いている）
- ❌ Windows 改行（CRLF）で保存する（`.editorconfig` で LF に統一）