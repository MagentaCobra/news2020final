var usEntertainment=null;
var usSports=null;
var usTechnology=null;
var paywals=['wall-street-jounal'];


$(document).ready(function(e) {
    var sourceID=  _getQueryInfo("sourceID");
	var sourceName = _getQueryInfo("sourceName");
	
	$("div.toptitle").html("<img src='images/logo.png' /> Source : "+ sourceName);
	loading("sources="+sourceID);
});



function loadHeadlines(jsonObj){
	obj=jsonObj; 
	processNullValue(obj);
    var objPar=$("div.result");
	$(objPar).find("div.item").remove();
	for(var i=0; i<obj.length; i++){ try{
		tmp = obj[i];
		var s="<div class='item' "+ ((i==1)?"index='0'":"")+">";
		
		s +="<img src='"+tmp.urlToImage+"' onerror='this.src=\"images/logo.png\"' alt='Not available' />";

         s += "<span class='title' url='"+tmp.url+"'>"+ tmp.title+"</span>";
		 s  += "<span class='author'>by: "+ tmp.author+" - "+ tmp.publishedAt+" &nbsp; &nbsp; &nbsp; Source: "+tmp.source.name+"</span>";
         s += "<span class='description'>"+tmp.content+"</span></div>";//alert(s); break;
		 //if(tmp.title.indexOf("The Mandalorian Season 1 Timeline Recap")>=0) alert(s);
		 $(objPar).append(s);
	}catch(err){alert(err);}
	}
}

$(document).on("click","div.world>span.menu[status='1']",function(event){
	var query=$(this).attr("query"); 
	var cat=$(this).attr("todo");
	$("div.world>span.menu[status='0']").attr("status",1);
	$(this).attr("status",0); 
	query += "&apiKey="+myAPIKey;
	var url="http://newsapi.org/v2/top-headlines?"+query;//alert(url);
	//loadWorldHeadlines(cat, JSON.parse(prevLoaded).articles);
	$.get(url, {
			},function(data, status){
			   if(status=='success'){
				   var jsonObj=data.articles;
				   loadWorldHeadlines(cat, jsonObj)
			   }
		  });
});

function processNullValue(obj){
	for(var i=0; obj!=null && i<obj.length; i++){
		if(obj[i].description==null ){
			if(obj[i].content==null){
				obj[i].description="";
			}else{
				obj[i].description = obj[i].content;
			}
		}
		if(obj[i].title==null ){
			obj[i].title=obj[i].description;
			if(obj[i].title.length>50) obj[i].title=obj[i].substring(0,50);	
		}
		if(obj[i].author==null) {
			obj[i].author="";
		}
		if(obj[i].publishedAt==null){
			obj[i].publishedAt="";
		}
		if(obj[i].content==null){
			obj[i].content = obj[i].description;
		}
	}
}

$(document).on("click","span.title",function(event){
	var url=$(this).attr("url");
	window.open(url,"_blank");
});

function loading(query){ 
	var url="http://newsapi.org/v2/top-headlines?"+query;
	
	if(!url.includes("apiKey=")){
		url += "&apiKey="+myAPIKey;
	}

   $.get(url, {
			},function(data, status){
			   if(status=='success'){
				   var jsonObj=data.articles;
				   loadHeadlines(jsonObj);
			   }
		  });
}

function _getQueryInfo(info){
	var urlParams = new URLSearchParams(window.location.search);
	var tmp = urlParams.get(info);
	return tmp;
}