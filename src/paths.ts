export const paths = {
  home: '/',
  auth: { signIn: '/auth/signIn', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    dashboard: '/dashboard/dashboardV2',
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    approval: '/dashboard/approval',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
