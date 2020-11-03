var usEntertainment=null;
var usSports=null;
var usTechnology=null;
var paywals=['wall-street-jounal'];

var selectedFavorite=null;
$(document).ready(function(e) {
    getAllFavorite();
	$(document).on("contextmenu","div.favorite>span[del='1']",function(event){
		event.stopPropagation();
	    event.preventDefault();
		selectedFavorite=this;
		var x=parseInt($("body").css("left")); 
		$("div#favoriteMenu").css("left",event.pageX - x).css("top",event.pageY).show();
		//$("div#favoriteMenu").css("left",pos.left).css("top",pos.top).show();
	});
});



function loadHeadlines(jsonObj){
	obj=jsonObj; 
	processNullValue(obj);
    var objPar=$("div.result");
	$(objPar).find("div.item").remove();
	for(var i=0; i<obj.length; i++){ try{
		tmp = obj[i];
		var s="<div class='item' "+ ((i==1)?"index='0'":"")+">";
		
		s +="<img src='"+tmp.urlToImage+"' onerror='this.src=\"images/logo.png\"'  alt='Not available' />";

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

function resetFields(){

	document.getElementById("searchCategory").selectedIndex=0;
	document.getElementById("country").selectedIndex=0;
	document.getElementById("keywordSearch").value="";
	document.getElementById("sortBy").selectedIndex=0;
	document.getElementById("dateFrom").value="";
	document.getElementById("dateTo").value="";
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift().replace(/\"/g,"");
}

function deleteCookie(name) {
	document.cookie = name+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

$(document).on("click","div.favorite>span",function(event){
	loading($(this).attr("query"));
});

$(document).on("click","div.topmenu>span[status='1']",function(event){
	document.location.href=$(this).attr("url");
});
function getAllFavorite(){
	var allCookies = document.cookie.split("; ");
	for(var i=0; i<allCookies.length; i++){
		var x = allCookies[i].indexOf("=");
		if(x<1) continue;
		var cname = allCookies[i].substring(0,x);

		var cvalue = allCookies[i].substring(x+1);
		if(cvalue.includes("category=")){
			$("div.favorite").append("<span query='"+cvalue+"' title='Right-click to delete' del='1'>"+cname+"</span>");
		}
	}
}
function deleteFavorite(){
	var cname=$(selectedFavorite).text();
	$("div#favoriteMenu").hide();
	deleteCookie(cname);
	$(selectedFavorite).remove();
}