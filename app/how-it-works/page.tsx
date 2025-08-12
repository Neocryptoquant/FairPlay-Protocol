import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, GitBranch, DollarSign, Users, Shield, Zap, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HowItWorksPage() {
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
              <Link href="/how-it-works" className="text-orange-500 font-medium">
                How it Works
              </Link>
              <Link href="/scoring-model" className="text-gray-600 hover:text-gray-900 font-medium">
                Scoring Model
              </Link>
              <Link href="/documentation" className="text-gray-600 hover:text-gray-900 font-medium">
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
            Revolutionary Fair Rewards
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            How <span className="text-orange-500">FairPlay</span> Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your hackathons and bounty campaigns with transparent, automated reward distribution based on
            actual GitHub contributions.
          </p>
        </div>

        {/* Problem Section */}
        <div className="mb-20">
          <div className="bg-gray-50 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">The Problem We Solve</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">For Campaign Organizers</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Manual tracking of contributions is time-consuming</li>
                  <li>• Subjective reward distribution leads to disputes</li>
                  <li>• Lack of transparency reduces participant trust</li>
                  <li>• Difficulty scaling to large contributor pools</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">For Contributors</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Uncertain if contributions will be fairly rewarded</li>
                  <li>• No real-time visibility into scoring</li>
                  <li>• Delayed or inconsistent reward distribution</li>
                  <li>• Limited proof of contribution value</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Solution Overview */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Solution: Automated Fair Rewards</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-orange-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">On-Chain Security</h3>
                <p className="text-gray-600">
                  Solana smart contracts ensure transparent, immutable reward distribution with USDC tokens.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Automated Tracking</h3>
                <p className="text-gray-600">
                  GitHub API integration automatically monitors and scores all pull requests in real-time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Fair Distribution</h3>
                <p className="text-gray-600">
                  Algorithmic scoring based on PR quality ensures contributors are rewarded proportionally.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works Process */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">The Process</h2>
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    1
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Launch Campaign</h3>
                </div>
                <p className="text-gray-600 text-lg mb-4">
                  Organizers create a campaign by setting the GitHub repository, reward pool in USDC, and campaign
                  duration. The smart contract locks the funds in escrow.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Set total reward pool (USDC)</li>
                  <li>• Define target GitHub repository</li>
                  <li>• Set campaign timeline</li>
                  <li>• Funds locked in smart contract</li>
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-orange-50 rounded-2xl p-8 text-center">
                  <Users className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <p className="text-orange-600 font-medium">Campaign Created</p>
                </div>
              </div>
            </div>

            <ArrowRight className="w-8 h-8 text-orange-500 mx-auto" />

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    2
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Contributors Join</h3>
                </div>
                <p className="text-gray-600 text-lg mb-4">
                  Developers connect their Solana wallets and link their GitHub accounts to participate. They can start
                  contributing immediately.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Connect Solana wallet</li>
                  <li>• Link GitHub account</li>
                  <li>• Register for campaign</li>
                  <li>• Start contributing to repository</li>
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-orange-50 rounded-2xl p-8 text-center">
                  <GitBranch className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <p className="text-orange-600 font-medium">Contributors Active</p>
                </div>
              </div>
            </div>

            <ArrowRight className="w-8 h-8 text-orange-500 mx-auto" />

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    3
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Automatic Tracking</h3>
                </div>
                <p className="text-gray-600 text-lg mb-4">
                  Our backend continuously monitors the repository via GitHub API, tracking all pull requests and
                  calculating scores based on merge status and quality.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Real-time PR monitoring</li>
                  <li>• Automatic quality scoring</li>
                  <li>• Transparent score updates</li>
                  <li>• No manual intervention needed</li>
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-orange-50 rounded-2xl p-8 text-center">
                  <Zap className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <p className="text-orange-600 font-medium">Tracking Active</p>
                </div>
              </div>
            </div>

            <ArrowRight className="w-8 h-8 text-orange-500 mx-auto" />

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    4
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Rewards Distributed</h3>
                </div>
                <p className="text-gray-600 text-lg mb-4">
                  When the campaign ends, final scores are calculated and USDC rewards are distributed proportionally to
                  all contributors based on their contribution quality.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Final score calculation</li>
                  <li>• Proportional reward distribution</li>
                  <li>• Instant USDC transfers</li>
                  <li>• Complete transparency</li>
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-orange-50 rounded-2xl p-8 text-center">
                  <DollarSign className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <p className="text-orange-600 font-medium">Rewards Distributed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose FairPlay?</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">For Organizers</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Zero Manual Work</h4>
                    <p className="text-gray-600">Fully automated tracking and distribution</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Complete Transparency</h4>
                    <p className="text-gray-600">All scores and distributions are publicly verifiable</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Scales Infinitely</h4>
                    <p className="text-gray-600">Handle thousands of contributors effortlessly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Instant Settlement</h4>
                    <p className="text-gray-600">USDC rewards distributed immediately</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">For Contributors</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Fair Rewards</h4>
                    <p className="text-gray-600">Algorithmic scoring ensures fair compensation</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-time Tracking</h4>
                    <p className="text-gray-600">See your score update with each contribution</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Guaranteed Payment</h4>
                    <p className="text-gray-600">Smart contracts ensure you get paid</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Build Reputation</h4>
                    <p className="text-gray-600">Verifiable contribution history on-chain</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-orange-50 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Launch Your First Campaign?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the revolution of fair, transparent, and automated reward distribution for open source contributions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                Launch Campaign Now
              </Button>
            </Link>
            <Link href="/documentation">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 bg-transparent"
              >
                Read Documentation
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
