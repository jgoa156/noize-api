import json
import requests

f = open("crawler.json", encoding="utf8")
data = json.load(f)

count = 0
allowedCategories = [
  "Bar",
  "Bar e Grill",
  "Bar com música ao vivo",
  "Bares",
  "Restaurante",
  "Diner",
  "Bar e restaurante de ostras",
  "Bar de cervejas",
  "Casa noturna",
  "Lanchonete",
  "Bar esportivo",
  "Bar de vinhos",
  "Gastropub",
  "Restaurante peruano",
  "Cervejaria",
  "Adega",
  "Restaurante brasileiro",
  "Local de apresentações de rock",
  "Local com música ao vivo",
  "Loja de bebidas",
  "Pub irlandês",
  "Chop bar",
  "Bar informal",
  "Bar com tabacaria",
  "Bar de narguilé",
  "Loja de narguilé",
  "Tabacaria",
  "Restaurante de sushi",
  "Restaurante japonês",
  "Café",
  "Delivery de Pizza",
  "Serviço de locação de casas flutuantes",
  "Bar com karaokê",
  "Loja de Conveniência",
  "Petiscaria",
  "Microcervejaria",
  "Distribuidor de bebidas",
  "Hamburgueria"
]

_places = []
for place in data:
    for category in place["categories"]:
      if (category in allowedCategories):
        _places.append(place)
        break
f.close()

dayMap = {
  "domingo": 0,
  "segunda-feira": 1,
  "terça-feira": 2,
  "quarta-feira": 3,
  "quinta-feira": 4,
  "sexta-feira": 5,
  "sábado": 6
}

__places = []
for place in _places:
  _name = place["title"]
  _address = place["address"]
  _lat = place["location"]["lat"]
  _lng = place["location"]["lng"]
  
  _openingHours = {}
  for openingHour in place["openingHours"]:
    if (openingHour["hours"] == "Fechado"):
      _openingHours[dayMap[openingHour["day"]]] = {
        "hourStart": "0",
        "hourEnd": "0"
      }
    elif (openingHour["hours"] == "Atendimento 24 horas"):
      _openingHours[dayMap[openingHour["day"]]] = {
        "hourStart": "00:00",
        "hourEnd": "23:59"
      }
    else:
      _hours = openingHour["hours"].split(" to ")
      _openingHours[dayMap[openingHour["day"]]] = {
        "hourStart": _hours[0],
        "hourEnd": _hours[1]
      }
      
  _openingHours = list(dict(sorted(_openingHours.items())).values())
  _images = place["imageUrls"]
  
  _place = {
    "name": _name,
    "address": _address,
    "lat": _lat,
    "lng": _lng,
    "openingHours": _openingHours,
    "images": _images
  }
  
  __places.append(_place)
  
with open("result.json", "w", encoding="utf8") as outfile:
    json.dump(__places, outfile, ensure_ascii=False)