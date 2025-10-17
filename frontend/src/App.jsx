import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Login from './pages/login'
import Navbar from './components/Navbar'
import Home from './pages/home'
import Chat from './pages/chat'
import Medication from './pages/medication'
import Metric from './pages/metric'
import Tasks from './pages/tasks'
import Requests from './pages/requests'

const App = () => {
  return (
     <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Navbar/>}>
          <Route index element={<Home/>}/>
          <Route path="/request" element={<Requests/>}/>
          <Route path="/chat" element={<Chat/>}/>
          <Route path="/medication" element={<Medication/>}/>
          <Route path="/metric" element={<Metric/>}/>
          <Route path='/tasks' element={<Tasks/>}/>
        </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
