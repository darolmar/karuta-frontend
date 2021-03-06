/* =======================================================
	Copyright 2014 - ePortfolium - Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://opensource.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
   ======================================================= */

/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}


/// Define our type
//==================================
UIFactory["TextField"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'TextField';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='TextField']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='TextField']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='TextField']",node));
	//--------------------
	this.text_node = [];
	for (var i=0; i<languages.length;i++){
		this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='TextField']",node));
		if (this.text_node[i].length==0) {
			if (i==0 && $("text",$("asmResource[xsi_type='TextField']",node)).length==1) { // for WAD6 imported portfolio
				this.text_node[i] = $("text",$("asmResource[xsi_type='TextField']",node));
			} else {
				var newelement = createXmlElement("text");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='TextField']",node)[0].appendChild(newelement);
				this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='TextField']",node));
			}
		}
	}
	this.encrypted = ($("metadata",node).attr('encrypted')=='Y') ? true : false;
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.maxword = $("metadata-wad",node).attr('maxword');
	if (this.maxword==undefined)
		this.maxword = 0;
	this.display = {};
};

UIFactory["TextField"].prototype.getAttributes = function(type,langcode)
//==================================
{
	var result = {};
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (this.multilingual!=undefined && !this.multilingual)
		langcode = 0;
	//---------------------
	if (dest!=null) {
		this.display[dest]=langcode;
	}
	//---------------------
	if (type==null)
		type = 'default';
	//---------------------
	if (type=='default') {
		result['restype'] = this.type;
		result['text'] = this.text_node[langcode].text();
	}
	return result;
}

/// Display
//==================================
UIFactory["TextField"].prototype.getView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	//---------------------
	if (type==null)
		type = "standard";
	var html = $(this.text_node[langcode]).text();
	//---------------------
	if(type=='standard') {
		if (this.encrypted)
			html = decrypt(html.substring(3),g_rc4key);
	}
	return html;
};

/// Editor
//==================================
UIFactory["TextField"].prototype.update = function(langcode)
//==================================
{
	$(this.lastmodified_node).text(new Date().toLocaleString());
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var value = $.trim($("#"+this.id+"_edit_"+langcode).val());
	var words = $.trim(value).split(' ');
	if (this.maxword>0 && countWords(value)>this.maxword) {
		value = getFirstWords(value,this.maxword);
		alertHTML(karutaStr[languages[langcode]]['maxword-alert']+"<br>"+value);
		$("#"+this.id+"_edit_"+langcode).val(value);
	}
	var newValue = value.replace(/(<img("[^"]*"|[^\/">])*)>/g, "$1/>");
	if (this.encrypted)
		newValue = "rc4"+encrypt(newValue,g_rc4key);
	$(this.text_node[langcode]).text(newValue);
	this.save();
	this.save();
	this.updateCounterWords(langcode);
};

//==================================
UIFactory["TextField"].prototype.updateCounterWords = function(langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (this.maxword>0) {
		var value = $.trim($("#"+this.id+"_edit_"+langcode).val());
		var nbWords = countWords(value);
		$("#counter_"+this.id).html(nbWords+"/"+this.maxword);
		if (nbWords>this.maxword){
			$("#counter_"+this.id).addClass('danger');
		}
		else
			$("#counter_"+this.id).removeClass('danger');
	}
}

var editor =  [];
var currentTexfieldUuid = "";
var currentTexfieldInterval = "";

//==================================
UIFactory["TextField"].prototype.displayEditor = function(destid,type,langcode,disabled)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	if (disabled==null)
		disabled = false;
	//---------------------
	if (type==null)
		type = 'default';
	//---------------------
	var text = "";
	if (this.encrypted){
		var cipher = $(this.text_node[langcode]).text().substring(3);
		text = decrypt(cipher,g_rc4key);
	}
	else
		text = $(this.text_node[langcode]).text();
	//---------------------
	var uuid = this.id;
	var html = "";
	if (type=='default') {
		html += "<button id='button_"+this.id+"' class='glyphicon glyphicon-resize-full' style='height:24px;float:right;' onclick=\"UIFactory.TextField.toggleExpand('"+this.id+"','"+langcode+"')\"></button>";
		html += "<div id='div_"+this.id+"'><span id='counter_"+this.id+"' class='word-counter' style='float:right'></span><textarea id='"+this.id+"_edit_"+langcode+"' class='form-control' expand='false' style='height:300px' placeholder='"+karutaStr[LANG]['enter-text']+"' ";
		if (disabled)
			html += "disabled='disabled' ";
		html += ">"+text+"</textarea></div>";
	}
	else if(type.indexOf('x')>-1) {
//		var width = type.substring(0,type.indexOf('x'));
		var height = type.substring(type.indexOf('x')+1);
		html += "<div id='div_"+this.id+"'><textarea id='"+this.id+"_edit_"+langcode+"' style='height:"+height+"px' ";
		if (disabled)
			html += "disabled='disabled' ";
		html += ">"+text+"</textarea></div>";
	}
	$("#"+destid).append($(html));
	if (this.maxword>0) {
		$("#counter_"+uuid).html(countWords(text)+"/"+this.maxword);
	}
	$("#"+uuid+"_edit_"+langcode).wysihtml5({toolbar:{"size":"xs","font-styles": false,"html":true,"blockquote": false,"image": true},"uuid":uuid,"locale":LANG,'events': {'load': function(){$('.wysihtml5-sandbox').contents().find('body').on("keyup", function(){UICom.structure['ui'][currentTexfieldUuid].resource.updateCounterWords(langcode);});},'change': function(){UICom.structure['ui'][currentTexfieldUuid].resource.update(langcode);},'focus': function(){currentTexfieldUuid=uuid;currentTexfieldInterval = setInterval(function(){UICom.structure['ui'][currentTexfieldUuid].resource.update(langcode);}, g_wysihtml5_autosave);},'blur': function(){clearInterval(currentTexfieldInterval);}}});
	//------------------------------------------------
};

//==================================
UIFactory["TextField"].toggleExpand = function(uuid,langcode)
//==================================
{
	if ($("#"+uuid+"_edit_"+langcode).attr('expand')=='false') {
		$("#button_"+uuid).removeClass('glyphicon-resize-full').addClass('glyphicon-resize-small');
		$("#"+uuid+"_edit_"+langcode).attr('expand','true');
		$(".wysihtml5-sandbox").css('height','600px');
		$(".modal-dialog").css('width','90%');
	} else {
		$("#button_"+uuid).removeClass('glyphicon-resize-small').addClass('glyphicon-resize-full');
		$("#"+uuid+"_edit_"+langcode).attr('expand','false');
		$(".wysihtml5-sandbox").css('height','300px');
		$(".modal-dialog").css('max-width','600px');
	}
};
//==================================
UIFactory["TextField"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["TextField"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};


