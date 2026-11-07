export const systems = [
  {
    id: "move",
    widget: "cutover",
    span: "feature",
    kicker: "AWS to AWS",
    title: "Account cutover",
    line: "Production changed accounts. The requests did not.",
    detail:
      "Stage is Mumbai, production is Singapore, both in the new organization. Terraform was matched to what was already live before DNS moved: EKS, Helm, CloudFront, S3, Lambda, and IAM. S3, images, Lambda layers, and RDS came across with the traffic.",
  },
  {
    id: "dhwani",
    widget: "wave",
    span: "wide",
    kicker: "Voice AI",
    title: "Dhwani",
    line: "A caller hears a person, not a queue.",
    detail:
      "Built for 150+ concurrent calls a minute. Twilio and LiveKit into a Node agent, Faster-Whisper, Amazon Bedrock, and GPU speech, with SQS between the stages.",
    ask: "How does Dhwani place a call?",
  },
  {
    id: "sip",
    widget: "sip",
    span: "third",
    kicker: "SIP",
    title: "FreeSWITCH edge",
    line: "The voice path, on a trunk, not a mock.",
    detail:
      "FreeSWITCH 1.10, DIDWW and Zentrunk, a browser softphone, G.711 both ways. On stage, browser concealment dropped from about 38 seconds to about 2.9 seconds. The production host is documented from that setup. A 100–120 call load test is planned, not claimed as finished.",
    ask: "What did FreeSWITCH fix on stage?",
  },
  {
    id: "gates",
    widget: "gates",
    span: "third",
    kicker: "DevSecOps",
    title: "Fail closed",
    line: "SonarQube, secrets, Trivy, ZAP. Then, and only then, ArgoCD.",
    detail:
      "Jenkins builds with Kaniko. A critical finding or a key in the diff stops the release. Cosign signs what passed. ArgoCD syncs Helm, and unsigned images do not deploy.",
    ask: "Which security gates fail the build?",
  },
  {
    id: "eks",
    widget: "nodes",
    span: "third",
    kicker: "EKS",
    title: "Private cluster",
    line: "Control plane and nodes never sit on a public subnet.",
    detail:
      "Karpenter scales the node groups. Jenkins left a single EC2 host in Mumbai and now runs on EKS in Singapore. Operators come in through VPN.",
  },
  {
    id: "waf",
    widget: "waf",
    span: "third",
    kicker: "Edge",
    title: "WAF, 15 distributions",
    line: "Terraform attached the Web ACL and touched nothing else.",
    detail:
      "CloudFront distributions picked up the WAF in one plan. GuardDuty, Security Hub, and Config watch the account. Alerts go to Slack.",
  },
  {
    id: "kibana",
    widget: "spark",
    span: "third",
    kicker: "Signal",
    title: "Incident boards",
    line: "Errors, latency, dependencies, the cluster. In that order.",
    detail:
      "Prometheus, Grafana, EFK, and OpenTelemetry are the stack. The Kibana boards are so a developer opens the right one during an incident instead of searching logs blind.",
  },
  {
    id: "cost",
    widget: "spend",
    span: "third",
    kicker: "FinOps",
    title: "$45K to $37K",
    line: "About 18% off the monthly bill.",
    detail:
      "Dual-stack VPC, gp3, Graviton and AMD, Savings Plans, Reserved Instances. Azure AKS sits beside AWS. Production did not move to Azure.",
  },
  {
    id: "desk",
    widget: "uptime",
    span: "half",
    kicker: "Internal",
    title: "Docmost and Plane",
    line: "Wiki and tracker that stay up when stage scales to zero.",
    detail:
      "Confluence and Jira stand-ins for about 50 people. Stage EKS goes to zero replicas outside working hours, so these two do not live on that cluster.",
  },
  {
    id: "mm",
    widget: "channels",
    span: "half",
    kicker: "Mattermost",
    title: "Teachers, channels only",
    line: "Direct messages between teachers are off. The server stayed up.",
    detail:
      "Mattermost runs on production EKS. The DM lock was checked before it was applied. Creating and removing teacher accounts is still manual.",
  },
];
