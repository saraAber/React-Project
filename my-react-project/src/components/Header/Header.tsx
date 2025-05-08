"use client"

import type React from "react"

import { Link, useNavigate } from "react-router-dom"
import "./Header.css"

interface User {
  Id: number
  Name: string
  Username: string
  Email: string
}

interface HeaderProps {
  user: User | null
  updateUser: (user: User | null) => void
}

const Header: React.FC<HeaderProps> = ({ user, updateUser }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    updateUser(null)
    navigate("/login")
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Food is Good👌</h1>
        </Link>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                דף הבית
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/recipes" className="nav-link">
                מתכונים
              </Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link to="/add-recipe" className="nav-link">
                    הוסף מתכון
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/shopping-list" className="nav-link">
                    רשימת קניות
                  </Link>
                </li>
                <li className="nav-item user-menu">
                  <span className="user-name">שלום, {user.Name}</span>
                  <button onClick={handleLogout} className="logout-btn">
                    התנתק
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    כניסה
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    הרשמה
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
