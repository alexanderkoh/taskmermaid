'use client'

import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/Sidebar'
import DiagramDisplay from '@/components/DiagramDisplay'
import { taskListToMermaid } from '@/utils/mermaidUtils'

export default function Home() {
  const [taskList, setTaskList] = useState<string>('')
  const [mermaidCode, setMermaidCode] = useState<string>('')
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const diagramRef = useRef<HTMLDivElement>(null)

  // Load state from sessionStorage on mount
  useEffect(() => {
    setMounted(true)
    
    // Load theme
    const savedTheme = sessionStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }

    // Load sidebar state
    const savedSidebarState = sessionStorage.getItem('sidebarOpen')
    if (savedSidebarState !== null) {
      setIsSidebarOpen(savedSidebarState === 'true')
    }

    // Load task list
    const savedTaskList = sessionStorage.getItem('taskList')
    if (savedTaskList) {
      setTaskList(savedTaskList)
    }
  }, [])

  // Save theme to sessionStorage when it changes
  useEffect(() => {
    if (mounted) {
      sessionStorage.setItem('theme', theme)
    }
  }, [theme, mounted])

  // Save sidebar state to sessionStorage when it changes
  useEffect(() => {
    if (mounted) {
      sessionStorage.setItem('sidebarOpen', String(isSidebarOpen))
    }
  }, [isSidebarOpen, mounted])

  // Save task list to sessionStorage when it changes
  useEffect(() => {
    if (mounted) {
      sessionStorage.setItem('taskList', taskList)
    }
  }, [taskList, mounted])

  useEffect(() => {
    setMermaidCode(taskListToMermaid(taskList))
  }, [taskList])

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  if (!mounted) {
    return null
  }

  return (
    <div data-theme={theme} className="min-h-screen bg-base-100">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 btn btn-circle btn-primary"
      >
        {isSidebarOpen ? '×' : '☰'}
      </button>

      <div className="flex flex-col lg:flex-row min-h-screen relative">
        {/* Sidebar */}
        <div className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:relative
          w-full lg:w-1/3
          h-screen
          z-40
          transition-transform duration-300 ease-in-out
          lg:transition-none
          lg:transform-none
        `}>
          <Sidebar 
            taskList={taskList} 
            setTaskList={setTaskList}
            currentTheme={theme}
            onThemeChange={handleThemeChange}
            isEmpty={!taskList.trim()}
            diagramRef={diagramRef}
          />
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className={`
          flex-1
          lg:ml-0
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'lg:ml-1/3' : 'ml-0'}
        `}>
          <DiagramDisplay 
            ref={diagramRef}
            mermaidCode={mermaidCode}
            currentTheme={theme}
          />
        </div>
      </div>
    </div>
  )
}
