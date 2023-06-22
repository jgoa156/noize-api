import json
import requests

f = open("crawler.json", encoding="utf8")
data = json.load(f)

count = 0
categories = {}
for place in data:
    for category in place["categories"]:
        categories[category] = 1
    # print(place["categories"])

for key in categories:
    print(key)
# print(categories)
f.close()
