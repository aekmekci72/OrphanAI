import xml.etree.ElementTree as ET

def parse_symptoms_from_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()
    
    symptoms = []
    for hpo_term in root.findall('.//HPOTerm'):
        symptoms.append(hpo_term.text)
    
    return symptoms

def save_symptoms_to_file(symptoms, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('[')
        for i, symptom in enumerate(symptoms):
            f.write(f'"{symptom}"')
            if i < len(symptoms) - 1:
                f.write(', ')
        f.write(']')

def main():
    input_file = './mlStuff/en_product4 (3).xml'
    output_file = 'symptoms.txt'
    
    symptoms = parse_symptoms_from_xml(input_file)
    save_symptoms_to_file(symptoms, output_file)
    
    print(f"Symptoms have been saved to {output_file}")
    print(f"Total number of symptoms: {len(symptoms)}")

if __name__ == "__main__":
    main()