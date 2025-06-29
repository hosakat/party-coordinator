# 飲み会幹事エージェントアプリ

## ローカルサーバー公開方法

- ngrok インストール

`brew install ngrok`

- ngrok サインアップ・ログイン

- ngnok のアクセストークン設定

`ngrok authtoken ACCESS_TOKEN`

- ngrok 起動

`ngrok http 3000`

### Cloudrun Function によるリマインド

工夫

4. Firestore の読み取りを効率化
   Firestore のコストを抑えるために、以下の方法を採用します：

ステータス管理: status: "pending"というフィールドを使って、まだリマインドしていない会議だけを対象にします。これにより、すでにリマインドした会議を再度チェックしなくて済みます。

データ更新: リマインドを送信した後は、会議の status を sent に更新します。これにより、次回以降のリマインド対象から外れます。

5. データの最適化
   Firestore から会議データをすべて取得するのではなく、リマインド日数と status を使ってフィルタリングを行います。例えば、where("remindBefore", "==", 1)のように、リマインド対象を絞り込むことでデータ量を削減します。

必要なデータだけを取得するようにクエリを最適化します（例えば、会議日程と参加者の LINE グループ ID のみを取得）。

6. コストを抑えるための工夫
   Firestore のコストは、読み取り回数や書き込み回数に基づいて課金されます。リマインド対象となるデータを絞り込んで、読み取り回数を最小化します。

定期的なリマインド処理（Cloud Scheduler で設定した実行タイミング）を使って、毎回すべての会議データをチェックするのではなく、リマインドが必要なデータのみを対象にします。

## システムアーキテクチャ

![アーキテクチャ図](./docs/architecture.drawio.svg)

本サービスは上記のアーキテクチャで構成しました。  
核になるのは以下の 2 つのアプリです。

### 幹事アプリ

LINE 上で連携される画面の実装やデータベース連携、LINE のメッセージ送信・Webhook 機能、AI エージェントサービス API アプリの呼び出しを実装しています。

#### 1. 技術スタック

| 分類     | 使用技術  | 用途                                                                                                      | 選定理由                                                                                                                 |
| -------- | --------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Frontend | Next.js   | アプリ画面実装、入力                                                                                      | 飲み会を盛り上げるための細かい UI を実装しやすい React ベースで実装できるため                                            |
| Backend  | Next.js   | LINE Messaging API を用いたメッセージ送受信、Webhook                                                      | API ルートやサーバー処理も同じフレームワークで一元管理でき、デプロイや保守が容易なため                                   |
| DB       | Firestore | LINE グループ情報やユーザーの画面入力情報、AI エージェントサービス API アプリからのレスポンスを格納・管理 | 本サービスではあまり複雑なデータ構造や操作が不要である一方、リアルタイム性やスケーラビリティが重要であると考えられるため |

#### 2. 工夫した点・拡張性

- 一般的な「ログイン → 一覧画面 → 詳細画面」のような連続性のあるアプリではなく、飲み会準備の段階やユーザーのアクティビティのタイミングの都度 単画面の URL を作成して LINE に送信することで、ユーザーが必要な操作だけを必要なときにすることができるようにしました。これにより、ユーザー体験を最大化することを目指しています。
- ステータス=飲み会準備の段階による管理をして LINE のメッセージと提示する画面を分けることで、今回はまだ実現しなかった飲み会当日（二次会場所の選定など）や飲み会後（精算など）のお手伝いも用意に実装することが可能です。

### AI エージェント API サービス

要望をリクエストとして受け取り、複数の AI エージェントの処理を介して要望にあったおすすめのお店をレスポンスとして返す、REST API サービスです。

#### 1. 技術スタック

| 分類                 | 使用技術                                   | 用途                  | 選定理由                                                                                                                     |
| -------------------- | ------------------------------------------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Google Cloud AI 技術 | Gemini API in Vertex AI, Google Gen AI SDK | AI エージェントの実装 | 最新の gemini-2.5-pro モデルを使って高能な AI エージェントを実装できるため                                                   |
| Web フレームワーク   | FastAPI                                    | API サービスの実装    | Google Gen AI SDK と親和性の高い Python で実装でき、ユーザーへの応答をできるだけ早くするために高速性と非同期処理に優れるため |

#### 2. AI API サービスの構成

AI エージェント API サービスの構成は以下のようになっています。

![AIエージェントAPIサービス構成](./docs/agent-architecture.drawio.svg)

今回は、飲み会のお店についての要望をリクエストに受け取り、要望に沿うおすすめのお店一覧を返す「おすすめ店検索エンドポイント」を作成しました。そこでは、3 つの AI エージェントを直列に処理させることでお店の検索精度を上げるようにしています。

##### Aggregation Agent（集約エージェント）

AggregationAgent は、複数の参加者から集めた要望（予算・アレルギー・最寄り駅・希望など）を分析し、全員が満足できそうな検索条件パターンを 1〜3 件生成する役割を担います。  
AI に対して、参加者ごとの要望をまとめたプロンプトと、出力してほしい JSON スキーマを与え、バランスの取れた検索条件を自動生成します。

- 特徴

  - 参加者ごとの細かな要望を集約し、矛盾や相反する条件がある場合もバランスを考慮して複数パターンを提案。
  - 予算やエリア、アレルギーなど、全員が納得できる条件を自動で調整。
  - 出力形式を JSON スキーマで明示し、AI からのレスポンスをパースしやすくしている。

- 工夫点
  - プロンプト内で「相反する要望がある場合はパターンを分ける」など、AI に具体的な指示を与えている。
  - 参加者リストを人間が読んでも分かりやすい形でプロンプトに埋め込むことで、AI の理解度を高めている。

このように、人間の幹事が実際のお店選びで考えていることを整理・言語化し、次の検索で効果的なパターンを作成します。

##### Search Agent（検索エージェント）

Search Agent は、Aggregation Agent が生成した検索条件パターンをもとに、Google 検索や Google マップを活用して、条件に合う飲食店を探し出します。  
AI に対して、具体的な検索条件と出力フォーマットを指示し、最大 2 軒までの候補店情報を取得します。

- 特徴

  - Google 検索グラウンディングや Google マップグラウンディングを活用し、現実的な店舗情報を取得。
  - テーマやキーワード、アレルギー対応など、細かな条件をプロンプトで指定。
  - 出力情報を必要最小限（店名・駅・価格帯・特徴・マップ URL・選定理由）に絞り、後続処理をシンプルに。

- 工夫点

  - AI が返す情報の粒度や内容をプロンプトで厳密に指定し、不要な情報を排除。
  - 出力形式をテキストにしてあえて形式を決めないことで、お店の特徴の記述にバラエティを持たせるようにしている。

##### Summary Agent（要約エージェント）

Summary Agent は、SearchAgent が取得した Web 検索結果テキストから、店舗情報を抽出・整形するとともに、ユーザーに魅力的に伝わるおすすめコメント（summary）を生成します。そして、呼び出しもとにそれらの情報を含んだおすすめのお店一覧を返します。

- 特徴

  - summary 項目には、検索テーマを踏まえた魅力的な一言を AI に生成させることにより、ユーザーが楽しく選べるようにしている。

- 工夫点

  - プロンプトで「テーマを考慮したおすすめコメント」を明示し、ユーザー体験を高める。
  - AI の出力形式が揺れても、dict/list 両方に対応するパース処理を実装。

#### 工夫した点

- 今回マルチエージェントの構成を採用しましたが、複数のエージェントが同時に相互作用する、協調型や階層型の方式ではなく、直列に複数のエージェントを順番につなぎ、前のエージェントの出力を次のエージェントの入力とする方式を採用しました。  
  これは、**「お店の検索」には明確なステップがあり一つ一つのステップで精度の高い処理をすることが全体的な精度につながる**と考えたためです
  。
- API サービスとして分離して作成することで、他のアプリからのリクエストも処理したり、他のエンドポイントも作成してサービスとしての機能を充実させたりと、今後の拡張性に優れる構成であると考えたからです。
