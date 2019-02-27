function doGet(e) {
     var params = JSON.stringify(e);
    
    return ContentService.createTextOutput(params);
}