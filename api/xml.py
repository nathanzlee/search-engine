import xml.etree.ElementTree as ET

def parseFile(file):
    root = ET.fromstring(file)
    caseCourt = root.find('.//QW/WS/JBFY').get('value') 
    caseReason = root.find('.//QW/CPFXGC/AY').get('value')
    # caseNum = root.find('.//QW').get('value')[:200]
    print("Case number: ", caseCourt + caseReason)
    return {
        'caseCourt': caseCourt,
        'caseReason': caseReason
    }