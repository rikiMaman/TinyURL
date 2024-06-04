import LinkModel from "../Models/LinkModel.js";
import crypto from 'crypto';


export function generateUniqueId(url) {
  // יצירת האש SHA-256 מה-URL
  const hash = crypto.createHash('sha256').update(url).digest('hex');
  // קיצור ההאש ל-8 תווים ראשונים לדוגמה (ניתן לשנות לפי צורך)
  const shortHash = hash.substring(0, 8);
  return shortHash;
}
const LinkController = {
  // קבלת כל הקישורים
  getAll: async (req, res) => {
    try {
      const links = await LinkModel.find();
      console.log(`the content: ${links}`)
      res.json(links);

    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  // קבלת קישור לפי id
  getById: async (req, res) => {
    try {
      const links = await LinkModel.find({ _id: req.params.id })
      res.json(links);
    } catch (e) {
      res.status(400).json({ message: e.message })
    }
  },
  // הוספת קישור
  add: async (req, res) => {
    const { originalUrl } = req.body;
    const { targetValues } = req.body;
    try {
      const uniqueId = generateUniqueId(originalUrl);
      const newLink = await LinkModel.create({ originalUrl: originalUrl, uniqueId: uniqueId, targetValues: targetValues });//הוספת חדש
      res.json(newLink);
      // res.status(201).json(uniqueId);

    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  // עדכון קישור לפי id
  update: async (req, res) => {
    const { id } = req.params;
    const { originalUrl } = req.body;
    try {
      const updatedLink = await LinkModel.findByIdAndUpdate(id, req.body, { originalUrl: originalUrl });//עדכון לפי מזהה
      res.json(updatedLink);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  // מחיקת קישור
  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await LinkModel.findByIdAndDelete(id);//מחיקה לפי מזהה
      res.json(deleted);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  // הוספת מקור תפוצה חדש לפי מזהה  של קישור מקוצר
  addTarget: async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    try {
      const link = await LinkModel.findById(id)
      if (link.targetValues.find(t => t.name == name))
        return res.status(409).json({ message: `There is already a target name with this name` })
      const target = {
        name: name,
        value: 0
      }
      link.targetValues.push(target)
      await link.save()
      res.json(link)
    } catch (e) {
      res.status(400).json({ message: e.message })
    }
  },
  // קבלת כל מקורות התפוצה - לפי מזהה קישור
  getTargets: async (req, res) => {
    const { id } = req.params
    try {
      const link = await LinkModel.findById(id)
      const targets = link.targetValues
      res.json(targets)
    } catch (e) {
      res.status(400).json({ message: e.message })
    }
  },
  // getLinkStats: async (req, res) => {
  //   const { uniqueId } = req.params;
  //   try {
  //     const link = await LinkModel.findOne({ uniqueId });
  //     if (!link) {
  //       return res.status(404).json({ message: "Link not found" });
  //     }
  //     // פילוח וחישוב סטטיסטיקות לפי ערכי ה-targetValues
  //     const stats = link.targetValues.reduce((acc, targetValue) => {
  //       // ספירת כל הקליקים שיש להם את ערך ה-value המתאים ל-name הנוכחי ב-targetValues
  //       const clicksCount = link.clicks.filter(click => click.targetParamValue === targetValue.value).length;
  //       acc[targetValue.name] = (acc[targetValue.name] || 0) + clicksCount;
  //       return acc;
  //     }, {});

  //     // מחזירים מידע על סטטיסטיקות הקליקים
  //     res.json({
  //       originalUrl: link.originalUrl,
  //       uniqueId: link.uniqueId,
  //       stats
  //     });

  //   } catch (error) {
  //     console.log('Error retrieving link statistics:', error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // }
}

export default LinkController;