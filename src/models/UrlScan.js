import mongoose from 'mongoose';

const urlScanSchema = new mongoose.Schema({
    scanId: {
        type: String,
        required: true,
        unique: true,
    },
    urlHash: {
        type: String,
        required: true,
        index: true,
    },
    verdict: {
        label: String,
        is_threat: Boolean,
        threat_types: [String],
    },
    aiResult: {
        ai_verdict: String,
        ai_actions: [String],
        ai_model_used: String,
        ai_fallback_used: Boolean,
    },
    ipCountry: String,
    timestamp: Date,
}, {
    timestamps: true,
});

export default mongoose.models.UrlScan || mongoose.model('UrlScan', urlScanSchema);