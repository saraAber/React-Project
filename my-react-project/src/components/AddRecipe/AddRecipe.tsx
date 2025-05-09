import type React from "react";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddRecipe.css";
import { Alert,  Snackbar } from "@mui/material";

interface User {
  Id: number;
  Name: string;
  Username: string;
  Email: string;
}

interface Category {
  Id: number;
  Name: string;
}

interface Ingredient {
  Name: string;
  Count: number;
  Type: string;
}

interface Instructions {
  Name: string;
  

}
// interface CategoryRes {
//   Id: number;
//   Name: string;
//   UpdatedAt: string;
//   CreatedAt: string;
// }

interface RecipeFormData {
  Id: number;
  Name: string;
  UserId: number;
  Description: string;
  Difficulty: "קשה" | "בינוני" | "קל",
  Duration: number;
  Categoryid: number,
  Img: string;
  Instructions: Instructions[];
  Ingridents: Ingredient[],
}

interface AddRecipeProps {
  user: User;
}

const AddRecipe: React.FC<AddRecipeProps> = ({ user }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RecipeFormData>({
    defaultValues: {
      UserId: user?.Id,
      Name: "האם עובד",
      Description: "חלכיעחלדמעחל",
      Difficulty: "קל",
      Duration: 30,
      Categoryid: 1,
      Img: "https://example.com/image.jpg",
      Instructions: [{ Name: "רכאעטיוחרכ" }],
      Ingridents: [{ Name: "כרעאיטחררכ", Count: 1, Type: "יחידה" }]
    },
  });

  const instructionsFieldArray = useFieldArray({
    control,
    name: "Instructions",
  });

  const ingridentsFieldArray = useFieldArray({
    control,
    name: "Ingridents",
  });

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = instructionsFieldArray;
  const { fields: ingridentFields, append: appendIngrident, remove: removeIngrident } = ingridentsFieldArray;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>("http://localhost:8080/api/category");
        setCategories(response.data);
      } catch (err) {
        console.error("שגיאה בטעינת הקטגוריות", err);
        setApiError("שגיאה בטעינת הקטגוריות");
      }
    };

    fetchCategories();
  }, []);

  const watchedImg = watch("Img");
  useEffect(() => {
  
  }, [watchedImg]);

  const onSubmit = async (data: RecipeFormData) => {
    if (!user) {
      setApiError("יש להתחבר כדי להוסיף מתכון");
      return;
    }
    setIsLoading(true);
    setApiError("");
    setSuccessMessage("");
  
    try {
      const recipeData = {
        Name: data.Name,
        Description: data.Description,
        Difficulty: data.Difficulty,
        Duration: data.Duration,
        UserId: user?.Id,
        Categoryid: data.Categoryid,
        Img: data.Img,
        Instructions: data.Instructions.filter(inst => inst.Name.trim() !== ""),
        Ingridents: data.Ingridents.filter(ing => ing.Name.trim() !== ""),
      };
  
      const response = await axios.post("http://localhost:8080/api/recipe", recipeData);
      
      // הצגת הודעת הצלחה
      setSuccess(true);
      setSuccessMessage("המתכון נוסף בהצלחה!");
  
      // נווט לעמוד המתכונים עם מזהה המתכון החדש
      navigate(`/recipes?id=${response.data.Id}`); 
      
    } catch (error) {
      console.error("Error adding recipe:", error);
      setApiError("הוספת המתכון נכשלה");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false); // כאן אתה מחזיר את הצלחה ל-false אחרי 6 שניות
      }, 6000); // 6000 מילישניות = 6 שניות
  
      return () => clearTimeout(timer); // לנקות את הטיימר אם הקומפוננטה מתעדכנת
    }
  }, [success]);
    

  return (
    <div className="add-recipe-container">
      <h2 className="page-title">הוספת מתכון חדש</h2>

      {apiError && <div className="error-alert">{apiError}</div>}
      {successMessage && <div className="success-alert">{successMessage}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="recipe-form">
        <div className="form-section">
          <h3 className="section-title">פרטים כלליים</h3>

          <div className="form-group">
            <label htmlFor="Name">שם המתכון</label>
            <input
              id="Name"
              type="text"
              className="form-control"
              {...register("Name", {
                required: "שדה חובה",
                minLength: { value: 3, message: "שם המתכון חייב להכיל לפחות 3 תווים" },
              })}
            />
            {errors.Name && <p className="error-message">{errors.Name.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="Description">תיאור קצר</label>
            <textarea
              id="Description"
              className="form-control"
              rows={3}
              {...register("Description", {
                required: "שדה חובה",
                minLength: { value: 10, message: "התיאור חייב להכיל לפחות 10 תווים" },
              })}
            ></textarea>
            {errors.Description && <p className="error-message">{errors.Description.message}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="Difficulty">רמת קושי</label>
              <select id="Difficulty" className="form-control" {...register("Difficulty", { required: "שדה חובה" })}>
                <option value="קל">קל</option>
                <option value="בינוני">בינוני</option>
                <option value="מורכב">מורכב</option>
              </select>
              {errors.Difficulty && <p className="error-message">{errors.Difficulty.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="Duration">זמן הכנה (דקות)</label>
              <input
                id="Duration"
                type="number"
                className="form-control"
                min="5"
                {...register("Duration", {
                  required: "שדה חובה",
                  min: { value: 5, message: "זמן ההכנה חייב להיות לפחות 5 דקות" },
                })}
              />
              {errors.Duration && <p className="error-message">{errors.Duration.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="CategoryId">קטגוריה</label>
              <select id="CategoryId" className="form-control" {...register("Categoryid", { required: "שדה חובה" })}>
                <option value="">בחר קטגוריה</option>
                {categories.map((category) => (
                  <option key={category.Id} value={category.Id}>
                    {category.Name}
                  </option>
                ))}
              </select>

              {errors.Categoryid && <p className="error-message">{errors.Categoryid.message}</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="Img">קישור לתמונה</label>
            <input
              id="Img"
              type="url"
              className="form-control"
              placeholder="https://example.com/image.jpg"
              {...register("Img", {
                pattern: {
                  value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                  message: "נא להזין כתובת URL תקינה",
                },
              })}
            />
            {errors.Img && <p className="error-message">{errors.Img.message}</p>}
          </div>
        </div>

       
        <div className="form-section">
          <h3 className="section-title">מצרכים</h3>

          {ingridentFields.map((field, index) => (
            <div key={field.id} className="ingredient-row">
              <div className="form-row">
                <div className="form-group ingredient-name">
                  <label htmlFor={`Ingrident.${index}.Name`}>שם המצרך</label>
                  <input
                    id={`Ingrident.${index}.Name`}
                    type="text"
                    className="form-control"
                    {...register(`Ingridents.${index}.Name`, {
                      required: "שדה חובה",
                    })}
                  />
                  {errors.Ingridents?.[index]?.Name && (
                    <p className="error-message">{errors.Ingridents[index].Name?.message}</p>
                  )}
                </div>

                <div className="form-group ingredient-count">
                  <label htmlFor={`Ingrident.${index}.Count`}>כמות</label>
                  <input
                    id={`Ingrident.${index}.Count`}
                    type="number"
                    className="form-control"
                    min="0.1"
                    step="0.1"
                    {...register(`Ingridents.${index}.Count`, {
                      required: "שדה חובה",
                      min: { value: 0.1, message: "הכמות חייבת להיות חיובית" },
                    })}
                  />
                  {errors.Ingridents?.[index]?.Count && (
                    <p className="error-message">{errors.Ingridents[index].Count?.message}</p>
                  )}
                </div>

                <div className="form-group ingredient-type">
                  <label htmlFor={`Ingrident.${index}.Type`}>יחידת מידה</label>
                  <select
                    id={`Ingrident.${index}.Type`}
                    className="form-control"
                    {...register(`Ingridents.${index}.Type`, {
                      required: "שדה חובה",
                    })}
                  >
                    <option value="יחידות">יחידות</option>
                    <option value="גרם">גרם</option>
                    <option value="כפית">כפית</option>
                    <option value="כף">כף</option>
                    <option value="כוס">כוס</option>
                    <option value="מ״ל">מ״ל</option>
                    <option value="ק״ג">ק״ג</option>
                    <option value="חבילה">חבילה</option>
                  </select>
                  {errors.Ingridents?.[index]?.Type && (
                    <p className="error-message">{errors.Ingridents[index].Type?.message}</p>
                  )}
                </div>

                {index > 0 && (
                  <button type="button" className="btn btn-danger remove-btn" onClick={() => removeIngrident(index)}>
                    הסר
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary add-btn"
            onClick={() => appendIngrident({ Name: "", Count: 1, Type: "יחידות" })}
          >
            הוסף מצרך
          </button>
        </div>

        <div className="form-section">
          <h3 className="section-title">הוראות הכנה</h3>

          {instructionFields.map((field, index) => (
            <div key={field.id} className="instruction-row">
              <div className="form-row">
                <div className="form-group instruction-text">
                  <label htmlFor={`Instructions.${index}.Name`}>שלב {index + 1}</label>
                  <textarea
                    id={`Instructions.${index}.Name`}
                    className="form-control"
                    rows={2}
                    {...register(`Instructions.${index}.Name`, {
                      required: "שדה חובה",
                     
                    })}
                  ></textarea>
                  {errors.Instructions?.[index]?.Name && (
                    <p className="error-message">{errors.Instructions[index]?.Name?.message}</p>
                  )}
                </div>

                {index > 0 && (
                  <button
                    type="button"
                    className="btn btn-danger remove-btn"
                    onClick={() => removeInstruction(index)}
                  >
                    הסר
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary add-btn"
            onClick={() => appendInstruction({ Name: "" })}
          >
            הוסף שלב
          </button>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/recipes")}>
            ביטול
          </button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "שומר מתכון..." : "שמור מתכון"}
          </button>
        </div>
      </form>
      // ה-Snackbar שלך
<Snackbar
  open={success}
  autoHideDuration={6000}
  onClose={() => setSuccess(false)}
  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
>
  <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: "100%" }}>
    {successMessage} {/* כאן אתה מציג את הודעת ההצלחה */}
  </Alert>
</Snackbar>

    </div>
    
  );
  
    
};

export default AddRecipe;
