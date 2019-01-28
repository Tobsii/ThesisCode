const contentful = require('contentful')
const Handlebars = require('handlebars')
var externProfil = require('../json/externProfil'); // load local json with nutzerprofile
var eigenesProfil = require('../json/eigenesProfil');
var internTrackingProfil = require('../json/internTrackingProfil.json');

const client = contentful.createClient({
  space: 'xmltm855c5tp',
  environment: 'master',
  accessToken: 'ee34981f7b6f136d65db092818f06976ee39e520c535325e06322c6920a1b53a'
})

// set Cookie
var usercookie = 2;

// Variables for personalization from user profile
var allCategories = "none"; // if user not exists, set unknown categorie.

/* 
CREATE PAGE
fragt Inhalte bei Contentful ab und baut daraus die Seite zusammen 
*/
function createPage(categories){

  // get single header
  client.getEntry('4CeHNtbObY8Asg2WucGI4U')
  .then(function(entry){
    console.log(entry);
    let header = entry.fields;
    var source   = document.getElementById("templateHeader").innerHTML;
    var template = Handlebars.compile(source);
    header => console.log("In function header")
      var context = {
        title : header.headertitel, 
        text: header.headertext,
        imgURL : 'https:' + header.headerbild.fields.file.url, 
        imgDescription : header.headerbild.fields.description
      }
      
      var result = template(context);
      document.getElementById("banner").innerHTML += result;
    
  })
  .catch(console.error)


  // Get Beiträge
  client.getEntries({
    content_type: 'beitrag',
    limit: 4,
  })
  .then(function(response){
    console.log(response.items);
    let beitrag = response.items;
    buildPosts(beitrag);

    // Wenn nicht genug Beiträge den Kriterien entsprechen
    if(beitrag.length < 4){ 
      var missingItems = 4 - beitrag.length;

      client.getEntries({
        content_type: 'beitrag',
        limit: missingItems,
      })
      .then(function(response){
        let beitrag = response.items;
        console.log(beitrag);
    
        buildPosts(beitrag);
      })
      .catch(console.error);
    }
  })
  .catch(console.error)

  // Get Produkte 
  client.getEntries({
    content_type: 'produkt',
    limit: 8,
    'fields.tags[in]': categories,
  })
  .then(function(response){
    let produkt = response.items;
    console.log(produkt); 

    buildProducts(produkt);

    // wenn nicht genug items mit der richtigen kategorie gefunden wurden, fülle random auf
    if(produkt.length < 8){ 
      var missingItems = 8 - produkt.length;

      client.getEntries({
        content_type: 'produkt',
        limit: missingItems,
      })
      .then(function(response){
        let produkt = response.items;
        console.log(produkt);
    
        buildProducts(produkt);
      })
      .catch(console.error);
    }
  })
  .catch(console.error);

  // get Downloads
  client.getEntries({
    content_type: 'download',
    limit: 3,
  })
  .then(function(response){
    let download = response.items;
    console.log(download);
    buildDownloads(download);

    // Wenn nicht genug Downloads den Kriterien entsprechen
    if(download.length < 3){ 
      var missingItems = 3 - download.length;

      client.getEntries({
        content_type: 'download',
        limit: missingItems,
      })
      .then(function(response){
        let download = download.items;
        console.log(download);
    
        buildDownloads(download);
      })
      .catch(console.error);
    }
  })
  .catch(console.error);
}

//BUILD POSTS FUNCTION
function buildPosts (beitrag){
  var source = document.getElementById("templatePost").innerHTML;
  var template = Handlebars.compile(source);
  return beitrag.map(function(beitrag){
    var context = {
      title : beitrag.fields.beitragstitel,
      text : beitrag.fields.beitragstext,
      imgURL : 'https:' + beitrag.fields.beitragsbild.fields.file.url,
      imgDescription : beitrag.fields.beitragsbild.fields.description,
      autorName : beitrag.fields.autor.fields.autorenname,
      imgAutorURL : 'https:' + beitrag.fields.autor.fields.autorenbild.fields.file.url,
      tags: beitrag.fields.beitragstags[0].fields.name + ", " + beitrag.fields.beitragstags[1].fields.name + ", " + beitrag.fields.beitragstags[2].fields.name,
      tagsNeu: beitrag.fields.tags[0] + ", " + beitrag.fields.tags[1] + ", " + beitrag.fields.tags[2],
    }

    var result = template(context)
    document.getElementById("blog").innerHTML+=result
  })
}

//BUILD DOWNLOADS FUNCTION
function buildDownloads(download){
  var source = document.getElementById("templateDownload").innerHTML;
  var template = Handlebars.compile(source);
  return download.map(function(download){
    var context = {
      title: download.fields.downloadtitel,
      text : download.fields.downloadbeschreibung,
      linkToFile : 'https:' + download.fields.downloaditem.fields.file.url,
      tags : download.fields.downloadtags[0].fields.name + " , " + download.fields.downloadtags[1].fields.name + " , " + download.fields.downloadtags[2].fields.name + " , " + download.fields.downloadtags[3].fields.name + " , " + download.fields.downloadtags[4].fields.name,
      tagsNeu : download.fields.tags[0] + ", " + download.fields.tags[1] + ", " + download.fields.tags[2],
    }
    var result = template(context);
    document.getElementById("downloads").innerHTML+=result;
  })
}

// BUILD PRODUCTS FUNCTION
function buildProducts(produkt){
  var source = document.getElementById("templateProdukt").innerHTML;
    var template = Handlebars.compile(source);
    return produkt.map(function(produkt){
      var context = {
        title : produkt.fields.produktname,
        text : produkt.fields.produktbeschreibung,
        price : produkt.fields.produktpreis,
        kalorien : produkt.fields.produktkalorien,
        imgURL : 'https:' + produkt.fields.produktbild.fields.file.url,
        imgDescription : produkt.fields.produktbild.fields.description,
        tags: produkt.fields.produkttags[0].fields.name + ", " + produkt.fields.produkttags[1].fields.name + ", " + produkt.fields.produkttags[2].fields.name,
        nationalitaet: produkt.fields.produktnationalitaet[0].fields.region,
        art : produkt.fields.produktart[0].fields.artname,
        besonderheit : produkt.fields.produktbesonderheit[0].fields.bezeichnung,
        tagsNeu : produkt.fields.tags[0] + ", " + produkt.fields.tags[1] + ", " + produkt.fields.tags[2],
      }
      var result = template(context);
      document.getElementById("produkte").innerHTML+=result;
    })
}

/* 
PARSE AND MAP
verarbeitet das Nutzerprofil so, dass Contentful damit arbeiten kann 
*/
function parseAndMap (nutzer, cookie){

  nutzer.map(function(user){
    // if id was found - do stuff
    if (user.id == cookie){

      // setze Kategorien String zusammen
      allCategories = "";
      for(var i = 0; i < user.categories.length; i++){
        if(i == user.categories.length-1){
          allCategories+= user.categories[i]
        } else{
            allCategories+= user.categories[i] + ","
        } 
      }
    }
  })
  createPage(allCategories)
}

parseAndMap(internTrackingProfil, usercookie)
