# 環境構築メモ

# CI
GitHub Actions

# Google Cloud連携

## 参考

- 概要
    - [見て見ぬふりをしない、権限とWorkload Identity(Google Cloud)](https://zenn.dev/kamos/articles/92a8125dc3adac)
- Workload Identityの設定
    - [[GitHub]OpenID Connect を使ったセキュリティ強化について](https://docs.github.com/ja/actions/security-for-github-actions/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
        - GitHub ActionsでGoogleCloudと連携するためのOIDCの仕組みについて解説
        - GoogleCloud側が「誰がアクセストークンを要求しているのか？」を識別するのに使える情報はいくつかあるが、とりあえずGitHub Actionsのenvironmentを定義しておいて、そこと紐づけるのが一番スタンダード。つまり「GitHub Actionsのenvironment」ごとにWorkload Identityプールを作成するということ。
        - GitHub Actionsのenvironmentを定義しておけば、GitHubのOIDCプロバイダーがGoogleCloudに提示するJWTの`sub`には`"repo:octo-org/octo-repo:environment:prod"`のような文字列が含まれるようになる
        - ただ、GitHubの場合はそれとは別にアクセス元の許可設定をしなきゃいけないので、やっておく
    - [[GoogleCloud]GitHub Actions を使用して Cloud Run にデプロイする](https://cloud.google.com/blog/ja/products/devops-sre/deploy-to-cloud-run-with-github-actions/)
        - アクションが古い以外はだいたいこの記事が正しい
        - こっちの例ではプロジェクトIDとworkload_identity_providerをsecretにしている。その方が当然セキュアなのでそうしておく
        - Google CloudのArtifactoryにdocker loginするときにアクセストークンが必要だった。このときWorkload identityはサービスアカウントの権限を借用してアクセストークンを取得する必要があった
            - access_tokenは明示的に作成しないと生成されない。ここに書いてあった
            - https://github.com/google-github-actions/auth?tab=readme-ov-file#sake
        - ということで1個適当なサービスアカウントを作って、このリポジトリのgithub actions dev環境からしか使えないworkflow identity user roleを割り当てた
    - [[GoogleCloud]ID 連携: プロダクトと制限事項](https://cloud.google.com/iam/docs/federated-identity-supported-services?hl=ja)
        - 使えないサービスもあるので気を付けておく
    - [[GoogleCloud]GitHub Actions からのキーなしの認証の有効化](https://cloud.google.com/blog/ja/products/identity-security/enabling-keyless-authentication-from-github-actions)
    - [[GoogleCloud]デプロイメント パイプラインとの Workload Identity 連携を構成する](https://cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines?hl=ja)
    - [Workload Identity 連携を利用して GitHub Actions を動かす](https://zenn.dev/cloud_ace/articles/7fe428ac4f25c8)
- [GithubActions で CloudRun を CI/CD する](https://zenn.dev/jinwatanabe/articles/646b4662f05a8c)

## その他興味深い情報

- [ローカル JWK を使用する OIDC プロバイダ](https://cloud.google.com/iam/docs/workload-identity-federation?hl=ja#oidc-credential-security)
    - パブリック OIDC エンドポイントのないワークロードを連携するには、OIDC JSON Web Key Set（JWKS）をプールに直接アップロードします。これは、Terraform または GitHub Enterprise を独自の環境でホストしている場合や、公開 URL を公開できない規制要件がある場合によく使用されます。詳細については、OIDC JWK を管理する（省略可）をご覧ください。
- [Workload Identity 連携の使用に関するベスト プラクティス](https://cloud.google.com/iam/docs/best-practices-for-using-workload-identity-federation?hl=ja)
    - 専用のプロジェクトを使用して Workload Identity プールとプロバイダを管理する
    - Workload Identity プールごとに 1 つのプロバイダを使用して、サブジェクトの競合を回避する
    - 同じ ID プロバイダとの 2 回の連携を回避する
    - Workload Identity プール プロバイダの URL をオーディエンスとして使用する
    - IAM API のデータアクセス ログを有効にする