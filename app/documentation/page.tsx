import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Layers,
  Code,
  Database,
  Zap,
  Shield,
  Calendar,
  User,
  ExternalLink,
  GitBranch,
  DollarSign,
  Settings,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/fairplay-logo.png" alt="FairPlay Protocol" width={32} height={32} className="w-8 h-8" />
              <div>
                <h1 className="font-bold text-lg text-gray-900">Fairplay Protocol</h1>
                <p className="text-xs text-orange-500 font-medium">Play | Fair | Play</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900 font-medium">
                How it Works
              </Link>
              <Link href="/scoring-model" className="text-gray-600 hover:text-gray-900 font-medium">
                Scoring Model
              </Link>
              <Link href="/documentation" className="text-orange-500 font-medium">
                Documentation
              </Link>
              <a
                href="https://github.com/neocryptoquant"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                GitHub
              </a>
            </nav>

            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">Launch Campaign</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="border-orange-200 text-orange-600 bg-orange-50 px-4 py-2 mb-6">
            Technical Documentation
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            <span className="text-orange-500">FairPlay</span> Protocol
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Comprehensive technical documentation for the on-chain reward distribution system
          </p>
          <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50 px-4 py-2">
            Proof of Concept (PoC)
          </Badge>
        </div>

        {/* Table of Contents */}
        <Card className="mb-12 border-2 border-orange-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-orange-500" />
              <span>Table of Contents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <a href="#objective" className="block text-orange-600 hover:text-orange-700 font-medium">
                  1. Objective
                </a>
                <a href="#architecture" className="block text-orange-600 hover:text-orange-700 font-medium">
                  2. Architecture Overview
                </a>
                <a href="#scoring" className="block text-orange-600 hover:text-orange-700 font-medium">
                  3. Scoring Model
                </a>
                <a href="#instructions" className="block text-orange-600 hover:text-orange-700 font-medium">
                  4. Solana Instructions
                </a>
              </div>
              <div className="space-y-2">
                <a href="#state" className="block text-orange-600 hover:text-orange-700 font-medium">
                  5. On-Chain State
                </a>
                <a href="#backend" className="block text-orange-600 hover:text-orange-700 font-medium">
                  6. Backend Integration
                </a>
                <a href="#tech-stack" className="block text-orange-600 hover:text-orange-700 font-medium">
                  7. Technology Stack
                </a>
                <a href="#milestones" className="block text-orange-600 hover:text-orange-700 font-medium">
                  8. Milestone Plan
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objective Section */}
        <section id="objective" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
            <Shield className="w-8 h-8 text-orange-500" />
            <span>Objective</span>
          </h2>
          <Card className="border-2 border-blue-100 bg-blue-50">
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 mb-6">
                FairPlay Protocol is an on-chain reward distribution system that ensures fair and transparent
                contribution-based rewards in collaborative environments. This PoC targets hackathons and DevRel-led
                bounty campaigns, with GitHub Pull Requests as the contribution metric.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enable campaign organizers to:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Launch contribution-based campaigns with a set deadline and reward pool (in USDC)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Automatically track contributors' GitHub Pull Requests</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Score contributors based on merged/unmerged status</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Distribute on-chain rewards fairly using a transparent scoring and allocation system</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Architecture Section */}
        <section id="architecture" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
            <Layers className="w-8 h-8 text-orange-500" />
            <span>Architecture Overview</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">The system is split across 3 coordinated components:</p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-800">
                  <Shield className="w-6 h-6" />
                  <span>Solana Program</span>
                </CardTitle>
                <Badge variant="outline" className="border-purple-200 text-purple-600 bg-purple-50 w-fit">
                  On-Chain Logic
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Handles:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Campaign state storage</li>
                  <li>• Contributor accounts</li>
                  <li>• Reward pool escrow</li>
                  <li>• Scoring and reward distribution</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <Zap className="w-6 h-6" />
                  <span>Backend Server</span>
                </CardTitle>
                <Badge variant="outline" className="border-green-200 text-green-600 bg-green-50 w-fit">
                  Off-Chain GitHub Sync
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Responsibilities:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Monitor GitHub PRs via API</li>
                  <li>• Score contributors based on model</li>
                  <li>• Push scores to Solana program</li>
                  <li>• Handle post-deadline processing</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <Settings className="w-6 h-6" />
                  <span>Frontend</span>
                </CardTitle>
                <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50 w-fit">
                  Web UI
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Used by:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Organizers to create campaigns</li>
                  <li>• Contributors to track progress</li>
                  <li>• Public for transparency</li>
                  <li>• Campaign visibility</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Scoring Model Section */}
        <section id="scoring" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
            <GitBranch className="w-8 h-8 text-orange-500" />
            <span>Scoring Model</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-orange-100">
              <CardHeader>
                <CardTitle>Contribution Types & Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-800">Merged PR</span>
                    <Badge className="bg-green-100 text-green-800">100 points</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium text-yellow-800">Unmerged PR with effort</span>
                    <Badge className="bg-yellow-100 text-yellow-800">20 points</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-red-800">Spam/invalid PR</span>
                    <Badge className="bg-red-100 text-red-800">0 points</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100">
              <CardHeader>
                <CardTitle>Distribution Formula</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm mb-4">
                  <div>reward_i = (score_i / total_scores) * total_reward</div>
                </div>
                <p className="text-gray-600 text-sm">
                  The total reward pool is distributed proportionally based on individual scores relative to the total
                  campaign score. All scores are normalized across contributors after the scoring sync.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Instructions Section */}
        <section id="instructions" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
            <Code className="w-8 h-8 text-orange-500" />
            <span>Solana Program Instructions</span>
          </h2>
          <div className="grid gap-6">
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">initialize_campaign</h3>
                <p className="text-gray-600 mb-3">
                  Create new campaign with USDC pool, timeline, and repository metadata
                </p>
                <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm text-gray-700">
                  Parameters: authority, campaign_name, reward_pool, deadline, repo_url
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">register_contributor</h3>
                <p className="text-gray-600 mb-3">Register contributor wallet tied to a GitHub ID</p>
                <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm text-gray-700">
                  Parameters: contributor_wallet, github_username, campaign_id
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">update_score</h3>
                <p className="text-gray-600 mb-3">Called by backend to update contributor scores after PR evaluation</p>
                <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm text-gray-700">
                  Parameters: contributor_id, new_score, campaign_id
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">close_campaign</h3>
                <p className="text-gray-600 mb-3">Mark campaign as ended and ready for reward distribution</p>
                <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm text-gray-700">
                  Parameters: campaign_id, final_total_score
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">claim_reward</h3>
                <p className="text-gray-600 mb-3">Allow contributor to withdraw their allocated share from escrow</p>
                <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm text-gray-700">
                  Parameters: contributor_wallet, campaign_id
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* State Accounts Section */}
        <section id="state" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
            <Database className="w-8 h-8 text-orange-500" />
            <span>On-Chain State Accounts</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-orange-100">
              <CardHeader>
                <CardTitle className="text-orange-800">CampaignState</CardTitle>
                <p className="text-gray-600">Stores global campaign information</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Authority (organizer)</li>
                  <li>• Campaign name, timeline</li>
                  <li>• Escrow account</li>
                  <li>• Total reward pool (USDC)</li>
                  <li>• GitHub repo metadata</li>
                  <li>• Total score across all contributors</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-800">ContributorState</CardTitle>
                <p className="text-gray-600">Stores per-user information</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Wallet address</li>
                  <li>• GitHub username (mapped)</li>
                  <li>• Score (from PR analysis)</li>
                  <li>• Claimed status</li>
                  <li>• Reward amount (calculated)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Backend Section */}
        <section id="backend" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
            <Zap className="w-8 h-8 text-orange-500" />
            <span>Backend GitHub Sync</span>
          </h2>
          <Card className="border-2 border-green-100 bg-green-50">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Scheduled to run once per campaign, at or after the deadline</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Pulls all PRs from target repository via GitHub API</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Classifies and scores based on the scoring model</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Pushes total contributor scores on-chain via update_score instruction
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Technology Stack Section */}
        <section id="tech-stack" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
            <Settings className="w-8 h-8 text-orange-500" />
            <span>Technology Stack</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="text-purple-800">Blockchain & Smart Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-purple-500" />
                    <span className="font-medium">Solana Program:</span>
                    <span className="text-gray-600">Anchor (Rust)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-purple-500" />
                    <span className="font-medium">Token:</span>
                    <span className="text-gray-600">USDC on Solana</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-800">Application Layer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Backend:</span>
                    <span className="text-gray-600">Node.js / Express</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Frontend:</span>
                    <span className="text-gray-600">React + TailwindCSS</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Milestone Plan Section */}
        <section id="milestones" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-orange-500" />
            <span>Milestone Plan</span>
          </h2>
          <div className="space-y-4">
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Aug 7–10</h3>
                  <Badge variant="outline" className="border-orange-200 text-orange-600 bg-orange-50">
                    Smart Contract
                  </Badge>
                </div>
                <p className="text-gray-600">Finalize Solana smart contract development and testing</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Aug 11–12</h3>
                  <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50">
                    Backend
                  </Badge>
                </div>
                <p className="text-gray-600">Backend GitHub sync integration and API development</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Aug 13–14</h3>
                  <Badge variant="outline" className="border-green-200 text-green-600 bg-green-50">
                    Frontend & Testing
                  </Badge>
                </div>
                <p className="text-gray-600">Frontend development and end-to-end testing</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 bg-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-purple-900">Aug 15</h3>
                  <Badge className="bg-purple-100 text-purple-800">Launch</Badge>
                </div>
                <p className="text-purple-700 font-medium">PoC MVP Launch</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contributors Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
            <User className="w-8 h-8 text-orange-500" />
            <span>Contributors</span>
          </h2>
          <Card className="border-2 border-orange-100 bg-orange-50">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Lead Developer</h3>
                <p className="text-lg text-gray-700 mb-4">Emmanuel Adebayo Abimbola</p>
                <div className="flex items-center justify-center space-x-6">
                  <a
                    href="https://github.com/neocryptoquant"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://twitter.com/eurojohnson1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Twitter</span>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Disclaimer */}
        <Card className="border-2 border-yellow-200 bg-yellow-50 mb-16">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-yellow-800 mb-4">Disclaimer</h3>
            <p className="text-yellow-700">
              This PoC is designed for experimental and demonstration purposes. Security, scalability, and
              multi-campaign handling are deferred for future versions.
            </p>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-orange-50 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Launch your first campaign and experience the future of fair contribution rewards.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                Launch Campaign
              </Button>
            </Link>
            <a href="https://github.com/neocryptoquant" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 bg-transparent"
              >
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
