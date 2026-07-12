export const ROUTES = {
  welcome: '/(auth)/welcome',
  login: '/(auth)/login',
  register: '/(auth)/register',
  forgotPassword: '/(auth)/forgot-password',
  dashboard: '/(tabs)/dashboard',
  tasks: '/(tabs)/tasks',
  goals: '/(tabs)/goals',
  habits: '/(tabs)/habits',
  journal: '/(tabs)/journal',
  mood: '/(tabs)/mood',
  notes: '/(tabs)/notes',
  profile: '/(tabs)/profile',
  reminder: {
    index: '/reminder',
    create: '/reminder/create',
    edit: (id: string | number) => `/reminder/edit?id=${id}` as const,
  },
  focus: {
    index: '/focus',
    session: '/focus/session',
  },
  settings: '/settings',
} as const;

export default ROUTES;
