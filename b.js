//http://xmlhttprequest.ru/
//http://learn.javascript.ru/json
// https://github.com/adammark/Markup.js

bbb = [];
tags = [];

markTemplate = document.getElementById("en-list").firstChild.textContent;
markOptions = {
    	compact: true
	};

reHASHTAG = /#([^ \!@#\$%\^&*()+={}\[\]\n\t]+)/g;
reIMG = /@(.+)@/g;
reCODE = /```[\n \r]*([^`]+)[\n \r]*```/g;
reP = /(^.+$)/gm

function httpGet(request){
	var xmlhttp = new XMLHttpRequest()
	
	//xmlhttp.open("GET",request.url,true);
	xmlhttp.open("GET",request.url,true)
	//xmlhttp.setRequestHeader('X-Redmine-API-Key', localStorage['apikey'])
	xmlhttp.send(null);
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState != 4){ return }

		if(xmlhttp.status == 200) {
			try{
				json = xmlhttp.responseText;
			}catch(err){
				//alertNotification("Error description: " + err.message)
				console.log("Error description: " + err.message)
			}
			if (json){ request.success(json) }
		}else{
			//alertNotification("Can't connect to server.\nStatus: " + xmlhttp.status.toString() + ' ('+xmlhttp.statusText+')')
			console.log("Can't connect to server.\nStatus: " + xmlhttp.status.toString() + ' ('+xmlhttp.statusText+')')
		}


	}
}
function entriesFromTxt(txt){
	var rawEntries = json.split(/\n*=====\n*/g);
    var entries = [];
	for (var i=rawEntries.length-1; i>=0; --i){
        rawEntrie = rawEntries[i].trim();
        
		if (rawEntrie.length > 0){
			var entrie = {};
			entrieLines = rawEntrie.split('\n');
			entrie.title = entrieLines[0];
			entrie.text = entrieLines.slice(1,entrieLines.length).join('\n');
			entrie.tags = rawEntries[i].match(reHASHTAG);
			entries.push(entrie);
		}
	}

	return entries
}

function toHTMLLayout(txt){
		txt = txt.replace(reP, '<p>$1</p>')
		txt = txt.replace(reIMG, '<img src="$1">')
		txt = txt.replace(reCODE, '<div class="code">$1</div>')
		txt = txt.replace(reHASHTAG, '<span class="textonetag">$1</span>')
		return txt
}
/*
function createDOMElementsFrom(entries){
	for (var i=entries.length-1; i>=0; --i){
		var entrie = entries[i];
		
		var d = document.createElement('div');
		d.className = "entrie";

		var t = document.createElement('div');
		t.className = 'title'
		//t.style.backgroundImage = 'url(http://pics.deejay.de/pics/xl/4/1/180841.jpg)'
		t.innerHTML = entrie.title

		var textNode = document.createElement('div');
		textNode.className = "text"
		textNode.innerHTML = toHTMLLayout(entrie.text);
		
		var tags = document.createElement('div');
		tags.className = 'tags'
		if (entrie.tags){
			for (var j=entrie.tags.length-1; j>=0; j--){
				var onetag = document.createElement('div');
				onetag.className = 'onetag';
				onetag.innerHTML = entrie.tags[j];
				tags.appendChild(onetag)
			}
		}

		d.appendChild(t);
		d.appendChild(textNode);
		d.appendChild(tags);
		document.getElementById('container').appendChild(d)
	};		
}
*/

function createDOMElementsFrom(entries){
	Mark.pipes.f = function (txt){
		var escape = document.createElement('textarea');
		escape.textContent = txt;
		txt = escape.innerHTML

		txt = txt.replace(reP, '<p>$1</p>')
		txt = txt.replace(reIMG, '<img src="$1" width=200>')
		txt = txt.replace(reCODE, '<div class="code">$1</div>')
		txt = txt.replace(reHASHTAG, '<span class="textonetag">$1</span>')
		return txt
	}
	var context = {
    	entries: entries
    };

	var result = Mark.up(markTemplate, context, markOptions);
	document.getElementById('container').innerHTML= result;
}
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}
// usage example:
var a = ['a', 1, 'a', 2, '1'];
var unique = a.filter( onlyUnique ); // returns ['a', 1, 2, '1']


var request = {};
request.url = "entries.txt";
request.success = function(txt){
    var entries = entriesFromTxt(txt);
    createDOMElementsFrom(entries);

	var msnry = new Masonry( document.getElementById('container'), {
	  //columnWidth: 600,
	  isAnimated: false,
	  itemSelector: '.entrie',
	  //isFitWidth: true,
	  //columnWidth:100,
	  transitionDuration: 0,
	  animationOptions: {
    	duration: 0,
    	queue: false,
     }
	})
	};


httpGet(request);

