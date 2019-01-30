import {createPage} from './main';

export function parseAndMap(internProfile, externProfile, ownProfile, cookie){
        // intern Variablen
        var ownAge
        var ownCategories
        var ownAuthor
        var ownDownloads
      
        ownProfile.map(function(user){
            if (user.id == cookie){
                ownAuthor = user.favoriteAuthor
                ownDownloads = user.downloads
                var birthday = user.birthday.split(".")
                ownAge = calculate_age(birthday[1], birthday[0], birthday[2])

                // setze Kategorien String zusammen
                for(var i = 0; i < user.favoriteFood.length; i++){
                    if(i == user.favoriteFood.length-1){
                    ownCategories+= user.favoriteFood[i]
                    } else{
                        ownCategories+= user.favoriteFood[i] + ","
                    } 
                }
                console.log(ownAge, ownCategories, ownAuthor, ownDownloads)
            } // end if
        })
        
        externProfile.map(function(user){
          if (user.id == cookie){
      
          }
      
        })
      
        internProfile.map(function(user){
          // if id was found - do stuff
          if (user.id == cookie){
            allCategories = "";
      
      
            // setze Kategorien String zusammen
            for(var i = 0; i < user.categories.length; i++){
              if(i == user.categories.length-1){
                allCategories+= user.categories[i]
              } else{
                  allCategories+= user.categories[i] + ","
              } 
            }
      
            // finde letztgesehene Beispiele im internenProfil
            for(var i = 0; i < user.lastKlickedProduct.length; i++){
              if(i == user.lastKlickedProduct.length-1){
                lastKlicked+= user.lastKlickedProduct[i]
              } else{
                lastKlicked+= user.lastKlickedProduct[i] + ","
              } 
            }
          }
        })
        // setze kategorien zusammen
      
        createPage(allCategories, lastKlicked)
      
}

function calculate_age(birth_month,birth_day,birth_year)
{
    today_date = new Date();
    today_year = today_date.getFullYear();
    today_month = today_date.getMonth();
    today_day = today_date.getDate();
    age = today_year - birth_year;

    if ( today_month < (birth_month - 1))
    {
        age--;
    }
    if (((birth_month - 1) == today_month) && (today_day < birth_day))
    {
        age--;
    }
    return age;
}