import requests
from bs4 import BeautifulSoup
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

disease_name = "Alexander Disease"

def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=chrome_options)

def get_trial_ids(driver, disease, max_trials=5):
    encoded_disease = disease.replace(' ', '%20')
    url = f"https://clinicaltrials.gov/search?cond={encoded_disease}&aggFilters=status:not%20rec"
    
    driver.get(url)
    
    wait = WebDriverWait(driver, 10)
    trials = []
    # #main-content > ctg-search-results-page > div.bg-white.desktop\:margin-top-4.ng-star-inserted > section > div > div > div > ctg-search-results-list > div.margin-bottom-5 > ctg-search-hit-card:nth-child(2) > div > div.headline > div.selection > div
    #main-content > ctg-search-results-page > div.bg-white.desktop\:margin-top-4.ng-star-inserted > section > div > div > div > ctg-search-results-list > div.margin-bottom-5 > ctg-search-hit-card:nth-child(2) > div > div.display-flex.flex-row.flex-align-center.nct-row.flex-wrap > div.nct-id
    #main-content > ctg-search-results-page > div.bg-white.desktop\:margin-top-4.ng-star-inserted > section > div > div > div > ctg-search-results-list > div.margin-bottom-5 > ctg-search-hit-card:nth-child(3) > div > div.display-flex.flex-row.flex-align-center.nct-row.flex-wrap > div.nct-id
    #main-content > ctg-search-results-page > div.bg-white.desktop\:margin-top-4.ng-star-inserted > section > div > div > div > ctg-search-results-list > div.margin-bottom-5 > ctg-search-hit-card:nth-child(4) > div > div.display-flex.flex-row.flex-align-center.nct-row.flex-wrap > div.nct-id
    for i in range(1, max_trials + 1):
        selector = f"#main-content > ctg-search-results-page > div.bg-white.desktop\:margin-top-4.ng-star-inserted > section > div > div > div > ctg-search-results-list > div.margin-bottom-5 > ctg-search-hit-card:nth-child({i+1}) > div > div.headline > div.selection > div"
        try:
            nct_element = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
            nct_id = nct_element.text
            trials.append(nct_id)
            print(f"Found NCT ID: {nct_id}")
        except:
            print(f"No more NCT IDs found after {len(trials)} trials. Stopping.")
            break
        
    
    return trials

# Set up the WebDriver once
driver = setup_driver()

try:
    print(f"Searching for clinical trials related to: {disease_name}")
    top_trials = get_trial_ids(driver, disease_name)

    print(f"\nTop Clinical Trials for {disease_name}:")
    if top_trials:
        for i, trial in enumerate(top_trials, 1):
            print(f"{i}. {trial}")
    else:
        print("No trials found.")
finally:
    driver.quit()