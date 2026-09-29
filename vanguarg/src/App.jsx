import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Details } from './components/Details'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { AboutUs } from './pages/AboutUs'
import { Contact } from './pages/Contact'
import { Properties } from './pages/Properties'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { AdminPage } from './pages/AdminPage'
import { ProtectedAdminRoute } from './components/ProtectedRoute'

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-[Inter,system-ui,sans-serif] antialiased">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property/:id" element={<Details />} />
          <Route path="/secret/register" element={<Register />} />
          <Route path="/secret/login" element={<Login />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path='/secret/admin/page' element={<ProtectedAdminRoute><AdminPage/></ProtectedAdminRoute>}/>
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
