import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './views/pages/login/Login'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

class App extends Component {
  render() {
    // eslint-disable-next-line prettier/prettier
    const user = localStorage.getItem("token");
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route
              path="/login"
              render={() => {
                return user ? <Navigate to="/dashboard" /> : <Login />
              }}
            />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />
            <Route path="/" exact element={<Login />} />
          </Routes>
        </Suspense>
      </HashRouter>
    )
  }
}

export default App
