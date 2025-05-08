import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit"

// טיפוסים בסיסיים
export interface Ingredient {
  Name: string
  Count: number
  Type: string
}

export interface Recipe {
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

export interface Category {
  Id: number
  Name: string
}

export interface User {
  Id: number
  Name: string
  Username: string
  Email: string
  Phone?: string
  Tz?: string
}

export interface ShoppingItem {
  Id: number
  Name: string
  Count: number
  UserId: number
}

// טיפוסי State
interface RecipesState {
  recipes: Recipe[]
  categories: Category[]
  isLoading: boolean
  error: string | null
}

interface UserState {
  currentUser: User | null
  isLoading: boolean
  error: string | null
}

interface ShoppingListState {
  items: ShoppingItem[]
  isLoading: boolean
  error: string | null
}

// מצבים התחלתיים
const initialRecipesState: RecipesState = {
  recipes: [],
  categories: [],
  isLoading: false,
  error: null,
}

const initialUserState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
}

const initialShoppingListState: ShoppingListState = {
  items: [],
  isLoading: false,
  error: null,
}

// יצירת slice למתכונים
const recipesSlice = createSlice({
  name: "recipes",
  initialState: initialRecipesState,
  reducers: {
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload
    },
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.recipes.push(action.payload)
    },
    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      const index = state.recipes.findIndex((recipe) => recipe.Id === action.payload.Id)
      if (index !== -1) {
        state.recipes[index] = action.payload
      }
    },
    deleteRecipe: (state, action: PayloadAction<number>) => {
      state.recipes = state.recipes.filter((recipe) => recipe.Id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

// יצירת slice למשתמש
const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    logout: (state) => {
      state.currentUser = null
    },
  },
})

// יצירת slice לרשימת קניות
const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState: initialShoppingListState,
  reducers: {
    setItems: (state, action: PayloadAction<ShoppingItem[]>) => {
      state.items = action.payload
    },
    addItem: (state, action: PayloadAction<ShoppingItem>) => {
      state.items.push(action.payload)
    },
    updateItem: (state, action: PayloadAction<ShoppingItem>) => {
      const index = state.items.findIndex((item) => item.Id === action.payload.Id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.Id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

// ייצוא של האקשנים
export const {
  setRecipes,
  setCategories,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  setLoading: setRecipesLoading,
  setError: setRecipesError,
} = recipesSlice.actions

export const { setUser, setLoading: setUserLoading, setError: setUserError, logout } = userSlice.actions

export const {
  setItems,
  addItem,
  updateItem,
  deleteItem,
  setLoading: setShoppingLoading,
  setError: setShoppingError,
} = shoppingListSlice.actions

// יצירת ה-store
export const store = configureStore({
  reducer: {
    recipes: recipesSlice.reducer,
    user: userSlice.reducer,
    shoppingList: shoppingListSlice.reducer,
  },
})

// טיפוסים עבור RootState ו-AppDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// הוק מותאם אישית לשימוש ב-TypeScript עם useDispatch ו-useSelector
export type DispatchFunc = () => AppDispatch
