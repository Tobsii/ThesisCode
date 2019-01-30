import {createPage} from './main';

export function parseAndMap(internProfile, externProfile, ownProfile, cookie){
        // intern Variablen
      
        ownProfile.map(function(user){
            if (user.id == cookie){
          
            }
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