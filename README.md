### *Jakub Martin, 186408*
---

# OpenCaching Nearest

#### Wstęp

Aplikacja, przeznaczona na telefony komórkowe, znajduje najbliższe skrzynki geocache na podstawie aktualnej pozycji szukającego.

#### Przygotowania

Przygotujemy bazę mongo wykorzystując gotowy skrypy w ruby. Bazę uzupełnimy o 500 skrzynek z Trójmiasta. Wykorzystamy API ze strony opencaching.pl.

```ruby
require "mongo"
require "json"
require "open-uri"
include Mongo

url = "http://opencaching.pl/okapi/services/caches/search/nearest?center=54.395732|18.573622"\
  "&status=Available&consumer_key=HpLvDvvjmG3HkeX8RsgU&limit=500"

data = open(URI::encode(url)).read
result = JSON.parse(data)

url = "http://opencaching.pl/okapi/services/caches/geocaches?cache_codes="\
  + result["results"].join("|") + "&consumer_key=HpLvDvvjmG3HkeX8RsgU&limit=500"

data = open(URI::encode(url)).read
result = JSON.parse(data)

mongodb = MongoClient.new("localhost", 27017, w: 1, wtimeout: 200, j: true).db("test")

result.each do |key, value|
  location = value["location"].split("|")
  value["location"] = [location[0].to_f, location[1].to_f]
  mongodb.collection("caches").insert(value)
end

mongodb.collection("caches").ensure_index({ location: '2d'})
```

Link do skryptu: [mongo.rb](/doc/mongo.rb)

#### Aplikacja

Wykorzystano:
- Ruby on Rails
- MongoDB
- jQuery
- Twitter Bootstrap

Aplikacja korzysta z geolokalizacji. Wymaga zgody użytkownika do prawidłowego działania.

#### Zrzuty ekranu

| ![](/doc/screen1.png) | ![](/doc/screen2.png) |
| :-: | :-: |
| ![](/doc/screen3.png) | ![](/doc/screen4.png) |
