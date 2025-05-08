
import React, { useContext, useState } from 'react';
import axios from 'axios';
import {  Recipe } from './Types';
import { TextField, Button, Grid, Typography, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { userContext } from './userContext';
import { CatContext } from './categoriesContext';


const AddRecipe: React.FC = () => {
    const { Myuser } = useContext(userContext);
    const { categories } = useContext(CatContext);
    console.log(categories);
    
    const [recipe, setRecipe] = useState<Recipe>({
        Id: 0,
        Name: '',
        Instructions: [{ Name: '' }], // ההוראות בפורמט הנכון
        Difficulty: '',
        Duration: 0,
        Description: '',
        UserId: 0,
        CategoryId: 0,
        Img: '',
        Ingridents: [{ Name: '', Count: '', Type: '' }] // המרכיבים בפורמט הנכון
    });

    // הוספת הוראה חדשה
    const addInstruction = () => {
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            Instructions: [...prevRecipe.Instructions, { Name: '' }]
        }));
    };

    //  שינוי הוראה ספציפית
    const handleInstructionChange = (index: number, value: string) => {
        const newInstructions = [...recipe.Instructions];
        newInstructions[index] = { Name: value };
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            Instructions: newInstructions
        }));
    };

    // שינוי ערך של שדה רגיל (שם, תיאור וכו')
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            [name]: name === "Difficulty" || name === "CategoryId" ? value : ["Duration", "UserId", "CategoryId"].includes(name) ? Number(value) : value
        }));
    };

    // שינוי מרכיב ספציפי
    const handleIngredientsChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newIngridents = [...recipe.Ingridents];
        newIngridents[index] = { ...newIngridents[index], [name]: value };
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            Ingridents: newIngridents
        }));
    };

    //  הוספת מרכיב חדש
    const addIngredient = () => {
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            Ingridents: [...prevRecipe.Ingridents, { Name: '', Count: '', Type: '' }]
        }));
    };

    //  שליחת הנתונים לשרת
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (Myuser) {        
            console.log("📤 Recipe before sending:", JSON.stringify(recipe, null, 2));
            const recipeWithUserId = {
                ...recipe,
                UserId: Myuser.Id // הנחה ש-Myuser כולל שדה Id
            };    
            try {
                const response = await axios.post('http://localhost:8080/api/recipe', recipeWithUserId);
                console.log('✅ Recipe added successfully:', response.data);
            } catch (error) {
                console.error('❌ Error adding recipe:', error);
            }
        }
        else{
            alert("לא ניתן להוסיף מתכון כי אתה לא מחובר.");
        }
    };

    return (
        <form onSubmit={handleSubmit}style={{ marginTop: '64px' }}>
            <Typography variant="h4" gutterBottom>
                Add Recipe
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField name="Name" label="Name" fullWidth onChange={handleChange} required />
                </Grid>
                <Grid item xs={12}>
                    <TextField name="Description" label="Description" multiline rows={4} fullWidth onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                        <InputLabel id="difficulty-label">Difficulty</InputLabel>
                        <Select
                            labelId="difficulty-label"
                            name="Difficulty"
                            onChange={handleChange}
                            defaultValue=""
                        >
                            <MenuItem value="קל">קל</MenuItem>
                            <MenuItem value="בינוני">בינוני</MenuItem>
                            <MenuItem value="קשה">קשה</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField name="Duration" type="number" label="Duration" fullWidth onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                        <InputLabel id="CategoryId-label">Category</InputLabel>
                        <Select
                            labelId="CategoryId-label"
                            name="CategoryId"
                            value={recipe.CategoryId ? recipe.CategoryId.toString() : ''} // עדכון ה-value
                            onChange={handleChange}
                        >
                            {categories&&categories.map((item)=> <MenuItem key={item.Id} value={item.Id}>{item.Name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField name="Img" label="Image URL" fullWidth onChange={handleChange} required />
                </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
                Instructions
            </Typography>
            {recipe.Instructions.map((instruction, index) => (
                <Grid item xs={12} key={index}>
                    <TextField
                        label={`Instruction ${index + 1}`}
                        value={instruction.Name}
                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                        fullWidth
                        required
                    />
                </Grid>
            ))}
            <Button onClick={addInstruction}>Add Instruction</Button>

            <Typography variant="h6" gutterBottom>
                Ingredients
            </Typography>
            {recipe.Ingridents.map((ingredient, index) => (
                <Grid container spacing={2} key={index}>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            name="Name"
                            label="Ingredient Name"
                            fullWidth
                            value={ingredient.Name}
                            onChange={(e) => handleIngredientsChange(index, e)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            name="Count"
                            label="Count"
                            fullWidth
                            value={ingredient.Count}
                            onChange={(e) => handleIngredientsChange(index, e)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            name="Type"
                            label="Type"
                            fullWidth
                            value={ingredient.Type}
                            onChange={(e) => handleIngredientsChange(index, e)}
                            required
                        />
                    </Grid>
                </Grid>
            ))}
            <Button onClick={addIngredient}>Add Ingredient</Button>

            <Button variant="contained" color="primary" type="submit" style={{ marginTop: '16px' }}>
                Submit Recipe
            </Button>
        </form>
    );
};

export default AddRecipe;