export interface Theme {
  id: string
  name: string
  colors: {
    background: string
    sidebar: string
    text: string
    primary: string
    secondary: string
    accent: string
    border: string
    hover: string
    selected: string
    completed: string
  }
  mermaidConfig: {
    theme: string
    themeVariables: Record<string, string>
  }
}

export const themes: Theme[] = [
  {
    id: 'light',
    name: 'Light Theme',
    colors: {
      background: 'bg-neutral-50',
      sidebar: 'bg-white',
      text: 'text-neutral-900',
      primary: 'bg-indigo-600 hover:bg-indigo-700',
      secondary: 'bg-emerald-600 hover:bg-emerald-700',
      accent: 'bg-neutral-100',
      border: 'border-neutral-200',
      hover: 'hover:bg-neutral-100',
      selected: 'bg-indigo-50',
      completed: 'text-neutral-500'
    },
    mermaidConfig: {
      theme: 'neutral',
      themeVariables: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '16px',
        primaryColor: '#ffffff',
        primaryTextColor: '#171717',
        primaryBorderColor: '#4f46e5',
        lineColor: '#4f46e5',
        textColor: '#171717',
        mainBkg: '#ffffff',
        nodeBorder: '#4f46e5',
        clusterBkg: '#ffffff',
        titleColor: '#171717',
        edgeLabelBackground: '#ffffff'
      }
    }
  },
  {
    id: 'dark',
    name: 'Dark Theme',
    colors: {
      background: 'bg-slate-900',
      sidebar: 'bg-slate-800',
      text: 'text-slate-100',
      primary: 'bg-blue-500 hover:bg-blue-600',
      secondary: 'bg-emerald-500 hover:bg-emerald-600',
      accent: 'bg-slate-700',
      border: 'border-slate-700',
      hover: 'hover:bg-slate-700',
      selected: 'bg-slate-600',
      completed: 'text-slate-400'
    },
    mermaidConfig: {
      theme: 'dark',
      themeVariables: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '16px',
        primaryColor: '#1e293b',
        primaryTextColor: '#f1f5f9',
        primaryBorderColor: '#3b82f6',
        lineColor: '#3b82f6',
        textColor: '#f1f5f9',
        mainBkg: '#0f172a',
        nodeBorder: '#3b82f6',
        clusterBkg: '#1e293b',
        titleColor: '#f1f5f9',
        edgeLabelBackground: '#1e293b'
      }
    }
  },
  {
    id: 'blue',
    name: 'Blue Theme',
    colors: {
      background: 'bg-blue-50',
      sidebar: 'bg-white',
      text: 'text-blue-950',
      primary: 'bg-blue-600 hover:bg-blue-700',
      secondary: 'bg-sky-500 hover:bg-sky-600',
      accent: 'bg-blue-100',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-50',
      selected: 'bg-blue-100',
      completed: 'text-blue-300'
    },
    mermaidConfig: {
      theme: 'neutral',
      themeVariables: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '16px',
        primaryColor: '#ffffff',
        primaryTextColor: '#172554',
        primaryBorderColor: '#2563eb',
        lineColor: '#2563eb',
        textColor: '#172554',
        mainBkg: '#eff6ff',
        nodeBorder: '#2563eb',
        clusterBkg: '#ffffff',
        titleColor: '#172554',
        edgeLabelBackground: '#ffffff'
      }
    }
  },
  {
    id: 'pink',
    name: 'Pastel Pink',
    colors: {
      background: 'bg-pink-50',
      sidebar: 'bg-white',
      text: 'text-pink-950',
      primary: 'bg-pink-400 hover:bg-pink-500',
      secondary: 'bg-rose-400 hover:bg-rose-500',
      accent: 'bg-pink-100',
      border: 'border-pink-200',
      hover: 'hover:bg-pink-50',
      selected: 'bg-pink-100',
      completed: 'text-pink-300'
    },
    mermaidConfig: {
      theme: 'neutral',
      themeVariables: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '16px',
        primaryColor: '#ffffff',
        primaryTextColor: '#831843',
        primaryBorderColor: '#f472b6',
        lineColor: '#f472b6',
        textColor: '#831843',
        mainBkg: '#fdf2f8',
        nodeBorder: '#f472b6',
        clusterBkg: '#ffffff',
        titleColor: '#831843',
        edgeLabelBackground: '#ffffff'
      }
    }
  }
]

export const getTheme = (themeId: string): Theme => {
  return themes.find(theme => theme.id === themeId) || themes[0]
} 