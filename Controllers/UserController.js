import UserModel from "../Models/UserModel.js";
import LinkModel from "../Models/LinkModel.js";
import crypto from 'crypto';


// const crypto = require('crypto');

export function generateUniqueId(url) {
    // יצירת האש SHA-256 מה-URL
    const hash = crypto.createHash('sha256').update(url).digest('hex');
    // קיצור ההאש ל-8 תווים ראשונים לדוגמה (ניתן לשנות לפי צורך)
    const shortHash = hash.substring(0, 8);

    return shortHash;
}
const UserController = {
    // קבלת כל המשתמשים עם כל פרטיהם 
    getAll: async (req, res) => {
        try {
            const users = await UserModel.find();
            res.json(users);

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    // קבלת משתמש לפי id
    getById: async (req, res) => {
        try {
            const user = await UserModel.find({ _id: req.params.id })
            res.json(user);
        } catch (e) {
            res.status(400).json({ message: e.message })
        }
    },

    //הוספת משתמש חדש 
    add: async (req, res) => {
        const { name, email, password, originalUrls } = req.body; // צריך להבטיח שoriginalUrls מגיע כמערך של מחרוזות
        try {
            const links = await Promise.all(originalUrls.map(async (url) => {
                const uniqueId = generateUniqueId(url);
                console.log(`The unique ID for ${url} is ${uniqueId}`);
                const newLink = await LinkModel.create({
                    originalUrl: url,
                    uniqueId: uniqueId,
                    targetValues: [] // ללא ערכים נוספים בשלב זה
                });
                await newLink.save();
                return newLink._id;
            }));
        
            const newUser = await UserModel.create({
                name,
                email,
                password,
                links
            });
            await newUser.save();
        
            res.status(201).json({ user: newUser._id, links });
        } catch (error) {
            console.error('Error creating user and links:', error);
            res.status(400).json({ message: error.message });
        }
    },
    
    // עדכון משתמש קיים   
    update: async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        const { email } = req.body;
        const { password } = req.body;
        const { links } = req.body;
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { name: name, email: email, password: password, links: links });//עדכון לפי מזהה
            res.json(updatedUser);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    },

    // מחיקת משתמש קיים לפי id
    delete: async (req, res) => {
        const { id } = req.params;
        try {
            const deleted = await UserModel.findByIdAndDelete(id);
            res.json(deleted);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    },
    // getCount: async (req,res) =>{
    //     const { uniqueId } = req.params;
    //     const { name, value } = req.body;
    //     try {
    //         const link = await LinkModel.findOne({ uniqueId });
    //         if (link) {
    //             link.targetValues.push({ name, value });
    //             await link.save();
    //             res.status(201).json(link);
    //             // res.json(link.clicks);
    //         } else {
    //             res.status(404).send('Link not found');
    //         }
    //     } catch (error) {
    //         res.status(500).send('Server error');
    //     }
    // }
}

export default UserController;