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
      console.log("ownData: " + ownAge, ownCategories, ownAuthor, ownDownloads, ownCountry)
    } // end if
  })

  externProfile.map(function (user) {
    if (user.id == cookie) {

    }

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
    }
    console.log("internData: " + internCategories, internLastKlicked, internCountry)
  })

  createPage(allCategories, internLastKlicked)

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