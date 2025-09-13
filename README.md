# SoundWave 🎵

## プロジェクト概要
SoundWaveは最新のWeb技術を活用した音楽ストリーミングプラットフォームです。ユーザーは音楽をアップロード、共有、再生できる他、プレイリストの作成や音楽の共有が可能です。

## 主な機能
- 🎵 音楽のアップロードと再生
- 👤 ユーザー認証（ログイン/サインアップ）
- ❤️ お気に入りの曲の保存
- 📝 プレイリストの作成と管理
- 🔍 音楽の検索
- 🔥 トレンド曲の表示
- 📱 レスポンシブデザイン

## 技術スタック
- **フロントエンド**: Next.js 13, TypeScript, Tailwind CSS
- **バックエンド**: Firebase (Authentication, Firestore, Storage)
- **UIライブラリ**: Radix UI, Lucide Icons
- **状態管理**: Zustand
- **スタイリング**: Tailwind CSS, shadcn/ui

## 開発環境のセットアップ

### 必要条件
- Node.js 18.x以上
- npm 9.x以上
- Firebase プロジェクト

### インストール手順
1. リポジトリのクローン:
\`\`\`bash
git clone https://github.com/tushig666/soundwave.git
cd soundwave
\`\`\`

2. 依存関係のインストール:
\`\`\`bash
npm install
\`\`\`

3. 環境変数の設定:
\`.env.local\`ファイルを作成し、以下の変数を設定:
\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

4. 開発サーバーの起動:
\`\`\`bash
npm run dev
\`\`\`

サーバーが起動したら \`http://localhost:9002\` でアプリケーションにアクセスできます。

## 主な機能の説明

### 認証機能
- Firebaseを使用したユーザー認証
- ログイン/サインアップ/ログアウト機能
- プロフィール管理

### 音楽管理
- 音楽ファイルのアップロード（MP3形式）
- 音楽の再生、一時停止、スキップ
- プレイリストの作成と編集
- お気に入り曲の管理

### 検索・探索
- 曲名による検索
- トレンド曲の表示
- ジャンル別ブラウジング

### UI/UX
- モダンで直感的なインターフェース
- レスポンシブデザイン
- ダークモード対応

## デプロイ

### Netlifyへのデプロイ手順
1. Netlifyアカウントを作成
2. GitHubリポジトリと連携
3. 環境変数の設定
4. デプロイ設定の確認
5. ビルドとデプロイの実行

## コントリビューション
1. このリポジトリをフォーク
2. 新しいブランチを作成 (\`git checkout -b feature/amazing-feature\`)
3. 変更をコミット (\`git commit -m 'Add amazing feature'\`)
4. ブランチにプッシュ (\`git push origin feature/amazing-feature\`)
5. プルリクエストを作成

## ライセンス
MIT License

## 作者
- Tushig (@tushig666)

## お問い合わせ
バグの報告や機能のリクエストは、GitHubのIssueセクションをご利用ください。