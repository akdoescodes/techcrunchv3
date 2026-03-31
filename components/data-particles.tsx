"use client"

import { useEffect, useRef } from "react"

export default function DataParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Data node class
    class DataNode {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      pulseSpeed: number
      pulseSize: number
      dataValue: string
      showValue: boolean

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 2
        this.speedX = (Math.random() - 0.5) * 1.5
        this.speedY = (Math.random() - 0.5) * 1.5

        // Data science theme colors
        const colors = [
          "rgba(147, 51, 234, 0.7)", // Purple
          "rgba(79, 70, 229, 0.7)", // Indigo
          "rgba(59, 130, 246, 0.7)", // Blue
          "rgba(236, 72, 153, 0.7)", // Pink
        ]

        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.pulseSpeed = 0.05 + Math.random() * 0.05
        this.pulseSize = 0

        // Data values for data science theme
        const dataValues = ["01", "10", "ML", "AI", "py", "df", "{}", "[]", "()", "<>", "NaN", "SQL", "API"]
        this.dataValue = dataValues[Math.floor(Math.random() * dataValues.length)]
        this.showValue = Math.random() > 0.7 // Only some nodes show values
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.pulseSize = Math.sin(Date.now() * this.pulseSpeed * 0.01) * 2

        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width

        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return

        // Draw node
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size + this.pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()

        // Draw data value for some nodes
        if (this.showValue) {
          ctx.font = "10px monospace"
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
          ctx.fillText(this.dataValue, this.x + this.size + 5, this.y + 3)
        }
      }
    }

    // Create data nodes
    const nodes: DataNode[] = []
    const numberOfNodes = Math.min(120, Math.floor(window.innerWidth / 15))

    for (let i = 0; i < numberOfNodes; i++) {
      nodes.push(new DataNode())
    }

    // Binary code background effect
    class BinaryStream {
      x: number
      y: number
      speed: number
      fontSize: number
      length: number
      characters: string[]

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = 0
        this.speed = 1 + Math.random() * 3
        this.fontSize = 10 + Math.random() * 6
        this.length = 10 + Math.floor(Math.random() * 20)
        this.characters = []

        for (let i = 0; i < this.length; i++) {
          this.characters.push(Math.random() > 0.5 ? "1" : "0")
        }
      }

      update() {
        this.y += this.speed

        if (this.y > canvas.height) {
          this.y = 0
          this.x = Math.random() * canvas.width
        }

        // Randomly change characters
        if (Math.random() > 0.95) {
          const index = Math.floor(Math.random() * this.characters.length)
          this.characters[index] = Math.random() > 0.5 ? "1" : "0"
        }
      }

      draw() {
        if (!ctx) return

        ctx.font = `${this.fontSize}px monospace`

        for (let i = 0; i < this.characters.length; i++) {
          const alpha = 1 - i / this.characters.length
          ctx.fillStyle = `rgba(147, 51, 234, ${alpha * 0.3})`
          ctx.fillText(this.characters[i], this.x, this.y - i * this.fontSize)
        }
      }
    }

    // Create binary streams
    const streams: BinaryStream[] = []
    const numberOfStreams = Math.min(30, Math.floor(window.innerWidth / 50))

    for (let i = 0; i < numberOfStreams; i++) {
      streams.push(new BinaryStream())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw binary streams first (background)
      for (let i = 0; i < streams.length; i++) {
        streams[i].update()
        streams[i].draw()
      }

      // Draw nodes and connections
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update()
        nodes[i].draw()

        // Connect nodes with lines
        for (let j = i; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(147, 51, 234, ${0.15 - distance / 1000})`
            ctx.lineWidth = 0.5
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
}

