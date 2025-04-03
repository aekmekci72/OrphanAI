import xml.etree.ElementTree as ET

def parse_diseases_from_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()
    
    diseases = []
    for disorder in root.findall('.//Disorder'):
        disease_name = disorder.find('Name').text
        diseases.append(disease_name)
    
    return diseases

def save_diseases_to_file(diseases, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('[')
        for i, disease in enumerate(diseases):
            f.write(f'"{disease}"')
            if i < len(diseases) - 1:
                f.write(', ')
        f.write(']')

def main():
    input_file = './mlStuff/en_product4 (3).xml'
    output_file = 'diseases.txt'
    
    diseases = parse_diseases_from_xml(input_file)
    save_diseases_to_file(diseases, output_file)
    
    print(f"Diseases have been saved to {output_file}")
    print(f"Total number of diseases: {len(diseases)}")

if __name__ == "__main__":
    main()