import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import "./Login.css"

interface LoginFormData {
  username: string
  password: string
}

interface User {
  Id: number
  Name: string
  Username: string
  Email: string
}

interface LoginProps {
  updateUser: (user: User) => void
}

const Login: React.FC<LoginProps> = ({ updateUser }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()
  const [apiError, setApiError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError("");

    // בדוק אם יש ערכים תקינים לפני שליחת הבקשה
    if (!data.username || !data.password) {
        setApiError("שדה שם משתמש וסיסמה הם חובה.");
        setIsLoading(false);
        return;
    }

    try {
        console.log("Sending login request with:", data);
        const response = await axios.post("http://localhost:8080/api/user/login", {
            UserName: data.username, // ודא ששמות השדות תואמים
            Password: data.password,
        });

        updateUser(response.data);
        navigate("/recipes");
    } catch (error: any) {
        console.error("Login error:", error);
        // טיפול בשגיאות מהשרת
        if (error.response) {
            setApiError("שגיאה מהשרת: " + error.response.data.message);
        } else if (error.request) {
            setApiError("לא התקבלה תגובה מהשרת.");
        } else {
            setApiError("שגיאה: " + error.message);
        }
    } finally {
        setIsLoading(false);
    }
};


  return (
    <div className="login-container container">
      <h2 className="login-title">כניסה למערכת</h2>

      {apiError && <div className="error-alert">{apiError}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="form-group">
          <label htmlFor="username">שם משתמש</label>
          <input
            id="username"
            type="text"
            className="form-control"
            {...register("username", {
              required: "שדה חובה",
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
            })}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
          {isLoading ? "מתחבר..." : "כניסה"}
        </button>

        <div className="login-footer">
          <p>
            אין לך חשבון? <Link to="/register">הירשם עכשיו</Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login
