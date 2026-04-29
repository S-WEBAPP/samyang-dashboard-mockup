export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  sy: {
    dashboard: '/sy/dashboard',
    overview: '/sy/overview',
    account: '/sy/account',
    customers: '/sy/customers',
    integrations: '/sy/integrations',
    settings: '/sy/settings',
    approval: '/sy/approval',
    amendment: '/sy/approval/amendment',
    settlement: '/sy/approval/settlement',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
