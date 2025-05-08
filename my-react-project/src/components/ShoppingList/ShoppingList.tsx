
import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import "./ShoppingList.css"

interface User {
    Id: number
    Name: string
    Username: string
    Email: string
}

interface ShoppingItem {
    Id: number
    Name: string
    Count: number
    UserId: number
}

interface ShoppingFormData {
    Name: string
    Count: number
}

interface ShoppingListProps {
    user: User | null
}

const ShoppingList: React.FC<ShoppingListProps> = ({ user }) => {
    const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null)
    const [showConfirm, setShowConfirm] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ShoppingFormData>({
        defaultValues: {
            Name: "",
            Count: 1,
        },
    })

    useEffect(() => {
        fetchShoppingList()
    }, [])

    const fetchShoppingList = async () => {
        try {
            const response = await axios.get<ShoppingItem[]>(`http://localhost:8080/api/bay/${user!.Id}`)
            setShoppingItems(response.data)
            setIsLoading(false)
        } catch (err) {
            console.error("Error fetching shopping list:", err)
            setError("שגיאה בטעינת רשימת הקניות. אנא נסה שוב מאוחר יותר.")
            setIsLoading(false)
        }
    }
    const onSubmit = async (data: ShoppingFormData) => {
        try {
            if (editingItem) {
                const updatedItem = {
                    ...editingItem,
                    Name: data.Name,
                    Count: data.Count,
                };
    
                console.log("Sending updated item:", updatedItem); // הוסף שורת דיבוג
    
                await axios.post("http://localhost:8080/api/bay/edit", updatedItem);
                setShoppingItems((prev) => prev.map((item) => (item.Id === editingItem.Id ? updatedItem : item)));
                setEditingItem(null);
            } else {
                const newItem = {
                    Name: data.Name,
                    Count: data.Count,
                    UserId: user!.Id,
                };
                const response = await axios.post("http://localhost:8080/api/bay", newItem);
                setShoppingItems((prev) => [...prev, response.data]);
            }
    
            reset({ Name: "", Count: 1 });
        } catch (err) {
            console.error("Error saving shopping item:", err);
            setError("שגיאה בשמירת הפריט. אנא נסה שוב.");
        }
    };
    

    const handleEdit = (item: ShoppingItem) => {
        setEditingItem(item)
        reset({
            Name: item.Name,
            Count: item.Count,
        })
    }

    const handleDelete = (itemId: number) => {
        setShowConfirm(true);
        setItemIdToDelete(itemId);
    };

    const confirmDelete = async () => {
        if (itemIdToDelete !== null) {
            try {
                await axios.post(`http://localhost:8080/api/bay/delete/${user!.Id}/${itemIdToDelete}`);
                setShoppingItems((prev) => prev.filter((item) => item.Id !== itemIdToDelete));
                setShowConfirm(false);
                setItemIdToDelete(null);
            } catch (err) {
                console.error("Error deleting shopping item:", err);
                setError("שגיאה במחיקת הפריט. אנא נסה שוב.");
            }
        }
    };

    const cancelDelete = () => {
        setShowConfirm(false);
        setItemIdToDelete(null);
    };

    const cancelEdit = () => {
        setEditingItem(null)
        reset({ Name: "", Count: 1 })
    }

    if (!user) {
        return <div>יש להתחבר כדי לראות את רשימת הקניות.</div>
    }
    
    return (
        <div className="shopping-list-container">
            <h2 className="page-title">רשימת קניות</h2>
            {error && <div className="error-alert">{error}</div>}

            <div className="shopping-list-content">
                <div className="add-item-form">
                    <h3 className="section-title">{editingItem ? "עריכת פריט" : "הוספת פריט חדש"}</h3>

                    <form onSubmit={handleSubmit(onSubmit)} className="item-form">
                        <div className="form-row">
                            <div className="form-group item-name">
                                <label htmlFor="Name">שם המוצר</label>
                                <input
                                    id="Name"
                                    type="text"
                                    className="form-control"
                                    {...register("Name", {
                                        required: "שדה חובה",
                                    })}
                                />
                                {errors.Name && <p className="error-message">{errors.Name.message}</p>}
                            </div>

                            <div className="form-group item-count">
                                <label htmlFor="Count">כמות</label>
                                <input
                                    id="Count"
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    {...register("Count", {
                                        required: "שדה חובה",
                                        min: { value: 1, message: "הכמות חייבת להיות לפחות 1" },
                                    })}
                                />
                                {errors.Count && <p className="error-message">{errors.Count.message}</p>}
                            </div>
                        </div>

                        <div className="form-actions">
                            {editingItem && (
                                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                                    ביטול
                                </button>
                            )}
                            <button type="submit" className="btn btn-primary">
                                {editingItem ? "עדכן פריט" : "הוסף לרשימה"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="items-list">
                    <h3 className="section-title">הפריטים שלך</h3>

                    {isLoading ? (
                        <div className="loading">טוען רשימת קניות...</div>
                    ) : shoppingItems.length === 0 ? (
                        <div className="empty-list">
                            <p>רשימת הקניות שלך ריקה.</p>
                            <p>הוסף פריטים באמצעות הטופס משמאל.</p>
                        </div>
                    ) : (
                        <ul className="shopping-items">
                            {shoppingItems.map((item) => (
                                <li key={item.Id} className="shopping-item">
                                    <div className="item-details">
                                        <span className="item-name">{item.Name}</span>
                                        <span className="item-count">כמות: {item.Count}</span>
                                    </div>
                                    <div className="item-actions">
                                        <button className="btn btn-secondary edit-btn" onClick={() => handleEdit(item)}>
                                            ערוך
                                        </button>
                                        <button className="btn btn-danger delete-btn" onClick={() => handleDelete(item.Id)}>
                                            מחק
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* דיו אישור מחיקה */}
            {showConfirm && (
                <div className="confirm-modal">
                    <div className="confirm-content">
                        <p>האם אתה בטוח שברצונך למחוק פריט זה?</p>
                        <button onClick={confirmDelete}>אישור</button>
                        <button onClick={cancelDelete}>ביטול</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ShoppingList
