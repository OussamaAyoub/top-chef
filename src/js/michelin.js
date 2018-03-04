var cheerio = require('cheerio');
var request = require('request');
var fs      = require('fs');
var promise = require('promise');
var obj;
function michelin(){
	this.get= function(){
		var json=[];
		var promises=[];
		for (var i = 1; i < 36; i++) {
			var promise= new Promise(function (resolve, reject) {
			var url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-'+i;
			request(url,function(error, response, html){
					if(!error){
						var title;
						var link;
						var $ = cheerio.load(html);
						var part=[]; 
						$('li').each(function(){
							var data=$(this);
							title=data.children().first().attr("attr-gtm-title");
							var link=data.children().first().children().attr("href");
							var resto={Name:title, site:link};
							if(resto.Name!=undefined){
								json.push(resto);
							}
						})
						resolve(json);
					}
					else{
						reject(error);
					}
				})
			});
			promises.push(promise);
		}
		Promise.all(promises).then(function(values){
			fs.writeFile('output.json',"");
			fs.appendFileSync('output.json', JSON.stringify(values[0], null, 4));
		}).catch(function(err){
			console.log(err);
		});

	}
	
}


module.exports=michelin;
var michelininstance=new michelin();
michelininstance.get();
