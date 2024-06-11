import os
import json
import xmltodict

num = 0
passnum = 0
total = 0
count = 0
for name in os.listdir("Legal_data"):
    # Open file
    total += 1
    filename = name.split('.')[0]
    filename = filename + ".json"

    file_path = os.path.join("Legal_data", name)
    if os.stat(file_path).st_size == 0:
        print(f"Skipping empty file: {file_path}")
        continue

    file_path = os.path.join("Legal_data", name)
    if os.stat(file_path).st_size == 0:
        print(f"Skipping empty file23: {file_path}")
        continue

    try:
        with open(os.path.join("Legal_data", name), encoding='UTF-8') as xml_file:
            data_dict = xmltodict.parse(xml_file.read(), process_namespaces=True)
            num += 1
            xml_file.close()
         
            json_data = json.dumps(data_dict, ensure_ascii=False)
         
            with open(f"Legal_data_json_10k/{filename}", "w", encoding='UTF-8') as json_file:
                json_file.write(json_data)
                json_file.close()
            count += 1
    except Exception as e:
        passnum += 1
        print(f"Error processing file {name}: {e}")
    if count==10000:
        break
print(num)
print(passnum)


# import pymongo
# import json
# from pymongo import MongoClient, InsertOne

# client = pymongo.MongoClient("mongodb+srv://admin:admin@searchengine.gswjlnf.mongodb.net/")
# db = client.sample_mflix
# collection = db.SearchEngine
# requesting = []

# with open(r"Legal_data_json/19066.json") as f:
#     for jsonObj in f:
#         myDict = json.loads(jsonObj)
#         requesting.append(InsertOne(myDict))

# result = collection.bulk_write(requesting)
# client.close()
