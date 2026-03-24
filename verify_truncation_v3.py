from playwright.sync_api import sync_playwright, expect

def verify_changes(page):
    # Go to the app
    page.goto("http://localhost:8000")
    page.wait_for_timeout(2000)

    # Try to click the register tab button
    page.click("#tab-register")
    page.wait_for_timeout(500)

    # Fill registration form
    page.fill("#reg-name", "Test User")

    # Fill PIN 1234
    page.fill("#reg-p1", "1")
    page.fill("#reg-p2", "2")
    page.fill("#reg-p3", "3")
    page.fill("#reg-p4", "4")

    # Click create account
    page.click("#btn-register")
    page.wait_for_timeout(2000)

    # Handle privacy modal if it appears
    if page.is_visible("#privacy-modal"):
        page.check("#accept-terms")
        page.click("#btn-enter")
        page.wait_for_timeout(1000)

    # Search for Ibuprofeno
    page.fill("#user-input", "Ibuprofeno")
    page.click("#btn-send")
    page.wait_for_timeout(3000)

    # Take screenshot of the drug card
    page.screenshot(path="/home/jules/verification/drug_card_v3.png")

    # Click ALL visible "Leer más" buttons
    btns = page.query_selector_all(".btn-expand-drug")
    print(f"Found {len(btns)} expansion buttons for Ibuprofeno")
    for btn in btns:
        if btn.is_visible():
            btn.click()
            page.wait_for_timeout(200)

    page.screenshot(path="/home/jules/verification/drug_card_v3_expanded.png")

    # Search for a symptom
    page.fill("#user-input", "Dolor de cabeza")
    page.click("#btn-send")
    page.wait_for_timeout(3000)

    # Take screenshot of the symptom card
    page.screenshot(path="/home/jules/verification/symptom_card_v3.png")

    # Click visible "Leer más" buttons
    btns = page.query_selector_all(".btn-expand-drug")
    print(f"Found {len(btns)} expansion buttons total")
    for btn in btns:
        if btn.is_visible():
            btn.click()
            page.wait_for_timeout(200)

    page.screenshot(path="/home/jules/verification/final_state_v3.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="/home/jules/verification/video")
        page = context.new_page()
        try:
            verify_changes(page)
        finally:
            context.close()
            browser.close()
