export const profile = {
  name: "Divyanshu Singh",
  role: "Lead DevOps Engineer",
  location: "India",
  email: "cgcdivyanshu@gmail.com",
  phone: "+91 9520641947",
  resume: {
    view: "https://drive.google.com/file/d/1rd2Ch_omWS8-uuI4hMAZlFruAnHdhFds/view?usp=sharing",
    download: "https://drive.google.com/uc?export=download&id=1rd2Ch_omWS8-uuI4hMAZlFruAnHdhFds",
  },
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/dsthakur402/" },
    { label: "GitHub", href: "https://github.com/dsthakur402/" },
    { label: "LeetCode", href: "https://leetcode.com/u/dsthakur402/" },
    { label: "Credly", href: "https://www.credly.com/users/divyanshu-singh.65b5c87d" },
  ],
};

export const projects = [
  {
    id: "migration",
    index: "01",
    title: "AWS-to-AWS account migration",
    when: "Jul 2026 – Sep 2026",
    kicker: "Zero downtime on production",
    summary:
      "Production left the old AWS account and landed in a new AWS Organization without a traffic cut. Stage is Mumbai. Production is Singapore. Both run in the new account.",
    points: [
      "Terraform had to match what was already live before DNS moved: private EKS, Helm, CloudFront, S3, Lambda, Route 53, and IAM, including Bedrock permissions.",
      "S3 objects, Lambda layers, ECR images, and RDS moved across accounts. RDS used DMS and cross-account snapshots. VPC peering kept the new account on the old private network until cutover.",
      "Jenkins left a single EC2 host in Mumbai and landed on EKS in Singapore. ArgoCD kept syncing the same services from Helm.",
      "When the source account could no longer serve traffic, stage was rebuilt on the new Mumbai cluster and brought back up.",
    ],
    strip: [
      { t: "Old account", d: "Live estate" },
      { t: "Parity", d: "Terraform vs reality" },
      { t: "Cutover", d: "DNS, zero downtime" },
      { t: "New org", d: "Mumbai + Singapore" },
    ],
    ask: "Walk me through the AWS account migration",
  },
  {
    id: "dhwani",
    index: "02",
    title: "Dhwani, AI calling platform",
    when: "Real-time voice",
    kicker: "Built for 150+ concurrent calls a minute",
    summary:
      "A voice system for automated lead generation. The caller hears a low-latency conversation, not a stack of batch jobs.",
    points: [
      "The call path is Twilio and LiveKit into Node.js agents, with audio in both directions.",
      "Speech work sits on Amazon ECS, Fargate and GPU EC2, with SQS between speech-to-text, an Amazon Bedrock model, and GPU text-to-speech.",
      "Speech-to-text is Faster-Whisper with voice activity detection. The layout can run on AWS or Azure.",
    ],
    strip: [
      { t: "Phone", d: "Twilio + LiveKit" },
      { t: "Agent", d: "Node.js" },
      { t: "STT", d: "Faster-Whisper" },
      { t: "LLM", d: "Bedrock" },
      { t: "TTS", d: "GPU" },
    ],
    ask: "How does the Dhwani calling platform work?",
  },
  {
    id: "sip",
    index: "03",
    title: "FreeSWITCH and SIP trunking",
    when: "Oct 2026 – Present",
    kicker: "Voice edge for Dhwani, proven on stage",
    summary:
      "FreeSWITCH 1.10 is the SIP and media server for outbound calls. Trunks go to DIDWW and Zentrunk. A browser softphone bridges to the phone network.",
    points: [
      "Per-call digest auth, E.164 caller ID, and P-Asserted-Identity. No separate Sofia gateway. Both legs are forced to G.711.",
      "A Python Event Socket service starts the call and reports ringing, answered, and ended. It also hangs up and handles barge-in. mod_audio_stream with TLS carries AI audio into the live call.",
      "On stage, browser concealment dropped from about 38 seconds to about 2.9 seconds, and the 2–3 second conversational delay was gone. A load test for about 100–120 concurrent AI calls is planned, not claimed as a finished result. The same setup is documented for the production host.",
    ],
    strip: [
      { t: "Softphone", d: "SIP.js over WSS" },
      { t: "FreeSWITCH", d: "1.10, G.711" },
      { t: "Trunk", d: "DIDWW, Zentrunk" },
      { t: "AI audio", d: "mod_audio_stream" },
    ],
    ask: "What did you set up with FreeSWITCH?",
  },
];

export const also = [
  {
    title: "CloudFront WAF",
    text: "Attached a WAF to 15 CloudFront distributions with Terraform. The plan touched the association only.",
  },
  {
    title: "Kibana for incidents",
    text: "Production boards for errors, latency, dependencies, and cluster health, plus a short guide so a developer can open the right one.",
  },
  {
    title: "Node.js 24, in progress",
    text: "A per-app risk sheet before anyone pins an image. Next.js 12 and old Chromium Lambda layers block some services. This is not a finished rollout.",
  },
];

export const jobs = [
  {
    role: "Lead DevOps Engineer",
    org: "Brightchamps",
    when: "Dec 2025 – Present",
    note: "Owns the DevOps roadmap and reports to the CTO.",
    points: [
      "Ran a zero-downtime production move into a new AWS Organization. Rebuilt the estate in Terraform and checked compute, storage, DNS, and IAM for live parity before cutover. Bedrock permissions live in Terraform.",
      "Moved Jenkins off one EC2 host in Mumbai onto EKS in Singapore. Built a private EKS cluster, control plane and nodes in private subnets, with Karpenter and a locked-down VPC.",
      "Led a dual-stack VPC migration that cut cloud spend from $45K to $37K a month, about 18%. Added Azure (AKS, Storage, Virtual Network) beside AWS.",
      "Rolled out IAM Identity Center with Google Workspace, least-privilege RBAC, KMS, an account-level S3 public-access block, AWS WAF, Security Hub, GuardDuty, AWS Config, and EventBridge alerts to Slack. ArgoCD, Grafana, and Kibana sit behind the same SSO.",
      "Split build and deploy: Jenkins with Kaniko, ArgoCD from Bitbucket, and Helm charts with Deployment, Service, Ingress, HPA, and PDB. Pipelines fail on critical SonarQube, Trivy, OWASP ZAP, or secret-scan findings.",
      "Set up Prometheus, Grafana, the EFK stack, and OpenTelemetry on EKS.",
      "Set up FreeSWITCH and SIP trunking as the voice edge for Dhwani, including the stage RTP changes that removed multi-second audio lag.",
    ],
  },
  {
    role: "DevOps Engineer",
    org: "Infra360",
    when: "Feb 2025 – Nov 2025",
    note: "External consultant. Clients included Brightchamps and Ionic.",
    points: [
      "Ran day-to-day DevOps for 30+ production microservices on Amazon EKS.",
      "Frontend path: Cloudflare to CDN to S3, with a 95%+ cache hit. Backend path: Cloudflare to an Application Load Balancer to EKS to RDS.",
      "Moved workloads into private subnets, enforced IMDSv2, and limited operator access to VPN.",
      "Right-sized compute onto gp3 and Graviton/AMD, migrated RDS MySQL to PostgreSQL with AWS DMS, and set cross-account RDS backups plus AMI retention.",
      "Cut spend with Savings Plans, Reserved Instances, and rightsizing. Enforced KMS and a tagging standard.",
      "Enabled GuardDuty, Security Hub, and AWS Config with conformance packs, and deletion protection on RDS, ALB, and EKS.",
    ],
  },
  {
    role: "DevOps Engineer",
    org: "The Concept Designing",
    when: "Feb 2023 – Feb 2025",
    note: "Hands-on AWS and the start of EKS and Terraform.",
    points: [
      "Ran day-to-day EC2, S3, IAM, VPC, and RDS, including new environments.",
      "Supported EKS in development: service accounts, PodDisruptionBudget, Horizontal Pod Autoscaler, and cluster upgrades.",
      "Triaged CrashLoopBackOff and OOMKilled from logs, limits, and events.",
      "Wrote Terraform for AWS resources and helped provision from that code.",
    ],
  },
];

export const skillGroups = [
  {
    title: "DevSecOps",
    items:
      "SonarQube, Snyk, Trivy, OWASP ZAP, secret scanning, Cosign, IAM Identity Center, GuardDuty, Security Hub, AWS Config, AWS WAF, KMS, Pritunl, Teleport, RBAC",
  },
  {
    title: "AI and voice",
    items:
      "Amazon Bedrock, Faster-Whisper, text-to-speech, FreeSWITCH, SIP trunking, WebRTC, SIP.js, Event Socket Library, RTP, G.711, ECS, GPU",
  },
  {
    title: "Platform",
    items:
      "AWS (EKS, VPC, ALB, CloudFront, S3, Lambda, SQS, RDS, Route 53), Azure AKS, Docker, Kubernetes, Helm, Karpenter, Kaniko, Terraform, CloudFormation",
  },
  {
    title: "Delivery and signal",
    items:
      "Jenkins, ArgoCD, GitHub Actions, GitOps, Bitbucket, Prometheus, Grafana, Elasticsearch, Fluentd, Kibana, OpenTelemetry, CloudWatch",
  },
];

export const education = {
  degree: "B.Tech, Artificial Intelligence and Data Science",
  school: "Chandigarh Engineering College, Jhanjeri, Mohali",
  when: "2021 – 2025",
  mark: "CGPA 8.13",
};

export const certs = [
  "Microsoft Certified: Azure Fundamentals (AZ-900)",
  "Microsoft Certified: Azure Data Fundamentals (DP-900)",
  "IBM Certified: Git and GitHub Fundamentals",
];

export const chips = [
  "What changed in the AWS migration?",
  "Which security gates fail the build?",
  "How does Dhwani place a call?",
  "What did FreeSWITCH fix on stage?",
];

export const topics = [
  {
    id: "migration",
    keys: [
      "migrat",
      "cutover",
      "new account",
      "aws organization",
      "organisation",
      "zero downtime",
      "zero-downtime",
      "account move",
      "account migration",
      "dns cutover",
      "parity",
    ],
    follow: ["What moved across accounts?", "What happened to stage?"],
    answer:
      "Production moved from the existing AWS account into a new AWS Organization with zero downtime. Stage is in Mumbai and production is in Singapore, both in the new account. Terraform had to match what was live before DNS moved: private EKS, Helm, CloudFront, S3, Lambda, Route 53, and IAM, including Bedrock.",
    more:
      "The data path moved too: S3 objects, Lambda layers, ECR images, and RDS through DMS and cross-account snapshots. VPC peering kept the new account on the old private network until cutover. Jenkins left one EC2 host in Mumbai and landed on EKS in Singapore, with ArgoCD syncing the same services from Helm. When the source account could no longer serve traffic, stage was rebuilt on the new Mumbai cluster.",
  },
  {
    id: "devsecops",
    keys: [
      "devsecops",
      "security",
      "security gate",
      "sonarqube",
      "sast",
      "trivy",
      "owasp",
      "zap",
      "secret",
      "cosign",
      "guardduty",
      "security hub",
      "waf",
      "snyk",
      "fail the build",
      "pipeline fail",
      "release gate",
    ],
    follow: ["How is the cluster locked down?", "Where does WAF sit?"],
    answer:
      "The release stops on a real finding. Jenkins builds with Kaniko. The pipeline fails on critical SonarQube, Trivy, OWASP ZAP, or a secret in the diff. Images that pass can be signed with Cosign. ArgoCD deploys from Helm, and only that path.",
    more:
      "Around the cluster: private EKS, IMDSv2, workloads in private subnets, VPN for operators, KMS, and an account-level block on public S3. IAM Identity Center is tied to Google Workspace, with least-privilege roles for dev and production. GuardDuty, Security Hub, and AWS Config are on, and EventBridge sends alerts to Slack. WAF is on CloudFront, including a Terraform change that attached it to 15 distributions without touching the rest of the stack. ArgoCD, Grafana, and Kibana sit behind the same SSO.",
  },
  {
    id: "dhwani",
    keys: [
      "dhwani",
      "calling",
      "voice ai",
      "lead gen",
      "twilio",
      "livekit",
      "whisper",
      "bedrock",
      "text to speech",
      "text-to-speech",
      "tts",
      "stt",
      "150",
    ],
    follow: ["Where does FreeSWITCH fit?", "What runs the speech pipeline?"],
    answer:
      "Dhwani is a real-time AI calling platform for lead generation, built for 150+ concurrent calls a minute. A call comes in through Twilio and LiveKit to a Node.js agent. Speech-to-text is Faster-Whisper with voice activity detection, the model is Amazon Bedrock, and speech goes back out through GPU text-to-speech.",
    more:
      "The speech services run on Amazon ECS, Fargate and GPU EC2, with SQS between the stages so a burst does not take the whole call path down. The layout is cloud-shaped so it can run on AWS or Azure. The newer voice edge, FreeSWITCH and SIP trunks, sits in front of this. Ask about FreeSWITCH if you want that path.",
  },
  {
    id: "sip",
    keys: [
      "freeswitch",
      "free switch",
      "sip",
      "trunk",
      "webrtc",
      "didww",
      "zentrunk",
      "softphone",
      "rtp",
      "g.711",
      "esl",
      "event socket",
      "audio lag",
      "concealment",
    ],
    follow: ["Was that production or stage?", "How does barge-in work?"],
    answer:
      "FreeSWITCH 1.10 is the SIP and media server for Dhwani outbound calls. Trunks to DIDWW and Zentrunk use per-call digest auth, E.164 caller ID, and P-Asserted-Identity. A browser softphone (SIP.js over secure WebSocket) bridges to the phone network, and both legs are forced to G.711.",
    more:
      "A Python Event Socket service originates the call and posts ringing, answered, and ended. It also hangs up and handles barge-in. mod_audio_stream with TLS streams AI audio into the live call. On stage, browser concealment dropped from about 38 seconds to about 2.9 seconds, and the 2–3 second conversational delay was gone. A load test for about 100–120 concurrent AI calls is planned, not finished. The production host has the same setup written down from stage. This was proven on stage.",
  },
  {
    id: "platform",
    keys: [
      "aws",
      "kubernetes",
      "k8s",
      "eks",
      "terraform",
      "karpenter",
      "helm",
      "jenkins",
      "argocd",
      "gitops",
      "kaniko",
      "vpc",
      "private cluster",
      "cloudfront",
      "lambda",
    ],
    follow: ["How do you cut cost?", "What does the pipeline block on?"],
    answer:
      "The platform is private EKS on AWS, described in Terraform. Jenkins on EKS builds images with Kaniko. ArgoCD syncs Helm charts from Bitbucket: Deployment, Service, Ingress, HPA, PDB. Karpenter scales node groups. The control plane and the nodes sit in private subnets.",
    more:
      "Jenkins used to be one EC2 host in Mumbai. It now runs on EKS in Singapore. A dual-stack VPC change was part of cutting cloud spend from $45K to $37K a month. Azure AKS, Storage, and a virtual network sit beside AWS, with one observability path. Production traffic for the product is Cloudflare to CDN to S3 on the frontend, and Cloudflare to an ALB to EKS to RDS on the backend.",
  },
  {
    id: "cost",
    keys: ["cost", "finops", "spend", "45", "37", "savings plan", "reserved", "kubecost", "rightsiz"],
    follow: ["What else changed in that migration?"],
    answer:
      "Monthly cloud spend dropped from $45K to $37K, about 18%, on a dual-stack VPC migration plus rightsizing. The levers he actually uses are Savings Plans, Reserved Instances, gp3, Graviton and AMD, and Kubecost.",
    more:
      "That number is the platform result, not a finance model. The account move and the private-subnet work sat in the same period. He has also put an AWS, Azure, and GCP cost comparison in front of leadership, but production runs on AWS, with Azure beside it.",
  },
  {
    id: "observe",
    keys: ["observ", "prometheus", "grafana", "kibana", "elasticsearch", "opentelemetry", "otel", "efk", "alert"],
    follow: ["What does a developer open during an incident?"],
    answer:
      "EKS has Prometheus, Grafana, the EFK stack, and OpenTelemetry, so an incident shows up in metrics, logs, and traces. EventBridge sends security alerts to Slack.",
    more:
      "On the production Kibana side there are boards for errors, latency, dependencies, and cluster health, and a short guide so a developer opens the right board instead of guessing. ArgoCD, Grafana, and Kibana are behind the same SSO as the rest of the internal tools.",
  },
  {
    id: "experience",
    keys: ["experience", "resume", "career", "brightchamps", "infra360", "years", "yoe", "background", "who are you", "about you", "about yourself"],
    follow: ["What do you own at Brightchamps?", "What came before that?"],
    answer:
      "Divyanshu Singh is a lead DevOps engineer in India, about three years in. Since December 2025 he has owned cloud, delivery, security, and the voice edge at Brightchamps, reporting to the CTO. Before that he was a consultant at Infra360 (Brightchamps and Ionic), and a DevOps engineer at The Concept Designing from 2023.",
    more:
      "At Infra360 he ran 30+ production services on EKS, moved RDS MySQL to PostgreSQL with DMS, and turned on GuardDuty, Security Hub, and AWS Config. The earlier role was EC2, VPC, RDS, and the first EKS and Terraform work: service accounts, autoscaling, crash loops, and out-of-memory kills.",
  },
  {
    id: "contact",
    keys: ["email", "phone", "contact", "linkedin", "github", "reach", "call you", "number"],
    follow: ["Are you open to roles?"],
    answer:
      "Email cgcdivyanshu@gmail.com or call +91 9520641947. The resume is on the contact section: view it in the browser, or download the PDF. LinkedIn is linkedin.com/in/dsthakur402. GitHub is github.com/dsthakur402.",
    more:
      "LeetCode is leetcode.com/u/dsthakur402 (400+ problems). Certifications are on Credly: credly.com/users/divyanshu-singh.65b5c87d. Azure Fundamentals, Azure Data Fundamentals, and IBM Git and GitHub.",
  },
  {
    id: "open",
    keys: ["open to", "hiring", "hire", "looking", "opportunity", "role", "available", "job"],
    follow: ["Fit a job description", "What should I email?"],
    answer:
      "He is open to lead DevOps and DevSecOps roles. He is based in India. The useful next step is an email to cgcdivyanshu@gmail.com with the posting. The Role fit tab on this page can score a job description against the actual work before you write.",
    more:
      "Notice period and compensation are not on this page. Send the role. The work that usually matters to that conversation is the account migration, the release gates, and the voice platform.",
  },
  {
    id: "education",
    keys: ["education", "degree", "college", "b.tech", "btech", "cgpa", "university", "graduat"],
    follow: ["What certifications do you have?"],
    answer:
      "B.Tech in Artificial Intelligence and Data Science from Chandigarh Engineering College, Jhanjeri, Mohali, 2021 to 2025. CGPA 8.13.",
    more:
      "Certifications: Microsoft Azure Fundamentals (AZ-900), Microsoft Azure Data Fundamentals (DP-900), and IBM Git and GitHub Fundamentals.",
  },
  {
    id: "node",
    keys: ["node 24", "node.js 24", "nodejs", "node upgrade", "runtime upgrade"],
    follow: ["What is already blocked?"],
    answer:
      "A Node.js 24 upgrade across stage and production is in progress. It is not a finished migration. Every app was checked before an image pin: some are a Dockerfile change, some cannot move yet.",
    more:
      "Next.js 12 cannot run on Node 24. Old Chromium Lambda layers break on nodejs24.x, and Serverless Framework 3 cannot deploy that runtime. Those stay blocked until the dependency moves. The rule he is using is to pin the exact image, ship stage first, and roll back by tag.",
  },
  {
    id: "mattermost",
    keys: ["mattermost", "teacher chat", "direct message"],
    follow: ["Is onboarding automated?"],
    answer:
      "Mattermost runs on production EKS for teachers. Direct messages between teachers were locked down so conversation stays in channels. Creating and deactivating teacher accounts is still manual.",
    more:
      "The DM change was done against production with a check before anything was applied, so the running system did not break. Automated join and leave was scoped, not shipped.",
  },
  {
    id: "docmost",
    keys: ["docmost", "plane.so", "jira", "confluence", "wiki"],
    follow: ["Why not on the stage cluster?"],
    answer:
      "Docmost and Plane were set up for the internal team as the stand-ins for Confluence and Jira. They serve a small group, on the order of 50 people, and they stay up when the stage cluster scales to zero outside working hours.",
    more:
      "Stage EKS is scaled down at night, which would have taken an internal wiki down with it. These two were placed so that did not happen, with public hostnames and private servers, and DNS on Cloudflare.",
  },
  {
    id: "notes",
    keys: ["blog", "blogs", "field note", "field notes", "essay", "notes section"],
    follow: ["What changed in the AWS migration?", "Which security gates fail the build?"],
    answer:
      "Field notes are on this page, under Notes. Five of them: the AWS account cutover, the fail-closed pipeline, the FreeSWITCH stage fix, the WAF in count mode, and the bill from about $45K to about $37K. Stage numbers stay labeled as stage.",
    more:
      "Open a note from the Notes section. The cutover note is the long one. The FreeSWITCH note says the concealment drop was measured on stage, and the 100–120 call load test is still planned.",
  },
  {
    id: "ai-page",
    keys: ["this page", "this site", "portfolio", "briefing", "how does this work", "runs in the browser", "chatbot"],
    follow: ["Score a job description", "Show me the release gate"],
    answer:
      "This page is the portfolio. The briefing, the job-description score, and the release gate all run in your browser. Nothing you type is sent to a server. Answers are taken from the same record as the rest of the page, not from a general model.",
    more:
      "Role fit compares the posting with the tools and projects on this page, and it will say when the overlap is thin. The release gate is a demonstration of the Jenkins, SonarQube, Trivy, secret scan, Cosign, and ArgoCD path. It does not deploy anything.",
  },
];

export const lexicon = [
  { id: "eks", group: "platform", weight: 5, label: "Kubernetes / EKS", terms: ["kubernetes", "k8s", "eks", "helm", "karpenter"], proof: "Private Amazon EKS, Helm, and Karpenter, with the control plane and nodes in private subnets." },
  { id: "tf", group: "platform", weight: 5, label: "Terraform", terms: ["terraform", "infrastructure as code", "iac"], proof: "The AWS estate was rebuilt in Terraform and checked against what was live before the account cutover." },
  { id: "aws", group: "platform", weight: 4, label: "AWS", terms: ["aws", "amazon web services", "cloudfront", "lambda"], proof: "Production and stage run on AWS, Singapore and Mumbai, including CloudFront, Lambda, S3, RDS, and IAM." },
  { id: "cicd", group: "delivery", weight: 5, label: "CI/CD and GitOps", terms: ["jenkins", "argocd", "gitops", "github actions", "ci/cd", "cicd"], proof: "Jenkins with Kaniko builds the image. ArgoCD deploys from Helm. The two are deliberately split." },
  { id: "migrate", group: "platform", weight: 5, label: "Cloud migration", terms: ["migration", "migrate", "cutover", "zero downtime", "account migration"], proof: "Production moved into a new AWS Organization with zero downtime, after a live parity check." },
  { id: "sast", group: "devsecops", weight: 5, label: "SAST", terms: ["sonarqube", "sast", "static analysis", "code scanning"], proof: "SonarQube is a failing gate. Critical findings stop the release." },
  { id: "sca", group: "devsecops", weight: 5, label: "Image and dependency scan", terms: ["trivy", "snyk", "container scan", "image scan", "vulnerability scan"], proof: "Trivy scans the image. A critical CVE fails the build before the image is published." },
  { id: "dast", group: "devsecops", weight: 4, label: "DAST", terms: ["owasp zap", "dast", "owasp"], proof: "OWASP ZAP runs in the pipeline, and a critical finding fails the release." },
  { id: "secrets", group: "devsecops", weight: 4, label: "Secret scanning", terms: ["secret scan", "secret scanning", "secrets detection", "gitleaks"], proof: "A secret in the diff fails the pipeline." },
  { id: "waf", group: "devsecops", weight: 4, label: "WAF and detection", terms: ["waf", "guardduty", "security hub", "aws config", "cspm"], proof: "WAF is on CloudFront. GuardDuty, Security Hub, and AWS Config are on, with alerts to Slack." },
  { id: "iam", group: "devsecops", weight: 4, label: "IAM and SSO", terms: ["iam", "sso", "identity center", "least privilege", "rbac"], proof: "IAM Identity Center is tied to Google Workspace, with least-privilege roles for dev and production." },
  { id: "sign", group: "devsecops", weight: 3, label: "Image signing", terms: ["cosign", "image signing", "sigstore"], proof: "Cosign is part of the release path for images that have already passed the scans." },
  { id: "obs", group: "delivery", weight: 3, label: "Observability", terms: ["prometheus", "grafana", "opentelemetry", "kibana", "observability"], proof: "Prometheus, Grafana, EFK, and OpenTelemetry cover metrics, logs, and traces on EKS." },
  { id: "finops", group: "platform", weight: 3, label: "FinOps", terms: ["finops", "cost optim", "savings plan", "reserved instance", "kubecost"], proof: "Spend fell from $45K to $37K a month through the network design, Savings Plans, Reserved Instances, and rightsizing." },
  { id: "azure", group: "platform", weight: 3, label: "Azure", terms: ["azure", "aks"], proof: "Azure AKS, Storage, and a virtual network run beside AWS, not instead of it." },
  { id: "voice", group: "ai", weight: 5, label: "Voice AI", terms: ["voice ai", "speech", "whisper", "text-to-speech", "text to speech", "tts", "stt", "bedrock", "llm"], proof: "Dhwani runs Faster-Whisper, Amazon Bedrock, and GPU text-to-speech on a live call path, built for 150+ concurrent calls a minute." },
  { id: "sip", group: "ai", weight: 5, label: "SIP and FreeSWITCH", terms: ["freeswitch", "sip trunk", "sip", "webrtc", "rtp", "voip"], proof: "FreeSWITCH 1.10 with DIDWW and Zentrunk trunks, a browser softphone, and an Event Socket dial API. Stage audio lag was removed." },
  { id: "python", group: "platform", weight: 2, label: "Python", terms: ["python"], proof: "Python shows up in the Event Socket dial service and in automation around the platform." },
];

export const gaps = [
  { id: "go", weight: 4, label: "Go", terms: ["golang", " go "], note: "The hands-on languages on this record are Python and Java, not Go." },
  { id: "rust", weight: 3, label: "Rust", terms: ["rust"], note: "Rust is not part of the shipped work." },
  { id: "gcp", weight: 4, label: "GCP as a primary cloud", terms: ["gcp", "google cloud"], note: "He has compared GCP on cost. Production runs on AWS, with Azure beside it. He has not run a GCP estate." },
  { id: "pulumi", weight: 3, label: "Pulumi", terms: ["pulumi"], note: "Infrastructure as code here is Terraform and CloudFormation." },
  { id: "ansible", weight: 3, label: "Ansible", terms: ["ansible"], note: "Config is Terraform, Helm, and pipelines, not Ansible." },
  { id: "istio", weight: 3, label: "Istio / service mesh", terms: ["istio", "service mesh", "linkerd"], note: "No service mesh is claimed. Ingress is the ALB and CloudFront path." },
  { id: "datadog", weight: 2, label: "Datadog", terms: ["datadog"], note: "The stack is Prometheus, Grafana, EFK, OpenTelemetry, and CloudWatch. Datadog itself is not the tool he runs." },
  { id: "swift", weight: 5, label: "iOS / Swift", terms: ["swift", "swiftui", "uikit"], note: "This is not an iOS role. The work is platform, security, and voice infrastructure." },
  { id: "reactnative", weight: 4, label: "Mobile product engineering", terms: ["react native", "flutter"], note: "He does not ship mobile apps. He runs the platform those apps call." },
];

export const sampleJobs = {
  security: `Lead DevSecOps engineer. 5+ years. Own AWS, EKS, and Terraform for a multi-account production estate. Jenkins and ArgoCD. Pipelines must fail on SonarQube, Trivy, secret scanning, and OWASP ZAP. GuardDuty, Security Hub, WAF, IAM least privilege. You have already done a production migration.`,
  voice: `Platform engineer for real-time voice AI. SIP, FreeSWITCH or equivalent, WebRTC, low-latency RTP, Whisper or similar speech-to-text, an LLM on Amazon Bedrock, and Kubernetes. You should have shipped this, not prototyped it.`,
};
