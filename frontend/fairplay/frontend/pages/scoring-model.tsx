import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Users, DollarSign } from "lucide-react"
import Link from "next/link"

const ScoringModelPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">FP</span>
              </div>
              <span className="font-bold text-lg text-gray-900">Fairplay Protocol</span>
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Scoring <span className="text-orange-500">Model</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our transparent and fair scoring system ensures contributors are rewarded based on the quality and impact of
            their contributions.
          </p>
        </div>

        {/* Scoring Rules */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <CardTitle className="text-green-800">Merged PR</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">100 pts</div>
              <CardDescription className="text-green-700">
                Pull requests that are successfully merged into the main branch receive full points.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                <CardTitle className="text-yellow-800">Reviewed PR</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600 mb-2">20 pts</div>
              <CardDescription className="text-yellow-700">
                Unmerged PRs that show genuine effort and receive meaningful reviews.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <XCircle className="w-6 h-6 text-red-600" />
                <CardTitle className="text-red-800">Spam/Invalid</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-2">0 pts</div>
              <CardDescription className="text-red-700">
                Low-quality, spam, or invalid pull requests receive no points.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Reward Calculation */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <span>Reward Calculation Formula</span>
            </CardTitle>
            <CardDescription>How individual rewards are calculated from the total reward pool</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono text-sm overflow-x-auto mb-6">
              <div className="mb-2">{"// Pseudocode for reward calculation"}</div>
              <div className="mb-2">{"function calculateRewards(contributors, totalRewardPool) {"}</div>
              <div className="ml-4 mb-2">{"  totalScore = sum(contributors.map(c => c.score))"}</div>
              <div className="ml-4 mb-2">{"  contributors.forEach(contributor => {"}</div>
              <div className="ml-8 mb-2">{"    percentage = contributor.score / totalScore"}</div>
              <div className="ml-8 mb-2">{"    contributor.reward = percentage * totalRewardPool"}</div>
              <div className="ml-4 mb-2">{"  })"}</div>
              <div className="mb-2">{"  return contributors"}</div>
              <div>{"}"}</div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Key Principles:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start space-x-2">
                    <Badge variant="outline" className="mt-0.5">
                      1
                    </Badge>
                    <span>Proportional distribution based on contribution scores</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Badge variant="outline" className="mt-0.5">
                      2
                    </Badge>
                    <span>Quality over quantity - merged PRs are heavily weighted</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Badge variant="outline" className="mt-0.5">
                      3
                    </Badge>
                    <span>Effort recognition - reviewed PRs still earn points</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Example Calculation:</h4>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <div className="mb-2">
                    <strong>Total Pool:</strong> 1000 USDC
                  </div>
                  <div className="mb-2">
                    <strong>Contributor A:</strong> 200 pts (2 merged PRs)
                  </div>
                  <div className="mb-2">
                    <strong>Contributor B:</strong> 120 pts (1 merged + 1 reviewed)
                  </div>
                  <div className="mb-2">
                    <strong>Total Score:</strong> 320 pts
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div>
                      <strong>A gets:</strong> (200/320) × 1000 = 625 USDC
                    </div>
                    <div>
                      <strong>B gets:</strong> (120/320) × 1000 = 375 USDC
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Preview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">Fair</div>
              <div className="text-gray-600">Transparent scoring for all contributors</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">Incentivized</div>
              <div className="text-gray-600">Quality contributions earn more rewards</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">Automated</div>
              <div className="text-gray-600">On-chain distribution via smart contracts</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ScoringModelPage
