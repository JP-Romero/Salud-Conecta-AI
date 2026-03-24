import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Use file:/// because it's a local file in the sandbox
        await page.goto('file:///app/index.html')

        # Bypass Auth (we can mock localStorage or just click if there's a dev mode)
        # Based on app.js, we can set sc_session and sc_consent
        await page.evaluate("""() => {
            localStorage.setItem('sc_users', JSON.stringify({'user_test': {pinHash: '1', createdAt: new Date().toISOString()}}));
            sessionStorage.setItem('sc_session', JSON.stringify({userId: 'user_test', loginAt: Date.now()}));
            localStorage.setItem('sc_consent', 'true');
        }""")
        await page.reload()

        # Send a message to trigger a long response (e.g., asking for a medicine in the DB)
        # First, let's see what's in base-datos-salud.js to find a good candidate
        await page.fill('#user-input', 'paracetamol')
        await page.click('#btn-send')

        # Wait for the AI response
        await page.wait_for_selector('.ai-message')
        await asyncio.sleep(2) # Wait for cards to render

        # Take a screenshot
        await page.screenshot(path='truncation_test.png', full_page=True)

        # Check if "Leer más" is visible
        read_more_visible = await page.is_visible('.btn-expand-drug')
        print(f"Read more button visible: {read_more_visible}")

        # Check drug content height or clamp
        clamp = await page.evaluate("""() => {
            const el = document.querySelector('.drug-section-content');
            return el ? getComputedStyle(el).webkitLineClamp : 'not found';
        }""")
        print(f"Line clamp: {clamp}")

        await browser.close()

asyncio.run(run())
