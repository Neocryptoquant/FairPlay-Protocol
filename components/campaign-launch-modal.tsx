"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GitBranch, DollarSign, Calendar, Shield, Info, CheckCircle, AlertCircle, Rocket, Key } from "lucide-react"

interface CampaignLaunchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLaunch: (campaignData: CampaignData) => void
}

export interface CampaignData {
  name: string
  description: string
  gitRepoUrl: string
  rewardAmount: number
  duration: number
  gitApiToken?: string
}

interface FormErrors {
  name?: string
  description?: string
  gitRepoUrl?: string
  rewardAmount?: string
  duration?: string
}

export function CampaignLaunchModal({ open, onOpenChange, onLaunch }: CampaignLaunchModalProps) {
  const [formData, setFormData] = useState<CampaignData>({
    name: "",
    description: "",
    gitRepoUrl: "",
    rewardAmount: 0,
    duration: 7,
    gitApiToken: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [step, setStep] = useState(1)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Campaign name is required"
    } else if (formData.name.length < 3) {
      newErrors.name = "Campaign name must be at least 3 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    if (!formData.gitRepoUrl.trim()) {
      newErrors.gitRepoUrl = "GitHub repository URL is required"
    } else if (!formData.gitRepoUrl.match(/^https:\/\/github\.com\/[\w\-.]+\/[\w\-.]+$/)) {
      newErrors.gitRepoUrl = "Please enter a valid GitHub repository URL"
    }

    if (!formData.rewardAmount || formData.rewardAmount <= 0) {
      newErrors.rewardAmount = "Reward amount must be greater than 0"
    } else if (formData.rewardAmount < 10) {
      newErrors.rewardAmount = "Minimum reward pool is 10 USDC"
    }

    if (!formData.duration || formData.duration < 1) {
      newErrors.duration = "Duration must be at least 1 day"
    } else if (formData.duration > 365) {
      newErrors.duration = "Duration cannot exceed 365 days"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await onLaunch(formData)
      onOpenChange(false)
      // Reset form
      setFormData({
        name: "",
        description: "",
        gitRepoUrl: "",
        rewardAmount: 0,
        duration: 7,
        gitApiToken: "",
      })
      setStep(1)
      setErrors({})
    } catch (error) {
      console.error("Failed to launch campaign:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (step === 1) {
      // Validate basic info before proceeding
      const basicErrors: FormErrors = {}
      if (!formData.name.trim()) basicErrors.name = "Campaign name is required"
      if (!formData.description.trim()) basicErrors.description = "Description is required"

      if (Object.keys(basicErrors).length === 0) {
        setErrors({})
        setStep(2)
      } else {
        setErrors(basicErrors)
      }
    }
  }

  const prevStep = () => {
    setStep(1)
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Rocket className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Launch New Campaign</DialogTitle>
              <DialogDescription className="text-base">
                Create a fair reward distribution campaign on Solana
              </DialogDescription>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 1 ? "text-orange-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"
                }`}
              >
                1
              </div>
              <span className="text-sm font-medium">Basic Info</span>
            </div>
            <div className={`w-8 h-0.5 ${step >= 2 ? "bg-orange-200" : "bg-gray-200"}`}></div>
            <div className={`flex items-center space-x-2 ${step >= 2 ? "text-orange-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"
                }`}
              >
                2
              </div>
              <span className="text-sm font-medium">Configuration</span>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              {/* Campaign Overview */}
              <Card className="border-orange-100">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Info className="w-5 h-5 text-orange-500" />
                    <span>Campaign Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Campaign Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Summer Hackathon 2025"
                      className={errors.name ? "border-red-300 focus:border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your campaign goals, contribution requirements, and what contributors should focus on..."
                      rows={4}
                      className={errors.description ? "border-red-300 focus:border-red-500" : ""}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.description}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-500">This will be visible to all potential contributors</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="button" onClick={nextStep} className="bg-orange-500 hover:bg-orange-600">
                  Continue to Configuration
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Repository Configuration */}
              <Card className="border-blue-100">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <GitBranch className="w-5 h-5 text-blue-500" />
                    <span>Repository Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gitRepoUrl" className="text-sm font-medium">
                      GitHub Repository URL *
                    </Label>
                    <Input
                      id="gitRepoUrl"
                      type="url"
                      value={formData.gitRepoUrl}
                      onChange={(e) => setFormData({ ...formData, gitRepoUrl: e.target.value })}
                      placeholder="https://github.com/username/repository"
                      className={errors.gitRepoUrl ? "border-red-300 focus:border-red-500" : ""}
                    />
                    {errors.gitRepoUrl && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.gitRepoUrl}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      All pull requests to this repository will be tracked and scored
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gitApiToken" className="text-sm font-medium flex items-center space-x-2">
                      <Key className="w-4 h-4" />
                      <span>GitHub API Token (Optional)</span>
                    </Label>
                    <Input
                      id="gitApiToken"
                      type="password"
                      value={formData.gitApiToken}
                      onChange={(e) => setFormData({ ...formData, gitApiToken: e.target.value })}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    />
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Required for private repositories or to avoid GitHub API rate limits.
                        <a
                          href="https://github.com/settings/tokens"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:text-orange-700 ml-1"
                        >
                          Generate token →
                        </a>
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>

              {/* Reward Configuration */}
              <Card className="border-green-100">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <span>Reward Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rewardAmount" className="text-sm font-medium">
                        Total Reward Pool (USDC) *
                      </Label>
                      <Input
                        id="rewardAmount"
                        type="number"
                        min="10"
                        step="0.01"
                        value={formData.rewardAmount || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, rewardAmount: Number.parseFloat(e.target.value) || 0 })
                        }
                        placeholder="1000"
                        className={errors.rewardAmount ? "border-red-300 focus:border-red-500" : ""}
                      />
                      {errors.rewardAmount && (
                        <p className="text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.rewardAmount}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-sm font-medium flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Duration (days) *</span>
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        max="365"
                        value={formData.duration || ""}
                        onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) || 7 })}
                        className={errors.duration ? "border-red-300 focus:border-red-500" : ""}
                      />
                      {errors.duration && (
                        <p className="text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.duration}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Funds will be locked in a Solana smart contract escrow until campaign completion. Rewards are
                      distributed automatically based on contribution scores.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Campaign Summary */}
              <Card className="border-orange-100 bg-orange-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <CheckCircle className="w-5 h-5 text-orange-500" />
                    <span>Campaign Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Campaign:</span>
                      <p className="font-medium">{formData.name || "Untitled Campaign"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Repository:</span>
                      <p className="font-medium truncate">{formData.gitRepoUrl || "Not specified"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Reward Pool:</span>
                      <p className="font-medium">{formData.rewardAmount || 0} USDC</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <p className="font-medium">{formData.duration || 0} days</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-orange-200">
                    <div className="flex items-center space-x-2 text-sm text-orange-700">
                      <Info className="w-4 h-4" />
                      <span>Campaign will start immediately after blockchain confirmation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={prevStep} disabled={isLoading}>
                  Back to Basic Info
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 min-w-[140px]">
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Launching...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Rocket className="w-4 h-4" />
                      <span>Launch Campaign</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
