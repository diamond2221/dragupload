import { PermissionModule } from '@/store/modules/permission'
import { LoadingBar } from 'view-design'
import { Route } from 'vue-router'
import router from './router'
import settings from './settings'

// Generate accessible routes map based on role
PermissionModule.GenerateRoutes(['admin'])
// Dynamically add accessible routes
router.addRoutes(PermissionModule.dynamicRoutes)

LoadingBar.config({ failedColor: '#ed4014' })

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  LoadingBar.start()
  if (to.path === '/login') {
    next({ path: '/' })
    LoadingBar.finish()
  } else {
    next()
  }
})

router.afterEach((to: Route) => {
  // Finish progress bar
  LoadingBar.finish()
  // set page title
  document.title = `${to.meta?.headtitle ?? ''} - ${settings.title}`
})
