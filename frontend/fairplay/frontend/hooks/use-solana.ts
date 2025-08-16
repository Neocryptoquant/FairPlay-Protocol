"use client"

import { useState, useEffect, useCallback } from "react"
import { Connection, clusterApiUrl } from "@solana/web3.js"
import { SolanaProgram, type CampaignData } from "../lib/solana-program"

const connection = new Connection(clusterApiUrl("devnet"))

export function useSolana() {
  const [wallet, setWallet] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<string>("")
  const [program, setProgram] = useState<SolanaProgram | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { solana } = window as any
      if (solana?.isPhantom) {
        setWallet(solana)
        checkConnection(solana)
      }
    }
  }, [])

  const checkConnection = async (solanaWallet: any) => {
    try {
      if (solanaWallet.isConnected) {
        const response = await solanaWallet.connect({ onlyIfTrusted: true })
        setPublicKey(response.publicKey.toString())
        setIsConnected(true)
        setProgram(new SolanaProgram(connection, solanaWallet))
      }
    } catch (error) {
      console.log("Wallet not connected")
    }
  }

  const connectWallet = useCallback(async () => {
    if (!wallet) return false

    try {
      const response = await wallet.connect()
      setPublicKey(response.publicKey.toString())
      setIsConnected(true)
      setProgram(new SolanaProgram(connection, wallet))
      return true
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      return false
    }
  }, [wallet])

  const disconnectWallet = useCallback(async () => {
    if (!wallet) return

    try {
      await wallet.disconnect()
      setIsConnected(false)
      setPublicKey("")
      setProgram(null)
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }, [wallet])

  const initializeCampaign = useCallback(
    async (campaignData: CampaignData) => {
      if (!program) throw new Error("Program not initialized")
      return await program.initializeCampaign(campaignData)
    },
    [program],
  )

  const depositToCampaign = useCallback(
    async (campaignId: string, amount: number) => {
      if (!program) throw new Error("Program not initialized")
      return await program.depositToCampaign(campaignId, amount)
    },
    [program],
  )

  const finalizeCampaign = useCallback(
    async (campaignId: string) => {
      if (!program) throw new Error("Program not initialized")
      return await program.finalizeCampaign(campaignId)
    },
    [program],
  )

  const isCampaignEnded = useCallback(
    async (campaignId: string) => {
      if (!program) return false
      return await program.isCampaignEnded(campaignId)
    },
    [program],
  )

  return {
    wallet,
    isConnected,
    publicKey,
    program,
    connectWallet,
    disconnectWallet,
    initializeCampaign,
    depositToCampaign,
    finalizeCampaign,
    isCampaignEnded,
  }
}
