export function taskListToMermaid(taskList: string): string {
  if (!taskList.trim()) {
    return 'mindmap\n  root((No tasks yet))'
  }

  const lines = taskList.split('\n')
  let mermaidCode = 'mindmap\n'
  
  // First line should be the project name (root)
  const firstLine = lines[0]?.trim()
  if (!firstLine?.startsWith('-')) {
    return 'mindmap\n  root((No project selected))'
  }

  // Set project name as root
  const projectName = firstLine.substring(1).trim()
  mermaidCode += `  root((${projectName}))\n`

  // Process tasks and subtasks, connecting them to root
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue

    const indent = line.search(/\S/)
    let text = line.trim().substring(1).trim() // Remove the leading dash

    // Check if task is completed
    if (text.startsWith('~~') && text.endsWith('~~')) {
      text = text.slice(2, -2).split('').join('\u0336') + '\u0336'
    }

    // For parent tasks (indent = 2)
    if (indent === 2) {
      mermaidCode += `    ${text}\n`
    }
    // For child tasks (indent = 4)
    else if (indent === 4) {
      mermaidCode += `      ${text}\n`
    }
  }

  return mermaidCode
} 