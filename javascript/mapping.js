import { createPage } from './main';

export function parseAndMap(internProfile, externProfile, ownProfile, cookie) {

  var ownAge
  var ownCategories
  var ownAuthor
  var ownDownloads
  var ownCountry

  ownProfile.map(function (user) {
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
    } // end if
    console.log("ownData: " + ownAge, ownCategories, ownAuthor, ownDownloads, ownCountry)
  })

  var externCategories
  var externCountry
  var externAge
  // Optional: überprüfen ob sich die Kategorien widersprechen
  externProfile.map(function (user) {
    if (user.id == cookie) {
      externCountry = getCountry(user.language)
      externAge = user.age
      user.buys.map(function(cat){
        if (cat == "Frühstück"|| "Pizza"|| "Pasta"|| "Vegetarisch"|| "Scharf"|| "Mexikanisch"|| "Gebäck"|| "Snack"|| "Low-Carb"|| "Asiastisch"|| "Leicht"|| "Vegan"|| "Fleisch"|| "Abend"|| "Deftig"|| "Hauptmahlzeit"|| "Italienisch")
          externCategories = externCategories + cat + ", "
      })

      user.buysOnline.map(function(cat){
        if (cat == "Frühstück"|| "Pizza"|| "Pasta"|| "Vegetarisch"|| "Scharf"|| "Mexikanisch"|| "Gebäck"|| "Snack"|| "Low-Carb"|| "Asiastisch"|| "Leicht"|| "Vegan"|| "Fleisch"|| "Abend"|| "Deftig"|| "Hauptmahlzeit"|| "Italienisch")
          externCategories = externCategories + cat + ", "
      })

      user.buysOnline.map(function(cat){
        if (cat == "Frühstück"|| "Pizza"|| "Pasta"|| "Vegetarisch"|| "Scharf"|| "Mexikanisch"|| "Gebäck"|| "Snack"|| "Low-Carb"|| "Asiastisch"|| "Leicht"|| "Vegan"|| "Fleisch"|| "Abend"|| "Deftig"|| "Hauptmahlzeit"|| "Italienisch")
          externCategories = externCategories + cat + ", "
      })

      user.buysOnline.map(function(cat){
        if (cat == "Frühstück"|| "Pizza"|| "Pasta"|| "Vegetarisch"|| "Scharf"|| "Mexikanisch"|| "Gebäck"|| "Snack"|| "Low-Carb"|| "Asiastisch"|| "Leicht"|| "Vegan"|| "Fleisch"|| "Abend"|| "Deftig"|| "Hauptmahlzeit"|| "Italienisch")
        externCategories = externCategories + cat + ", "
      })
      // usw. - reicht erstmal als beispiel

      if (user.parent == 1){
        externCategories = externCategories + "Pizza, Pasta, Gebäck"
      }
      // usw. - mapping für andere Dinge nur im Text beschreiben
      
    }
    console.log(externCategories, externCountry)
  })

  var internCategories
  var internLastKlicked
  var internCountry

  internProfile.map(function (user) {
    if (user.id == cookie) {
      internCategories = "";
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
    } // end if
    console.log("internData: " + internCategories, internLastKlicked, internCountry)
  })

  // TODO: vergleiche Werte, die in mehreren Profilen vorkommen, dann: Zusammenführen oder eins wählen
  var age
  var allCategories
  var country
  // TODO - lookup javascript ifelse
  if(ownCountry != ""){
    country = ownCountry
  } else {
    if(internCountry != ""){
      country = internCountry
    } else {
      if(externCountry != ""){
        country = externCountry
      } else{
        country = "default"
      }
    }
  }

  // meist wird beim Personalisieren ein altersbereich angegeben, deshalb würde ich hier den bereich aus dem Tool nehmen
  var externStartEndAge = externAge.split("-")
  if (ownAge !< externStartEndAge[0] && ownAge !> externStartEndAge[1])
    age = externAge

  createPage(allCategories, internLastKlicked, country)

}

function calculate_age(birth_month, birth_day, birth_year) {
  today_date = new Date();
  today_year = today_date.getFullYear();
  today_month = today_date.getMonth();
  today_day = today_date.getDate();
  age = today_year - birth_year;

  if (today_month < (birth_month - 1)) {
    age--;
  }
  if (((birth_month - 1) == today_month) && (today_day < birth_day)) {
    age--;
  }
  return age;
}

function getCountry (language){
  switch(language) {
    case 'german':
      return 'Germany'
      break;
    case 'danish':
      return 'Denmark'
      break;
    case 'spanish':
      return 'Spain'
      break;
    case 'english':
      return 'America'
      break;
    default:
      return 'Germany'
  }
}