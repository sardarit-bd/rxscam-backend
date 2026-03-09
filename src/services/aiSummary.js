// backend/services/aiSummary.js
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

class AISummaryService {
    constructor() {
        this.anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    getSystemPrompt() {
        return `You are ScamRx, a friendly and expert digital safety assistant helping everyday people - including elderly users - understand whether a URL is dangerous.

You will receive a JSON object containing:
- url_domain: the domain portion of the URL that was scanned
- google_web_risk_result: either 'CLEAN' or a list of threat types found
- threat_types: an array of threat type strings (may be empty)

Write a response that includes exactly three parts, separated by newlines:

VERDICT: A single bolded label - one of: 'No Known Threats Found' (for clean results) 'Confirmed Phishing Page' (for SOCIAL ENGINEERING) 'Suspected Phishing Page' (for SOCIAL ENGINEERING_EXTENDED_COVERAGE) 'Malware Distribution Site' (for MALWARE) 'Unwanted Software Site' (for UNWANTED_SOFTWARE)

SUMMARY: 2-3 sentences in plain, warm language. Explain what was found and what it means. Do not use technical jargon. Write as if speaking to someone who is not comfortable with technology. For clean results, be reassuring but honest that 'not found' is not the same as 'guaranteed safe'. For threat results, be clear and direct without causing panic.

ACTIONS: A numbered list of 2-4 specific actions the user should take right now. Keep each action to one sentence. Start with the most urgent action first.

Do not include any other text, preamble, or explanation outside of these three sections. Do not use markdown headers - just the labels as shown.`;
    }

    async generateSummary(domain, gwrResult) {
        const isThreat = gwrResult.isThreat;
        const threatTypes = gwrResult.threatTypes || [];

        const userMessage = JSON.stringify({
            url_domain: domain,
            google_web_risk_result: isThreat ? 'THREAT_FOUND' : 'CLEAN',
            threat_types: threatTypes,
        });

        // Try Claude first
        try {
            const claudeResult = await this.tryClaude(userMessage);
            if (claudeResult) return claudeResult;
        } catch (error) {
            console.error('Claude failed:', error);
        }

        // Fallback to GPT-4o
        try {
            const gptResult = await this.tryGPT4o(userMessage);
            if (gptResult) return { ...gptResult, fallbackUsed: true };
        } catch (error) {
            console.error('GPT-4o failed:', error);
        }

        // Both failed - use static fallback
        return {
            ...this.getStaticFallback(gwrResult),
            fallbackUsed: true,
        };
    }

    async tryClaude(userMessage) {
        const response = await this.anthropic.messages.create({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 400,
            system: this.getSystemPrompt(),
            messages: [
                { role: 'user', content: userMessage },
            ],
        });

        const text = response.content[0].text;
        return this.parseAISummary(text);
    }

    async tryGPT4o(userMessage) {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            max_tokens: 400,
            messages: [
                { role: 'system', content: this.getSystemPrompt() },
                { role: 'user', content: userMessage },
            ],
        });

        const text = response.choices[0].message.content;
        return this.parseAISummary(text);
    }

    parseAISummary(rawText) {
        const lines = rawText.trim().split('\n').filter(l => l.trim());
        let verdict = '';
        let summary = '';
        const actions = [];
        let section = '';

        for (const line of lines) {
            if (line.startsWith('VERDICT:')) {
                verdict = line.replace('VERDICT:', '').trim();
                section = 'verdict';
            } else if (line.startsWith('SUMMARY:')) {
                summary = line.replace('SUMMARY:', '').trim();
                section = 'summary';
            } else if (line.startsWith('ACTIONS:')) {
                section = 'actions';
            } else if (section === 'summary') {
                summary += ' ' + line.trim();
            } else if (section === 'actions' && /^\d+\./.test(line)) {
                actions.push(line.replace(/^\d+\.\s*/, '').trim());
            }
        }

        return { ai_verdict: verdict, ai_summary: summary, ai_actions: actions };
    }

    getStaticFallback(gwrResult) {
        const threatTypes = gwrResult.threatTypes || [];

        if (!gwrResult.isThreat) {
            return {
                ai_verdict: 'No Known Threats Found',
                ai_summary: "Google's threat database did not flag this URL as a known phishing site, malware source, or unwanted software distributor. That said, new threats appear constantly — be cautious with any link you weren't expecting to receive.",
                ai_actions: [
                    'Be cautious with any unexpected links, even if they look safe',
                    'Check the sender of the message that contained this link',
                    'Consider using ScamRx for continuous protection',
                ],
            };
        }

        if (threatTypes.includes('SOCIAL_ENGINEERING')) {
            return {
                ai_verdict: 'Confirmed Phishing Page',
                ai_summary: 'Google has identified this URL as a phishing page — a site designed to steal your personal information or login credentials.',
                ai_actions: [
                    'Do not visit this page or enter any information',
                    'Change your passwords immediately if you already visited this site',
                    'Contact your bank if you entered payment details',
                    'Delete the message that contained this link',
                ],
            };
        }
    }
}

export default new AISummaryService();