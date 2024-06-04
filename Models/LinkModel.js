import mongoose from "mongoose";

const LinkSchema = mongoose.Schema({
    originalUrl: {
        type: String,
        required: false,
        default: ""
    },
    uniqueId: {
        type: String,
        required: true,
        unique: true
    },

    clicks: [{
        date: {
            type: Date,
            default: Date.now
        },
        ipAddress: {
            type: String
        },
        targetParamValue: {
            type: String,
            default: ''
        }
    }],
    targetParamName: {
        type: String,
        default: 't'
    },
    targetValues: [{
        name: { type: String },
        value: { type: Number }
    }]
});
//  { timestamps: true });  // הוספת חותמות זמן ליצירה ועדכון
const Link = mongoose.model("link", LinkSchema);
export default mongoose.model("link", LinkSchema);