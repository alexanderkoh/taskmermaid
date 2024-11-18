'use client'

interface ExportDiagramProps {
  isEmpty: boolean
  svgRef: React.RefObject<HTMLDivElement>
}

const ExportDiagram: React.FC<ExportDiagramProps> = ({ isEmpty, svgRef }) => {
  const exportToPNG = async () => {
    if (!svgRef.current) return

    try {
      const svgElement = svgRef.current.querySelector('svg')
      if (!svgElement) return

      // Get original SVG dimensions
      const svgWidth = svgElement.viewBox.baseVal.width || svgElement.clientWidth
      const svgHeight = svgElement.viewBox.baseVal.height || svgElement.clientHeight

      // Create a canvas with 16:9 aspect ratio
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set dimensions for 16:9 ratio at 1920x1080 resolution
      canvas.width = 1920
      canvas.height = 1080

      // Calculate scaling to fit the diagram while maintaining aspect ratio
      const scale = Math.min(
        (canvas.width * 0.8) / svgWidth,  // Leave 20% margin
        (canvas.height * 0.8) / svgHeight
      )

      // Calculate centered position
      const xOffset = (canvas.width - (svgWidth * scale)) / 2
      const yOffset = (canvas.height - (svgHeight * scale)) / 2

      // Create an image from the SVG with high resolution
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)

      const img = new Image()
      img.onload = () => {
        // Fill canvas with white background
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Enable high-quality scaling
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Draw the image centered and scaled
        ctx.drawImage(
          img,
          xOffset,
          yOffset,
          svgWidth * scale,
          svgHeight * scale
        )

        // Add a subtle border
        ctx.strokeStyle = '#e5e7eb'
        ctx.lineWidth = 2
        ctx.strokeRect(0, 0, canvas.width, canvas.height)

        // Convert to high-quality PNG
        const pngUrl = canvas.toDataURL('image/png', 1.0)
        const downloadLink = document.createElement('a')
        downloadLink.href = pngUrl
        downloadLink.download = 'mindmap.png'
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        URL.revokeObjectURL(url)
      }

      img.src = url
    } catch (err) {
      console.error('Failed to export diagram:', err)
    }
  }

  return (
    <div className="border-t border-base-300 pt-4 mt-4">
      <h3 className="text-base-content font-semibold mb-2">Export Options</h3>
      <button
        onClick={exportToPNG}
        disabled={isEmpty}
        className={`btn btn-primary btn-sm w-full ${isEmpty ? 'btn-disabled' : ''}`}
        title="Export as PNG"
      >
        Export as PNG (1920×1080)
      </button>
    </div>
  )
}

export default ExportDiagram 