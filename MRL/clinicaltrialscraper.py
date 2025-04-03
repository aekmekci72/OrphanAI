import requests
from bs4 import BeautifulSoup
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

def get_nct_ids(driver, disease, max_ids=5):
    encoded_disease = disease.replace(' ', '%20')
    url = f"https://clinicaltrials.gov/search?cond={encoded_disease}&aggFilters=status:not%20rec"
    
    driver.get(url)
    
    wait = WebDriverWait(driver, 5)
    trials = []
    for i in range(1, max_ids + 1):
        selector = f"#main-content > ctg-search-results-page > div.bg-white.desktop\:margin-top-4.ng-star-inserted > section > div > div > div > ctg-search-results-list > div.margin-bottom-5 > ctg-search-hit-card:nth-child({i+1}) > div > div.headline > div.selection > div"
        try:
            nct_element = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
            nct_id = nct_element.text
            trials.append(nct_id)
            print(f"Found NCT ID: {nct_id}")
        except Exception as e:
            print(f"No more NCT IDs found after {len(trials)} trials. Stopping.")
            break
        
    
    return trials

def get_trial_title(driver, nct_id, disease):
    encoded_disease = disease.replace(' ', '%20')
    url = f"https://clinicaltrials.gov/study/{nct_id}?cond={encoded_disease}&aggFilters=status:not%20rec"
    
    driver.get(url)
    info = []
    selectors = [
        "#main-content > ctg-study-details > section > ctg-study-details-top-info > div > h2"
    ]
    
    wait = WebDriverWait(driver, 5)
    for selector in selectors:
        try:
            title_element = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
            
            info.append(title_element.text)
        except:
            info.append('')
            continue
    
    selectors1 = [
        "#brief-summary > div > div"
    ]
    
    wait = WebDriverWait(driver, 5)
    for selector in selectors1:
        try:
            purpose = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
            info.append(purpose.text)
        except:
            info.append('')
            continue

    selectors2 = [
        "#detailed-description > div > div"
    ]
    
    wait = WebDriverWait(driver, 5)
    for selector in selectors2:
        try:
            detailed_description = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
            info.append(detailed_description.text)
        except:
            info.append('')
            continue

    selectors3 = [
        "#overviewResourceLinks > div:nth-child(1) > ctg-external-link-ref:nth-child(1) > a",
        "#overviewResourceLinks > div:nth-child(2) > ctg-external-link-ref:nth-child(1) > a",
        "#overviewResourceLinks > div:nth-child(3) > ctg-internal-link-ref > a",
    ]
    links = []
    wait = WebDriverWait(driver, 5)

    for selector in selectors3:
        try:
            element = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
            link = element.get_attribute('href')
            if link:
                links.append(link)
        except:
            print(f"Could not find or process selector: {selector}")
            continue
    info.append(links)

    selectors4 = [
        "#contacts-and-locations > ctg-study-contacts-and-locations > div > div > div:nth-child(1) > ctg-study-contact-info > p:nth-child(2) > span",
        "#contacts-and-locations > ctg-study-contacts-and-locations > div > div > div:nth-child(1) > ctg-study-contact-info > p:nth-child(3) > ctg-phone-with-extension > span",
        "#contacts-and-locations > ctg-study-contacts-and-locations > div > div > div > ctg-study-contact-info > p:nth-child(4) > ctg-study-contact-email > span > a",
    ]
    contacts = []
    wait = WebDriverWait(driver, 5)
    for selector in selectors4:
        try:
            contact = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
            contacts.append(contact.text)
        except:
            contacts.append('N/A')
            continue
    info.append(contacts)

    
    location_number = 0
    while True:
        temp_location_arr = []

        selectors5 = [
            f"#study-location-item-{location_number} > a > div:nth-child(1) > b > span",
            f"#study-location-item-{location_number} > a > div.padding-left-205.mobile-lg\:padding-left-5 > ctg-recruitment-status > p > ctg-enum-value > span",
            f"#study-location-item-{location_number} > a > div.padding-left-205.mobile-lg\:padding-left-5 > span",
        ]  
        wait = WebDriverWait(driver, 5)
        for selector in selectors5:
            try:
                detailed_description = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
                temp_location_arr.append(detailed_description.text)
                found_elements = True
            except:
                temp_location_arr.append("") 
                found_elements = False

        if found_elements:
            info.append(temp_location_arr)
            location_number += 1
        else:
            break
    selectors6 = [
        "#eligibility-criteria-description > div > div"
    ]
    
    wait = WebDriverWait(driver, 5)
    for selector in selectors6:
        try:
            detailed_description = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
            child_elements = detailed_description.find_elements(By.XPATH, ".//*")

            all_text = ""
            for element in child_elements:
                all_text += element.text + " "

            all_text = " ".join(all_text.split())
            info.append(all_text)
        except:
            info.append('')
            continue

    base_selector = "#participation-criteria > ctg-participation-criteria > div.usa-prose.margin-top-4.participation-content > div > div.grid-row.grid-gap.row-overview > div.right-col > div:nth-child(2) > ctg-standard-age > span > ctg-enum-value:nth-child({}) > span"

    child_number = 1
    current_set = []

    while True:
        try:
            selector = base_selector.format(child_number)
            
            element = WebDriverWait(driver, 3).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, selector))
            )
            
            text = element.text.strip()
            if text:
                current_set.append(text)
            
            child_number += 1
        except:
            break
    info.append(current_set)

    selectors7 = [
        "#participation-criteria > ctg-participation-criteria > div.usa-prose.margin-top-4.participation-content > div > div.grid-row.grid-gap.row-overview > div.right-col > div:nth-child(4) > ctg-enum-value > span"
    ]
    
    wait = WebDriverWait(driver, 5)
    for selector in selectors7:
        try:
            detailed_description = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
            info.append(detailed_description.text)
        except:
            info.append('')
            continue

    selectors8 = [
        "#participation-criteria > ctg-participation-criteria > div.usa-prose.margin-top-4.participation-content > div > div.grid-row.grid-gap.row-overview > div.right-col > div:nth-child(5) > div.col-overview > ctg-boolean-value > span"
    ]
    
    wait = WebDriverWait(driver, 5)
    for selector in selectors8:
        try:
            detailed_description = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
            info.append(detailed_description.text)
        except:
            info.append('')
            continue

    selectors9 = [
        "#participation-criteria > ctg-participation-criteria > div.usa-prose.margin-top-4.participation-content > div > div.grid-row.grid-gap.row-overview > div.right-col > div:nth-child(6) > div.col-overview > ctg-enum-value > span"
    ]
    wait = WebDriverWait(driver, 5)
    for selector in selectors9:
        try:
            detailed_description = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
            info.append(detailed_description.text)
        except:
            info.append('')
            continue

    return info

def get_trial_titles(driver, nct_id, max_trials=5):
    trials = []
    trial_title = get_trial_title(driver, nct_id, disease_name)
    if trial_title:
        trials.append(trial_title)
        print(f"Found trial title: {trial_title}")
    else:
        print(f"No trial title found. Stopping.")
        
    return trials

# Set up the WebDriver once
driver = setup_driver()

try:
    print(f"Searching for clinical trials related to: {disease_name}")
    ids = get_nct_ids(driver, disease_name, 5)
    trials = []
    for id in ids:
        top_trial = get_trial_titles(driver, id)
        trials.append(top_trial)

    print(f"\nTop Clinical Trials for {disease_name}:")
    if trials:
        for i, trial in enumerate(trials, 1):
            print(f"{i}. {trial}")
    else:
        print("No trials found.")
finally:
    driver.quit()