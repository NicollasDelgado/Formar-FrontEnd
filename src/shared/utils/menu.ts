type UserRole = 'admin' | 'user'

interface MenuItem {
  label: string
  icon: string
  path: string
  allowedRoles?: UserRole[] // Se não definido, todos podem ver
}

interface MenuSection {
  title: string
  icon: string
  items: MenuItem[]
}

export const menu: MenuSection[] = [
  {
    title: 'Acesso Rápido',
    icon: 'bolt',
    items: [
      {
        label: 'Página Inicial',
        icon: 'home',
        path: '/home',
        // Sem allowedRoles = todos podem ver
      },
      {
        label: 'Análises',
        icon: 'equalizer',
        path: '/analytics',
        // Todos podem ver
      },
    ],
  },
  {
    title: 'Cadastros',
    icon: 'receipt_long',
    items: [
      {
        label: 'Veículos',
        icon: 'directions_car',
        path: '/vehicles',
        allowedRoles: ['admin'], // Apenas admin
      },
      {
        label: 'Usuários',
        icon: 'person',
        path: '/users',
        allowedRoles: ['admin'], // Apenas admin
      },
      {
        label: 'Novo Agendamento',
        icon: 'event',
        path: '/new-appointments',
        // Todos podem ver
      },
    ],
  },
  {
    title: 'Configurações',
    icon: 'build',
    items: [
      {
        label: 'Ajustes',
        icon: 'display_settings',
        path: '/configs',
        // Todos podem ver
      },
    ],
  },
]

// Função para filtrar o menu baseado no role do usuário
export function getFilteredMenu(userRole?: UserRole): MenuSection[] {
  if (!userRole) return []

  return menu
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        // Se não tem allowedRoles definido, todos podem ver
        if (!item.allowedRoles) return true
        // Verifica se o role do usuário está na lista permitida
        return item.allowedRoles.includes(userRole)
      }),
    }))
    .filter((section) => section.items.length > 0) // Remove seções vazias
}