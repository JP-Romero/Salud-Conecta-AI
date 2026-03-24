import asyncio
from playwright.async_api import async_playwright
import os

async def generate_icons():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Load the HTML generator
        await page.goto(f"file://{os.getcwd()}/icon_gen.html")

        # Select the container
        icon_selector = "#capture"

        # Define the sizes
        sizes = [48, 72, 96, 144, 180, 192, 512]

        for size in sizes:
            # Resize the viewport to the desired size
            await page.set_viewport_size({"width": size, "height": size})
            # Also resize the container in the page via evaluation
            await page.evaluate(f"document.getElementById('capture').style.width = '{size}px'")
            await page.evaluate(f"document.getElementById('capture').style.height = '{size}px'")

            # Save the screenshot
            filepath = f"icon-{size}.png"
            await page.locator(icon_selector).screenshot(path=filepath, omit_background=True)
            print(f"Generated {filepath}")

            # Maskable version (same but with some padding)
            if size in [192, 512]:
                # Add padding for maskable
                await page.evaluate(f"document.querySelector('.icon-image').style.transform = 'scale(1.3)'")
                filepath_maskable = f"icon-{size}-maskable.png"
                await page.locator(icon_selector).screenshot(path=filepath_maskable, omit_background=True)
                print(f"Generated {filepath_maskable}")
                # Reset transform
                await page.evaluate(f"document.querySelector('.icon-image').style.transform = 'scale(1.6)'")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(generate_icons())
