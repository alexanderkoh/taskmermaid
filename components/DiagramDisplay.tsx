'use client'

import React, { useEffect, forwardRef, useState } from 'react'
import mermaid from 'mermaid'

interface DiagramDisplayProps {
  mermaidCode: string
  currentTheme: string
}

const DiagramDisplay = forwardRef<HTMLDivElement, DiagramDisplayProps>(({ 
  mermaidCode, 
  currentTheme
}, ref) => {
  const [error, setError] = useState<string | null>(null)
  const [isEmpty, setIsEmpty] = useState(true)

  // Initialize mermaid once
  useEffect(() => {
    try {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        mindmap: {
          padding: 100,
          useMaxWidth: false,
        }
      })
    } catch (err) {
      console.error('Mermaid initialization error:', err)
    }
  }, [])

  // Render diagram whenever code changes
  useEffect(() => {
    const renderDiagram = async () => {
      if (!ref || !('current' in ref) || !ref.current) return
      
      if (!mermaidCode || mermaidCode === 'mindmap\n  root((No tasks yet))') {
        setIsEmpty(true)
        setError(null)
        ref.current.innerHTML = '<div class="text-base-content">Diagram is empty</div>'
        return
      }

      try {
        // Clear previous content
        ref.current.innerHTML = `<div class="mermaid">${mermaidCode}</div>`
        
        // Get the mermaid element
        const mermaidElement = ref.current.querySelector('.mermaid')
        if (!mermaidElement) {
          throw new Error('Mermaid element not found')
        }

        // Render new diagram
        await mermaid.run({
          nodes: [mermaidElement as HTMLElement]
        })

        setIsEmpty(false)
        setError(null)

        // Store the mermaid code for export
        const svgElement = ref.current.querySelector('svg')
        if (svgElement) {
          svgElement.setAttribute('data-processed', mermaidCode)
          svgElement.style.maxWidth = '100%'
          svgElement.style.height = 'auto'
        }
      } catch (err) {
        console.error('Failed to render diagram:', err)
        setError('Failed to render diagram. Please check your task format.')
      }
    }

    renderDiagram()
  }, [mermaidCode, ref])

  return (
    <div className="flex-1 p-4 lg:p-8 overflow-auto bg-base-100 min-h-screen">
      {error && (
        <div className="mb-4 p-4 bg-error/20 rounded text-error">
          {error}
        </div>
      )}
      <div 
        ref={ref}
        className={`w-full h-full flex items-center justify-center text-base-content ${
          isEmpty ? 'text-lg font-medium' : ''
        }`} 
      />
    </div>
  )
})

DiagramDisplay.displayName = 'DiagramDisplay'

export default DiagramDisplay 