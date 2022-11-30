
<!-- 
var validDays = 90;  // number of days before cookie expires
var noise = false ;
var disallowNestedFrames = false ;   

function fixTopicLinks() {
  var i ;
  var aLink ;
  var pDocNum = -1;
  var pBooks = -1;
  var pFrames = -1;
  var pQS ;
  var sfx ;

  for ( i = 0 ; i < document.links.length ; i++ ) 
  {
      aLink = document.links[i].href ;
        
      pFrames = aLink.indexOf("FS=TRUE");

      if(pFrames < 0)
      {

	    pBooks = aLink.indexOf("/books/");
	  
        if (pBooks < 0)
            pBooks = aLink.indexOf("/BOOKS/");
    
        if (pBooks < 0)
        {
            pDocNum =aLink.indexOf("/docnum/") ;
         
            if ( pDocNum < 0 )  
                pDocNum =aLink.indexOf("/DOCNUM/") ;
        }

        if (( pDocNum >= 0 ) || (pBooks >= 0)) 
        {
            pQS = aLink.indexOf("?") ;
         
            if ( pQS < 0 )
            {
                document.links[i].href = aLink + "?FS=TRUE" ;
            }
		    else 
            {
                aLinkLength = aLink.length;
                document.links[i].href = aLink.substring(0,pQS+1) + "FS=TRUE&" + aLink.substring(pQS+1, aLinkLength) ;
	 		    sfx = "&FS=TRUE" ;
		    }  
         
            //if (noise) alert("Fix topic Link " + i +"  "+ document.links[i] ) ;   
        }  // if docnum
      } // if (pFrames < 0)
      else
      {
        document.links[i].href = aLink + "";
      }
  }  // for each link
    
}


function fixUpLinks(admin) {
  var i ;
  var aLink ;
  var pBooks ;
  var pHelp = -1;
  var pDocNum = -1; 
  var pQS ;
  var sfx ;
  var pFrames = -1;
 
  
   
  if ( cookieTest(admin) ) {

    if ( noise ) alert("Fix up Links- cookie true ") ;
    for ( i = 0 ; i < document.links.length ; i++ ) 
    {
      aLink = document.links[i].href ;
      qslink = aLink.substring(aLink.indexOf("?"), aLink.length);
      aLink = aLink.substring(0, aLink.indexOf("?"));
 
      pBooks =aLink.indexOf("/books/") ;
      if ( pBooks < 1 )  
         pBooks =aLink.indexOf("/BOOKS/") ;
      
      if ( pBooks >= 0 ) 
      {
         document.links[i].href = aLink.substring(0,pBooks) + "/FRAMESET/"+ escape(aLink.substring(pBooks+7,aLink.length)) + qslink;
         if ( noise )alert("Fixup Link " + i +"  "+ document.links[i] ) ;   
      } 
      else 
      {
	 
	    aLink = document.links[i].href ; 
		 pFrames = aLink.indexOf("FS=TRUE");

		 if(pFrames < 0)
		 {
			pHelp =aLink.indexOf("/help/") ;
			if ( pHelp < 0 )  
				pHelp =aLink.indexOf("/HELP/") ;
			
            if(pHelp < 0)
            {
                pDocNum =aLink.indexOf("/docnum/") ;
         
                if ( pDocNum < 0 )  
                    pDocNum =aLink.indexOf("/DOCNUM/") ;
            }

            if (( pHelp >= 0 ) || (pDocNum >= 0))
			{
				pQS = aLink.indexOf("?") ;
				if ( pQS < 0 )
					sfx = "?FS=TRUE" ;
				else 
	 				sfx = "&FS=TRUE" ;
		
				document.links[i].href = aLink + sfx ;
				if (noise) alert("Fix topic help Link " + i +"  "+ document.links[i] ) ;   
			}  // help link 
		 } // if(pFrames <0)
		 else
		 {
			document.links[i].href = aLink + "";
		 }            
      } // not books link
    } // for each link
  } else
    if ( noise ) alert("Fix up Links- cookie FALSE ") ;
}

function FramesOn() {

if ( disallowNestedFrames ) {   
    
  if(document.location.href != top.location.href) // prevent being framed
    {
       if(noise) alert("FramesOn - Don't get framed");
       return;
    }
}
   
   cookieON() ;
   var pBooks ;
   var thePath = location.pathname;
   var queryString = location.search;
   pBooks =thePath.indexOf("/books/") ;
   if ( pBooks < 1 )  
       pBooks =thePath.indexOf("/BOOKS/") ;
   if ( pBooks > 0 ) {
       thePath = thePath.substring(0,pBooks) + "/FRAMESET/"+ thePath.substring(pBooks+7,thePath.length) ;
       if (noise) alert("Frameson Path "+ thePath +
	                    "\nQuery String " + queryString) ;   
   } else
      if(noise) alert("Frameson /books/ missing "+ thePath ) ;   
     
   location.href = thePath + queryString;
   return ;
}

function FramesOff() {
   cookieOFF() ;

   var pBooks ;
   var thePath = location.pathname;
   var queryString = location.search;
   var qsLength = queryString.length;

   pBooks =thePath.indexOf("/frameset/") ;
   if ( pBooks < 1 )  
       pBooks =thePath.indexOf("/FRAMESET/") ;
   if ( pBooks > 0 ) {
       thePath = thePath.substring(0,pBooks) + "/BOOKS/"+ thePath.substring(pBooks+10,thePath.length) ;
       if (noise) alert("FramesOff Path  "+ thePath ) ; 
       if (noise) alert("QueryString = " + queryString);  
   } else
   {
       if (noise) alert("FramesOff -/frameset/ missing  "+ thePath ) ;   
       if (noise) alert("FramesOff:  QueryString = " + queryString);
   }
   if(qsLength > 0)
   {
       var fsString = queryString.indexOf("FS=TRUE");
       
       if(fsString == -1)  // FS=TRUE not part of queryString
       {
            parent.location.href = thePath + queryString;
       }
       else if(qsLength == 8) // FS=TRUE only thing in queryString
       {
            parent.location.href = thePath;
       }
       else  // take FS=TRUE out of queryString
       {
            if(fsString == 1) // FS=TRUE is first
            {
                parent.location.href = thePath + "?" + queryString.substring(9,qsLength);
            }
            else if((fsString + 7) == qsLength) // FS=TRUE is last
            {
                parent.location.href = thePath + queryString.substring(0,fsString-1);
            }
            else  // FS=TRUE is somewhere in middle
            {
                parent.location.href = thePath + queryString.substring(0,fsString) + queryString.substring(fsString+8,qsLength);
            }
        }	
   }  
   else
   {
       parent.location.href = thePath ; 
   }
   return ;
}

function cookieON(){
  setCookie("bookserverframes","ON", validDays);

}
function cookieOFF(){
  setCookie("bookserverframes","OFF", validDays);

}
function cookieValue(){
  return getCookie("bookserverframes");

}
function cookieTest(admin) {

if (disallowNestedFrames ) {   
   if(document.location.href != top.location.href) // prevent being framed
   {
       if(noise) alert("cookieTest - False...Don't get framed");
       return false;
   }
}
   
   if ( cookieValue() == "ON" )
	  return true ;
   else 
   if ( cookieValue() == "OFF" )
	    return false;
   else  // cookie is null
   if ( admin == "0" )	
	    return false;
   else   
        return true;
}

// Use this function to retrieve a cookie.
function getCookie(name){
var cname = name + "=";               
var dc = document.cookie;             
    if (dc.length > 0) {              
    begin = dc.indexOf(cname);       
        if (begin != -1) {           
        begin += cname.length;       
        end = dc.indexOf(";", begin);
            if (end == -1) end = dc.length;
            return unescape(dc.substring(begin, end));
        } 
    }
return null;
}

// Use this function to save a cookie.
function setCookie(name, value, days){
    var expires = new Date();

    if(days)
    {
        expires.setTime (expires.getTime() + (days * 1000 * 60 * 60 * 24) );

        document.cookie = name + "=" + escape(value) + "; path=/" + "; expires=" + expires.toGMTString();
    }
    else
        document.cookie = name + "=" + escape(value) + "; path=/";
}

// Use this function to delete a cookie.
function delCookie(name) {
document.cookie = name + "=; expires=Thu, 01-Jan-70 00:00:01 GMT" +  "; path=/";
}

//-->
