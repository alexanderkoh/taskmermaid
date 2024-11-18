export function taskListToMermaid(taskList: string): string {
  if (!taskList.trim()) {
    return 'mindmap\n  root((No tasks yet))'
  }

  const lines = taskList.split('\n')
  let mermaidCode = 'mindmap\n'
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim()
    if (!trimmedLine || !trimmedLine.startsWith('-')) return

    const indent = line.search(/\S/)
    let text = trimmedLine.substring(1).trim()
    const spaces = '  '.repeat(Math.floor(indent / 2) + 1)

    // Check if text is marked as completed (wrapped in ~~)
    if (text.startsWith('~~') && text.endsWith('~~')) {
      // For completed tasks, add the strikethrough character to each character
      text = text.slice(2, -2).split('').join('\u0336') + '\u0336'
    }

    // Root level (Project)
    if (indent === 0) {
      mermaidCode += `  root((${text}))\n`
      return
    }

    // For tasks and subtasks
    mermaidCode += `${spaces}${text}\n`
  })

  return mermaidCode
} 