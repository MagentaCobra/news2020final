var usEntertainment=null;
var usSports=null;
var usTechnology=null;
var paywals=['wall-street-jounal'];

$(document).ready(function(e) {

	var url="http://newsapi.org/v2/top-headlines?category=entertainment&country=us&apiKey="+myAPIKey;
	$.get(url, {
			},function(data, status){
			   if(status=='success'){
				   usEntertainment=data.articles;
				   processNullValue(usEntertainment);
				   rotateArticles(usEntertainment,5, 'entertainment', false);
			   }
		  });
	
	url="http://newsapi.org/v2/top-headlines?category=technology&country=us&apiKey="+myAPIKey;
	$.get(url, {
			},function(data, status){
			   if(status=='success'){
				   usTechnology=data.articles;
				   processNullValue(usTechnology);
				   rotateArticles(usTechnology,0, 'technology', true);
			   }
		  });
	
	url="http://newsapi.org/v2/top-headlines?category=sports&country=us&apiKey="+myAPIKey;
	$.get(url, {
			},function(data, status){
			   if(status=='success'){
				   usSports=data.articles;
				   processNullValue(usSports);
				   rotateArticles(usSports,0, 'sports', false);
			   }
		  });

	$("div.world>span.menu[todo='technology']").trigger("click");
});

function rotateArticles(obj, index, cat, rotating){
	if(rotating){
		if($("div.us1").attr("cat") != cat){
			index=0;
			cat = $("div.us1").attr("cat");
			switch(cat){
				case 'sports': obj=usSports;  break;
				case 'entertainment': obj=usEntertainment;  break;
				case 'technology': obj = usTechnology; 
			}
		}
	}
	var objDIV=$("div[cat='"+cat+"']")[0];//alert($(objDIV).html());
	if(obj != null){
		var tmp=obj[index];
		$(objDIV).fadeOut(1000);
		setTimeout(function(){ try{//alert(tmp.urlToImage.length);
			if(tmp.urlToImage==null || tmp.urlToImage.length==0){
				$(objDIV).css("background-image","url(images/"+cat+".png)");
			}else{
				$(objDIV).css("background-image","url("+tmp.urlToImage+")");
			}
			try{
				if(source.id != null && paywalls.includes(tmp.source.id)){
					$(objDIV).find(">span.title").html(tmp.title).attr("paywall",1).attr("url",tmp.url); 
				}else{
					$(objDIV).find(">span.title").html(tmp.title).attr("url",tmp.url); 
				}
			}catch(err){
				$(objDIV).find(">span.title").html(tmp.title).attr("url",tmp.url);
			}
			$(objDIV).find(">span.author").html(tmp.author);
			$(objDIV).find(">span.description").html(tmp.description);
			$(objDIV).fadeIn(2000);}catch(err){}
		},1000);
		index = ++index % obj.length; 
	}else{
		index=0;
	}
	if(rotating){
		setTimeout(rotateArticles, 6000, obj, index, cat, true);
	}
}

function loadWorldHeadlines(cat, jsonObj){
	obj=jsonObj;
	processNullValue(obj);
	$('div.world>div.item').remove();
	var objDIV=$("div.world>div.w1")[0];
	var tmp=obj[0];
	//$(objDIV).find(">span.image").css("background-image","url(images/"+cat+".png)");
	
	try{
		if(tmp.urlToImage==null || tmp.urlToImage.length==0){
			tmp.urlToImage="images/logo.png";
		}
	    $(objDIV).find(">span.image").html("<img src='"+tmp.urlToImage+"' onerror='this.src=\"images/logo.png\"' alt='Not available' />");
	
	$(objDIV).find(">span.title").html(tmp.title).attr("url",tmp.url); 
	$(objDIV).find(">span.author").html(tmp.author);
	$(objDIV).find(">span.description").html(tmp.description);
	}catch(err){alert(err);}
	for(var i=1; i<obj.length; i++){
		tmp = obj[i];
		var s="<div class='item' "+ ((i==1)?"index='0'":"")+">";
		/*if(tmp.urlToImage==null || tmp.urlToImage.length==0){
			s +="<span class='image' style='background-image:url(images/"+cat+".png)'></span>";
		}else{
			s +="<span class='image' style='background-image:url("+tmp.urlToImage+")'></span>";
		}
		*/
		if(tmp.urlToImage==null || tmp.urlToImage.length==0){
			tmp.urlToImage="images/logo.png";
		}
	     s += "<span class='image'><img src='"+tmp.urlToImage+"' onerror='this.src=\"images/logo.png\"' alt='Not available' /></span>";
		
         s += "<span class='title' url='"+tmp.url+"'>"+ (tmp.title.length>100?tmp.title.substring(0,100):tmp.title)+"</span>";
		 s  += "<span class='author'>by: "+ tmp.author+" - "+ tmp.publishedAt+" &nbsp; &nbsp; &nbsp; Source: "+tmp.source.name+"</span>";
         s += "<span class='description'>"+tmp.description+"</span></div>";//alert(s); break;
		 //if(tmp.title.indexOf("The Mandalorian Season 1 Timeline Recap")>=0) alert(s);
		 $("div.world").append(s);
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
	}
}

$(document).on("click","span.title",function(event){
	var url=$(this).attr("url");
	window.open(url,"_blank");
});

$(document).on("click","div.topmenu>span[status='1']",function(event){
	document.location.href=$(this).attr("url");
});

$(document).on("click", "div.us2>span[todo='cat'], div.us3>span[todo='cat']",function(event){
	var cat1=$("div.us1").attr("cat");
	var objPar=$(this).parent();
	var cat=$(objPar).attr("cat"); 
	$("div.us1").attr("cat", cat).find(">span[todo='cat']").text("U.S. "+cat.toUpperCase());
	$(objPar).attr("cat", cat1).find(">span[todo='cat']").text("U.S. "+cat1.toUpperCase());
	var objTmp=usTechnology;
	switch(cat1){
		case 'sports': objTmp=usSports;  break;
		case 'entertainment': objTmp=usEntertainment;  break;
	}
	rotateArticles(objTmp, 6, cat1, false)
	//$("div.us1").attr("cat",
});