var usEntertainment=null;
var usSports=null;
var usTechnology=null;

var querySearch="";
var currentItem=null;
$(document).ready(function(e) {
    usTechnology=JSON.parse(prevLoaded).articles; 
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

         s += "<span class='title' url='"+tmp.url+"' sourceID='"+tmp.source.id+"' sourceName='"+tmp.source.name+"' ";
		 if(tmp.source.id.length>0 && paywalls.includes(tmp.source.id)){
			 s += "paywall='1' title='paywall'";
		 }
		 s += ">"+ tmp.title+"</span>";
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
		try{
			if(obj[i].source.id==null){
				obj[i].source.id="";
			}
		}catch(err){};
	}
}

$(document).on("mouseenter","div.result>div.item",function(event){
	var pos = $(this).position(); 
	$(this).attr("active",1);
	currentItem=this;
	var x = parseInt($(this).css("width")) - 10;
	var y = parseInt($("div.result").css("top"))+ pos.top+20;//parseInt($(this).position().top);
	$("img#moreOption").css("left", x).css("top", y).show();
	
});
$(document).on("mouseleave","div.result>div.item",function(event){
	$(this).attr("active",0);
});

$(document).on("mouseenter","img#moreOption",function(event){
	var pos = $(this).position(); 
	$(currentItem).attr("active",1);
	/*
	var x = parseInt($(this).css("width")) - 10;
	var y = parseInt($("div.result").css("top"))+ pos.top+20;//parseInt($(this).position().top);
	$("img#moreOption").css("left", x).css("top", y);*/
	var source=$(currentItem).find(">span.title").attr("sourceID");
	$("div#optionMenu>span[todo='source']").attr("status", (source.length==0?0:1));
	var sname=$(currentItem).find(">span.title").attr("sourceName");
	$("div#optionMenu>span[todo='source']").html("<img src='images/source16.png' /> Goto "+ sname);
	$("div#optionMenu").css("left",pos.left-100).css("top",pos.top+10).show();
});

$(document).on("mouseleave","div#optionMenu",function(event){
	$(this).hide();
});
$(document).on("click","span.title",function(event){
	var url=$(this).attr("url");
	window.open(url,"_blank");
});

function searching(){
	/*var obj=JSON.parse(prevLoaded).articles;
	loadHeadlines(obj);
	return;*/
	
 
	var cat=document.getElementById("searchCategory").value;
	var country=document.getElementById("country").value;
	var keywordSearch=document.getElementById("keywordSearch").value;
	var dateFrom=document.getElementById("dateFrom").value;
	var dateTo=document.getElementById("dateTo").value;
	var sortBy=document.getElementById("sortBy").value;
	var query="category="+cat;
	if(country!='0'){
		query += "&country="+country;
	}
	if(keywordSearch.length>0){
		query += "&q="+keywordSearch;
	}
	if(dateFrom.length>0){
		query += "&from="+dateFrom;
	}
	if(dateTo.length>0){
		query += "&to="+dateTo;
	}
	if(sortBy != '0'){
		query += "&sortBy="+sortBy;
	} 
	if(dateFrom.length>0 && dateTo.length>0){
		var a=new Date(dateFrom).getTime();;
		var b= new Date(dateTo).getTime();
		if(a>b){
			alert("Beginning (From) date should be before ending (To) date. Please make correction and try again.");
			return;
		}
	}
	/*var newKey=document.getElementById("apikey").value;
	if(newKey.length>30){
		query += "&apiKey="+newKey;
	}else{
		query += "&apiKey="+myAPIKey;
	}*/
	query += "&apiKey="+myAPIKey;
	var url="http://newsapi.org/v2/top-headlines?"+query;
    querySearch = query;
	


   $.get(url, {
			},function(data, status){
			   if(status=='success'){
				   var jsonObj=data.articles;
				   loadHeadlines(jsonObj);
				   $("input#favoriteName").show();
				   $("img#addFavorite").show();
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

function addToFavorite(){
	var cname=document.getElementById("favoriteName").value;
	if(cname.length==0){
		document.getElementById("favoriteName").focus();
		return;
	}
	setCookie(cname, querySearch, 10);
	$("input#favoriteName").val('').hide();
	$("img#addFavorite").hide(); 
	alert(cname+" was added to your favorite.\nYou may view it on favorite page.");
}
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

$(document).on("click","div.topmenu>span[status='1']",function(event){
	document.location.href=$(this).attr("url");
});

function copyToClipboard(text) {
	var $temp = $("<input>");
	$("body").append($temp);
	$temp.val(text).select();
	document.execCommand("copy");
	$temp.remove();
}
$(document).on("click","div#optionMenu>span",function(event){
	var url=$(currentItem).find(">span.title").attr("url");
	var sourceID=$(currentItem).find(">span.title").attr("sourceID");
	var sourceName=$(currentItem).find(">span.title").attr("sourceName");
	switch($(this).attr("todo")){
		case 'copyURL': copyToClipboard(url); break;
		case 'save': foo(currentItem); break;
		case 'source': window.open("source.html?sourceID="+sourceID+"&sourceName="+sourceName, sourceID); break;
	}
	
	$("div#optionMenu").hide();
});

function foo(obj){
	var url=$(obj).find(">span.title").attr("url");
	var title=$(obj).find(">span.title").text();
	setCookie("saved"+new Date().getTime(), "url="+url+"TITLE="+title, 10);
}