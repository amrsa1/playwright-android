import { AndroidDevice, test as base, _android } from '@playwright/test';
import LandingPage from '../src/pages/landingPage';

const retries = 3;
const timeoutMs = 12000;

function timeoutPromise(ms: number | undefined) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error(`Timed out after ${ms}ms`));
        }, ms);
    });
}

async function instintiateConnection(func: { (): Promise<void>; (): any; }, retries: number, timeout: number | undefined) {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await Promise.race([func(), timeoutPromise(timeout)]);
            return result;
        } catch (error) {
            console.error(`Error on attempt ${i + 1}: ${error}`);
            if (i === retries - 1) {
                throw error;
            } else {
                await new Promise(resolve => setTimeout(resolve, timeout));
            }
        }
    }
}

let device: AndroidDevice;
type MyFixtures = {
    landingPage: LandingPage;
    afterEach: void;
    beforeEach: void;

};



const fixtures = base.extend<MyFixtures>({

    page: async ({ baseURL }, use) => {
        instintiateConnection(
            async () => {
                await _android.launchServer({ deviceSerialNumber: 'emulator-5554', omitDriverInstall: false })
                    .then(async (res) => {
                        console.log(res.wsEndpoint());
                        device = await _android.connect(res.wsEndpoint());
                        await device.shell('pm clear com.android.chrome');
                        await device.shell('am set-debug-app --persistent com.android.chrome');
                        const context = await device.launchBrowser({
                            baseURL: baseURL
                        });
                        const page = await context.newPage();
                        await use(page);
                    });
            },
            retries,
            timeoutMs
        );

    },

    landingPage: async ({ page }, use) => {
        const landingPage = new LandingPage(page)
        await use(landingPage)
    },

    beforeEach: [async ({ page }, use) => {
        await device.shell('input keyevent 4');
        await page.context().tracing.start({ screenshots: true, snapshots: true, sources: true })
        await use()
    }, { auto: true }],

    afterEach: [async ({ page }, use, testInfo) => {
        await use()
        if (testInfo.status == 'failed') {
            await page.context().tracing.stop({ path: `${testInfo.outputDir}/trace.zip` })
            await page.screenshot({ path: `${testInfo.outputDir}/screenshot.png` })
            await testInfo.attach('screenshot', { path: `${testInfo.outputDir}/screenshot.png`, contentType: 'image/png' });
            await testInfo.attach('trace', { path: `${testInfo.outputDir}/trace.zip`, contentType: 'application/zip' });
        }
        await page.close()
    }, { auto: true }],

});

export { fixtures };

