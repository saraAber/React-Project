import type React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./RecipeList.css";
import defaultImage from '../images/cake.png'; // ייבוא התמונה המקומית

interface Recipe {
    Id: number;
    Name: string;
    Description: string;
    Difficulty: string;
    Duration: number;
    Categoryid: number;
    UserId: number;
    Img: string;
    Instructions: string[];
    Ingrident: Ingredient[];
}

interface Ingredient {
    Name: string;
    Count: number;
    Type: string;
}

interface Category {
    Id: number;
    Name: string;
}
interface User {
    Id: number
    Name: string
    Username: string
    Email: string
  }

  interface RecipeListProps {
    user: User | null
  }
interface Filters {
    category: string;
    difficulty: string;
    duration: string;
    creator: string;
}

const RecipeList: React.FC<RecipeListProps> = ({ user }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    const [filters, setFilters] = useState<Filters>({
        category: "",
        difficulty: "",
        duration: "",
        creator: "",
    });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recipesResponse, categoriesResponse] = await Promise.all([
                    axios.get<Recipe[]>("http://localhost:8080/api/recipe"),
                    axios.get<Category[]>("http://localhost:8080/api/category"),
                ]);

                setRecipes(recipesResponse.data);
                setCategories(categoriesResponse.data);

                const params = new URLSearchParams(location.search);
                const recipeId = params.get("id");

                if (recipeId) {
                    const recipe = recipesResponse.data.find((r) => r.Id === Number.parseInt(recipeId));
                    if (recipe) {
                        setSelectedRecipe(recipe);
                        setShowModal(true);
                    }
                }

                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("שגיאה בטעינת הנתונים. אנא נסה שוב מאוחר יותר.");
                setIsLoading(false);
            }
        };

        fetchData();
    }, [location.search]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetFilters = () => {
        setFilters({
            category: "",
            difficulty: "",
            duration: "",
            creator: "",
        });
    };

    const handleDeleteRecipe = async (recipeId: number) => {
        if (!window.confirm("האם אתה בטוח שברצונך למחוק את המתכון?")) {
            return;
        }

        try {
            await axios.post(`http://localhost:8080/api/recipe/delete/${recipeId}`);
            setRecipes((prev) => prev.filter((recipe) => recipe.Id !== recipeId));

            if (selectedRecipe && selectedRecipe.Id === recipeId) {
                setSelectedRecipe(null);
                setShowModal(false);
            }
        } catch (err) {
            console.error("Error deleting recipe:", err);
            alert("שגיאה במחיקת המתכון. אנא נסה שוב.");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        navigate("/recipes", { replace: true });
    };

    const filteredRecipes = recipes.filter((recipe) => {
        return (
            (filters.category === "" || recipe.Categoryid === Number.parseInt(filters.category)) &&
            (filters.difficulty === "" || recipe.Difficulty === filters.difficulty) &&
            (filters.duration === "" ||
                (filters.duration === "short" && recipe.Duration <= 30) ||
                (filters.duration === "medium" && recipe.Duration > 30 && recipe.Duration <= 60) ||
                (filters.duration === "long" && recipe.Duration > 60)) &&
            (filters.creator === "" ||
                (filters.creator === "me" && user && recipe.UserId === user.Id) ||
                (filters.creator === "others" && (!user || recipe.UserId !== user.Id)))
        );
    });

    const difficultyLevels = [...new Set(recipes.map((recipe) => recipe.Difficulty))];

    return (
        <div className="recipe-list-container">
            <h2 className="page-title">מתכונים</h2>

            {isLoading ? (
                <div className="loading">טוען מתכונים...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <>
                    <div className="filters-container">
                        <div className="filter-group">
                            <label htmlFor="category">קטגוריה:</label>
                            <select
                                id="category"
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="filter-select"
                            >
                                <option value="">הכל</option>
                                {categories.map((category) => (
                                    <option key={category.Id} value={category.Id}>
                                        {category.Name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="difficulty">רמת קושי:</label>
                            <select
                                id="difficulty"
                                name="difficulty"
                                value={filters.difficulty}
                                onChange={handleFilterChange}
                                className="filter-select"
                            >
                                <option value="">הכל</option>
                                {difficultyLevels.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* שאר הפילטרים */}
                        <button onClick={resetFilters} className="btn btn-secondary reset-btn">
                            אפס פילטרים
                        </button>
                    </div>

                    {filteredRecipes.length === 0 ? (
                        <div className="no-recipes">
                            <p>לא נמצאו מתכונים התואמים את הפילטרים שבחרת.</p>
                            <button onClick={resetFilters} className="btn btn-primary">
                                הצג את כל המתכונים
                            </button>
                        </div>
                    ) : (
                        <div className="recipes-grid">
                            {filteredRecipes.map((recipe) => (
                                <div key={recipe.Id} className="recipe-card">
                                    <img
                                        src={recipe.Img || require("../images/cake.png").default}
                                        alt={recipe.Name}
                                        className="recipe-image"
                                        onClick={() => {
                                            setSelectedRecipe(recipe);
                                            setShowModal(true);
                                            navigate(`/recipes?id=${recipe.Id}`, { replace: true });
                                        }}
                                    />
                                    <div className="recipe-content">
                                        <h3 className="recipe-title">{recipe.Name}</h3>
                                        <p className="recipe-description">{recipe.Description}</p>
                                        <div className="recipe-meta">
                                            <span className="recipe-difficulty">רמת קושי: {recipe.Difficulty}</span>
                                            <span className="recipe-duration">זמן הכנה: {recipe.Duration} דקות</span>
                                        </div>
                                        <div className="recipe-category">
                                            {categories.find((c) => c.Id === recipe.Categoryid)?.Name || "ללא קטגוריה"}
                                        </div>
                                        <div className="recipe-actions">
                                            <button
                                                className="btn btn-secondary view-btn"
                                                onClick={() => {
                                                    setSelectedRecipe(recipe);
                                                    setShowModal(true);
                                                    navigate(`/recipes?id=${recipe.Id}`, { replace: true });
                                                }}
                                            >
                                                צפה במתכון
                                            </button>

                                            {user && user.Id === recipe.UserId && (
                                                <div className="owner-actions">
                                                    <Link to={`/edit-recipe/${recipe.Id}`} className="btn btn-secondary edit-btn">
                                                        ערוך
                                                    </Link>
                                                    <button className="btn btn-danger delete-btn" onClick={() => handleDeleteRecipe(recipe.Id)}>
                                                        מחק
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {showModal && selectedRecipe && (
                        <div className="recipe-modal-overlay" onClick={closeModal}>
                            <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
                                <button className="close-modal" onClick={closeModal}>
                                    &times;
                                </button>

                                <div className="recipe-modal-content">
                                    <div className="recipe-modal-header">
                                        <h2>{selectedRecipe.Name}</h2>
                                        <div className="recipe-modal-meta">
                                            <span>רמת קושי: {selectedRecipe.Difficulty}</span>
                                            <span>זמן הכנה: {selectedRecipe.Duration} דקות</span>
                                            <span>
                                                קטגוריה: {categories.find((c) => c.Id === selectedRecipe.Categoryid)?.Name || "ללא קטגוריה"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="recipe-modal-body">
                                        <div className="recipe-modal-image">
                                            <img
                                                src={selectedRecipe.Img ? selectedRecipe.Img : defaultImage} // השתמש בקישור אם קיים, אחרת השתמש בתמונה המקומית
                                                alt={selectedRecipe.Name}
                                                className="recipe-image"
                                            />

                                        </div>

                                        <div className="recipe-modal-description">
                                            <h3>תיאור</h3>
                                            <p>{selectedRecipe.Description}</p>
                                        </div>

                                        <div className="recipe-modal-ingredients">
                                            <h3>מצרכים</h3>
                                            <ul>
                                                {selectedRecipe.Ingrident?.map((ingredient, index) => (
                                                    <li key={index}>
                                                        {ingredient.Name}: {ingredient.Count} {ingredient.Type}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="recipe-modal-instructions">
                                            <h3>הוראות הכנה</h3>
                                            <ol>
                                                {selectedRecipe.Instructions?.map((instruction, index) => (
                                                    <li key={index}>{instruction}</li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>

                                    {user && user.Id === selectedRecipe.UserId && (
                                        <div className="recipe-modal-actions">
                                            <Link to={`/edit-recipe/${selectedRecipe.Id}`} className="btn btn-secondary">
                                                ערוך מתכון
                                            </Link>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => {
                                                    handleDeleteRecipe(selectedRecipe.Id);
                                                    closeModal();
                                                }}
                                            >
                                                מחק מתכון
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default RecipeList;
