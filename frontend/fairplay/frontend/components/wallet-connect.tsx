"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"

interface WalletConnectProps {
  onConnect?: (publicKey: string) => void
  onDisconnect?: () => void
}

export function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    try {
      const { solana } = window as any
      if (solana?.isPhantom && solana.isConnected) {
        const response = await solana.connect({ onlyIfTrusted: true })
        setPublicKey(response.publicKey.toString())
        setIsConnected(true)
        onConnect?.(response.publicKey.toString())
      }
    } catch (error) {
      console.log("Wallet not connected")
    }
  }

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      const { solana } = window as any
      if (!solana?.isPhantom) {
        alert("Please install Phantom wallet!")
        window.open("https://phantom.app/", "_blank")
        return
      }

      const response = await solana.connect()
      setPublicKey(response.publicKey.toString())
      setIsConnected(true)
      onConnect?.(response.publicKey.toString())
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      alert("Failed to connect wallet. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = async () => {
    try {
      const { solana } = window as any
      if (solana?.isPhantom) {
        await solana.disconnect()
      }
      setIsConnected(false)
      setPublicKey("")
      onDisconnect?.()
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-600">
          {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
        </div>
        <Button variant="ghost" size="sm" onClick={disconnectWallet} className="text-gray-600 hover:text-gray-900">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={connectWallet} disabled={isConnecting} className="bg-orange-500 hover:bg-orange-600 text-white">
      <Wallet className="w-4 h-4 mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
