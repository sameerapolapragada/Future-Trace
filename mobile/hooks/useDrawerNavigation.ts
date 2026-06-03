import { DrawerActions, useNavigation } from '@react-navigation/native'
import { useCallback, useMemo } from 'react'

type NavLike = {
  getState?: () => { type?: string }
  getParent?: () => NavLike | undefined
  dispatch: (action: ReturnType<typeof DrawerActions.openDrawer>) => void
}

export function useDrawerNavigation() {
  const navigation = useNavigation()

  const drawerNav = useMemo(() => {
    let current: NavLike | undefined = navigation as NavLike

    while (current) {
      if (current.getState?.()?.type === 'drawer') {
        return current
      }
      current = current.getParent?.()
    }

    return null
  }, [navigation])

  const openDrawer = useCallback(() => {
    drawerNav?.dispatch(DrawerActions.openDrawer())
  }, [drawerNav])

  return { drawerNav, openDrawer }
}
