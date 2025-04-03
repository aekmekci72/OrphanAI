from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import os 
from dotenv import load_dotenv
import joblib 
import numpy as np
import xml.etree.ElementTree as ET
import xml.etree.ElementTree as ET
import os
import numpy as np
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam
import joblib 
import matplotlib.pyplot as plt
import seaborn as sns
from tensorflow.keras.utils import plot_model
import io
from PIL import Image
import numpy as np
import pandas as pd
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.model_selection import train_test_split, KFold
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.metrics import roc_curve, auc
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import xml.etree.ElementTree as ET
from functools import lru_cache
from datetime import datetime, timedelta

cached_page_time = None
cached_page = None

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000','*'])

load_dotenv()

cred = credentials.Certificate({
    "type": os.getenv("FIREBASE_TYPE"),
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL")
})

firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

model = joblib.load('model.joblib')



async def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument('--disable-images')
    chrome_options.add_argument('--disable-extensions')

    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=chrome_options)
# import asyncio
async def get_nct_ids(driver, disease, max_ids=5):
    encoded_disease = disease.replace(' ', '%20')
    url = f"https://clinicaltrials.gov/search?cond={encoded_disease}&aggFilters=status:not%20rec"
    
    driver.get(url)
    
    wait = WebDriverWait(driver, 2)
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
# async def get_nct_ids(driver, disease, max_ids=5):
#     encoded_disease = disease.replace(' ', '%20')
#     url = f"https://clinicaltrials.gov/search?cond={encoded_disease}&aggFilters=status:not%20rec"
    
#     driver.get(url)
    
#     wait = WebDriverWait(driver, 2)
#     trials = []
#     tasks = []
#     for i in range(1, max_ids + 1):
#         selector = f"#main-content > ctg-search-results-page > div.bg-white.desktop\:margin-top-4.ng-star-inserted > section > div > div > div > ctg-search-results-list > div.margin-bottom-5 > ctg-search-hit-card:nth-child({i+1}) > div > div.headline > div.selection > div"
#         tasks.append(asyncio.ensure_future(fetch_nct_id(wait, selector, trials)))
    
#     await asyncio.gather(*tasks)

#     return trials
# async def fetch_nct_id(wait, selector, trials):
#     try:
#         nct_element = await wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
#         nct_id = nct_element.text
#         trials.append(nct_id)
#         print(f"Found NCT ID: {nct_id}")
#     except Exception as e:
#         print(f"Failed to fetch NCT ID: {e}")
async def get_trial_title(driver, nct_id, disease):
    encoded_disease = disease.replace(' ', '%20')
    url = f"https://clinicaltrials.gov/study/{nct_id}?cond={encoded_disease}&aggFilters=status:not%20rec"
    
    driver.get(url)
    info = []
    selectors = [
        "#main-content > ctg-study-details > section > ctg-study-details-top-info > div > h2"
    ]
    
    wait = WebDriverWait(driver, 2)
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
    
    wait = WebDriverWait(driver, 2)
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
    
    wait = WebDriverWait(driver, 2)
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
    wait = WebDriverWait(driver, 2)

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
    wait = WebDriverWait(driver, 2)
    for selector in selectors4:
        try:
            contact = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
            contacts.append(contact.text)
        except:
            contacts.append('N/A')
            continue
    info.append(contacts)

    
    location_number = 0
    # while True:
    temp_location_arr = []

    selectors5 = [
        f"#study-location-item-{location_number} > a > div:nth-child(1) > b > span",
        f"#study-location-item-{location_number} > a > div.padding-left-205.mobile-lg\:padding-left-5 > ctg-recruitment-status > p > ctg-enum-value > span",
        f"#study-location-item-{location_number} > a > div.padding-left-205.mobile-lg\:padding-left-5 > span",
    ]  
    wait = WebDriverWait(driver, 2)
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
        # else:
        #     break
    selectors6 = [
        "#eligibility-criteria-description > div > div"
    ]
    
    wait = WebDriverWait(driver, 2)
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
            
            element = WebDriverWait(driver, 2).until(
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
    
    wait = WebDriverWait(driver, 2)
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
    
    wait = WebDriverWait(driver, 2)
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
    wait = WebDriverWait(driver, 2)
    for selector in selectors9:
        try:
            detailed_description = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
            info.append(detailed_description.text)
        except:
            info.append('')
            continue

    return info

async def get_trial_titles(driver, nct_id, disease_name, max_trials=5):
    trials = []
    trial_title = await get_trial_title(driver, nct_id, disease_name)
    if trial_title:
        trials.append(trial_title)
        print(f"Found trial title: {trial_title}")
    else:
        print(f"No trial title found. Stopping.")
        
    return trials





@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        email = data.get('email')
        first_name = data.get('firstName')
        last_name = data.get('lastName')

        if not email or not first_name or not last_name:
            return jsonify({'error': 'Missing data'}), 400

        user_ref = db.collection('users').document(email)

        if user_ref.get().exists:
            return jsonify({'error': 'User already exists'}), 400

        user_ref.set({
            'email': email,
            'first_name': first_name,
            'last_name': last_name
        })

        return jsonify({'success': True, 'user_id': email}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/profile', methods=['GET'])
def profile():
    try:
        # Get the email from query parameters
        email = request.args.get('email')

        # Validate the email
        if not email:
            return jsonify({'error': 'Email is required'}), 400

        # Reference the user document by email
        user_ref = db.collection('users').document(email)
        user_doc = user_ref.get()

        # Check if the user exists
        if not user_doc.exists:
            return jsonify({'error': 'User not found'}), 404

        # Return the user profile data
        user_data = user_doc.to_dict()
        return jsonify(user_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

def get_inheritance_data(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()

    inheritance_data = {}

    for disorder in root.findall(".//Disorder"):
        disease_name = disorder.find("Name[@lang='en']").text
        inheritance_type_list = disorder.findall("InheritanceType")

        inheritance_types = []
        for inheritance in inheritance_type_list:
            inheritance_type = inheritance.text.strip() if inheritance is not None else None
            if inheritance_type:
                inheritance_types.append(inheritance_type)

        if disease_name:
            inheritance_data[disease_name] = inheritance_types

    return inheritance_data


def get_unique_diseases_symptoms(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()
    
    diseases_dict = {}
    symptoms_set = set()

    for disorder_status in root.findall(".//HPODisorderSetStatus"):
        disorder = disorder_status.find("Disorder")
        if disorder is None:
            continue

        disease_name = disorder.find("Name[@lang='en']").text
        if disease_name not in diseases_dict:
            diseases_dict[disease_name] = set()

        for association in disorder.findall("HPODisorderAssociationList/HPODisorderAssociation"):
            hpo_term = association.find("HPO/HPOTerm").text
            frequency = association.find("HPOFrequency/Name[@lang='en']")
            freq_text = frequency.text if frequency is not None else "Not specified"
            
            diseases_dict[disease_name].add((hpo_term, freq_text))
            symptoms_set.add(hpo_term)

    unique_symptoms = sorted(list(symptoms_set))
    return diseases_dict, unique_symptoms


def predict_diseases(model, patient_symptoms, symptoms_list, diseases_list, age, gender, top_n=5):
    patient_vector = np.zeros(len(symptoms_list))
    for symptom in patient_symptoms:
        if symptom in symptoms_list:
            patient_vector[symptoms_list.index(symptom)] = 1
    age_vector = np.array([age])
    gender_vector = np.array([gender])
    input_vector = np.concatenate([patient_vector, age_vector, gender_vector])
    input_vector = input_vector.reshape(1, -1)
    predictions = model.predict(input_vector)[0]

    top_indices = predictions.argsort()[-top_n:][::-1]
    
    results = []
    for index in top_indices:
        results.append({
            "Disease": diseases_list[index],
            "Probability": predictions[index]
        })
    
    return results

@app.route('/predict', methods=['POST'])
async def predict():
    data = request.json

    file_path = os.path.join("mlStuff", "en_product4 (3).xml")
    ages_file_path = os.path.join("mlStuff", "en_product9_ages.xml")

    email = data.get("username", "")
    
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user_ref = db.collection('users').document(email)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return jsonify({'error': 'User not found'}), 404

    user_data = user_doc.to_dict()
    patient_symptoms = user_data.get('symptoms', [])
    patient_symptoms = [symptom['name'] for symptom in patient_symptoms]
    print(patient_symptoms)
    # Parse patient symptoms from request data
    # patient_symptoms = data.get("patient_symptoms", [])
    # patient_symptoms = ["Prolonged QTc interval", "Syncope", "Arrhythmia"]

    # Make predictions based on the input symptoms
    predictions = predict_diseases(model, patient_symptoms, symptoms, diseases, age, sex)
    print(predictions)
    # Prepare predictions for JSON response
    serializable_predictions = [
        {
            "Disease": pred["Disease"],
            "Probability": float(pred["Probability"])  # Convert to Python float for JSON serialization
        }
        for pred in predictions
    ]
    
    # Return prediction as JSON
    return jsonify({'prediction': serializable_predictions})

@app.route('/update_profile', methods=['POST'])
def update_profile():
    try:
        # Get the data from the request
        data = request.json
        email = data.get('email')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        height = data.get('height')
        weight = data.get('weight')
        age = data.get('age')

        sex = data.get('sex')


        if not email:
            return jsonify({'error': 'Email is required'}), 400

        user_ref = db.collection('users').document(email)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({'error': 'User not found'}), 404

        user_ref.update({
            'first_name': first_name,
            'last_name': last_name,
            'height':height,
            'weight':weight,
            'age':age,
            'sex':sex
        })

        return jsonify({'success': True, 'message': 'Profile updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

func_consequences_tree = ET.parse('./mlStuff/en_funct_consequences.xml')
symptoms_tree = ET.parse('./mlStuff/en_product4 (3).xml')
associations_tree = ET.parse('./mlStuff/en_product7 (1).xml')
ages_inheritance_tree = ET.parse('./mlStuff/en_product9_ages.xml')

@app.route('/get_disease_info', methods=['GET'])
def get_disease_info():
    disease = request.args.get('disease')
    functional_consequences = get_functional_consequences(func_consequences_tree, disease)
    symptoms = get_symptomsss(symptoms_tree, disease)
    associations = get_associations(associations_tree, disease)
    ages_and_inheritance = get_ages_and_inheritance(ages_inheritance_tree, disease)

    disease_info = {
        "disease": disease,
        "functional_consequences": functional_consequences,
        "symptoms": symptoms,
        "associations": associations,
        "ages_of_onset": ages_and_inheritance["ages_of_onset"],
        "inheritance": ages_and_inheritance["inheritance"]
    }
    return jsonify(disease_info)
def get_functional_consequences(tree, disease):
    root = tree.getroot()
    consequences = []
    
    try:
        for disorder in root.findall(".//Disorder"):
            if disorder.find("Name[@lang='en']").text == disease:
                for association in disorder.findall(".//DisabilityDisorderAssociation"):
                    disability = association.find(".//Disability/Name[@lang='en']")
                    frequency = association.find(".//FrequenceDisability/Name[@lang='en']")
                    
                    consequences.append({
                        "disability": disability.text if disability is not None else "N/A",
                        "frequency": frequency.text if frequency is not None else "N/A"
                    })
        
        if not consequences:
            consequences.append({"disability": "N/A", "frequency": "N/A"})
    
    except Exception as e:
        print(f"Error in get_functional_consequences: {str(e)}")
        consequences.append({"disability": "N/A", "frequency": "N/A"})
    
    return consequences
def get_symptomsss(tree, disease):
    root = tree.getroot()
    symptoms = []
    
    for disorder in root.findall(".//Disorder"):
        if disorder.find("Name[@lang='en']").text == disease:
            for association in disorder.findall(".//HPODisorderAssociation"):
                symptom = association.find(".//HPOTerm").text
                frequency = association.find(".//HPOFrequency/Name[@lang='en']").text
                symptoms.append({"symptom": symptom, "frequency": frequency})
    
    return symptoms

def get_associations(tree, disease):
    root = tree.getroot()
    associations = []
    
    for disorder in root.findall(".//Disorder"):
        if disorder.find("Name[@lang='en']").text == disease:
            for association in disorder.findall(".//DisorderDisorderAssociation"):
                target = association.find(".//TargetDisorder/Name[@lang='en']").text
                association_type = association.find(".//DisorderDisorderAssociationType/Name[@lang='en']").text
                associations.append({"target": target, "type": association_type})
    
    return associations

def get_ages_and_inheritance(tree, disease):
    root = tree.getroot()
    ages_of_onset = []
    inheritance = ""
    
    for disorder in root.findall(".//Disorder"):
        if disorder.find("Name[@lang='en']").text == disease:
            ages_of_onset = [age.find("Name[@lang='en']").text for age in disorder.findall(".//AverageAgeOfOnset")]
            inheritance_elem = disorder.find(".//TypeOfInheritance/Name[@lang='en']")
            if inheritance_elem is not None:
                inheritance = inheritance_elem.text
    
    return {"ages_of_onset": ages_of_onset, "inheritance": inheritance}
@app.route('/search_clinical_trials', methods=['POST'])
async def search_clinical_trials():
    try:
        data = request.json
        disease = data.get('disease')
        index = data.get('index', 0)
        driver = await setup_driver()

        if index == 0:
            ids = await get_nct_ids(driver, disease, 5)
            return jsonify({'ids': ids})
        else:
            nct_id = data.get('nct_id')
            trial = await get_trial_title(driver, nct_id, disease)
            return jsonify({'trial': trial})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

def get_diseasess(tree, disease):
    root = tree.getroot()
    symptoms = []
    
    for disorder in root.findall(".//Disorder"):
        if disorder.find("Name[@lang='en']").text == disease:
            for association in disorder.findall(".//HPODisorderAssociation"):
                symptom = association.find(".//HPOTerm").text
                frequency = association.find(".//HPOFrequency/Name[@lang='en']").text
                symptoms.append({"symptom": symptom, "frequency": frequency})
    
    return symptoms

@app.route('/get_all_diseases', methods=['GET'])
def get_all_diseases():
    try:
        tree = ET.parse('./mlStuff/en_product9_ages.xml')
        root = tree.getroot()
        
        diseases = []
        for disorder in root.findall(".//Disorder"):
            name = disorder.find("Name[@lang='en']")
            if name is not None:
                diseases.append(name.text)
        
        return jsonify({'diseases': diseases})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/update_family_history', methods=['POST'])
def update_family_history():
    try:
        data = request.json
        email = data.get('email')
        family_history = data.get('family_history')

        if not email:
            return jsonify({'error': 'Email is required'}), 400
        if not isinstance(family_history, list):
            return jsonify({'error': 'Family history must be a list'}), 400

        user_ref = db.collection('users').document(email)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({'error': 'User not found'}), 404

        user_ref.update({
            'family_history': family_history
        })

        return jsonify({'success': True, 'message': 'Family history updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/get_family_history', methods=['GET'])
def get_family_history():
    try:
        email = request.args.get('email')

        if not email:
            return jsonify({'error': 'Email is required'}), 400

        user_ref = db.collection('users').document(email)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({'error': 'User not found'}), 404

        user_data = user_doc.to_dict()
        family_history = user_data.get('family_history', [])

        return jsonify({'family_history': family_history}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/update_medical_history', methods=['POST'])
def update_medical_history():
    try:
        data = request.json
        email = data.get('email')
        medical_history = data.get('medical_history')

        if not email:
            return jsonify({'error': 'Email is required'}), 400
        if not isinstance(medical_history, list):
            return jsonify({'error': 'Medical history must be a list'}), 400

        user_ref = db.collection('users').document(email)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({'error': 'User not found'}), 404

        user_ref.update({
            'medical_history': medical_history
        })

        return jsonify({'success': True, 'message': 'Medical history updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/get_medical_history', methods=['GET'])
def get_medical_history():
    try:
        email = request.args.get('email')

        if not email:
            return jsonify({'error': 'Email is required'}), 400

        user_ref = db.collection('users').document(email)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({'error': 'User not found'}), 404

        user_data = user_doc.to_dict()
        medical_history = user_data.get('medical_history', [])

        return jsonify({'medical_history': medical_history}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/update_symptoms', methods=['POST'])
def update_symptoms():
    try:
        data = request.json
        email = data.get('email')
        symptoms = data.get('symptoms')

        if not email:
            return jsonify({'error': 'Email is required'}), 400
        if not isinstance(symptoms, list):
            return jsonify({'error': 'Symptoms must be a list'}), 400

        user_ref = db.collection('users').document(email)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({'error': 'User not found'}), 404

        user_ref.update({
            'symptoms': symptoms
        })

        return jsonify({'success': True, 'message': 'Symptoms updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/get_symptoms', methods=['GET'])
def get_symptoms():
    try:
        email = request.args.get('email')

        if not email:
            return jsonify({'error': 'Email is required'}), 400

        user_ref = db.collection('users').document(email)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({'error': 'User not found'}), 404

        user_data = user_doc.to_dict()
        symptoms = user_data.get('symptoms', [])

        return jsonify({'symptoms': symptoms}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/update_risk_factors', methods=['POST'])
def update_risk_factors():
    try:
        data = request.json
        email = data.get('email')
        risk_factors = data.get('risk_factors')

        if not email:
            return jsonify({'error': 'Email is required'}), 400
        if not isinstance(risk_factors, list):
            return jsonify({'error': 'Risk factors must be a list'}), 400

        user_ref = db.collection('users').document(email)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({'error': 'User not found'}), 404

        user_ref.update({
            'risk_factors': risk_factors
        })

        return jsonify({'success': True, 'message': 'Risk factors updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

def parse_symptoms_from_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()
    
    symptoms = []
    # Iterate over each HPODisorderAssociation in the XML
    for disorder in root.findall('.//HPODisorderAssociation'):
        hpo_term = disorder.find('.//HPOTerm')
        if hpo_term is not None:
            symptoms.append(hpo_term.text)
    
    return symptoms



@app.route('/get_all_symptoms', methods=['GET'])
def get_all_symptoms():
    try:
        # Parse symptoms from the XML file
        symptoms = parse_symptoms_from_xml('./mlStuff/en_product4 (3).xml')
        print('gotthem')
        print(symptoms)
        return jsonify({'symptoms': symptoms}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route('/get_risk_factors', methods=['GET'])
def get_risk_factors():
    try:
        email = request.args.get('email')

        if not email:
            return jsonify({'error': 'Email is required'}), 400

        user_ref = db.collection('users').document(email)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({'error': 'User not found'}), 404

        user_data = user_doc.to_dict()
        risk_factors = user_data.get('risk_factors', [])

        return jsonify({'risk_factors': risk_factors}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)