function getTags(clickedElement){
    var tagsInText = clickedElement.getElementsByClassName("tags")[0].innerHTML;
    var seperateTagsFromText = tagsInText.split(":");
    var tagsArray = seperateTagsFromText[1];
    
    console.log(tagsArray);
    // TODO - ANALYZE & SAVE THEM? WHERE?
}