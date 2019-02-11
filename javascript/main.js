const contentful = require('contentful')
const Handlebars = require('handlebars')
const externTrackingProfil = require('../json/externProfil.json');
const eigenesProfil = require('../json/eigenesProfil.json');
const internTrackingProfil = require('../json/internTrackingProfil.json');

const client = contentful.createClient({
  space: 'xmltm855c5tp',
  environment: 'master',
  accessToken: 'ee34981f7b6f136d65db092818f06976ee39e520c535325e06322c6920a1b53a'
})

/* 
CREATE PAGE
fragt Inhalte bei Contentful ab und baut daraus die Seite zusammen 
*/
function createPage(country, age, author, downloads, lastKlicked, categories) {

  getBlogPost(author, categories)

  getProdukte(categories)

  getDownloads(downloads)

  getLastKlickedEntries(lastKlicked)
}

function buildPosts(beitrag) {
  var source = document.getElementById("templatePost").innerHTML;
  var template = Handlebars.compile(source);
  return beitrag.map(function (beitrag) {
    var context = {
      title: beitrag.fields.beitragstitel,
      text: beitrag.fields.beitragstext,
      imgURL: 'https:' + beitrag.fields.beitragsbild.fields.file.url,
      imgDescription: beitrag.fields.beitragsbild.fields.description,
      autorName: beitrag.fields.autor.fields.autorenname,
      imgAutorURL: 'https:' + beitrag.fields.autor.fields.autorenbild.fields.file.url,
      tags: beitrag.fields.beitragstags[0].fields.name + ", " + beitrag.fields.beitragstags[1].fields.name + ", " + beitrag.fields.beitragstags[2].fields.name,
      tagsNeu: beitrag.fields.tags[0] + ", " + beitrag.fields.tags[1] + ", " + beitrag.fields.tags[2],
    }

    var result = template(context)
    document.getElementById("blog").innerHTML += result
  })
}

function buildDownloads(download) {
  var source = document.getElementById("templateDownload").innerHTML;
  var template = Handlebars.compile(source);
  return download.map(function (download) {
    var context = {
      title: download.fields.downloadtitel,
      text: download.fields.downloadbeschreibung,
      linkToFile: 'https:' + download.fields.downloaditem.fields.file.url,
      tags: download.fields.downloadtags[0].fields.name + " , " + download.fields.downloadtags[1].fields.name + " , " + download.fields.downloadtags[2].fields.name + " , " + download.fields.downloadtags[3].fields.name + " , " + download.fields.downloadtags[4].fields.name,
      tagsNeu: download.fields.tags[0] + ", " + download.fields.tags[1] + ", " + download.fields.tags[2],
    }
    var result = template(context);
    document.getElementById("downloads").innerHTML += result;
  })
}

function buildProducts(produkt) {
  var source = document.getElementById("templateProdukt").innerHTML;
  var template = Handlebars.compile(source);
  return produkt.map(function (produkt) {
    var context = {
      title: produkt.fields.produktname,
      text: produkt.fields.produktbeschreibung,
      price: produkt.fields.produktpreis,
      kalorien: produkt.fields.produktkalorien,
      imgURL: 'https:' + produkt.fields.produktbild.fields.file.url,
      imgDescription: produkt.fields.produktbild.fields.description,
      tags: produkt.fields.produkttags[0].fields.name + ", " + produkt.fields.produkttags[1].fields.name + ", " + produkt.fields.produkttags[2].fields.name,
      nationalitaet: produkt.fields.produktnationalitaet[0].fields.region,
      art: produkt.fields.produktart[0].fields.artname,
      besonderheit: produkt.fields.produktbesonderheit[0].fields.bezeichnung,
      tagsNeu: produkt.fields.tags[0] + ", " + produkt.fields.tags[1] + ", " + produkt.fields.tags[2],
    }
    var result = template(context);
    document.getElementById("produkte").innerHTML += result;
  })
}

function buildLastProducts(produkt) {
  var source = document.getElementById("templateZuletztAngeschaut").innerHTML;
  var template = Handlebars.compile(source);
  return produkt.map(function (produkt) {
    var context = {
      title: produkt.fields.produktname,
      text: produkt.fields.produktbeschreibung,
      price: produkt.fields.produktpreis,
      kalorien: produkt.fields.produktkalorien,
      imgURL: 'https:' + produkt.fields.produktbild.fields.file.url,
      imgDescription: produkt.fields.produktbild.fields.description,
      tags: produkt.fields.produkttags[0].fields.name + ", " + produkt.fields.produkttags[1].fields.name + ", " + produkt.fields.produkttags[2].fields.name,
      nationalitaet: produkt.fields.produktnationalitaet[0].fields.region,
      art: produkt.fields.produktart[0].fields.artname,
      besonderheit: produkt.fields.produktbesonderheit[0].fields.bezeichnung,
      tagsNeu: produkt.fields.tags[0] + ", " + produkt.fields.tags[1] + ", " + produkt.fields.tags[2],
    }
    var result = template(context);
    document.getElementById("zuletztAngeschaut").innerHTML += result;
  })
}

/* 
PARSE AND MAP 
verarbeitet das Nutzerprofil so, dass Contentful damit arbeiten kann 
*/
window.parseAndMap = function (cookie) {

  var ownAge
  var ownCategories = ""
  var ownAuthor
  var ownDownloads
  var ownCountry

  eigenesProfil.map(function (user) {
    if (user.id == cookie) {
      ownAuthor = user.favoriteAuthor
      ownDownloads = user.downloads
      ownCountry = user.country
      var birthday = user.birthday.split(".")
      ownAge = calculate_age(birthday[1], birthday[0], birthday[2])

      for (var i = 0; i < user.favoriteFood.length; i++) {
        if (i == user.favoriteFood.length - 1) {
          ownCategories += user.favoriteFood[i]
        } else {
          ownCategories += user.favoriteFood[i] + ","
        }
      }
      console.log("ownData: " + ownAge, ownCategories, ownAuthor, ownDownloads, ownCountry)
    } // end if

  })

  var externCategories = ""
  var externCountry
  var externAge

  externTrackingProfil.map(function (user) {
    if (user.id == cookie) {
      var tagArray = ['Frühstück', 'Pizza', 'Pasta', 'Vegetarisch', 'Scharf', 'Mexikanisch', 'Gebäck', 'Snack', 'Low-Carb', 'Asiastisch', 'Leicht', 'Vegan', 'Fleisch', 'Abend', 'Deftig', 'Hauptmahlzeit', 'Italienisch']
      externCountry = getCountry(user.language)
      externAge = user.age
      user.buys.map(function (cat) {
        if (tagArray.indexOf(cat) >= 0) {
          externCategories = externCategories + cat + ", "
        }
      })
      console.log("Array" + user.buysOnline)
      user.buysOnline.map(function (cat) {
        if (tagArray.indexOf(cat) >= 0)
          externCategories = externCategories + cat + ", "
      })

      user.buysOnline.map(function (cat) {
        if (tagArray.indexOf(cat) >= 0)
          externCategories = externCategories + cat + ", "
      })

      user.buysOnline.map(function (cat) {
        if (tagArray.indexOf(cat) >= 0)
          externCategories = externCategories + cat + ", "
      })
      // usw. - reicht erstmal als beispiel

      if (user.parent == 1) {
        externCategories = externCategories + "Pizza, Pasta, Gebäck, "
      }
      // usw. - mapping für andere Dinge nur im Text beschreiben
      console.log("extern Data: " + externCategories, externCountry)
    }

  })

  var internCategories = ""
  var internLastKlicked = ""
  var internCountry

  internTrackingProfil.map(function (user) {
    if (user.id == cookie) {
      internCategories = ""
      internCountry = user.country

      for (var i = 0; i < user.categories.length; i++) {
        if (i == user.categories.length - 1) {
          internCategories += user.categories[i]
        } else {
          internCategories += user.categories[i] + ","
        }
      }

      for (var i = 0; i < user.lastKlickedProduct.length; i++) {
        if (i == user.lastKlickedProduct.length - 1) {
          internLastKlicked += user.lastKlickedProduct[i]
        } else {
          internLastKlicked += user.lastKlickedProduct[i] + ","
        }
      }
      console.log("internData: " + internCategories, internLastKlicked, internCountry)

    } // end if
  })

  // vergleiche Werte, die in mehreren Profilen vorkommen, dann: Zusammenführen oder eins wählen
  var age
  var allCategories
  var country
  if (ownCountry != "") {
    country = ownCountry
  } else {
    if (internCountry != "") {
      country = internCountry
    } else {
      if (externCountry != "") {
        country = externCountry
      } else {
        country = "default"
      }
    }
  }

  // meist wird beim Personalisieren ein altersbereich angegeben, deshalb nehme ich hier den Bereich aus dem Tool, sofern er mit dem Alter im eigenen Nuterprofil übereinstimmt
  var externStartEndAge = externAge.split("-")
  if (ownAge < externStartEndAge[0] || ownAge > externStartEndAge[1]) {
    age = ownAge
  } else {
    age = externAge
  }

  var uniqueCategories
  // füge alle Kategorien zu einem String zusammen
  if (ownCategories == "" && externCategories == "" && internCategories == "") {
    allCategories = "default"
  } else {
    allCategories = ownCategories + ", " + externCategories + internCategories

    // entferne Dublikate
    uniqueCategories = allCategories.split(',').filter(function (item, i, allItems) {
      return i == allItems.indexOf(item);
    }).join(',');

  }


  console.log("Übergabewerte an Create Page: " + country, age, ownAuthor, ownDownloads, internLastKlicked, uniqueCategories)
  createPage(country, age, ownAuthor, ownDownloads, internLastKlicked, uniqueCategories)

}

function calculate_age(birth_month, birth_day, birth_year) {
  today_date = new Date()
  today_year = today_date.getFullYear()
  today_month = today_date.getMonth()
  today_day = today_date.getDate()
  age = today_year - birth_year

  if (today_month < (birth_month - 1)) {
    age--
  }
  if (((birth_month - 1) == today_month) && (today_day < birth_day)) {
    age--
  }
  return age
}

function getCountry(language) {
  switch (language) {
    case 'german':
      return 'Germany'
    case 'danish':
      return 'Denmark'
    case 'spanish':
      return 'Spain'
    case 'english':
      return 'America'
    default:
      return 'Germany'
  }
}

function getBlogPost(author, categories) {
  client.getEntries({
    content_type: 'beitrag',
    limit: 4,
    "fields.autor.fields.autorenname": author,
    "fields.autor.sys.contentType.sys.id": "autor"
  })
    .then(function (response) {
      console.log(response.items);
      let beitrag = response.items;
      buildPosts(beitrag);

      // Wenn nicht genug Beiträge den Kriterien entsprechen
      if (beitrag.length < 4) {
        var missingItems = 4 - beitrag.length;

        client.getEntries({
          content_type: 'beitrag',
          limit: missingItems,
          'fields.tags[in]': categories,
          "fields.autor.fields.autorenname[ne]": author,
          "fields.autor.sys.contentType.sys.id": "autor"
        })
          .then(function (response) {
            let beitrag = response.items
            console.log(beitrag)

            buildPosts(beitrag)
          })
          .catch(console.error)
      }
    })
    .catch(console.error)
}

function getProdukte(categories) {
  client.getEntries({
    content_type: 'produkt',
    limit: 8,
    'fields.tags[in]': categories,
  })
    .then(function (response) {
      let produkt = response.items
      console.log(produkt)

      buildProducts(produkt)

      // wenn nicht genug items mit der richtigen kategorie gefunden wurden, fülle random auf
      if (produkt.length < 8) {
        var missingItems = 8 - produkt.length;

        client.getEntries({
          content_type: 'produkt',
          limit: missingItems,
        })
          .then(function (response) {
            let produkt = response.items
            console.log(produkt)

            buildProducts(produkt)
          })
          .catch(console.error)
      }
    })
    .catch(console.error);
}

function getDownloads(downloads) {
  client.getEntries({
    content_type: 'download',
    limit: 3,
    'sys.id[ne]': downloads
  })
    .then(function (response) {
      let download = response.items;
      console.log(download);
      buildDownloads(download);

      // Wenn nicht genug Downloads den Kriterien entsprechen
      if (download.length < 3) {
        var missingItems = 3 - download.length

        client.getEntries({
          content_type: 'download',
          limit: missingItems,
        })
          .then(function (response) {
            let download = response.items
            console.log(download)

            buildDownloads(download)
          })
          .catch(console.error)
      }
    })
    .catch(console.error)
}

function getLastKlickedEntries(lastKlicked) {
  client.getEntries({
    content_type: 'produkt',
    limit: 3,
    'sys.id[in]': lastKlicked,
  })
    .then(function (response) {
      let produktZuletzt = response.items
      console.log(produktZuletzt)
      buildLastProducts(produktZuletzt)
    })
    .catch(console.error);
}

