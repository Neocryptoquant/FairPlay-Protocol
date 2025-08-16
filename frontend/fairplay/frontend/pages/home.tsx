"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GitBranch, DollarSign, Eye } from "lucide-react"
import { CampaignLaunchModal, type CampaignData } from "../components/campaign-launch-modal"
import { CampaignFinalizeModal } from "../components/campaign-finalize-modal"
import { WalletConnect } from "../components/wallet-connect"
import { useSolana } from "../hooks/use-solana"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const [launchModalOpen, setLaunchModalOpen] = useState(false)
  const [finalizeModalOpen, setFinalizeModalOpen] = useState(false)
  const [currentCampaignId, setCurrentCampaignId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { isConnected, publicKey, initializeCampaign, depositToCampaign, finalizeCampaign, isCampaignEnded } =
    useSolana()

  const handleLaunchCampaign = async (campaignData: CampaignData) => {
    if (!isConnected) {
      alert("Please connect your wallet first!")
      return
    }

    setIsLoading(true)
    try {
      console.log("[v0] Launching campaign with data:", campaignData)

      const campaignId = await initializeCampaign(campaignData)
      console.log("[v0] Campaign initialized with ID:", campaignId)

      await depositToCampaign(campaignId, campaignData.rewardAmount)
      console.log("[v0] Initial deposit completed")

      setCurrentCampaignId(campaignId)
      alert(`Campaign launched successfully! ID: ${campaignId}`)
    } catch (error) {
      console.error("Failed to launch campaign:", error)
      alert("Failed to launch campaign. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinalizeCampaign = async () => {
    if (!currentCampaignId) return

    setIsLoading(true)
    try {
      console.log("[v0] Finalizing campaign:", currentCampaignId)

      const hasEnded = await isCampaignEnded(currentCampaignId)
      if (!hasEnded) {
        alert("Campaign has not ended yet. Please wait until the duration expires.")
        return
      }

      await finalizeCampaign(currentCampaignId)
      console.log("[v0] Campaign finalized successfully")

      alert("Campaign finalized and rewards distributed!")
      setCurrentCampaignId(null)
    } catch (error) {
      console.error("Failed to finalize campaign:", error)
      alert("Failed to finalize campaign. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/fairplay-logo.png" alt="FairPlay Protocol" width={32} height={32} className="w-8 h-8" />
              <div>
                <h1 className="font-bold text-lg text-gray-900">Fairplay Protocol</h1>
                <p className="text-xs text-orange-500 font-medium">Play | Fair | Play</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900 font-medium">
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

            {/* Wallet Connect */}
            <div className="flex items-center space-x-3">
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto pt-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Fair Rewards for <span className="text-orange-500">GitHub</span>
            <br />
            Contributions
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            An on-chain reward distribution system that tracks GitHub Pull Requests and distributes USDC rewards fairly
            in hackathons and bounty campaigns.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 mb-20">
            {isConnected ? (
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
                onClick={() => setLaunchModalOpen(true)}
                disabled={isLoading}
              >
                {currentCampaignId ? "Manage Active Campaign" : "Launch Campaign"}
              </Button>
            ) : (
              <div className="text-gray-500 text-lg">Connect your wallet in the top right to launch campaigns</div>
            )}

            {/* Finalize Campaign Button */}
            {isConnected && currentCampaignId && (
              <Button
                variant="outline"
                size="lg"
                className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-3 bg-transparent"
                onClick={() => setFinalizeModalOpen(true)}
                disabled={isLoading}
              >
                Finalize Campaign
              </Button>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 pb-20">
          {/* GitHub Integration */}
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <GitBranch className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">GitHub Integration</h3>
            <p className="text-gray-600">Automatic PR tracking & scoring</p>
          </div>

          {/* USDC Rewards */}
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">USDC Rewards</h3>
            <p className="text-gray-600">Fair distribution on Solana</p>
          </div>

          {/* Transparent */}
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Eye className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparent</h3>
            <p className="text-gray-600">Open scoring & allocation</p>
          </div>
        </div>
      </main>

      {/* Campaign Launch Modal */}
      <CampaignLaunchModal open={launchModalOpen} onOpenChange={setLaunchModalOpen} onLaunch={handleLaunchCampaign} />

      {/* Campaign Finalize Modal */}
      <CampaignFinalizeModal
        open={finalizeModalOpen}
        onOpenChange={setFinalizeModalOpen}
        onFinalize={handleFinalizeCampaign}
        campaignStats={{
          totalContributors: 0,
          totalRewards: 0,
          totalPRs: 0,
        }}
      />
    </div>
  )
}
