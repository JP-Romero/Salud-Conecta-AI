
import asyncio
from playwright.async_api import async_playwright
import os

async def verify_long_response():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        # Go to the app
        await page.goto('http://localhost:8080')

        # Login
        await page.fill('input[type="password"]', '1234')
        await page.click('button:has-text("Entrar")')

        # Wait for chat
        await page.wait_for_selector('.chat-container')

        # Send a message that should trigger a long response
        # Using a prompt that asks for detailed information
        await page.fill('#chat-input', 'Dame una lista detallada de todos los centros de salud en Granada y qué servicios ofrecen cada uno.')
        await page.click('#send-btn')

        # Wait for the AI response (it might take a while)
        # We wait for the message to appear and then wait for it to stop "typing" or just wait a few seconds
        await asyncio.sleep(5)

        # Take a screenshot of the chat
        await page.screenshot(path='/home/jules/verification/long_response.png')

        # Check if "Leer más" is visible
        read_more_visible = await page.is_visible('.read-more-btn')
        print(f"Read more button visible: {read_more_visible}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_long_response())
