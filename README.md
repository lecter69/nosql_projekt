### *Jakub Martin, 186408*
---

# OpenCaching Nearest

Aplikacja szuka najbliższe skrzynki geocache na podstawie pozycji szukającego.

#### Przygotowania

Przygotujemy bazę mongo na dwa sposoby:

* gotowy skrypy w ruby
* z użyciem skryptu ruby, narzędzia Google Refine oraz mongoimport

Bazę uzupełnimy o 500 skrzynek w Trójmieście. Wykorzystamy API ze strony opencaching.pl.

##### Sposób 1

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
  value["location"] = [location[0], location[1]]
  mongodb.collection("caches").insert(value)
end
```

Link do skryptu: [mongo.rb](/doc/mongo.rb)

##### Sposób 2

```js
TODO
```
