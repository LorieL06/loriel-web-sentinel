/**
 * ==========================================
 * @module LorieL Web Sentinel
 * @author Bora Dogan (github.com/LorieL06)
 * @description zero-cost uptime & SSL Monitor
 * ==========================================
 * 
 * --- contribution ledger (time spent) ---
 * [format: name - hours - scope]
 * 1. Bora Dogan  - 2h - Core Uptime Logic, SSL Verification & CI/CD pipeline
 * 2.
 * =========================================?
 */

import https from 'https';
import fs from 'fs';
import path from 'path';

interface Site {
    name: string;
    url: string;
}

const SITES_PATH = path.resolve(process.cwd(), 'sites.json');

function checkSite(site: Site): Promise<void> {
    return new Promise((resolve, reject) => {
        const req = https.request(site.url, (res) => {
            const cert = (res.socket as any).getPeerCertificate?.();
            
            let sslDaysLeft = 'N/A';
            if (cert && cert.valid_to) {
                const validTo = new Date(cert.valid_to);
                const daysLeft = Math.round((validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                sslDaysLeft = daysLeft.toString();
            }

            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
                console.log(`[LorieL Sentinel] ALIVE: ${site.name} ✔ | Status: ${res.statusCode} | SSL: ${sslDaysLeft} days left`);
                resolve();
            } else {
                reject(new Error(`[LorieL Sentinel] 🚨 DOWN: ${site.name} returned status ${res.statusCode}`));
            }
        });

        req.on('error', (e) => {
            reject(new Error(`[LorieL Sentinel] 🚨 DOWN: ${site.name} | Error: ${e.message}`));
        });

        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error(`[LorieL Sentinel] 🚨 TIMEOUT: ${site.name} took too long to respond.`));
        });

        req.end();
    });
}

async function runSentinel() {
    console.log('--- LorieL Web Sentinel Starting ---');
    
    if (!fs.existsSync(SITES_PATH)) {
        console.error('Error: sites.json not found.');
        process.exit(1);
    }

    const sites: Site[] = JSON.parse(fs.readFileSync(SITES_PATH, 'utf-8'));
    let hasErrors = false;

    for (const site of sites) {
        try {
            await checkSite(site);
        } catch (error: any) {
            console.error(error.message);
            hasErrors = true;
        }
    }

    if (hasErrors) {
        console.error('\nLorieL Web Sentinel detected issues. ❌ Failing the pipeline to trigger alerts.');
        process.exit(1); // bu komut Githubın sana uyarı maili atmasını sağlar
    } else {
        console.log('\nAll systems operational. ✅ LorieL Sentinel going to sleep.');
        process.exit(0);
    }
}

runSentinel();