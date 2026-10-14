# autopilot-lab

自律運用（handbook の ADR-0011）の計測・検証用の練習リポジトリ。中身は小さな TypeScript のユーティリティ集。

## 構成
- `src/<name>.ts` に関数を 1 つずつ置き、テストは隣の `src/<name>.test.ts`
- import は拡張子 `.js` 付き（NodeNext）
- `apps/web/` — pnpm workspace のパッケージ（React + Vite の ToDo とテスト基盤）。詳細は `apps/web/README.md`。ルートの lint・型・テストは `src/` だけを対象にし、`apps/web` は自前の設定で検査する

## コマンド
- `pnpm check` — lint（Biome）+ 型チェック + テスト。PR の前に必ず通す（ルートの `src/` のみ）
- `pnpm format` — 整形と lint の自動修正
- `pnpm --filter @autopilot-lab/web check` — `apps/web` の lint・型・単体。ブラウザ・E2E は CI の `web` ジョブ（Playwright 公式 Docker イメージ）が正

## 作業の流れ
- Issue 1 件 = PR 1 件。ブランチは `<type>/<要約>`、コミットは Conventional Commits
- 実装したら `/self-review` で Draft PR にする
- 受け入れ条件と「触ってよい範囲」の外は変更しない
