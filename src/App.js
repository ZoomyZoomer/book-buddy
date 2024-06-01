import React from 'react'
import {Route, Routes} from "react-router-dom"
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import axios from 'axios'
import ErrorPage from './pages/ErrorPage'
import BookshelfPage from './pages/BookshelfPage'
import TestPage from './pages/TestPage'
import AddBook from './pages/AddBook'

axios.defaults.withCredentials = true;


function App() {
  return (

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route index element={<HomePage />} />
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route path="/bookshelf" element={<BookshelfPage />} />
      <Route path="/add-book/:tabName" element={<AddBook />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/error" element={<ErrorPage />} />
    </Routes>

  )
}

export default App