var usEntertainment=null;
var usSports=null;
var usTechnology=null;
var paywals=['wall-street-jounal'];
var querySearch="";
var currentItem=null;
$(document).ready(function(e) {
    getAllSaved();
});

$(document).on("click","div.topmenu>span[status='1']",function(event){
	document.location.href=$(this).attr("url");
});


$(document).on("click","span.title",function(event){
	var url=$(this).attr("url");
	window.open(url,"_blank");
});

function getAllSaved(){
	var allCookies = document.cookie.split("; ");
	var count=0;
	for(var i=0; i<allCookies.length; i++){
		var x = allCookies[i].indexOf("=");
		if(x<1) continue;
		var cname = allCookies[i].substring(0,x);
		if(cname.indexOf("saved")==0 && cname.length==18){
			var cvalue = allCookies[i].substring(x+1);
			if(cvalue.includes("TITLE=")){
				var data=cvalue.split("TITLE=");
				var url=data[0].substring(4); //the first 4 letters is url=
				$("div.result").append("<div class='item'><span class='title' url='"+url+"'>"+ ++count+". "+data[1]+"</span></div>");
			}
		}
	}
}