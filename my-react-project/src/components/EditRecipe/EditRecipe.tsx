// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useForm, useFieldArray } from "react-hook-form"
// import { useNavigate, useParams } from "react-router-dom"
// import axios from "axios"
// import "./EditRecipe.css"

// interface User {
//   Id: number
//   Name: string
//   Username: string
//   Email: string
// }

// interface Category {
//   Id: number
//   Name: string
// }
// interface ingridents {
//     Name: string;
//     Count: string; // שונה מ-number ל-string
//     Type: string;
//   }

//   interface Recipe {
//     Id: number;
//     Name: string;
//     Description: string;
//     Difficulty: string;
//     Duration: number;
//     CategoryId: number;
//     UserId: number;
//     Img: string;
//     Instructions: string[];
//     ingridents: ingridents[]; 
//   }
//   interface RecipeFormData {
//     Name: string;
//     Description: string;
//     Difficulty: string;
//     Duration: number;
//     CategoryId: string;
//     Img: string;
//     Instructions: string[];
//     ingridents: ingridents[]; 
//   }
// interface EditRecipeProps {
//   user: User
// }

// const EditRecipe: React.FC<EditRecipeProps> = ({ user }) => {
//   const { id } = useParams<{ id: string }>()
//   const [categories, setCategories] = useState<Category[]>([])
//   const [recipe, setRecipe] = useState<Recipe | null>(null)
//   const [isLoading, setIsLoading] = useState<boolean>(true)
//   const [isSaving, setIsSaving] = useState<boolean>(false)
//   const [apiError, setApiError] = useState<string>("")
//   const navigate = useNavigate()

//   const {
//     register,
//     control,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<RecipeFormData>()

//   const instructionsFieldArray = useFieldArray({
//     control,
//     name: "Instructions", // נשאר כפי שהוא
//   });


//   const ingridentssFieldArray = useFieldArray({
//     control,
//     name: "ingridents", // ודא שזה תואם
//   });

//   // Destructure the field arrays for easier use
//   const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = instructionsFieldArray
//   const { fields: ingridentsFields, append: appendingridents, remove: removeingridents } = ingridentssFieldArray

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [recipesResponse, categoriesResponse] = await Promise.all([
//           axios.get<Recipe[]>("http://localhost:8080/api/recipe"),
//           axios.get<Category[]>("http://localhost:8080/api/category"),
//         ])

//         const foundRecipe = recipesResponse.data.find((r) => r.Id === Number.parseInt(id || "0"))

//         if (!foundRecipe) {
//           setApiError("המתכון המבוקש לא נמצא.")
//           setIsLoading(false)
//           return
//         }

//         if (foundRecipe.UserId !== user.Id) {
//           setApiError("אין לך הרשאה לערוך מתכון זה.")
//           setIsLoading(false)
//           return
//         }

//         setRecipe(foundRecipe)
//         setCategories(categoriesResponse.data)

//         reset({
//           ...foundRecipe,
//           CategoryId: foundRecipe.CategoryId.toString(),
//         })

//         setIsLoading(false)
//       } catch (err) {
//         console.error("Error fetching data:", err)
//         setApiError("שגיאה בטעינת הנתונים. אנא נסה שוב מאוחר יותר.")
//         setIsLoading(false)
//       }
//     }

//     fetchData()
//   }, [id, user.Id, reset])

//   const onSubmit = async (data: RecipeFormData) => {
//     setIsSaving(true)
//     setApiError("")

//     try {
//       if (!recipe) {
//         throw new Error("המתכון לא נמצא")
//       }

//       const recipeData = {
//         ...data,
//         Id: recipe.Id,
//         UserId: recipe.UserId,
//         CategoryId: Number.parseInt(data.CategoryId),
//       }

//       await axios.post("http://localhost:8080/api/recipe/edit", recipeData)

//       navigate(`/recipes?id=${recipe.Id}`)
//     } catch (err: any) {
//       console.error("Error updating recipe:", err)
//       setApiError(err.response?.data?.message || "שגיאה בעדכון המתכון. אנא נסה שוב.")
//       setIsSaving(false)
//     }
//   }

//   if (isLoading) {
//     return <div className="loading">טוען נתונים...</div>
//   }

//   if (apiError) {
//     return (
//       <div className="edit-recipe-container">
//         <div className="error-alert">
//           {apiError}
//           <div className="mt-4">
//             <button className="btn btn-primary" onClick={() => navigate("/recipes")}>
//               חזרה לרשימת המתכונים
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="edit-recipe-container">
//       <h2 className="page-title">עריכת מתכון</h2>

//       <form onSubmit={handleSubmit(onSubmit)} className="recipe-form">
//         <div className="form-section">
//           <h3 className="section-title">פרטים כלליים</h3>

//           <div className="form-group">
//             <label htmlFor="Name">שם המתכון</label>
//             <input
//               id="Name"
//               type="text"
//               className="form-control"
//               {...register("Name", {
//                 required: "שדה חובה",
//                 minLength: { value: 3, message: "שם המתכון חייב להכיל לפחות 3 תווים" },
//               })}
//             />
//             {errors.Name && <p className="error-message">{errors.Name.message}</p>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="Description">תיאור קצר</label>
//             <textarea
//               id="Description"
//               className="form-control"
//               rows={3}
//               {...register("Description", {
//                 required: "שדה חובה",
//                 minLength: { value: 10, message: "התיאור חייב להכיל לפחות 10 תווים" },
//               })}
//             ></textarea>
//             {errors.Description && <p className="error-message">{errors.Description.message}</p>}
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="Difficulty">רמת קושי</label>
//               <select id="Difficulty" className="form-control" {...register("Difficulty", { required: "שדה חובה" })}>
//                 <option value="קל">קל</option>
//                 <option value="בינוני">בינוני</option>
//                 <option value="מורכב">מורכב</option>
//               </select>
//               {errors.Difficulty && <p className="error-message">{errors.Difficulty.message}</p>}
//             </div>

//             <div className="form-group">
//               <label htmlFor="Duration">זמן הכנה (דקות)</label>
//               <input
//                 id="Duration"
//                 type="number"
//                 className="form-control"
//                 min="5"
//                 {...register("Duration", {
//                   required: "שדה חובה",
//                   min: { value: 5, message: "זמן ההכנה חייב להיות לפחות 5 דקות" },
//                 })}
//               />
//               {errors.Duration && <p className="error-message">{errors.Duration.message}</p>}
//             </div>

//             <div className="form-group">
//               <label htmlFor="CategoryId">קטגוריה</label>
//               <select id="CategoryId" className="form-control" {...register("CategoryId", { required: "שדה חובה" })}>
//                 <option value="">בחר קטגוריה</option>
//                 {categories.map((category) => (
//                   <option key={category.Id} value={category.Id}>
//                     {category.Name}
//                   </option>
//                 ))}
//               </select>
//               {errors.CategoryId && <p className="error-message">{errors.CategoryId.message}</p>}
//             </div>
//           </div>

//           <div className="form-group">
//             <label htmlFor="Img">קישור לתמונה</label>
//             <input
//               id="Img"
//               type="url"
//               className="form-control"
//               placeholder="https://example.com/image.jpg"
//               {...register("Img", {
//                 pattern: {
//                   value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
//                   message: "נא להזין כתובת URL תקינה",
//                 },
//               })}
//             />
//             {errors.Img && <p className="error-message">{errors.Img.message}</p>}
//           </div>
//         </div>

//         <div className="form-section">
//           <h3 className="section-title">מצרכים</h3>

//           {ingridentsFields.map((field, index) => (
//   <div key={field.id} className="ingridents-row">
//     <div className="form-row">
//       <div className="form-group ingridents-name">
//         <label htmlFor={`ingridents.${index}.Name`}>שם המצרך</label>
//         <input
//           id={`Ingrident.${index}.Name`} // שונה מ-Ingridents ל-ingridents
//           type="text"
//           className="form-control"
//           {...register(`ingridents.${index}.Name`, {
//             required: "שדה חובה",
//           })}
//         />
//         {errors.ingridents?.[index]?.Name && (
//           <p className="error-message">{errors.ingridents[index].Name?.message}</p>
//         )}
//       </div>

//       <div className="form-group ingridents-count">
//         <label htmlFor={`ingridents.${index}.Count`}>כמות</label>
//         <input
//           id={`ingridents.${index}.Count`} // שונה מ-Ingridents ל-ingridents
//           type="number"
//           className="form-control"
//           min="0.1"
//           step="0.1"
//           {...register(`ingridents.${index}.Count`, {
//             required: "שדה חובה",
//             min: { value: 0.1, message: "הכמות חייבת להיות חיובית" },
//           })}
//         />
//         {errors.ingridents?.[index]?.Count && (
//           <p className="error-message">{errors.ingridents[index].Count?.message}</p>
//         )}
//       </div>

//       <div className="form-group ingridents-type">
//         <label htmlFor={`ingridents.${index}.Type`}>יחידת מידה</label>
//         <select
//           id={`Ingrident.${index}.Type`} // שונה מ-Ingridents ל-ingridents
//           className="form-control"
//           {...register(`ingridents.${index}.Type`, {
//             required: "שדה חובה",
//           })}
//         >
//           <option value="יחידות">יחידות</option>
//           <option value="גרם">גרם</option>
//           <option value="כפית">כפית</option>
//           <option value="כף">כף</option>
//           <option value="כוס">כוס</option>
//           <option value="מ״ל">מ״ל</option>
//           <option value="ק״ג">ק״ג</option>
//           <option value="חבילה">חבילה</option>
//         </select>
//         {errors.ingridents?.[index]?.Type && (
//           <p className="error-message">{errors.ingridents[index].Type?.message}</p>
//         )}
//       </div>

//       <button type="button" className="btn btn-danger remove-btn" onClick={() => removeingridents(index)}>
//         הסר
//       </button>
//     </div>
//   </div>
// ))}
// // הוספת מצרך חדש
// <button
//   type="button"
//   className="btn btn-secondary add-btn"
//   onClick={() => appendingridents({ Name: "", Count: "1", Type: "יחידות" })} // שים לב ל-Count כ-string
// >
//   הוסף מצרך
// </button>
//         </div>

//         <div className="form-section">
//           <h3 className="section-title">הוראות הכנה</h3>

//           {instructionFields.map((field, index) => (
//             <div key={field.id} className="instruction-row">
//               <div className="form-row">
//                 <div className="form-group instruction-text">
//                   <label htmlFor={`Instructions.${index}`}>שלב {index + 1}</label>
//                   <textarea
//                     id={`Instructions.${index}`}
//                     className="form-control"
//                     rows={2}
//                     {...register(`Instructions.${index}` as const, {
//                       required: "שדה חובה",
//                       minLength: { value: 5, message: "ההוראה חייבת להכיל לפחות 5 תווים" },
//                     })}
//                   ></textarea>
//                   {errors.Instructions?.[index] && (
//                     <p className="error-message">{errors.Instructions[index]?.message}</p>
//                   )}
//                 </div>

//                 <button type="button" className="btn btn-danger remove-btn" onClick={() => removeInstruction(index)}>
//                   הסר
//                 </button>
//               </div>
//             </div>
//           ))}


// // הוספת שלב חדש
// <button
//   type="button"
//   className="btn btn-secondary add-btn"
//   onClick={() => appendInstruction("")} // הוסף אובייקט ריק
// >
//   הוסף שלב
// </button>
//         </div>

//         <div className="form-actions">
//           <button type="button" className="btn btn-secondary" onClick={() => navigate("/recipes")}>
//             ביטול
//           </button>
//           <button type="submit" className="btn btn-primary" disabled={isSaving}>
//             {isSaving ? "שומר שינויים..." : "שמור שינויים"}
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default EditRecipe

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import "./EditRecipe.css"

interface Ingridents  {
  Name: string;
  Count: string;
  Type: string
};

interface Instructions {
  Name: string;
}

interface RecipeFormData  {
  Name: string
    Description: string
    Difficulty: string
    Duration: number
    CategoryId: string
    Img: string
    Instructions: Instructions[]
    Ingridents: Ingridents[]
};

interface Recipe {
  Id: number
  Name: string
  Description: string
  Difficulty: string
  Duration: number
  CategoryId: number
  UserId: number
  Img: string
  Instructions: Instructions[]
  Ingridents: Ingridents[]
}


interface Category {
  Id: number
  Name: string
}

interface User {
  Id: number
  Name: string
  Username: string
  Email: string
}
interface EditRecipeProps {
  user: User
}

const EditRecipe: React.FC<EditRecipeProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>()
  const [categories, setCategories] = useState<Category[]>([])
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [apiError, setApiError] = useState<string>("")
  const navigate = useNavigate()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,

  } = useForm<RecipeFormData>();



  // const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } =
  //   useFieldArray({
  //     control,
  //     name: "Ingridents",
  //   });
    const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
      control,
      name: "Instructions",
    });
    
    const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
      control,
      name: "Ingridents",
    });
    
  // const Instructions = watch("Instructions");

  useEffect(() => {
    const fetchData = async () => {
        try {
            // טעינת המתכון והקטגוריות במקביל
            const [recipesResponse, categoriesResponse] = await Promise.all([
                axios.get<Recipe[]>("http://localhost:8080/api/recipe"),
                axios.get<Category[]>("http://localhost:8080/api/category"),
            ])

            const foundRecipe = recipesResponse.data.find((r) => r.Id === Number.parseInt(id || "0"))

            if (!foundRecipe) {
                setApiError("המתכון המבוקש לא נמצא.")
                setIsLoading(false)
                return
            }

            // בדיקה שהמשתמש הוא בעל המתכון
            if (foundRecipe.UserId !== user.Id) {
                setApiError("אין לך הרשאה לערוך מתכון זה.")
                setIsLoading(false)
                return
            }

            setRecipe(foundRecipe)
            setCategories(categoriesResponse.data)

            // איתחול הטופס עם נתוני המתכון
            reset({
                ...foundRecipe,
                CategoryId: foundRecipe.CategoryId.toString(),
            })

            setIsLoading(false)
        } catch (err) {
            console.error("Error fetching data:", err)
            setApiError("שגיאה בטעינת הנתונים. אנא נסה שוב מאוחר יותר.")
            setIsLoading(false)
        }
    }

    fetchData()
}, [id, user.Id, reset])
  const onSubmit = async (data: RecipeFormData) => {
    setIsSaving(true)
        setApiError("")

        try {
            if (!recipe) {
                throw new Error("המתכון לא נמצא")
            }

            // שמירה על מזהה המתכון והמשתמש המקוריים
            const recipeData = {
                ...data,
                Id: recipe.Id,
                UserId: recipe.UserId,
                CategoryId: Number.parseInt(data.CategoryId),
            }

            await axios.post("http://localhost:8080/api/recipe/edit", recipeData)

            navigate(`/recipes?id=${recipe.Id}`)
        } catch (err: any) {
            console.error("Error updating recipe:", err)
            setApiError(err.response?.data?.message || "שגיאה בעדכון המתכון. אנא נסה שוב.")
            setIsSaving(false)
        }
  };
  if (isLoading) {
    return <div className="loading">טוען נתונים...</div>
}
if (apiError) {
  return (
      <div className="edit-recipe-container">
          <div className="error-alert">
              {apiError}
              <div className="mt-4">
                  <button className="btn btn-primary" onClick={() => navigate("/recipes")}>
                      חזרה לרשימת המתכונים
                  </button>
              </div>
          </div>
      </div>
  )
}

  return (
    <div className="edit-recipe-container">
            <h2 className="page-title">עריכת מתכון</h2>    
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
                            <select id="CategoryId" className="form-control" {...register("CategoryId", { required: "שדה חובה" })}>
                                <option value="">בחר קטגוריה</option>
                                {categories.map((category) => (
                                    <option key={category.Id} value={category.Id}>
                                        {category.Name}
                                    </option>
                                ))}
                            </select>
                            {errors.CategoryId && <p className="error-message">{errors.CategoryId.message}</p>}
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

                    {ingredientFields.map((field, index) => (
                        <div key={field.id} className="ingredient-row">
                            <div className="form-row">
                                <div className="form-group ingredient-name">
                                    <label htmlFor={`Ingridents.${index}.Name`}>שם המצרך</label>
                                    <input
                                        id={`Ingridents.${index}.Name`}
                                        type="text"
                                        className="form-control"
                                        {...register(`Ingridents.${index}.Name` as const, {
                                            required: "שדה חובה",
                                        })}
                                    />
                                    {errors.Ingridents?.[index]?.Name && (
                                        <p className="error-message">{errors.Ingridents[index].Name?.message}</p>
                                    )}
                                </div>

                                <div className="form-group ingredient-count">
                                    <label htmlFor={`Ingridents.${index}.Count`}>כמות</label>
                                    <input
                                        id={`Ingridents.${index}.Count`}
                                        type="number"
                                        className="form-control"
                                        min="0.1"
                                        step="0.1"
                                        {...register(`Ingridents.${index}.Count` as const, {
                                            required: "שדה חובה",
                                            min: { value: 0.1, message: "הכמות חייבת להיות חיובית" },
                                        })}
                                    />
                                    {errors.Ingridents?.[index]?.Count && (
                                        <p className="error-message">{errors.Ingridents[index].Count?.message}</p>
                                    )}
                                </div>

                                <div className="form-group ingredient-type">
                                    <label htmlFor={`Ingridents.${index}.Type`}>יחידת מידה</label>
                                    <select
                                        id={`Ingridents.${index}.Type`}
                                        className="form-control"
                                        {...register(`Ingridents.${index}.Type` as const, {
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

                                <button type="button" className="btn btn-danger remove-btn" onClick={() => removeIngredient(index)}>
                                    הסר
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn btn-secondary add-btn"
                        onClick={() => appendIngredient({ Name: "", Count: "1", Type: "יחידות" })}
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
                                    <label htmlFor={`Instructions.${index}`}>שלב {index + 1}</label>
                                    <textarea
                                        id={`Instructions.${index}`}
                                        className="form-control"
                                        rows={2}
                                        {...register(`Instructions.${index}` as const, {
                                            required: "שדה חובה",
                                            minLength: { value: 5, message: "ההוראה חייבת להכיל לפחות 5 תווים" },
                                        })}
                                    ></textarea>
                                    {errors.Instructions?.[index] && (
                                        <p className="error-message">{errors.Instructions[index]?.message}</p>
                                    )}
                                </div>

                                <button type="button" className="btn btn-danger remove-btn" onClick={() => removeInstruction(index)}>
                                    הסר
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn btn-secondary add-btn"
                        onClick={() => appendInstruction({Name: ""})}
                    >
                        הוסף שלב
                    </button>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/recipes")}>
                        ביטול
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                        {isSaving ? "שומר שינויים..." : "שמור שינויים"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditRecipe
