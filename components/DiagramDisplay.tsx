'use client'

import React, { useEffect, forwardRef, useState } from 'react'

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

  // Simplified theme mapping based on DaisyUI themes
  const getMermaidTheme = (theme: string) => {
    switch (theme) {
      case 'dark':
      case 'halloween':
      case 'forest':
      case 'black':
      case 'luxury':
      case 'dracula':
      case 'night':
      case 'coffee':
        return 'dark'
      case 'cupcake':
      case 'valentine':
      case 'pastel':
        return 'default'
      case 'synthwave':
      case 'cyberpunk':
        return 'dark'
      default:
        return 'default'
    }
  }

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
        const { default: mermaid } = await import('mermaid')
        
        mermaid.initialize({
          startOnLoad: false,
          theme: getMermaidTheme(currentTheme),
          securityLevel: 'loose',
          mindmap: {
            padding: 20,
            useMaxWidth: true,
          }
        })

        const { svg } = await mermaid.render('mermaid-diagram', mermaidCode)
        
        if (ref.current) {
          ref.current.innerHTML = svg
          setError(null)
          setIsEmpty(false)

          // Apply basic theme-specific background
          const svgElement = ref.current.querySelector('svg')
          if (svgElement) {
            svgElement.style.background = 'transparent'
          }
        }
      } catch (err) {
        console.error('Failed to render diagram:', err)
        setError('Failed to render diagram. Please check your task format.')
      }
    }

    renderDiagram()
  }, [mermaidCode, currentTheme, ref])

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