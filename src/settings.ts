import { getfixHeader, getshowTagViews, getTheme, getshowSiderbarLogo } from './utils/storage'

interface ISettings {
  title: string // Overrides the default title
  showSettings: boolean // Controls settings panel display
  showTagsView: boolean // Controls tagsview display
  showSidebarLogo: boolean // Controls siderbar logo display
  fixedHeader: boolean // If true, will fix the header component
  errorLog: string[] // The env to enable the errorlog component, default 'production' only
  sidebarTextTheme: boolean // If true, will change active text color for sidebar based on theme
  devServerPort: number // Port number for webpack-dev-server
  mockServerPort: number // Port number for mock server
  theme: string
  logoA: string
  logoB: string
}

// You can customize below settings :)
const settings: ISettings = {
  title: '拖拽上传',
  showSettings: true,
  showTagsView: Boolean(Number(getshowTagViews() ?? 1)),
  fixedHeader: Boolean(Number(getfixHeader() ?? 1)),
  showSidebarLogo: Boolean(Number(getshowSiderbarLogo() ?? 1)),
  errorLog: ['production'],
  sidebarTextTheme: true,
  devServerPort: 8084,
  mockServerPort: 9528,
  theme: getTheme() || '#0079fe',
  logoA: '/logo/normal-logo.png',
  logoB: '/logo/small-logo.png'
}

export default settings
