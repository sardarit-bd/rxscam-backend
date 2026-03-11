import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

class GoogleWebRiskService {
    constructor() {
        this.apiKey = process.env.GOOGLE_WEB_RISK_API_KEY;
        console.log("WEB RISK API KEY:", this.apiKey, "\n");

        this.baseUrl = "https://webrisk.googleapis.com/v1";

        this.threatTypes = [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "SOCIAL_ENGINEERING_EXTENDED_COVERAGE",
        ];
    }

    async checkUrl(url) {

        // DEVELOPMENT MODE BYPASS
        console.log("⚠️ Google Web Risk API bypassed (development mode)");

        return {
            isThreat: false,
            threatTypes: [],
            expireTime: null,
        };

        /*
        -----------------------------
        ORIGINAL API CODE (DISABLED)
        -----------------------------

        try {
            const params = new URLSearchParams({
                key: this.apiKey,
                uri: url,
            });

            this.threatTypes.forEach((type) => {
                params.append("threatTypes", type);
            });

            const response = await fetch(
                `${this.baseUrl}/uris:search?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Google Web Risk API error: ${response.status}`);
            }

            const data = await response.json();

            return {
                isThreat: !!data.threat,
                threatTypes: data.threat?.threatTypes || [],
                expireTime: data.threat?.expireTime || null,
            };

        } catch (error) {
            console.error("Google Web Risk error:", error);
            throw error;
        }
        */
    }
}

export default new GoogleWebRiskService();