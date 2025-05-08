

// import type React from "react"
// import { useState } from "react"
// import { useForm } from "react-hook-form"
// import { useNavigate, Link } from "react-router-dom"
// import axios from "axios"
// import "./Register.css"

// interface RegisterFormData {
//   username: string
//   password: string
//   confirmPassword: string
//   name: string
//   phone: string 
//   email: string
//   tz: string
// }

// interface User {
//   Id: number
//   Name: string
//   Username: string
//   Email: string
// }

// interface RegisterProps {
//   updateUser: (user: User) => void
// }

// const Register: React.FC<RegisterProps> = ({ updateUser }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setError,
//     watch,
//   } = useForm<RegisterFormData>()
//   const [apiError, setApiError] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const navigate = useNavigate()

//   const onSubmit = async (data: RegisterFormData) => {
//     setIsLoading(true)
//     setApiError("")

//     try {
//         const userData = {
//             UserName: data.username, // שונה ל-UserName
//             Password: data.password,
//             Name: data.name,
//             Phone: data.phone,
//             Email: data.email,
//             Tz: data.tz,
//           }
          

//       const response = await axios.post("http://localhost:8080/api/user/sighin", userData)

//       updateUser(response.data)
//       navigate("/recipes")
//     } catch (error: any) {
//         console.error("Registration error:", error.response?.data);

//       setApiError(error.response?.data?.message || "שגיאה בהרשמה. אנא נסה שוב.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="register-container container">
//       <h2 className="register-title">הרשמה למערכת</h2>

//       {apiError && <div className="error-alert">{apiError}</div>}

//       <form onSubmit={handleSubmit(onSubmit)} className="register-form">
//         <div className="form-group">
//           <label htmlFor="username">שם משתמש</label>
//           <input
//             id="username"
//             type="text"
//             className="form-control"
//             {...register("username", {
//               required: "שדה חובה",
//               minLength: { value: 3, message: "שם משתמש חייב להכיל לפחות 3 תווים" },
//             })}
//           />
//           {errors.username && <p className="error-message">{errors.username.message}</p>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="password">סיסמה</label>
//           <input
//             id="password"
//             type="password"
//             className="form-control"
//             {...register("password", {
//               required: "שדה חובה",
//               minLength: { value: 6, message: "סיסמה חייבת להכיל לפחות 6 תווים" },
//             })}
//           />
//           {errors.password && <p className="error-message">{errors.password.message}</p>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="confirmPassword">אימות סיסמה</label>
//           <input
//             id="confirmPassword"
//             type="password"
//             className="form-control"
//             {...register("confirmPassword", {
//               required: "שדה חובה",
//               validate: (value) => value === watch("password") || "הסיסמאות אינן תואמות",
//             })}
//           />
//           {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="name">שם מלא</label>
//           <input id="name" type="text" className="form-control" {...register("name", { required: "שדה חובה" })} />
//           {errors.name && <p className="error-message">{errors.name.message}</p>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="phone">טלפון</label>
//           <input
//             id="phone"
//             type="tel"
//             className="form-control"
//             {...register("phone", {
//               required: "שדה חובה",
//               pattern: { value: /^[0-9]{10}$/, message: "מספר טלפון לא תקין" },
//             })}
//           />
//           {errors.phone && <p className="error-message">{errors.phone.message}</p>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="email">דואר אלקטרוני</label>
//           <input
//             id="email"
//             type="email"
//             className="form-control"
//             {...register("email", {
//               required: "שדה חובה",
//               pattern: { value: /^\S+@\S+\.\S+$/, message: "כתובת אימייל לא תקינה" },
//             })}
//           />
//           {errors.email && <p className="error-message">{errors.email.message}</p>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="tz">תעודת זהות</label>
//           <input
//             id="tz"
//             type="text"
//             className="form-control"
//             {...register("tz", {
//               required: "שדה חובה",
//               pattern: { value: /^[0-9]{9}$/, message: "תעודת זהות לא תקינה" },
//             })}
//           />
//           {errors.tz && <p className="error-message">{errors.tz.message}</p>}
//         </div>

//         <button type="submit" className="btn btn-primary register-btn" disabled={isLoading}>
//           {isLoading ? "מבצע רישום..." : "הרשמה"}
//         </button>

//         <div className="register-footer">
//           <p>
//             כבר יש לך חשבון? <Link to="/login">התחבר כאן</Link>
//           </p>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default Register
import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import "./Register.css"

interface RegisterFormData {
  username: string
  password: string
  confirmPassword: string
  name: string
  phone: string
  email: string
  tz: string
}

interface User {
  Id: number
  Name: string
  Username: string
  Email: string
}

interface RegisterProps {
  updateUser: (user: User) => void
}

const Register: React.FC<RegisterProps> = ({ updateUser }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<RegisterFormData>()
  const [apiError, setApiError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setApiError("")

    try {
      const userData = {
        UserName: data.username,
        Password: data.password,
        Name: data.name,
        Phone: data.phone,
        Email: data.email,
        Tz: data.tz,
      }

      const response = await axios.post("http://localhost:8080/api/user/sighin", userData)

      updateUser(response.data)
      navigate("/recipes")
    } catch (error: any) {
      console.error("Registration error:", error.response?.data)

      const message = error.response?.data?.message || "שגיאה בהרשמה. אנא נסה שוב."

      // מיפוי מילים להצגת שגיאה בשדה מסוים
      if (message.includes("אימייל")) {
        setError("email", { type: "server", message })
      } else if (message.includes("משתמש") || message.includes("שם משתמש")) {
        setError("username", { type: "server", message })
      } else if (message.includes("סיסמה")) {
        setError("password", { type: "server", message })
      } else if (message.includes("טלפון")) {
        setError("phone", { type: "server", message })
      } else if (message.includes("תעודת זהות") || message.includes("תז")) {
        setError("tz", { type: "server", message })
      } else {
        setApiError(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-container container">
      <h2 className="register-title">הרשמה למערכת</h2>

      {apiError && <div className="error-alert">{apiError}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="register-form">
        <div className="form-group">
          <label htmlFor="username">שם משתמש</label>
          <input
            id="username"
            type="text"
            className="form-control"
            {...register("username", {
              required: "שדה חובה",
              minLength: { value: 3, message: "שם משתמש חייב להכיל לפחות 3 תווים" },
            })}
          />
          {errors.username && <p className="error-message">{errors.username.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">סיסמה</label>
          <input
            id="password"
            type="password"
            className="form-control"
            {...register("password", {
              required: "שדה חובה",
              minLength: { value: 6, message: "סיסמה חייבת להכיל לפחות 6 תווים" },
            })}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">אימות סיסמה</label>
          <input
            id="confirmPassword"
            type="password"
            className="form-control"
            {...register("confirmPassword", {
              required: "שדה חובה",
              validate: (value) => value === watch("password") || "הסיסמאות אינן תואמות",
            })}
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="name">שם מלא</label>
          <input id="name" type="text" className="form-control" {...register("name", { required: "שדה חובה" })} />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">טלפון</label>
          <input
            id="phone"
            type="tel"
            className="form-control"
            {...register("phone", {
              required: "שדה חובה",
              pattern: { value: /^[0-9]{10}$/, message: "מספר טלפון לא תקין" },
            })}
          />
          {errors.phone && <p className="error-message">{errors.phone.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">דואר אלקטרוני</label>
          <input
            id="email"
            type="email"
            className="form-control"
            {...register("email", {
              required: "שדה חובה",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "כתובת אימייל לא תקינה" },
            })}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="tz">תעודת זהות</label>
          <input
            id="tz"
            type="text"
            className="form-control"
            {...register("tz", {
              required: "שדה חובה",
              pattern: { value: /^[0-9]{9}$/, message: "תעודת זהות לא תקינה" },
            })}
          />
          {errors.tz && <p className="error-message">{errors.tz.message}</p>}
        </div>

        <button type="submit" className="btn btn-primary register-btn" disabled={isLoading}>
          {isLoading ? "מבצע רישום..." : "הרשמה"}
        </button>

        <div className="register-footer">
          <p>
            כבר יש לך חשבון? <Link to="/login">התחבר כאן</Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Register
