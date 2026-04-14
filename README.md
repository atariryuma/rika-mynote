# 理科マイノート

**那覇市立天久小学校 理科専科 中 龍馬** による教材研究＆授業 PDCA 記録サイト（令和8年度／2026）。

- 🌐 公開サイト: <https://atariryuma.github.io/rika-mynote/>
- 🛠️ 構築: [MkDocs Material](https://squidfunk.github.io/mkdocs-material/)
- 📚 対象: 5年（10単元・105h）／6年（12単元・105h）／校内研究・年間まとめ

---

## クイックスタート

### 必要なもの
- Python 3.10+（[python.org](https://www.python.org/) の公式インストーラで OK）
- Git

### 初回セットアップ（PowerShell）
```powershell
git clone https://github.com/atariryuma/rika-mynote.git
cd rika-mynote
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

> `Activate.ps1` が実行できない場合：
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` を一度だけ実行。

### ローカルプレビュー
```powershell
.\scripts\serve.ps1
# → http://127.0.0.1:8000/ が起動し、保存のたびに自動リロード
```

### 厳格チェック（CI と同等）
```powershell
.\scripts\check.ps1
# mkdocs build --strict --clean を実行。警告も失敗扱い。
```

### 新しい単元ページを作る
```powershell
.\scripts\new-unit.ps1 -Grade 5 -Slug new-unit -Title "新単元"
# docs/5nen/new-unit/{plan,do-check,action}.md がテンプレから生成される
# 最後に mkdocs.yml の nav・docs/index.md・docs/5nen/index.md に追記すれば完了
```

### コミット & デプロイ
`main` への push で GitHub Actions が自動的に GitHub Pages にビルド＆デプロイします（`.github/workflows/deploy.yml`）。手動 `mkdocs gh-deploy` は不要。

```powershell
git add .
git commit -m "docs: 単元Xを更新"
git push
```

---

## ディレクトリ構成

```
rika-mynote/
├── docs/                    # 原稿（MkDocs のソース）
│   ├── index.md             # ダッシュボード型トップ
│   ├── 5nen/ 6nen/          # 学年別 単元フォルダ（plan/do-check/action.md）
│   ├── research/            # 校内研究
│   ├── resources/           # 年間計画・指導要領対照
│   ├── reflection/          # 年間まとめ
│   ├── stylesheets/extra.css  # カスタム CSS（~1,500行）
│   ├── javascripts/extra.js   # カスタム JS（今週の単元表示・ショートカット等）
│   └── includes/abbreviations.md  # 略語定義（snippets で自動挿入）
├── _templates/unit/          # 新単元雛形
├── scripts/                  # PowerShell 開発スクリプト
├── mkdocs.yml                # サイト設定・nav
├── requirements.txt          # Python 依存（pin 済み）
├── Makefile                  # WSL / Git Bash / macOS 用タスク
├── .editorconfig             # エンコード・改行の統一
├── .vscode/                  # 推奨拡張と設定
└── .github/workflows/        # CI/CD（GitHub Actions）
```

---

## 執筆ルール（ダイジェスト）

詳細は [CONTRIBUTING.md](CONTRIBUTING.md) 参照。

- 単元スラッグは **英小文字＋ハイフン**。例: `denryu-to-denjishaku`
- PDCA は 3 ファイル必須: `plan.md` / `do-check.md` / `action.md`
- 見出しは `# 単元名 ― Plan` の形
- 記録待ちは `!!! warning "記録待ち"` で統一
- 画像は `docs/<学年>/<単元>/assets/` に置く
- すべての内部リンクは**相対パス**で書く（絶対パス `/foo/bar` は使わない）

---

## よくある運用

| やりたいこと | コマンド |
|--------------|----------|
| ローカル確認 | `.\scripts\serve.ps1` |
| 警告も含めて全チェック | `.\scripts\check.ps1` |
| 新単元の雛形を作る | `.\scripts\new-unit.ps1 -Grade 5 -Slug foo -Title "..."` |
| 依存パッケージ更新 | `pip install -U -r requirements.txt` してから `pip freeze` を差し替え |
| 本番サイト再ビルド | main に push（Actions が自動実行） |

---

## トラブルシュート

- **`mkdocs build --strict` が失敗する** → 出力の `WARNING` 行を読む（大抵は相対リンク切れ）
- **`Activate.ps1` が実行できない** → `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`
- **ダークモードで色が変** → `docs/stylesheets/extra.css` の `[data-md-color-scheme="slate"]` ブロック
- **「今週の単元」が空** → `docs/javascripts/extra.js` の日付判定ロジックを確認（年度始まりオフセット）

---

## ライセンス

- 教材本文（`docs/` 以下の Markdown）: **CC BY-SA 4.0**
- コード（YAML / CSS / JS / スクリプト）: **MIT**