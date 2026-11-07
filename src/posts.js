export const posts = [
  {
    slug: "cutover",
    index: "01",
    tag: "Platform",
    date: "19 Sep 2026",
    minutes: 6,
    status: "Production",
    title: "Production changed accounts.",
    italic: "The requests did not.",
    dek: "A live AWS estate moved into a new organization. Stage stayed in Mumbai. Production stayed in Singapore. DNS moved last.",
    lines: [
      ["account", "new organization"],
      ["parity", "terraform = live"],
      ["data", "s3, images, rds"],
      ["jenkins", "ec2 mumbai → eks singapore"],
      ["dns", "after parity"],
      ["dropped", "0"],
    ],
    sections: [
      {
        heading: "The order was the work",
        paragraphs: [
          "Moving an AWS account is easy to describe and unpleasant to do while production is answering requests. The estate had to leave one account and land in a new AWS Organization. Stage stayed in Mumbai. Production stayed in Singapore. The cut was not allowed to drop traffic.",
          "Terraform was brought to parity with what was already live before any DNS record moved. Private EKS, Helm, CloudFront, S3, Lambda, Route 53, and IAM, including the permissions Amazon Bedrock needs. If the code and the account had disagreed, DNS would have advertised a guess.",
        ],
      },
      {
        heading: "What crossed the account line",
        paragraphs: [
          "S3 objects, Lambda layers, and container images moved across accounts. RDS moved with DMS and cross-account snapshots. VPC peering kept the new account on the old private network until the cut was done, so services were not asked to find each other across a wall on the same afternoon they changed homes.",
          "Jenkins looked like the small piece. It was a single EC2 host in Mumbai. It landed on EKS in Singapore, and ArgoCD kept syncing the same services from Helm. A new cluster with the old pipeline still pointed at the old account would have been a diagram, not a migration.",
        ],
      },
      {
        heading: "Stage was the recovery",
        paragraphs: [
          "Production was the zero-downtime cut. Stage was not given the same sentence. When the source account could no longer serve traffic, stage was rebuilt on the new Mumbai cluster and brought back up.",
          "The part worth repeating is dull on purpose. Match Terraform to reality before you touch DNS. Move the data while the old network can still see the new one. Treat the CI host as part of the estate.",
        ],
      },
    ],
  },
  {
    slug: "fail-closed",
    index: "02",
    tag: "DevSecOps",
    date: "8 Mar 2026",
    minutes: 4,
    status: "Every release",
    title: "The build is not a suggestion.",
    italic: "It stops.",
    dek: "Critical SonarQube, a secret in the diff, Trivy, or ZAP, and the release does not continue. Later gates do not try anyway.",
    lines: [
      ["branch", "bitbucket"],
      ["sast", "sonarqube"],
      ["secrets", "diff clean, or stop"],
      ["image", "trivy, 0 critical"],
      ["sign", "cosign"],
      ["sync", "argocd"],
    ],
    sections: [
      {
        heading: "A green ball is a decision",
        paragraphs: [
          "The pipeline fails closed. A critical SonarQube finding, a key in the diff, a critical Trivy result, or OWASP ZAP, and the release does not continue. Cosign signs what passed. ArgoCD syncs Helm. An unsigned image does not deploy.",
          "The order is the policy. Branch, static analysis, secrets, the image scan, the signature, GitOps, then the edge. A later gate does not keep going after an earlier one has failed. Skip is the honest state. Waiting for someone to notice a red row is how a critical finding becomes a deployment.",
        ],
      },
      {
        heading: "No side door on the build",
        paragraphs: [
          "Jenkins builds with Kaniko. The image is produced inside the cluster instead of depending on a Docker daemon on a shared host. That is a smaller story than the gate, and it matters for the same reason. The build should not have a side door.",
          "The release at the top of this site plays the policy back. A clean run ends on SUCCESS. A leaked secret stops at the secret scan. A critical CVE stops at Trivy. The animation does not deploy anything.",
        ],
      },
    ],
  },
  {
    slug: "concealment",
    index: "03",
    tag: "Voice",
    date: "21 Oct 2026",
    minutes: 5,
    status: "Stage-proven",
    title: "Thirty-eight seconds of silence.",
    italic: "Then 2.9.",
    dek: "FreeSWITCH on the Dhwani edge. The concealment number is from stage. The load test is still a plan.",
    lines: [
      ["trunk", "didww, zentrunk"],
      ["codec", "g.711 both legs"],
      ["audio", "mod_audio_stream, tls"],
      ["conceal", "38s → 2.9s, stage"],
      ["delay", "2–3s gone, stage"],
      ["load", "100–120, planned"],
    ],
    sections: [
      {
        heading: "The caller is the latency budget",
        paragraphs: [
          "Dhwani is a calling platform. The caller is supposed to hear a person, not a queue. Twilio and LiveKit feed a Node agent. Speech work sits on ECS, Fargate and GPU, with SQS between Faster-Whisper, Amazon Bedrock, and GPU text-to-speech. The platform was built for 150 or more concurrent calls a minute.",
          "The model path and the phone path are different problems. FreeSWITCH 1.10 sits on the trunk. DIDWW and Zentrunk carry the phone network. A browser softphone speaks SIP over WSS. Both legs are forced to G.711. Digest auth is per call. Caller ID is E.164, and P-Asserted-Identity goes with it. There is no separate Sofia gateway in the way.",
        ],
      },
      {
        heading: "What stage actually measured",
        paragraphs: [
          "A Python Event Socket service starts the call and reports ringing, answered, and ended. It hangs up, and it handles barge-in. AI audio enters the live call through mod_audio_stream over TLS.",
          "On stage, the browser was concealing about 38 seconds of audio. After the path was fixed, concealment was about 2.9 seconds, and a 2 to 3 second conversational delay was gone. Those are stage numbers. A load test for about 100 to 120 concurrent AI calls is planned. It is not a result. The production host is documented from that setup. Documented is not the same word as load-tested.",
        ],
      },
    ],
  },
  {
    slug: "count-mode",
    index: "04",
    tag: "Edge",
    date: "2 Jun 2026",
    minutes: 3,
    status: "Count mode",
    title: "Fifteen distributions.",
    italic: "One plan.",
    dek: "Terraform attached the Web ACL and left the two distributions that were not in code alone. Count mode sees. It does not block.",
    lines: [
      ["edge", "cloudfront"],
      ["attach", "15 distributions"],
      ["plan", "read before apply"],
      ["untouched", "2, not in terraform"],
      ["mode", "count"],
      ["block", "not yet"],
    ],
    sections: [
      {
        heading: "Association, and nothing else",
        paragraphs: [
          "CloudFront was already in front of the product. The WAF was not on those distributions. Attaching it looks like one checkbox and turns into fifteen surprises if the distributions are edited by hand.",
          "Terraform attached the Web ACL. The plan was read first. Apply changed the association. Two distributions that were not in Terraform were left alone.",
        ],
      },
      {
        heading: "Count is a measurement",
        paragraphs: [
          "The Web ACL went on in count mode. It sees the requests and does not block them. That is a measurement, not a finished shield. GuardDuty, Security Hub, and AWS Config watch the account. Alerts go to Slack.",
          "Blocking rules are a later decision, made with the counts in hand. This note will not pretend that decision has already been taken.",
        ],
      },
    ],
  },
  {
    slug: "the-bill",
    index: "05",
    tag: "FinOps",
    date: "18 Jan 2026",
    minutes: 3,
    status: "Monthly bill",
    title: "Forty-five to thirty-seven.",
    italic: "Production stayed.",
    dek: "About $45K a month to about $37K. Azure AKS sits beside AWS. Production did not move there.",
    lines: [
      ["before", "$45k / month"],
      ["after", "$37k / month"],
      ["delta", "about 18%"],
      ["shape", "gp3, graviton, amd"],
      ["commit", "savings plans, ris"],
      ["azure", "beside, not instead"],
    ],
    sections: [
      {
        heading: "The bill moved because the shape did",
        paragraphs: [
          "The monthly AWS bill moved from about $45K to about $37K. That is roughly 18 percent. It did not move because someone turned production off.",
          "The changes were ordinary and cumulative. A dual-stack VPC. gp3 volumes. Graviton and AMD where the workload allowed them. Savings Plans and Reserved Instances against usage that was already real.",
        ],
      },
      {
        heading: "A second cloud is not a migration",
        paragraphs: [
          "Azure AKS runs beside AWS. Production did not move to Azure. A second cloud next to the bill is not a migration, and this page will not call it one.",
        ],
      },
    ],
  },
];
