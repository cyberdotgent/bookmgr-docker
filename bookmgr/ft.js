fTversion = "4.6a"
evalVersion = false
//****************************************************************
// You are free to copy the original version 1 and 2 "Folder-Tree" script found in:
// http://www.geocities.com/Paris/LeftBank/2178/
// as long as you keep the copyright notice found in that file.
// Author: Marcelino Alves Martins (martins@hks.com) December '97.
//
// This modified version of the script, version 4 and later,
// found in http://www.essence.co.uk/essence/foldertree and elsewhere,
// includes major changes by Nigel Goodwin (C) Copyright 1998-1999.
// You are not free to copy or use this version. All rights reserved.
//
// The evaluation license may be found in the file evallicense.txt
// The full purchase license may be found in the file fulllicense.txt
// The developer license may be found in the file developlicense.txt
// By using this software, you signify that you have read this notice and the license and accept its terms.
//
// This notice must be kept in full at the top of this foldertree code.
//*********************************************************************

error_count = 0;
window.onerror = errorHandler;
var werr;
showmessretry = 0
errmessage = ""
errurl = ""
errline = ""
errstacktrace = ""
errid = 0
errloading = false

function errormessage(){
 //       if (!werr.loaded)
 //       {
 //               errid = setTimeout("errormessage()",200)
 //               showmessretry++;
 //       }
 //       else
	{
		errloading = false
		clearTimeout(errid)
		var f = werr.document.errorfrm
		var n = navigator;
		f.message.value = errmessage;
		f.url.value = errurl;
		f.line.value = errline
		f.useragent.value = n.userAgent
		f.bname.value = n.appName
		f.bversion.value = n.appVersion
		f.bcodename.value = n.appCodeName
		if (n.platform) f.platform.value = n.platform
		if (n.javaEnabled()) f.java.value = "java: " + n.javaEnabled()
		f.fTversion.value = fTversion
		f.evalVersion.value = evalVersion
		f.stacktrace.value = errstacktrace
		if (bV > 0) werr.focus()
	}
	if (showmessretry > 200) clearTimeout(errid)
}

function errorHandler(message, url, line)
{
	if ((!werr || !werr.loaded) && !errloading)
	{
		msgText = ""

		if (confirm("A JavaScript error has occurred - " + message + msgText + "\n\nDo you wish to report this error?"))
		{
			errloading = false
			werr = window.open(ftFolder+"fterror.htm","error"+error_count++,"resizable,status,width=625,height=800");
			errloading = true
			errmessage = message
			errurl = url
			errline = line
			errstacktrace = stacktrace()
			errormessage()
		}

		rewriting = false

		if (!javaerror) setTimeout("rewritepage()",500)

		javaerror = true;
	}

	return true;
}


function stacktrace() {
	var s = "";
	for( a = arguments.caller; a != null; a = a.caller ) {
		s += funcname( a ) + "\n";
		if( a.caller == a || !a.caller) break;
	}

	return s;
}


function funcname(f) {

	if (f == null) return "anonymous";

	if (!f.callee)
		func = f
	else
		func = f.callee

	int1 = func.toString().indexOf("function")
	int2 = func.toString().indexOf("(")
	s = func.toString().substring(int1+9,int2)

	if ((s == null) || (s.length == 0))
		return "anonymous";

	return s;
}


function Node(folderDescription, hreference)
{
	this.desc = folderDescription
	this.hreference = hreference
	this.id = -1
	this.navObj = null
	this.iconImg = null
	this.nodeImg = null
	this.isLastNode = 0
	this.suid = 0
	this.targetFrame = -1
	this.linkType = -1
	this.openIcon = ""
	this.closedIcon = ""
	this.openIconOver = ""
	this.closedIconOver = ""
	this.statusText = ""
	this.hidden = false
	this.userDef = ""
	this.isOpen = false
	this.checked = true
	this.c = new Array
	this.nC = 0
	this.nodeLeftSide = ""
	this.nodeLevel = 0
	this.nodeParent = 0
	this.isInitial = false
	this.font = ""
	this.isFolder = true
	this.initialize = initialize
	this.setState = setStateFolder
	this.moveState = moveStateFolder
	this.addChild = addChild
	this.createIndex = createEntryIndex
	this.hide = hide
	this.display = display
	this.initMode = initMode
	this.collExp = collExp
	this.initLayer = initLayer
	this.setNodeDraw = setNodeDraw
	this.setFont = setFont
	this.setInitial = setInitial
	this.setIcon = setIcon
	this.setTarget = setTarget
	this.setStatusBar = setStatusBar
	this.setUserDef = setUserDef
	this.getUserDef = getUserDef
	this.setNodeFont = setNodeFont
	this.nodeIcon = nodeIcon
	this.nodeTIcon = nodeTIcon
}

function setStateFolder(isOpen)
{
	var totalHeight
	var fIt = 0
	var i=0
	this.isOpen = isOpen

	if (bV > 0)
		propagateChangesInState(this)
}


function moveStateFolder(isOpen)
{
	var totalHeight
	var fIt = 0
	var i=0
	var j=0
	var subopen = 1
	var parent = 0
	var thisnode = 0
	var found = false
	var width = 0
	totalHeight = 0

	for (i=0; i < this.nC; i++)
	{
		if (!noDocs || this.c[i].isFolder)
		{
			totalHeight += this.c[i].navObj.clip.height

			if (isOpen)
				width = Math.max(width,this.c[i].navObj.clip.width)
		}
	}

	if (!isOpen)
		totalHeight = - totalHeight

	this.navObj.clip.height +=  totalHeight

	if (isOpen)
		this.navObj.clip.width = Math.max(width, this.navObj.clip.width)

	thisnode = this
	parent = thisnode.nodeParent

	for (i=0; i < this.nodeLevel; i++)
	{
		parent.navObj.clip.height +=  totalHeight

		if (isOpen)
			parent.navObj.clip.width = Math.max(width, parent.navObj.clip.width)

		found = false

		for (j=0; j < parent.nC; j++)
		{
			if (!noDocs || parent.c[j].nC != null)
			{
				if (found)
					parent.c[j].navObj.moveBy(0,totalHeight)
				else if (parent.c[j] == thisnode)
					found = true
			}
		}

		thisnode = parent
		parent = thisnode.nodeParent
	}

	newHeight= fT.navObj.clip.height + topLayer.layers["header"].clip.height + topLayer.layers["footer"].clip.height
	topLayer.clip.height = newHeight
	topLayer.clip.width = Math.max(topLayer.clip.width,fT.navObj.clip.width)
	newHeight = newHeight + topGap
	frameHeight = thisFrame.innerHeight

	if (isOpen){

		if (doc.height < newHeight)
			doc.height = newHeight
		else if (newHeight < frameHeight) {
			doc.height = frameHeight
			thisFrame.scrollTo(0,0)
		}

		else if (doc.height > newHeight + 0.5*frameHeight){
			doc.height = doc.height*0.5 + (newHeight + 0.5*frameHeight)*0.5
		}
	}

	topLayer.layers["footer"].top = topLayer.layers["footer"].top + totalHeight
}


function propagateChangesInState(folder)
{
	var i=0

	if (folder.nC && treeLines == 1)
	{
		if (!folder.nodeImg)
		{
			if (bV == 2)
				folder.nodeImg = folder.navObj.document.images["treeIcon"+folder.id]
			else if (bV == 1 || doc.images)
				folder.nodeImg = doc.images["treeIcon"+folder.id]
		}

		if (folder.nodeLevel > 0) folder.nodeImg.src = folder.nodeTIcon()
	}

	if (folder.isOpen && folder.isInitial)
	{
		for (i=0; i<folder.nC; i++)
			if (!noDocs || folder.c[i].isFolder)

		folder.c[i].display()
	}
	else
	{
		if (folder.isInitial)
			for (i=0; i<folder.nC; i++)
				if (!noDocs || folder.c[i].isFolder)

		folder.c[i].hide()
	}

	var iA = iNA

	if (!folder.iconImg)
	{
		if (bV == 2)
			folder.iconImg = folder.navObj.document.images["nodeIcon"+folder.id]
		else if (bV == 1 || doc.images)
			folder.iconImg = doc.images["nodeIcon"+folder.id]
	}

	folder.iconImg.src = folder.nodeIcon("",iA)
}


function display()
{
	var i=0

	if (bV == 1)
	{
		if (!this.navObj)
			this.navObj = doc.all["node" + this.id]

		this.navObj.style.display = "block"
	}
	else if (bV ==2)
		this.navObj.visibility = "show"

	if (bV == 1) {
		if (this.isInitial && this.isOpen)
			for (i=0; i < this.nC; i++)
				if (!noDocs || this.c[i].isFolder)
					this.c[i].display()
	}
}


function hide()
{
	var i = 0

	if (bV == 1)
	{
		if (!this.navObj)
			this.navObj = doc.all["node" + this.id]

		this.navObj.style.display = "none"
	}
	else if (bV ==2)
		this.navObj.visibility = "hidden"

	if (bV == 1) {
		if (this.isInitial)
			for (i=this.nC-1; i>-1; i--)
			{
				if (!noDocs || this.c[i].isFolder)
					this.c[i].hide()
			}
	}
}


function initialize(level, lastNode, leftSide, doc, prior)
{
	this.createIndex()
	this.nodeLevel = level

	if(!this.isFolder)
		this.isInitial = true

	if (level>0)
	{
		this.isLastNode = lastNode
		tmpIcon = this.nodeTIcon()

		if (this.isLastNode == 1)
			tmp2Icon = iTA["b"].src
		else
			tmp2Icon = iTA["vl"].src

		if (treeLines == 0)
			tmp2Icon = iTA["b"].src

		if (this.hidden == false)
		{
			if (level == 1 && treeLines == 0 && noTopFolder)
				this.setNodeDraw(leftSide, doc, prior)
			else
			{
				if (this.isFolder){
					auxEv = "<a href='javascript:;' onClick='return " + frameParent + ".clickOnNode("+this.id+");'"
					auxEv += " onMouseOver='return " + frameParent + ".mouseOverNode(0,"+this.id+");'"
					auxEv += " onMouseOut='return " + frameParent + ".mouseOutNode(0,"+this.id+");' alt=''>"
					auxEv += "<img name='treeIcon" + this.id + "' src='" + tmpIcon + "' border=0 alt='' ></a>"
				}
				else
					auxEv = "<img src='" + tmpIcon + "' >"

				this.setNodeDraw(leftSide + auxEv, doc, prior)

				if (this.isFolder)
					leftSide +=  "<img src='" + tmp2Icon + "' >"
			}
		}
	}
	else
		this.setNodeDraw("", doc, prior)

	if (this.isFolder) {
		this.nodeLeftSide = leftSide

		if (this.nC > 0 && this.isInitial)
		{
			level = level + 1
			for (var i=0 ; i < this.nC; i++)
			{
				this.c[i].nodeParent = this
				if (noDocs)
				{
					newLastNode = 1

					for (var j=i+1; j < this.nC; j++)
						if (this.c[j].isFolder)
							newLastNode = 0
				}
				else
				{
					newLastNode = 0

					if (i == this.nC-1)
						newLastNode = 1
				}

				if (i==0 && level == 1 && noTopFolder)
					newLastNode = -1

				if (!noDocs || this.c[i].isFolder)
				{
					this.c[i].initialize(level, newLastNode, leftSide, doc, prior)
				}
			}
		}
	}

	if (bV == 2 && this.hidden == false && !prior)
		doc.write("</layer>");
}


function setNodeDraw(leftSide,doc,prior)
{
	var strbuf = ""
	var font
	if (bV == 2)
	{
		if (!prior)
		{
			strbuf += "<layer id='node" + this.id + "' visibility='hidden'>"
		}
		else
		{
			if (noWrap)
				laywidth = 400
			else
				laywidth = thisFrame.innerWidth - 20

			var testlayer = new Layer(laywidth, prior)
		}
	}
	fullLink = ""
	linkFrame = ""

	// NEWCode
	//if (this.targetFrame == -1)
		targetFrame = defTargetFrame
	//else
		//targetFrame = this.targetFrame
	// ***
	if (targetFrame == 0)
		linkFrame = "target=\"" + baseFrame + "\""
	else if (targetFrame == 1)
		linkFrame = "target=_blank"
	else if (targetFrame == 2)
		linkFrame = "target=_top"
	else
		linkFrame = "target=\"" + targetFrame + "\""

	if (this.linkType == -1)
		linkType = defLinkType
	else
		linkType = this.linkType

	linkURL = ""

	if (linkType == 0)
		linkURL = ""
	else if (linkType == 1)
		linkURL = "http://"
	else if (linkType == 2)
		linkURL = "ftp://"
	else if (linkType == 3)
		linkURL = "telnet://"

	if (this.hreference)
	{
		linkText = commonLink + this.hreference
		int1 = linkText.indexOf("this\.id")

		if (int1 != -1) {
			linkText = linkText.substring(0,int1) + this.id + linkText.substring(int1+7)
		}

        if(linkText.indexOf("?") != -1)
        {
            fullLink = " href='" + linkURL + bookPath + bookScope +separator + bookName + separator + linkText + "&" + "SHELF=" + shelfName + "&" + framedTopic + "' " + linkFrame
        }
        else
        {
            fullLink = " href='" + linkURL + bookPath + bookScope +separator + bookName + separator + linkText + "?" + "SHELF=" + shelfName + "&" + framedTopic + "' " + linkFrame
        }
	}
	else
		fullLink = " href='javascript:;' "

	if (noFrame)
	{
		if (bV == 2)
			fullLink = " href='javascript:document.layers[\"body\"].src=\""
		else if (bV == 1)
			fullLink = " href='javascript:document.all[\"body\"].src=\""

		fullLink += this.hreference + "\";"

		if (collapseOnSelect) fullLink += "collapseAll();"
			fullLink += "void(0); '"
	}

	fullLink += " onMouseOver='return " + frameParent + ".mouseOverNode(1,"+this.id+");' onMouseOut='return " + frameParent + ".mouseOutNode(1,"+this.id+");' "
	fullLink += " onClick='return " + frameParent + ".clickNode("+this.id+");' "

	if (this.statusText == "")
	    var toolTip= this.desc
    else
	    var toolTip = this.statusText

	if (bV > 0)
		eval("toolTip = toolTip.replace(/<[^<>]*>/g,'');");

	fullLink += " TITLE ='" + toolTip + "' "

	if (bV == 1)
		strbuf += "<div id='node" + this.id + "' style='position:static;'>"

	strbuf += "<table border=0 cellspacing=0 cellpadding=0><tr><td valign = "

	if (noWrap)
		strbuf += " 'middle' "
	else
		strbuf += " 'top' "

	strbuf += " nowrap>" + leftSide + "<a " + fullLink + "><img name='nodeIcon" + this.id + "' "
	var iA = iNA
	tmpIcon = this.nodeIcon("",iA)
	strbuf += "src='" + tmpIcon + "' border=0 align = 'absmiddle' alt = '" + toolTip + "'>"

	if (this.isFolder)
		var space = folderIconSpace
	else
		var space = documentIconSpace

	if (space > 0) {
		hspace = parseInt("" + (space/2 + .5) + "")
		wspace = 1

		if (hspace*2 == space) wspace = 2
			hspace = hspace - 1;

		strbuf += "<IMG border=0 align = 'absmiddle' height = '" + wspace + "' width = '" + wspace + "' src='" + iTA["b"].src + "' hspace = '" + hspace + "'>"
	}

	strbuf += "</a></td><td valign=middle "

	if (noWrap)
		strbuf += "nowrap>"
	else
		strbuf += ">"

	if (checkBox)
	{
		strbuf += "<input type=checkbox NAME='" + this.suid + "' VALUE = 'Yes' "
		strbuf += "onClick = 'node = parent.indexOfEntries[" + this.id + "];node.checked = !node.checked;' "

		if (this.checked == true)
			strbuf += " checked>"
		else
			strbuf += ">"
	}

	font = this.setNodeFont()

	if (useTextLinks && this.hreference)
		strbuf += "<a " + fullLink + " >" + font + this.desc + "</font></a>"
	else
		strbuf += font + this.desc + "</font>"

	strbuf += "</td></tr></table>"

	if (bV == 1)
		strbuf += "</div>"

	if (this.nodeLevel == 0 && noTopFolder)
	{
		if (bV == 2)
			strbuf = "<layer id='node" + this.id + "' visibility=hidden>"
		else if (bV == 1)
			strbuf = "<div id='node" + this.id + "' ></div>"
		else if (bV == 0)
			strbuf = ""
	}

	this.navObj = null

	if (this.isFolder)
		this.nodeImg = null

	this.iconImg = null

	if (bV == 0 || !prior)
	{
		if (bV != 1)
			doc.write(strbuf)
		else
			strbufarray[this.id] = strbuf
	}
	else
	{
		if (bV == 2)
		{
			testlayer.document.open()
			testlayer.document.write(strbuf)
			testlayer.document.close()
			this.navObj = testlayer
			this.navObj.top = doc.yPos
			this.navObj.visibility = "show"
			doc.yPos += this.navObj.clip.height
		}
		else if (bV == 1)
		{
			strbufarray[strbufIndex] = strbuf
			strbufIndex++
		}
	}
}


function setNodeFont()
{
	font = "<FONT>"

	if (!levelDefFont[this.nodeLevel])
		levelDefFont[this.nodeLevel] = ""

	if (this.font != "")
		font = this.font
	else if (levelDefFont[this.nodeLevel] != "")
		font = levelDefFont[this.nodeLevel]
	else if (defFolderFont != "" && this.isFolder)
		font = defFolderFont
	else if (defDocFont != "" && !this.isFolder)
		font = defDocFont

	return font;
}


function createEntryIndex()
{
	this.id = nEntries
	indexOfEntries[nEntries] = this
	nEntries++
}


function mouseOverNode(type,folderId)
{
	var mouseNode = 0
	mouseNode = indexOfEntries[folderId]

	if (!mouseNode)
		return false;

	if (bV == 1 && !mouseNode.navObj)
		mouseNode.navObj = doc.all["node" + mouseNode.id]

	if (type == 0)
		if (mouseNode.isOpen)
		{
			setStatus("Click to close")

			if (mouseOverPMMode == 2)
				clickOnNode(folderId)
		}
		else
		{
			setStatus("Click to open")
			if (mouseOverPMMode > 0) clickOnNode(folderId)
		}
	else if (type == 1)
	{
		clearTimeout(timeoutIDOver)

        if(mouseNode.statusText)
        {
		    if (mouseNode.statusText == "")
		    {
			    setStatus(mouseNode.desc)
		    }
		    else
		    {
			    setStatus(mouseNode.statusText)
		    }
        }

		if (mouseNode.isFolder)
			if ((!mouseNode.isOpen && mouseOverIconMode == 1) || mouseOverIconMode == 2)
				timeoutIDOver = setTimeout("clickOnNode(" + folderId + ")",350)
	}

	if (document.images && type == 1)
	{
		over = "Over"
		var iA = iNAO

		if (!mouseNode.iconImg)
		{
			if (bV == 2)
				mouseNode.iconImg = mouseNode.navObj.document.images["nodeIcon"+mouseNode.id]
			else if (bV == 1 || doc.images)
				mouseNode.iconImg = doc.images["nodeIcon"+mouseNode.id]
		}

		mouseNode.iconImg.src = mouseNode.nodeIcon(over,iA)
	}

	return true;
}


function clickNode(folderId)
{
	var thisNode = 0
	thisNode = indexOfEntries[folderId]

	if (!thisNode)
		return false;

	if (thisNode.isFolder)
	{
		if (clickIconMode == 1 && thisNode.isOpen != null)
		{
			if(!thisNode.isOpen)
				clickOnNode(folderId)
		}
		else if (clickIconMode == 2 && thisNode.isOpen != null)
			clickOnNode(folderId)
	}

	if (clickAction)
		clickAction(thisNode)

	if (thisNode.hreference)
		return true;
	else
		return false;
}



function nodeTIcon (){
	iName = ""

	if (this.isFolder)
	{
		if (this.isOpen)
		{
			if (this.isLastNode == 0)
				iName = "mn"
			else if (this.isLastNode == 1)
				iName = "mln"
			else
				iName = "mfn"
		}
		else
		{
			if (this.isLastNode == 0)
				iName = "pn"
			else if (this.isLastNode == 1)
				iName = "pln"
			else
				iName = "pfn"
		}

		if (noDocs)
		{
			folderChildren = false

			for (i=0 ; i < this.nC; i++)
			{
				if (this.c[i].isFolder)
					folderChildren = true
			}

			if (!folderChildren)
				if (this.isLastNode == 0)
					iName = "n"
				else if (this.isLastNode == 1)
					iName = "ln"
				else
					iName = "fn"
		}
	}
	else
	{
		if (this.isLastNode == 0)
			iName = "n"
		else if (this.isLastNode == 1)
			iName = "ln"
		else
			iName = "fn"
	}

	if (treeLines == 0)
		iName = "b"

	tmpIcon = iTA[iName].src
	return tmpIcon
}


function nodeIcon(over,iA){

	tmpIcon = ""
	if (this.isFolder)
	{
		if (this.isOpen)
		{
			if (this["openIcon"+over] != "")
				tmpIcon = imageArray[this["openIcon"+over]].src
			else if (this.nodeLevel == 0)
				tmpIcon = iA["tOF"].src
			else
				tmpIcon = iA["oF"].src
		}
		else
		{
			if (this["closedIcon" + over] != "")
				tmpIcon = imageArray[this["closedIcon"+over]].src
			else if (this.nodeLevel == 0)
				tmpIcon = iA["tCF"].src
			else
				tmpIcon = iA["cF"].src
		}
	}
	else
	{
		if (this["openIcon"+over] != "")
			tmpIcon = imageArray[this["openIcon"+over]].src
		else
			tmpIcon = iA["d"].src
	}

	if (tmpIcon == "")
		tmpIcon = iTA["b"].src

	return tmpIcon;
}



function mouseOutNode(type,folderId)
{
	var mouseNode = 0
	mouseNode = indexOfEntries[folderId]

	if (!mouseNode)
		return false;

	clearTimeout(timeoutIDOver)

	if (document.images && type == 1)
	{
		over = ""
		var iA = iNA

		if (!mouseNode.iconImg)
		{
			if (bV == 2)
				mouseNode.iconImg = mouseNode.navObj.document.images["nodeIcon"+mouseNode.id]
			else if (bV == 1 || doc.images)
				mouseNode.iconImg = doc.images["nodeIcon"+mouseNode.id]
		}

		mouseNode.iconImg.src = mouseNode.nodeIcon(over,iA)
	}

	setStatus("")
	return true;
}


function setStatus(statusText){

    var str = ""

    if(statusText)
	    str = statusText

	if (bV > 0)
		eval("str = str.replace(/<[^<>]*>/g,'');")

  //      top.window.defaultStatus = ""
  //      top.window.status = str
        thisFrame.defaultStatus = str
        thisFrame.status = str

	if (bV == 0)
	{
		clearTimeout(timeoutID)
		timeoutID = setTimeout("top.status = ''",5000)
	}
}



function clickOnNode(folderId)
{
	var cF = 0
	var state = 0
	oldwinheight = thisFrame.innerHeight
	oldwinwidth = thisFrame.innerWidth
	cF = indexOfEntries[folderId]

	if (!cF)
		return false;

	if (!cF.navObj && bV == 1)
		cF.navObj = doc.all["node" + cF.id]

	state = cF.isOpen

	if (!state)
	{
		if (cF.isInitial == false)
		{
			if(cF.nC == 0)
				if (!addToTree)
					alert("Folder has no children")
				else if (addToTree(cF) == true)
					return false;

			if(cF.nC > 0)
			{
				if (bV == 2)
					doc.yPos = cF.navObj.clip.height
				if (bV > 0)
					prior = cF.navObj

				if (bV > 0)
				{
					level = cF.nodeLevel
					leftSide = cF.nodeLeftSide

					if (bV == 1)
					{
						strbufarray = new Array
						strbufIndex = 0
					}

					for (var i=0 ; i < cF.nC; i++)
					{
						cF.c[i].nodeParent = cF

						if (i == cF.nC-1)
							newLastNode = 1
						else
							last = 0

						if (noDocs)
						{
							newLastNode = 1

							for (var j=i+1; j < cF.nC; j++)
								if (cF.c[j].isFolder)
									newLastNode = 0
						}
						else
						{
							newLastNode = 0

							if (i == cF.nC-1)
								newLastNode = 1
						}

						if (!noDocs || cF.c[i].isFolder)
						{
							cF.c[i].initialize(level + 1, newLastNode, leftSide, doc, prior)
							needRewrite = true
						}
					} // for (var i=0 ; i < cF.nC; i++)

					if (bV == 1)
					{
      					htmlStr = strbufarray.join("")
						prior.insertAdjacentHTML("AfterEnd",htmlStr)
					}
				} //if (bV > 0)

				cF.setState(!state)
				cF.isInitial = true
			} //if(cF.nC > 0)
		}// if (cF.isInitial == false)
		else
			cF.setState(!state)
	} // if (!state)
	else
	{
		if (bV == 0)
			cF.isInitial = false

		cF.setState(!state)
	}

	if (bV == 2)
		cF.moveState(!state);

	if (!state && modalClick && (cF.nodeLevel > 0))
		for (i=0; i < cF.nodeParent.nC; i++)
		{
			if (cF.nodeParent.c[i].isOpen && (cF.nodeParent.c[i] != cF))
			{
				if (bV == 2)
					cF.nodeParent.c[i].moveState(false)
				if (bV == 0)
					cF.nodeParent.c[i].isInitial = false

				cF.nodeParent.c[i].setState(false)
			}
		}

	if (bV == 0)
		setTimeout("rewritepage()",50)
	else
		doc.close()

	return false;
}


function collExp(mode)
{
	var i=0

	if (mode == 1)
	{
		this.isInitial = true

		if (this.isFolder)
			this.isOpen = true
	}
	else
	{
		this.isInitial = false

		if (this.isFolder)
			this.isOpen = false
	}

	if (this.isFolder) {
		for (i=0; i<this.nC; i++)
			this.c[i].collExp(mode)
	}
}



function initMode()
{
	var i=0

	if (initialMode == 2)
	{
		if (this.isFolder)
			this.isOpen = true

		this.isInitial = true
	}

	if (this.isFolder) {
		for (i=0; i<this.nC; i++)
		{
			this.c[i].initMode()

			if (this.c[i].isOpen && this.c[i].isInitial)
			{
				this.isOpen = true
				this.isInitial = true
			}
		}
	}
}



function initializeDocument()
{
	if (firstInitial)
	{
		if (initialMode == 0)
		{
			fT.isInitial = false
			fT.isOpen = false
		}

		if (initialMode == 1)
		{
			fT.isInitial = true
			fT.isOpen = true
		}

		fT.initMode()
	}

	prior = null
	fT.initialize(0, 1, "", doc, prior)
	firstInitial = false
}


function collapseAll(){
	var i=0

	if (noFrame)
	{
		if (initialMode == 0)
		{
			if (!fT.navObj && bV == 1)
				fT.navObj = doc.all["node" + fT.id]

			if (fT.isOpen){
				fT.setState(!state)

				if (bV == 2)
					fT.moveState(!state);
			}
		}

		if (initialMode > 0)
		{
			for (i=0; i<fT.nC; i++)
			{
				if (fT.c[i].isOpen) {

					if (!fT.c[i].navObj && bV == 1)
						fT.c[i].navObj = doc.all["node" + fT.c[i].id]

					state = fT.c[i].isOpen
					fT.c[i].setState(!state)

					if (bV == 2)
						fT.c[i].moveState(!state);
				}
			}
		}
	}
	else
	{
		if (initialMode == 0)
		{
			fT.isInitial = false
			fT.isOpen = false
		}
		if (initialMode > 0)
		{
			fT.isInitial = true
			fT.isOpen = true
		}

		for (i=0; i<fT.nC; i++)
			fT.c[i].collExp(0)

		backButton = false
		setTimeout("rewritepage()",50)
	}
}



function expandAll(){
	var i=0

	if (noFrame)
	{
		for (i=0; i<nEntries; i++)
			if (!indexOfEntries[i].isOpen)
			{
				indexOfEntries[i].setState(!state)

				if (bV == 2)
					indexOfEntries[i].moveState(!state);
			}
	}
	else
	{
		fT.collExp(1)
		backButton = false
		setTimeout("rewritepage()",50)
	}
}



function initLayer() {
	var i
	var totalHeight
	var oldyPos
	var width = 0

	if (!this.nodeParent)
		layer = topLayer
	else
		layer = this.nodeParent.navObj

	this.navObj = layer.document.layers["node"+this.id]
	this.navObj.top = doc.yPos
	this.navObj.visibility = "show"

	if (this.nC > 0 && this.isInitial)
	{
		doc.yPos += this.navObj.document.layers[0].top
		oldyPos = doc.yPos
		doc.yPos = this.navObj.document.layers[0].top
		this.navObj.clip.height = doc.yPos
		totalHeight = 0

		for (i=0 ; i < this.nC; i++)
		{
			if (!noDocs || this.c[i].isFolder)
			{
				if (this.c[i].hidden == false)
					this.c[i].initLayer()
				if (bV == 2)
				{
					totalHeight +=  this.c[i].navObj.clip.height
					width = Math.max(width,this.c[i].navObj.clip.width)
				}
			}
		}

		if (this.isOpen)
		{
			doc.yPos = oldyPos + totalHeight
			this.navObj.clip.height += totalHeight
			this.navObj.clip.width = Math.max(width, this.navObj.clip.width)
		}
		else
		{
			doc.yPos = oldyPos
		}
	}
	else
		doc.yPos += this.navObj.clip.height
}


function gFld(d, h, suid)
{
	folder = new Node(d, h)
	folder.isFolder = true

	if (suid != null)
		folder.suid = suid;
	return folder
}


function gLnk(d, h, suid)
{
	linkItem = new Node(d, h)
	linkItem.isFolder = false

	if (suid != null)
		linkItem.suid = suid;
	return linkItem
}


function insFld(p, c)
{
	return p.addChild(c)
}


function insDoc(p, d)
{
	return p.addChild(d)
}


function addChild(childNode)
{
	this.c[this.nC] = childNode
	this.nC++
	return childNode
}


function setFont(font){
	this.font = font
	return
}

function setInitial(initial){
	if (initial && this.isFolder)
	{
		this.isInitial = true
		this.isOpen = true
	}
	return
}


function setIcon(o,c, oO,cO){
	if (this.isFolder){
		if (o != null)
			this.openIcon = o

		if (c != null)
			this.closedIcon = c

		if (oO != null)
			this.openIconOver = oO

		if (cO != null)
			this.closedIconOver = cO
	}
	else
	{
		if (o != null)
			this.openIcon = o

		if (c != null)
			this.openIconOver = c
	}
	return
}


function fTimage(f){
	this.src = iconFolder + f
	return
}


function addImage(name, f){
	if (bV != 1)
		imageArray[name] = new fTimage(f)
	else
	{
		imageArray[name] = new Image()
		imageArray[name].src = iconFolder + f
	}
	nImageArray++
}


function addIcon(icon,prop,f) {
	if (bV != 1)
		icon[prop] = new fTimage(f)
	else
	{
		icon[prop] = new Image()
		icon[prop].src = iconFolder + f
	}
}


function setTarget(t){
	this.targetFrame = t
	return
}



function setLinkType(l){
	if (l >= 0 && 1 <= 3)
		this.linkType = l
	return
}


function setStatusBar(s){
	if (s != null)
		this.statusText = s
	return
}


function setUserDef(name,text){
	if (text != null)
		this.userDef += "<" + name + ">" + text + "</" + name + ">"
	return
}


function getUserDef(name){
	substr1 = "<" + name + ">"
	substr2 = "</" + name + ">"
	length1 = substr1.length
	index1 = this.userDef.indexOf(substr1)
	index2 = this.userDef.indexOf(substr2)

	if (index1 == -1 || index2 == -1)
		return "";

	return this.userDef.substring(index1+length1,index2);
}



function initImage(){
	addIcon(iNA,"tOF",topOpenFolderIcon)
	addIcon(iNA,"tCF",topClosedFolderIcon)
	addIcon(iNA,"oF",openFolderIcon)
	addIcon(iNA,"cF",closedFolderIcon)
	addIcon(iNA,"d",documentIcon)
	addIcon(iNAO,"tOF",topOpenFolderIconOver)
	addIcon(iNAO,"tCF",topClosedFolderIconOver)
	addIcon(iNAO,"oF",openFolderIconOver)
	addIcon(iNAO,"cF",closedFolderIconOver)
	addIcon(iNAO,"d",documentIconOver)
	addIcon(iTA,"mn",mnIcon)
	addIcon(iTA,"pn",pnIcon)
	addIcon(iTA,"pln",plnIcon)
	addIcon(iTA,"mln",mlnIcon)
	addIcon(iTA,"pfn",pfnIcon)
	addIcon(iTA,"mfn",mfnIcon)
	addIcon(iTA,"b",bIcon)
	addIcon(iTA,"ln",lnIcon)
	addIcon(iTA,"fn",fnIcon)
	addIcon(iTA,"vl",vlIcon)
	addIcon(iTA,"n",nIcon)

}



function blank() {
	icheck = 0
	doc = self.frames[menuFrame].document
	ret = "<HTML><HEAD>"

	// NEWCode
	temp = document.location.toString()
	tempIndex = temp.indexOf("FRAMESET")
	if(tempIndex >= 0)
	{
		bookPath = temp.substring(0,tempIndex)
		firstIndex = temp.indexOf("/", tempIndex)

		if(firstIndex >= 0)
		{
			secondIndex = temp.indexOf("/", firstIndex+1)
			if(secondIndex == -1)
			{
				tempLength = temp.length
				bookName = temp.substring(firstIndex+1, tempLength)
			}
			else
			{
				bookName = temp.substring(firstIndex+1, secondIndex)
			}
		}
	}
	// ***

	if (styleSheetFile != "")
		ret += "<link rel='stylesheet' href='" + styleSheetFile + "'>"

	if (bV < 2 )
		ret += "<BASE HREF='" + document.location + "'>"

	ret += "</HEAD><BODY " + bodyOption + " onLoad = 'parent.checkload()'"
	ret += ">"
	initImage()
	ret += "<B><CENTER>Please wait for menu<BR>to be constructed</B><P>"
	ret += "<font size=-1>Loading auxiliary bitmaps:<br>"
	subret = "<img src='"

	for (var propname in iNA)
		if (iNA[propname].src != "")
			ret += subret + iNA[propname].src + "'>"

	for (var propname in iNAO)
		if (iNAO[propname].src != "")
			ret += subret + iNAO[propname].src + "'>"

	for (var propname in iTA)
		if (iTA[propname].src != "")
			ret += subret + iTA[propname].src + "'>"

	for (var propname in imageArray)
		ret += subret + imageArray[propname].src + "'>"

	ret += "<br></CENTER></BODY></HTML>"

	if (doc.all)
		doc.open("text/html","replace")
	else
		doc.open()

	doc.write(ret)

	if (doc.all)
		setTimeout("doc.close()",200)
	else
	{
		doc.close()
		self.frames[menuFrame].onload = checkload
	}
	return ret
}


icheck = 0

function checkload() {
	doc = self.frames[menuFrame].document
	if (!doc.all)
		rewritepage()
	else {
		icheck++

		if (doc.readyState == "complete") {
			setTimeout("rewritepage()",200)
		}
		else {
			if (icheck > 500)
				alert("Loading not complete")
   			else
    			setTimeout("checkload()",200)
		}
	}
}

function rewritepage() {
	backButton = false

	if (rewriting)
		return false;

	rewriting = true

	if (!fT)
	{
		alert("No menu structure")
		rewriting = false
		return false;
	}

	if (document.all)
		bV = 1
	else
	{
		if (document.layers)
		{
			bV = 2
			if (inTable || inForm)
				bV = 0
		}
		else
			bV = 0
	}

	if (navigator.userAgent.indexOf("Win") == -1 && bV == 1)
		bV = 0

	if (bV == 2 && !noFrame)
		self.onresize = self.handleResize

	if (noFrame) {
		doc = document
		frameParent = "self"
		thisFrame = self
	}
	else
	{
		thisFrame = self.frames[menuFrame]
		doc = thisFrame.document

		if (bV == 2) {
			if (doc.width == 0)
			{
				clearTimeout(rewriteID)
				rewriteID = setTimeout("rewritepage()",1000)
				rewriting = false
				return false;
			}
		}
	}

	setStatus("Please wait for menu.")

	if (bV == 1)
		doc.open("text/html","replace")

	if (bV == 0)
		doc.open()

	nEntries = 0
	doc = thisFrame.document

	if (!noFrame || bV != 2)
	{
		doc.write("<html><head>")

		// NEWCode
		temp = document.location.toString()
		tempIndex = temp.indexOf("FRAMESET")

		if(tempIndex >= 0)
		{
			bookPath = temp.substring(0,tempIndex)
			firstIndex = temp.indexOf("/", tempIndex)

			if(firstIndex >= 0)
			{
				secondIndex = temp.indexOf("/", firstIndex+1)

				if(secondIndex == -1)
				{
					tempLength = temp.length
					bookName = temp.substring(firstIndex+1, tempLength)
				}
				else
				{
					bookName = temp.substring(firstIndex+1, secondIndex)
				}
			}
		}

		// ****
		if (styleSheetFile != "")
			doc.write("<link rel='stylesheet' href='" + styleSheetFile + "'>")
		if (bV < 2 )
			doc.write("<BASE HREF='" + document.location + "'>");

		doc.write("<Title></Title></head>")
		resizestr = ""

		if (bV == 2 && !noFrame) {
			resizestr = "onResize = 'parent.handleResize(event)' "
			resizestr += " onLoad = 'parent.docLoad()' "
			resizestr += " onUnLoad = 'parent.backLoad()' "
		}

		doc.write("<BODY " + resizestr + bodyOption + ">")
		setStatus("Please wait for menu.")
	}
	initImage()

	if (bV == 2 && !noFrame)
		self.onresize = self.handleResize

	if (bV == 2)
	{
		if (noFrame)
			doc.write("<LAYER id = 'body' visibility = 'show' SRC= '" + noFrameBody + "'></LAYER>")

		doc.write("<LAYER id = 'foldertree' visibility = 'show' top=" + topGap + " left = " + leftGap + " Z-INDEX=1>")
		doc.write("<layer id = 'header' visibility = 'hidden'>" + menuHeader + "</layer>")
		initializeDocument()
		doc.write("<layer id = 'footer' visibility = 'hidden'>" + menuFooter + "</layer>")
		doc.write("</LAYER>")
	}
	else
	{
		if (bV == 1 && noFrame)
			doc.write("<TABLE border=0 style='height:100%;width:100%;'><TR><TD width = 1 valign = 'top'>")

		if (bV == 1 && noFrame)
			doc.write("<DIV id='foldertree' style='position:static;'>")
		else if (bV == 1)
			doc.write("<DIV id='foldertree' style='position:absolute; left:" + leftGap + "; top:" + topGap + ";'>")
		else
			doc.write("<DIV id='foldertree'>")

		doc.write(menuHeader)
		strbufarray = new Array
		initializeDocument()

		if (bV == 1)
			eval("htmlStr = strbufarray.join(''); doc.write(htmlStr);")

		doc.write(menuFooter)
		doc.write("</DIV>")

		if (bV == 1 && noFrame)
			doc.write("</TD><TD><DIV><IFRAME id='body' visibility = 'show' SCROLLING = auto FRAMEBORDER = 0 BORDER = 0 SRC= '" + noFrameBody + "' style = 'position:relative;height:100%;width:100%;'></IFRAME></DIV></TD></TR></TABLE>")
	}

	if (!noFrame){
		doc.write("</BODY></HTML>")

		if (bV == 2)
			doc.close()
	}

	if (bV == 1 && noFrame)
	{
		doc.body.topMargin = 0
		doc.body.leftMargin = 0
		doc.body.rightMargin = 0
	}

	if (noFrame)
		doc = document
	else

	if (bV == 2)
		doc = self.frames[menuFrame].document

	if (bV == 2)
	{
		topLayer = doc.layers["foldertree"]
		doc.yPos = topLayer.layers["header"].clip.height
		fT.initLayer()
		topLayer.layers["footer"].top = doc.yPos
		topLayer.clip.height = fT.navObj.clip.height + topLayer.layers["header"].clip.height + topLayer.document.layers["footer"].clip.height
		doc.height = topLayer.clip.height + topGap
		topLayer.layers["header"].visibility = "show"
		topLayer.layers["footer"].visibility = "show"
		topLayer.visibility = "show"
		fT.display()
		oldwinheight = thisFrame.innerHeight
		oldwinwidth = thisFrame.innerWidth
	}

	if (bV == 2 && noFrame)
	{
		doc.body.left = doc.foldertree.clip.width
		doc.body.resizeTo(self.innerWidth - doc.body.left,self.innerHeight)
	}

	setStatus("")
	rewriting = false
	needRewrite = false

	if (!noFrame)
	{
		if (doc.all)
			setTimeout("doc.close()",200)
		else
			if (bV == 0)
			{
				doc.close()
				doc = self.frames[menuFrame].document
			}
	}

	backButton = false
	return false;
}


function docLoad() {
	if (bV == 2) {
		if (!topLayer)
		{
			setTimeout("rewritepage()",200);
		}
		else {
			if (topLayer.document.layers["node0"].visibility == "hide")
			{
				setTimeout("self.history.back()",200);
			}
		}
	}
	return
}


function backLoad() {
	if (!backButton) {
		backButton = true
	}
	else {
		if (!remenu) {
			clearTimeout(rewriteID)
			rewriteID = setTimeout("self.history.back()",200)
			backButton = false
		}
	}
	return false;
}


function handleResize(evt) {
	backButton = false
	if (rewriting) {
		alert("Please do not resize window while menu is loading.\n\n Resize again to redraw menu.")
		rewriting = false
		return false
	}

	if (!needRewrite && noWrap && navigator.userAgent.indexOf("Win") != -1)
	{
		for (i=0 ; i < nEntries; i++)
		{
			thisnode = indexOfEntries[i]

			if (thisnode.nodeImg)
				thisnode.nodeImg.src = thisnode.nodeTIcon()
		}
		oldwinheight = thisFrame.innerHeight
		oldwinwidth = thisFrame.innerWidth
		return false;
	}

	if (evt.target.name == menuFrame)
	{
		remenu = false
		if(!(oldwinheight == evt.target.innerHeight && oldwinwidth == evt.target.innerWidth))
		{
			clearTimeout(rewriteID)
			if (topLayer)
			{
				topLayer.clip.height = 0
			}

			rewriteID = setTimeout("rewritepage()",500)
			rewriting = false
			remenu = true
		}
	}
	else
	{
		if(!(oldtopheight == evt.target.innerHeight && oldtopwidth == evt.target.innerWidth))
		{
			if (!remenu){
				clearTimeout(rewriteID)
				rewriteID = setTimeout("rewritepage()",500)
				rewriting = false
			}

			oldtopheight = evt.target.innerHeight
			oldtopwidth = evt.target.innerWidth
		}
		remenu = false
	}
	return false;
}

function setShelfName(shelf){

    shelfName = shelf;
}

// Global variables
// ****************
// NEWCode
var framedTopic = "FS=TRUE"
var bookPath = ""
var bookName = ""
var bookScope = "BOOKS"
separator = "/"
var shelfName = ""
// ****
indexOfEntries = new Array
var nEntries = 0
var selectedNode = 0
var bV = 0
var javaerror = false
var needRewrite = true
var backButton = false
var doc = document
var oldwinheight = 0
var oldwinwidth = 0
var oldtopheight = 0
var oldtopwidth = 0
var topLayer
levelDefFont = new Array
var remenu = false
var firstInitial = true
top.defaultStatus = "";
iNA = new Object()
iNAO = new Object()
iTA = new Object()
imageArray = new Object()
var nImageArray = 0
timeoutID = 0
timeoutIDOver = 0
rewriteID = 0
rewriting = false
frameParent = "parent"
thisFrame = self
fT = 0
addToTree = 0
clickAction = 0
pnIcon = "ftpn.gif";
mnIcon = "ftmn.gif";
pfnIcon = "ftpfn.gif";
mfnIcon = "ftmfn.gif";
plnIcon = "ftpln.gif";
mlnIcon = "ftmln.gif";
nIcon = "ftn.gif";
fnIcon = "ftfn.gif";
lnIcon = "ftln.gif";
bIcon = "ftb.gif";
vlIcon = "ftvl.gif";

//************************************************************
//Folder Tree options. These option can be changed by the user.
// Full details may be found in the documention.
//************************************************************
//**********************
// General
//**********************
var styleSheetFile = "/bookmgr/ftstyle.css"		// Default file for style sheet
var noFrame = false				// indicates whether menu is within frame
var noFrameBody = ""				// Initial URL for no frame mode
var inTable = false				// Indicates whether menu is contained in table
var inForm = false				// Indicates whether menu is contained in form
var checkBox = false				// Indicates whether check box appears or not.
var menuFrame = "tocFrame"			// Default frame for menu
var baseFrame = "topicFrame" 			// Default frame for base
// NEWCode
var defTargetFrame = 0				// Default target frame
// ***
var defLinkType = 0				// Default link type
var commonLink = ""				// Default  common link string
var topGap = 8					// Gap at top of menu in pixels
var leftGap = 8					// Gap at left of menu in pixels
var useTextLinks = 1				// Use text as link or not
var collapseOnSelect = false			// Menu collapses when menu selected - only valid with noFrame
var modalClick = false				// Whether modal or not
var initialMode = 1				// Initial open mode
var treeLines = 1					// Use (+/-) signs or not
var mouseOverPMMode = 0				// Events for mouse over (+/-) signs
var mouseOverIconMode = 0			// Events for mouse over icons
var clickIconMode = 0				// Events for clicking folder icons
var menuHeader = ""				// Header HTML
var menuFooter = ""				// Footer HTML
var folderIconSpace = 8				// blank space after folder icons
var documentIconSpace = 8			// blank space after document icons
var noWrap = true					// Do not wrap menu items if true
var noDocs = false				// Do not show items if true
var noTopFolder = false				// Do not show top folder node if true
var ftFolder = ""					// Default folder for scripts, html files and java applet
var bodyOption = "background='/bookmgr/backdrop.gif'"	// Default options for within <BODY> tag
//var bodyOption = "bgcolor = 'white'"	// Default options for within <BODY> tag
//**********************
// Images
//**********************
var iconFolder = "/bookmgr/" 				// Default folder/directory for the images. This is a relative URL path.
var topOpenFolderIcon = "ftfo.gif" 		// Icon file for open top folder
var topClosedFolderIcon = "ftfc.gif" 	// Icon file for closed top folder
var openFolderIcon = "ftfo.gif" 		// Icon file for other open folders
var closedFolderIcon = "ftfc.gif" 		// Icon file for other closed folders
var documentIcon = "ftd.gif" 			// Icon file for documents
var topOpenFolderIconOver = "ftfc.gif" 	// Icon file for open top folder, mouse over
var topClosedFolderIconOver = "ftfo.gif" 	// Icon file for closed top folder, mouse over
var openFolderIconOver = "ftfc.gif" 	// Icon file for other open folders, mouse over
var closedFolderIconOver = "ftfo.gif" 	// Icon file for other closed folders, mouse over
var documentIconOver = "ftdo.gif" 		// Icon file for documents, mouse over
//**********************
// Fonts
//**********************
var defFolderFont = "<font size=1>"			// Default folder font
var defDocFont = "<font size=1>" 				// Default document font
levelDefFont[0] = ""				// Default level 0 font
levelDefFont[1] = "" 				// Default level 1 font
levelDefFont[2] = "" 				// Default level 2 font


