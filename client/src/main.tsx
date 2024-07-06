import ReactDOM from 'react-dom/client'
import './index.css'
import { ThemeProvider } from './components/theme-provider.tsx'
import { Provider } from 'react-redux'
import store from './state/store.ts'
import AppRefactor from './AppRefactor.tsx'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
)
