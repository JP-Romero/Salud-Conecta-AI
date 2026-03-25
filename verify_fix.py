import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Load the app
        await page.goto("http://localhost:8000")

        # Handle login
        if await page.is_visible("#auth-screen"):
            await page.click("#tab-register")
            await page.wait_for_selector("#reg-p1", state="visible")
            await page.fill("#reg-name", "Test User")
            for i in range(1, 5):
                await page.fill(f"#reg-p{i}", "1")
            await page.click("#btn-register")

        # Privacy modal
        if await page.is_visible("#privacy-modal"):
            await page.wait_for_selector("#accept-terms", state="visible")
            await page.click("#accept-terms")
            await page.click("#btn-enter")

        # Wait for app to load
        await page.wait_for_selector("#user-input", state="visible")

        # Search for "Cefadroxilo"
        await page.fill("#user-input", "Cefadroxilo")
        await page.click("#btn-send")

        # Wait for the drug card
        await page.wait_for_selector(".drug-card", timeout=10000)

        # Get card text and normalize case for label checking
        card_text = await page.inner_text(".drug-card")
        card_text_upper = card_text.upper()

        print(f"Card Content:\n{card_text}")

        labels_to_check = ["CATEGORÍA", "DOSIS NIÑOS", "EMBARAZO", "USO PRINCIPAL", "PRECIO APROXIMADO"]
        for label in labels_to_check:
            assert label in card_text_upper, f"Label {label} not found in card"

        assert "CEFADROXILO" in card_text_upper

        # Search for a symptom to verify category there too
        await page.fill("#user-input", "Diarrea")
        await page.click("#btn-send")

        # Wait for the symptom card (last one)
        await page.wait_for_selector(".message.ai-message .drug-card >> text=Cuidados en casa")

        symptom_card_text = (await page.query_selector_all(".drug-card"))[-1].inner_text()
        symptom_card_text = await symptom_card_text
        print(f"Symptom Card Content:\n{symptom_card_text}")

        assert "CATEGORÍA" in symptom_card_text.upper()

        print("Verification successful!")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
