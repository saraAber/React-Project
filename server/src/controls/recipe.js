const { GetRecipeDb, AddRecipyDB, EditRecipyDb, DeleteDb, GetRecipesDb } = require("../reposetory/recipe");

const GetAllRecipe = (_req, res) => {
    GetRecipesDb()
        .then(x => res.send(x))
        .catch(err => {
            if (err?.errors[0]) {
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)
        })
}

const GetRecipe = (req, res) => {
    const { Id } = req.params;
    GetRecipeDb(Id)
        .then(x => res.send(x))
        .catch(err => {
            if (err?.errors[0]) {
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)

        })
}


const AddRecipy = (req, res) => {
    const {
        Name, UserId, Categoryid, Img, Duration, Difficulty, Description,
        Ingridents, Instructions 
    } = req.body;

    // בדוק אם כל המידע נשלח
    if (!Name || !UserId || !Categoryid || !Img || !Duration || !Difficulty || !Description || !Ingridents || !Instructions) {
        return res.status(400).send('המידע שנשלח לא תקין');
    }

    // ודא ש-Difficulty הוא מספר
    if (typeof Difficulty !== 'string') {
        return res.status(400).send('רמת הקושי חייבת להיות מחרוזת');
    }

    const newRecipe = {
        Name, UserId, Categoryid, Img, Duration, Difficulty, Description,
        Ingridents, Instructions
    };

    AddRecipyDB(newRecipe)
        .then(x => {
            return res.status(201).send(x);
        })
        .catch(err => {
            console.error("Error adding recipe:", err); // הדפס את השגיאה
            if (err?.errors && err.errors.length > 0) {
                return res.status(400).send(err.errors[0].message);
            }
            return res.status(500).send('שגיאה בהוספת המתכון');
        });
        
        
        
}


const EditRecipy = (req, res) => {
    const { Id,
        Name, UserId, Categoryid, Img, Duration, Difficulty, Description,
        Ingridents, Instructions } = req.body;

    if (!Id || !Name || !UserId || !Categoryid || !Img || !Duration || !Difficulty || !Description || !Ingridents || !Instructions) {
        // לא נשלח מידע
        return res.status(400).send('המידע שנשלח לא תקין')
    };

    const updateRecipe = {
        Id, Name, Categoryid, Img, Duration, Difficulty,
        Description, Ingridents, Instructions
    };
    EditRecipyDb(updateRecipe)
        .then(x => res.send(x))
        .catch(err => {
            if (err?.errors[0]) {
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)

        })

}

const Delete = (req, res) => {
    const { Id } = req.params;
    DeleteDb(Id)
        .then(_ => res.send('ok'))
        .catch(err => {
            if (err?.errors[0]) {
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)

        })

}

module.exports = { Delete, EditRecipy, AddRecipy, GetAllRecipe, GetRecipe };