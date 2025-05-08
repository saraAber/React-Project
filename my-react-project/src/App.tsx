"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Provider } from "react-redux"
import { store } from "./store/store"
import Header from "./components/Header/Header"
import Login from "./components/Login/Login"
import Register from "./components/Register/Register"
import Home from "./components/Home/Home"
import RecipeList from "./components/RecipeList/RecipeList"
import AddRecipe from "./components/AddRecipe/AddRecipe"
import EditRecipe from "./components/EditRecipe/EditRecipe"
import ShoppingList from "./components/ShoppingList/ShoppingList"
import "./App.css"

interface User {
  Id: number
  Name: string
  Username: string
  Email: string
  Phone?: string
  Tz?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // בדיקה אם יש משתמש מחובר בלוקל סטורג'
    const loggedInUser = localStorage.getItem("user")
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }
  }, [])

  // פונקציה לעדכון המשתמש המחובר
  const updateUser = (userData: User | null) => {
    setUser(userData)
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData))
    } else {
      localStorage.removeItem("user")
    }
  }

  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Header user={user} updateUser={updateUser} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login updateUser={updateUser} />} />
              <Route path="/register" element={<Register updateUser={updateUser} />} />
              <Route path="/recipes" element={<RecipeList user={user} />} />
              <Route path="/add-recipe" element={user ? <AddRecipe user={user} /> : <Navigate to="/login" />} />
              <Route path="/edit-recipe/:id" element={user ? <EditRecipe user={user} /> : <Navigate to="/login" />} />
              <Route path="/shopping-list" element={user ? <ShoppingList user={user} /> : <Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  )
}

export default App
