"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, DollarSign, Users } from "lucide-react"

interface CampaignFinalizeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFinalize: () => void
  campaignStats?: {
    totalContributors: number
    totalRewards: number
    totalPRs: number
  }
}

export function CampaignFinalizeModal({
  open,
  onOpenChange,
  onFinalize,
  campaignStats = { totalContributors: 0, totalRewards: 0, totalPRs: 0 },
}: CampaignFinalizeModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleFinalize = async () => {
    setIsLoading(true)

    try {
      await onFinalize()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to finalize campaign:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Finalize Campaign</DialogTitle>
          <DialogDescription>
            End the campaign and distribute rewards to contributors based on their scores.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Campaign Stats */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900">Campaign Summary</h4>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Contributors</span>
              </div>
              <Badge variant="secondary">{campaignStats.totalContributors}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Total PRs</span>
              </div>
              <Badge variant="secondary">{campaignStats.totalPRs}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Rewards to Distribute</span>
              </div>
              <Badge className="bg-orange-500">{campaignStats.totalRewards} USDC</Badge>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              <strong>Warning:</strong> This action cannot be undone. All rewards will be distributed to contributors
              based on their contribution scores.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleFinalize} disabled={isLoading} className="bg-red-500 hover:bg-red-600">
              {isLoading ? "Finalizing..." : "Finalize Campaign"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
