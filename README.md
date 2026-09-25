# stresscheckfree｜職業性ストレス簡易調査票

職業性ストレス簡易調査票（新職業性ストレス簡易調査票）のWebアプリです。
個人向け（匿名・無料）にオンラインで受検・結果確認ができます。

## 公開URL
- 個人向け（フリー）: https://stresscheckfree.cloud
- Vercelプロジェクト: https://stress-check-gamma.vercel.app

## 機能
- 57問版ストレスチェック（個人向け・匿名・session_id方式）
- 141問版ストレスチェック（今後の用途に応じて利用予定）
- 自動採点・グラフ表示・全国平均との比較（偏差値ベース）
- 高ストレス判定・面接指導案内

## ファイル構成

### ルート
| ファイル | 役割 |
|---|---|
| index57.html | 受検画面（57問版）。`/check` でアクセス |
| index141.html | 受検画面（141問版）。今後の用途に応じて利用予定 |
| result.html | 受検後の結果表示画面。`/result` でアクセス。RLS対応のためget-result Edge Function経由で結果を取得 |
| vercel.json | Vercelのデプロイ・URLルーティング設定 |
| prompt-test.html | AIアドバイス機能（プロンプト設計）の開発用テストページ |
| questions_export.xlsx | 質問データのエクスポート（参考資料） |
| CLAUDE.md | Claude Code向けの開発メモ |

### lp/（個人向けLP・stresscheckfree.cloud）
| ファイル | 役割 |
|---|---|
| index.html | トップページ（ランディングページ） |
| legal.html | プライバシーポリシー・免責事項 |
| css/style.css | トップページのスタイル |
| js/main.js | トップページのスクリプト |

### admin/
| ファイル | 役割 |
|---|---|
| superadmin.html | 開発者向け：1件のsession_idを指定して詳細分析（全問回答・スケール偏差値・判定根拠）を表示 |
| super_dashboard.html | 開発者向け：全件一覧・フィルタ・CSVダウンロード |

### js/
| ファイル | 役割 |
|---|---|
| scoring.js | 採点エンジン（Supabaseマスターテーブル参照） |
| supabase-client.js | Supabaseへの接続設定 |

## Supabase Edge Functions
RLS対応のため、`survey_responses`テーブルへの読み取りはEdge Function経由のみに限定しています。

| Function名 | 役割 |
|---|---|
| get-result | session_id指定で1件取得（未指定時は最新1件）。result.html・admin/superadmin.htmlが使用 |
| list-results | 全件取得。admin/super_dashboard.htmlが使用 |
| notify-new-response | 新規回答時の通知（Database Webhook経由） |

## 技術スタック
- フロントエンド：HTML / JavaScript（単一ファイル構成、ビルド不要）
- データベース：Supabase（RLS有効）
- ホスティング：Vercel（GitHubと連携、pushで自動デプロイ）

## 今後の予定
- [ ] AIアドバイス・壁打ち機能（有料）
- [ ] 集団分析へのJD-Rモデル図解の組み込み

## 過去の設計: カンパニー機能(2026年9月削除)

かつて `survey_responses` は、法人向け(会社ひも付き)の受検フローと、
個人向け(匿名・session_id方式)の受検フローで共有されていました。

削除した `supabase/schema.sql` ・ `supabase/patch_01_link_function.sql` には、
以下の設計が記録されていました。

- テーブル: `companies` / `admin_users` / `survey_links` / `employees`
- 管理者(Supabase Auth)が、自社の受検結果のみRLSで閲覧できる設計
  （`my_company_id()` というセキュリティ定義関数で company_id を判定）
- `register.html` から、招待URL(token)経由で従業員が自己登録し、
  `company_id` を紐付けて141問版を受検する仕組み

この仕組み自体は「スモールChecker」として独立したシステムに置き換えられたため、
関連ファイル(admin/dashboard.html, links.html, login.html, signup.html,
reset-password.html, stress_check_group_analysis.html, register.html,
supabase/schema.sql, supabase/patch_01_link_function.sql)を削除しました。
