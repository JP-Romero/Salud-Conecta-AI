import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto('file:///app/index.html')

        await page.evaluate("""() => {
            localStorage.setItem('sc_users', JSON.stringify({'user_test': {pinHash: '1', createdAt: new Date().toISOString()}}));
            sessionStorage.setItem('sc_session', JSON.stringify({userId: 'user_test', loginAt: Date.now()}));
            localStorage.setItem('sc_consent', 'true');
        }""")
        await page.reload()

        # Ask for something that exists in the database to see the full list of pharmacies
        await page.fill('#user-input', 'paracetamol')
        await page.click('#btn-send')

        await page.wait_for_selector('.ai-message:nth-child(3)') # Wait for the pharmacy list
        await asyncio.sleep(2)

        await page.screenshot(path='pharmacy_list_full.png', full_page=True)

        # Count items in the pharmacy list
        count = await page.evaluate("""() => {
            const messages = Array.from(document.querySelectorAll('.message-content p'));
            const pharmacyMsg = messages.find(p => p.textContent.includes('Puedes conseguirlo en estas farmacias'));
            if (!pharmacyMsg) return 0;
            return pharmacyMsg.textContent.split('\\n•').length - 1;
        }""")
        print(f"Pharmacies shown: {count}")

        await browser.close()

asyncio.run(run())
