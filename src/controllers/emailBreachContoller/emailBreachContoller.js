import EmailBreach from "../../models/EmailBreach.js";
import generateUniqueId from "../../utils/generateUniqueId.js";
import getMostRecentBreachDate from "../../utils/getMostRecentBreachDate.js";
import getMostSensitiveData from "../../utils/getMostSensitiveData.js";
import isValidEmail from "../../utils/isValidEmail.js";



/********** create coupons controller is here **********/
const emailBreachCcheck = async (req, res) => {

    try {


        // Validate body data using Joi schema
        const { email, consent } = req.body;
        const ip = req.ip;


        // email address validity check
        const isvalid = isValidEmail(email);
        if (!isvalid) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address.",
            });
        }





        // fetch request in the have ibeen pwned  api
        const rs = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}?truncateResponse=false&includeUnverified=false`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "hibp-api-key": process.env.HIBP_API_KEY,
                "User-Agent": "Scam"
            },
        })


        if (rs.status === 404) {


            const savebleBreachData = {
                scan_id: generateUniqueId(),
                email,
                checked_at: new Date(),
                ip,
                text: "Good news — your email was not found in any known data breaches",
                breach_summary: {
                    breach_count: 0,
                    is_breached: false,
                    most_recent_breach: "",
                    most_sessitive_Data: [],
                    risk_tier: "none"
                },
                breachs: [],

            }

            const breach = await EmailBreach.create(savebleBreachData);

            // No breach found (this is NOT an error)
            return res.status(201).json({
                success: true,
                message: "No breach found for this email",
                data: breach
            });

        }


        const result = await rs.json();


        const breachlength = result.length;

        let risk;
        let text;
        let sensitiveData = getMostSensitiveData(result);



        if (breachlength === 0) {
            risk = "none";
            text = "Good news — your email was not found in any known data breaches";
        } else if (breachlength > 0 && breachlength <= 1) {
            risk = "low";
            text = "Your email appeared in 1 breach. Lowseverity data was exposed — still worth reviewing.";
        } else if (breachlength >= 2 && breachlength <= 3) {
            risk = "medium";
            text = `Your email appeared in ${breachlength} breaches. Some sensitive data was exposed. Take action on the steps below.`;
        } else if (breachlength >= 4) {
            risk = "high";
            text = `Your email appeared in ${breachlength} breaches. Critical data was exposed. Act immediately.`;
        } else if (breachlength >= 4 && (sensitiveData?.includes("Password") || sensitiveData?.includes("Usernames") || sensitiveData?.includes("Credit Card"))) {
            risk = "critical";
            text = `Urgent — your email appeared in a recent breach exposed critical data. Take action now.`;
        }



        const savebleBreachData = {
            scan_id: generateUniqueId(),
            email,
            checked_at: new Date(),
            ip,
            text: text,
            breach_summary: {
                breach_count: breachlength,
                is_breached: true,
                most_recent_breach: getMostRecentBreachDate(result),
                most_sessitive_Data: sensitiveData,
                risk_tier: risk
            },
            breachs: result,

        }

        const breach = await EmailBreach.create(savebleBreachData);


        // Send success response
        return res.status(201).json({
            success: true,
            message: "Email breach checked successfully",
            data: breach
        });

    } catch (err) {
        console.error("Error Email breach checked:", err.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong while Email breach checked.",
        });
    }

};






/*********** modules export from here ************/
export { emailBreachCcheck };

