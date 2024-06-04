import LinkModel from "../Models/LinkModel.js";


const RedirectController = {
    redirectLink: async (req, res) => {
        const { uniqueId } = req.params;
        try {
            const link = await LinkModel.findOne({ uniqueId });
            if (link) {
                const targetName = req.query[link.targetParamName];
                // בדיקה אם קיים שם ב-query string והוספת קליק למערך
                if (targetName) {
                    // חיפוש האלמנט במערך targetValues
                    const target = link.targetValues.find(t => t.name === targetName);
                    if (target) {
                        target.value += 1; // עדכון ה-value אם נמצא האלמנט
                    } else {
                        // אם לא נמצא, אפשר להוסיף לוג או התמודדות אחרת
                        console.log('Target name not found in targetValues');
                    }
                    link.clicks.push({ ipAddress: req.ip, targetParamValue: targetName });
                } else {
                    link.clicks.push({ ipAddress: req.ip });
                }
                await link.save();
                console.log('Redirecting to:', link.originalUrl);
                res.redirect(link.originalUrl); // מבצעים redirect
            } else {
                console.log('Link not found');
                res.status(404).send('Link not found');
            }
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).send('Server error');
        }
    }
}

export default RedirectController;
