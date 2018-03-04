var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var promise = require('promise');


function lafourchette(){
  var promises=[];
  var restaurants=[];
  var obj;
  fs.readFile('output.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    obj.forEach(function(element) {
      var Name=element.Name;
      
      var name=element.Name.replace(/ /g,"%20");
      name=name.replace(/'/g,"%27");
      name=name.replace(/é/g,"e");
      name=name.replace(/è/g,"e");
      name=name.replace(/ë/g,"e");
      name=name.replace(/ê/g,"e");
      name=name.replace(/û/g,"u");
      name=name.replace(/ü/g,"u");
      name=name.replace(/î/g,"i");
      name=name.replace(/ï/g,"i");
      name=name.replace(/ç/g,"c");
      name=name.replace(/ô/g,"o");
      name=name.replace(/â/g,"a");
      name=name.replace(/à/g,"a");
      name=name.replace(/É/g,"E");
      var link="https://m.lafourchette.com/api/restaurant-prediction?name="+name+"&origin_code_list[0]=THEFORKMANAGER&origin_code_list[1]=TRIPADVISOR";
      var resto;
      var promise=new Promise(function (resolve, reject) {
        request(link, function(error, response, html){
          if(!error){
            var $ = cheerio.load(html);
            const element = $('body');
            var test=element.text();
            if(test[4]!="B"){
             var objectValue = JSON.parse(test);
             if(objectValue[0]!=undefined){
              var rname=objectValue[0].name;
              var rid=objectValue[0].id;
              resto={Name:rname, id:rid};
            }
          }
        }
        else{
          reject(error);
        }
        resolve(resto);
      });
      });
      promises.push(promise);

    });
    Promise.all(promises).then(function(values){
      getsales(values);
    }).catch(function(err){
      console.error(err);
    });
    
  });
  
}

function getsales(restaurants){
  var promises=[];
  restaurants.forEach(function(restaurant) {
    if(restaurant!=undefined){
      var Name=restaurant.Name;
      var rid=restaurant.id;
      var link="https://m.lafourchette.com/api/restaurant/"+rid+"/sale-type";
      var promise=new Promise(function (resolve, reject) {
        request(link, function(error, response, html){
          if(!error){
            var $ = cheerio.load(html);
            const element = $('body');
            var test=element.text();

            var resto;
            if(test!=[]){
             var objectValue = JSON.parse(test);
             if(objectValue[0]!=undefined){
              var special=objectValue[0].is_special_offer;
              var specialmenu=objectValue[0].is_menu;
              if(special!=true && specialmenu!=true){
                resto={Name:Name, id:rid, special:false};
              }
              else{
                var sales=[]
                objectValue.forEach(function(sale)
                {
                  sales.push(sale.title);
                });
                sales.splice(-1,1);
                resto={Name:Name, id:rid, special:sales};
              }
            }
          }
        }
        else{
          reject(error);
        }
        resolve(resto);
      });
      });
      promises.push(promise);
    }

  });
  Promise.all(promises).then(function(newvalues){
    fs.writeFile('special.json',"");
    fs.appendFileSync('special.json', JSON.stringify(newvalues, null, 4));
  }).catch(function(err){
    console.error(err);
  });
}


lafourchette();
