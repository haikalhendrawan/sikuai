import {NextUIProvider} from '@nextui-org/react'
import { BrowserRouter} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Router from './routes'


function App() {

  return (
    <>
      <HelmetProvider>
        <BrowserRouter>
          <NextUIProvider locale='id-ID'>
            <Router />
          </NextUIProvider>
        </BrowserRouter>
      </HelmetProvider>
    </>
  )
}

export default App
