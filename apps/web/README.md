# apps/web

テスト基盤の検証用の小さな ToDo（React + Vite + TypeScript）。追加・完了・削除・絞り込み（全部 / 未完了 / 完了）・localStorage 保存。

## コマンド（リポジトリのルートで `pnpm install` 済みとする）

| コマンド | 内容 |
| --- | --- |
| `pnpm --filter @autopilot-lab/web dev` | 開発サーバー |
| `pnpm --filter @autopilot-lab/web build` | 本番ビルド |
| `pnpm --filter @autopilot-lab/web test` | 単体（Vitest・Node。`src/**/*.test.ts`） |
| `pnpm --filter @autopilot-lab/web test:browser` | コンポーネント（Vitest Browser Mode・Chromium・headless。`src/**/*.browser.test.tsx`） |
| `pnpm --filter @autopilot-lab/web e2e` | E2E（Playwright。本番ビルドを `vite preview` で配信して試験） |
| `pnpm --filter @autopilot-lab/web check` | Biome + tsc + 単体 |

ブラウザは `pnpm --filter @autopilot-lab/web exec playwright install chromium` で入れる（CI は公式 Docker イメージに入っている）。

## テストの層

| 層 | 場所 | 目的 |
| --- | --- | --- |
| 単体 | `src/*.test.ts` | 絞り込みなどの純粋関数、保存データの検証 |
| コンポーネント | `src/*.browser.test.tsx` | 実ブラウザで画面の部品を描画して操作 |
| E2E | `e2e/*.spec.ts` | ビルド済みのアプリで主要な流れ + スクショ比較 |

ロケーターは role / label を優先する（`getByRole`・`getByLabel`）。

## スクショ比較の基準画像

基準画像（`e2e/todo.spec.ts-snapshots/*.png`）は**フォントやレンダリングが環境で変わる**ため、CI と同じ公式 Docker イメージ（`mcr.microsoft.com/playwright:v1.64.0-noble`）で撮る。ホストで撮った画像は使わない。

- 基準画像が無い間、CI の E2E は `--ignore-snapshots` で比較を飛ばす。基準をコミットしたら `.github/workflows/ci.yml` からそのフラグを外す
- 基準を自動で更新するジョブは作らない。更新は人が差分を目で確認してコミットする

### 初回の作り方 / 見た目を意図して変えたとき

リポジトリのルートで実行する。リポジトリは読み取り専用でマウントし、画像だけを `/tmp/pw-out` に出す（ホストの `node_modules` を汚さない）。

```sh
mkdir -p /tmp/pw-out
docker run --rm --ipc=host \
  -v "$PWD":/src:ro -v /tmp/pw-out:/out \
  mcr.microsoft.com/playwright:v1.64.0-noble bash -c '
    cp -r /src /work && cd /work &&
    rm -rf node_modules apps/web/node_modules &&
    corepack enable && pnpm install --frozen-lockfile &&
    cd apps/web && pnpm exec playwright test --update-snapshots &&
    cp -r e2e/todo.spec.ts-snapshots /out/ &&
    chown -R "$(stat -c %u:%g /src)" /out'
cp -r /tmp/pw-out/todo.spec.ts-snapshots apps/web/e2e/
```

出来た PNG を目で確認してからコミットする。

## Playwright のバージョン

`@playwright/test` と `playwright` は Docker イメージのタグ（`v1.64.0`）と**完全に一致**させるため、`^` を付けずに固定している。上げるときは `package.json` とイメージのタグ（`ci.yml`・この README）を同時に上げ、基準画像を撮り直す。

## 夜間・週次のテスト

PR の CI（`ci.yml`）は速さを優先して chromium だけを回す。時間のかかるものは `schedule` で別に回す。

| ワークフロー | いつ | 内容 | 失敗したら |
| --- | --- | --- | --- |
| `nightly.yml` | 毎日 JST 3:00（UTC 18:00）・手動 | Chromium + Firefox + WebKit + iPhone 15（WebKit）の E2E。公式 Docker イメージで実行し、`--ignore-snapshots` でスクショ比較は飛ばす | 同じタイトルの open な Issue が無ければ Issue を作る（ラベル `bug`・`claude:ready`）。本文に失敗したテストと run の URL |
| `weekly.yml` | 毎週月曜 JST 4:00（日曜 UTC 19:00）・手動 | Stryker のミューテーションテスト。対象は `src/todo.ts` と `src/storage.ts`。スコアを run の要約に出し、HTML レポートを artifact に残す（14 日） | スコアが 60% 未満なら Issue を作る（ラベル `test-quality`、同じタイトルの open な Issue が無いとき） |

### 全ブラウザで手元実行

```sh
pnpm --filter @autopilot-lab/web exec playwright install firefox webkit
PW_ALL_BROWSERS=1 pnpm --filter @autopilot-lab/web e2e
```

`PW_ALL_BROWSERS=1` を付けたときだけ `playwright.config.ts` に firefox・webkit・mobile-safari（`devices['iPhone 15']`）が加わる。付けなければ chromium だけ。

### ミューテーションテストを手元で実行

```sh
pnpm --filter @autopilot-lab/web mutation
```

- 単体テストだけを回す（`vitest.stryker.config.ts`。Chromium は不要）
- レポートは `apps/web/reports/mutation/`（`mutation.html`・`mutation.json`。git 管理外）
- スコア = 検出（Killed + Timeout）/（検出 + Survived + NoCoverage）。基準 60% は Stryker の `thresholds.break` ではなく `weekly.yml` の `MIN_SCORE` で判定する（落とさず Issue にするため）
- スコアが低いときは、生き残ったミュータントを殺すテストを足す。**テストをミュータントに合わせて弱めない**
