"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "./Home.css"

interface Recipe {
  Id: number
  Name: string
  Description: string
  Difficulty: string
  Duration: number
  CategoryId: number
  UserId: number
  Img: string
  Instructions: string[]
  Ingrident: Ingredient[]
}

interface Ingredient {
  Name: string
  Count: number
  Type: string
}

const Home: React.FC = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get<Recipe[]>("http://localhost:8080/api/recipe")
        // לקיחת 3 מתכונים אקראיים להצגה בדף הבית
        const randomRecipes = response.data.sort(() => 0.5 - Math.random()).slice(0,3)
        setFeaturedRecipes(randomRecipes)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching recipes:", err)
        setError("שגיאה בטעינת המתכונים. אנא נסה שוב מאוחר יותר.")
        setIsLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Food is Good</h1>
          <p className="hero-subtitle">גלו מתכונים מתוקים, שתפו את היצירות שלכם ותהנו מחוויית אפייה מושלמת
            
          </p>
          <Link to="/recipes" className="btn btn-primary hero-btn">
            לכל המתכונים
          </Link>
        </div>
      </section>

      <section className="featured-section">
        <h2 className="section-title">מתכונים מומלצים</h2>

        {isLoading ? (
          <div className="loading">טוען מתכונים...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="featured-recipes">
            {featuredRecipes.map((recipe) => (
              <div key={recipe.Id} className="recipe-card">
                <img
                  src={
                    recipe.Img ||
                    "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                  }
                  alt={recipe.Name}
                  className="recipe-image"
                />
                <div className="recipe-content">
                  <h3 className="recipe-title">{recipe.Name}</h3>
                  <p className="recipe-description">{recipe.Description}</p>
                  <div className="recipe-meta">
                    <span className="recipe-difficulty">רמת קושי: {recipe.Difficulty}</span>
                    <span className="recipe-duration">זמן הכנה: {recipe.Duration} דקות</span>
                  </div>
                  <Link to={`/recipes?id=${recipe.Id}`} className="btn btn-secondary view-recipe-btn">
                    צפה במתכון
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">יש לך מתכון מנצח?</h2>
          <p className="cta-text">שתף אותו ותן לכולם ליהנות מהיצירות המשובחות שלך</p>
          <Link to="/add-recipe" className="btn btn-primary cta-btn">
            הוסף מתכון
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
