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
UIFactory["Get_Resource"] = function(node,condition)
//==================================
{
	this.clause = "xsi_type='Get_Resource'";
	if (condition!=null)
		this.clause = condition;
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Get_Resource';
	this.code_node = $("code",$("asmResource["+this.clause+"]",node));
	this.value_node = $("value",$("asmResource["+this.clause+"]",node));
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource["+this.clause+"]",node));
		if (this.label_node[i].length==0) {
			if (i==0 && $("label",$("asmResource["+this.clause+"]",node)).length==1) { // for WAD6 imported portfolio
				this.label_node[i] = $("text",$("asmResource["+this.clause+"]",node));
			} else {
				var newelement = createXmlElement("label");
				$(newelement).attr('lang', languages[i]);
				$("asmResource["+this.clause+"]",node)[0].appendChild(newelement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource["+this.clause+"]",node));
			}
		}
	}
	this.encrypted = ($("metadata",node).attr('encrypted')=='Y') ? true : false;
	if (this.clause=="xsi_type='Get_Resource'")
		this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	else // asmUnitStructure - Get_Resource
		this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
	this.inline = ($("metadata",node).attr('inline')=='Y') ? true : false;
	this.display = {};
	this.displayCode = {};
	this.displayValue = {};
};

//==================================
UIFactory["Get_Resource"].prototype.getAttributes = function(type,langcode)
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
		result['value'] = this.value_node.text();
		result['code'] = this.code_node.text();
		result['portfoliocode'] = this.portfoliocode_node.text();
		result['label'] = this.label_node[langcode].text();
	}
	return result;
}

/// Display

//==================================
UIFactory["Get_Resource"].prototype.getCode = function(dest)
//==================================
{
	if (dest!=null) {
		this.displayCode[dest] = true;
	}
	return this.code_node.text();
};

//==================================
UIFactory["Get_Resource"].prototype.getValue = function(dest)
//==================================
{
	if (dest!=null) {
		this.displayValue[dest] = true;
	}
	return this.value_node.text();
};

//==================================
UIFactory["Get_Resource"].prototype.getView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var label = this.label_node[langcode].text();
	if (this.encrypted)
		label = decrypt(label.substring(3),g_rc4key);
	var code = $(this.code_node).text();
	if (code.indexOf("@")>-1)
		code = code.substring(0,code.indexOf("@"))+code.substring(code.indexOf("@")+1);
	if (code.indexOf("#")>-1)
		code = code.substring(0,code.indexOf("#"))+code.substring(code.indexOf("#")+1);
	if (code.indexOf("&")>-1)
		code = code.substring(0,code.indexOf("&"))+code.substring(code.indexOf("&")+1);
	var html = "";
	html += "<span class='"+code+"'>";
	if (($(this.code_node).text()).indexOf("#")>-1)
		html += code+ " ";
	if (($(this.code_node).text()).indexOf("&")>-1)
		html += "["+$(this.value_node).text()+ "] ";
	html += label+"</span>";
	return html;
};

//==================================
UIFactory["Get_Resource"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
//	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var label = this.label_node[langcode].text();
	if (this.encrypted)
		label = decrypt(label.substring(3),g_rc4key);
	var code = $(this.code_node).text();
	if (code.indexOf("@")>-1)
		code = code.substring(0,code.indexOf("@"))+code.substring(code.indexOf("@")+1);
	if (code.indexOf("#")>-1)
		code = code.substring(0,code.indexOf("#"))+code.substring(code.indexOf("#")+1);
	if (code.indexOf("&")>-1)
		code = code.substring(0,code.indexOf("&"))+code.substring(code.indexOf("&")+1);
	var html = "";
	html += "<span class='"+code+"'>";
	if (($(this.code_node).text()).indexOf("#")>-1)
		html += code+ " ";
	if (($(this.code_node).text()).indexOf("&")>-1)
		html += "["+$(this.value_node).text()+ "] ";
	html += label+"</span>";
	$("#"+dest).html("");
	$("#"+dest).append($(html));
};


/// Editor
//==================================
UIFactory["Get_Resource"].update = function(selected_item,itself,langcode,type)
//==================================
{
	var value = $(selected_item).attr('value');
	var code = $(selected_item).attr('code');
	//---------------------
	if (itself.encrypted)
		value = "rc4"+encrypt(value,g_rc4key);
	if (itself.encrypted)
		code = "rc4"+encrypt(code,g_rc4key);
	//---------------------
	$(itself.value_node[0]).text(value);
	$(itself.code_node[0]).text(code);
	for (var i=0; i<languages.length;i++){
		var label = $(selected_item).attr('label_'+languages[i]);
		//---------------------
		if (itself.encrypted)
			label = "rc4"+encrypt(label,g_rc4key);
		//---------------------
		$(itself.label_node[i][0]).text(label);
	}
	itself.save();
};

//==================================
UIFactory["Get_Resource"].prototype.displayEditor = function(destid,type,langcode,disabled,cachable,resettable)
//==================================
{
	if (cachable==undefined || cachable==null)
		cachable = true;
	if (type==undefined || type==null)
		type = $("metadata-wad",this.node).attr('seltype');
	var queryattr_value = $("metadata-wad",this.node).attr('query');
	if (queryattr_value!=undefined && queryattr_value!='') {
		//------------
		var srce_indx = queryattr_value.lastIndexOf('.');
		var srce = queryattr_value.substring(srce_indx+1);
		var semtag_indx = queryattr_value.substring(0,srce_indx).lastIndexOf('.');
		var semtag = queryattr_value.substring(semtag_indx+1,srce_indx);
		var target = queryattr_value.substring(srce_indx+1); // label or text
		//------------
		var portfoliocode = queryattr_value.substring(0,semtag_indx);
		var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
		if (portfoliocode.indexOf('.')<0 && selfcode.indexOf('.')>0 && portfoliocode!='self')  // There is no project, we add the project of the current portfolio
			portfoliocode = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode;
		if (portfoliocode=='self') {
			portfoliocode = selfcode;
			cachable = false;
		}
		//------------
		var self = this;
		if (cachable && g_Get_Resource_caches[queryattr_value]!=undefined && g_Get_Resource_caches[queryattr_value]!="")
			UIFactory["Get_Resource"].parse(destid,type,langcode,g_Get_Resource_caches[queryattr_value],self,disabled,srce,resettable,target,semtag);
		else
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/nodes?portfoliocode=" + portfoliocode + "&semtag="+semtag,
				success : function(data) {
					if (cachable)
						g_Get_Resource_caches[queryattr_value] = data;
					UIFactory["Get_Resource"].parse(destid,type,langcode,data,self,disabled,srce,resettable,target,semtag);
				}
			});
	}
};


//==================================
UIFactory["Get_Resource"].parse = function(destid,type,langcode,data,self,disabled,srce,resettable,target,semtag) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!self.multilingual)
		langcode = NONMULTILANGCODE;
	if (disabled==null)
		disabled = false;
	if (resettable==null)
		resettable = true;
	//---------------------
	var self_code = $(self.code_node).text();
	if (self.encrypted)
		self_code = decrypt(self_code.substring(3),g_rc4key);
	//---------------------
	if (type==undefined || type==null)
		type = 'select';

	//------------------------------------------------------------
	if (type=='select') {
		var html = "<div class='btn-group choice-group select-"+semtag+"'>";		
		html += "<button type='button' class='btn btn-default select select-label' id='button_"+self.id+"'>&nbsp;</button>";
		html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>&nbsp;</span></button>";
		html += "</div>";
		var btn_group = $(html);
		$("#"+destid).append($(btn_group));
		html = "<ul class='dropdown-menu' role='menu'></ul>";
		var select  = $(html);
		if (resettable) //----------------- null value to erase
			html = "<li></li>";
		else
			html ="";
		var select_item = $(html);
		html = "<a  value='' code='' ";
		for (var j=0; j<languages.length;j++) {
			html += "label_"+languages[j]+"='&nbsp;' ";
		}
		html += ">";
		html += "&nbsp;</a>";
		var select_item_a = $(html);
		$(select_item_a).click(function (ev){
			$("#button_"+self.id).html($(this).attr("label_"+languages[langcode]));
			$("#button_"+self.id).attr('class', 'btn btn-default select select-label');
			UIFactory["Get_Resource"].update(this,self,langcode);
		});
		$(select_item).append($(select_item_a))
		$(select).append($(select_item));
		//--------------------
		var nodes = $("node",data);
		//---------------------
		if (target=='label') {
			for ( var i = 0; i < $(nodes).length; i++) {
				var resource = null;
				if ($("asmResource",nodes[i]).length==3)
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
				else
					resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
				var code = $('code',resource).text();
				var display_code = true;
				if (code.indexOf("@")>-1) {
					display_code = false;
					code = code.substring(0,code.indexOf("@"))+code.substring(code.indexOf("@")+1);
				}
				if (code.indexOf("#")>-1) {
					code = code.substring(0,code.indexOf("#"))+code.substring(code.indexOf("#")+1);
				}
				if (code.indexOf('----')>-1) {
					html = "<li class='divider'></li><li></li>";
				} else {
					html = "<li></li>";
				}
				var select_item = $(html);
				html = "<a  value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='sel"+code+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				html += ">";
				if (display_code)
					html += "<div class='li-code'>"+code+"</div> <span class='li-label'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span></a>";
				else
					html += "<span class='li-label'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span></a>";
				
				var select_item_a = $(html);
				$(select_item_a).click(function (ev){
					if (($('code',resource).text()).indexOf("#")>-1)
						$("#button_"+self.id).html(code+" "+$(this).attr("label_"+languages[langcode]));
					else
						$("#button_"+self.id).html($(this).attr("label_"+languages[langcode]));
					var code = $(this).attr("code");
					if (code.indexOf("@")>-1) {
						code = code.substring(0,code.indexOf("@"))+code.substring(code.indexOf("@")+1);
					}
					if (code.indexOf("#")>-1) {
						code = code.substring(0,code.indexOf("#"))+code.substring(code.indexOf("#")+1);
					}
					$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
					UIFactory["Get_Resource"].update(this,self,langcode);
				});
				$(select_item).append($(select_item_a))
				//-------------- update button -----
				if (code!="" && self_code==$('code',resource).text()) {
					if (($('code',resource).text()).indexOf("#")>-1)
						$("#button_"+self.id).html(code+" "+$(srce+"[lang='"+languages[langcode]+"']",resource).text());
					else
						$("#button_"+self.id).html($(srce+"[lang='"+languages[langcode]+"']",resource).text());
					$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
				}
				$(select).append($(select_item));
			}
		}
		//---------------------
		if (target=='text') {
			for ( var i = 0; i < $(nodes).length; i++) {
				var resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
				html = "<li></li>";
				var select_item = $(html);
				html = "<a  value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='sel"+code+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				html += ">";
				
				html += $(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</a>";
				var select_item_a = $(html);
				$(select_item_a).click(function (ev){
					$("#button_"+self.id).html($(this).attr("label_"+languages[langcode]));
					$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
					UIFactory["Get_Resource"].update(this,self,langcode);
				});
				$(select_item).append($(select_item_a))
				$(select).append($(select_item));
			}
		}
		//---------------------
		$(btn_group).append($(select));
		
	}
	//------------------------------------------------------------
	if (type.indexOf('radio')>-1) {
		//----------------- null value to erase
		if (resettable) {
			var radio_obj = $("<div class='get-radio'></div>");
			var input = "";
			input += "<input type='radio' name='radio_"+self.id+"' value='' code='' ";
			if (disabled)
				input +="disabled='disabled' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"='&nbsp;'";
			}
			if (self_code=='')
				input += " checked ";
			input += ">&nbsp;&nbsp;";
			input += "</input>";
			var obj = $(input);
			$(obj).click(function (){
				UIFactory["Get_Resource"].update(this,self,langcode,type);
			});
			$(radio_obj).append(obj);
			$("#"+destid).append(radio_obj);
		}
		//-------------------
		var nodes = $("node",data);
		for ( var i = 0; i < $(nodes).length; i++) {
			var radio_obj = $("<div class='get-radio'></div>");
			var input = "";
			var resource = null;
			if ($("asmResource",nodes[i]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
			var code = $('code',resource).text();
			var display_code = true;
			if (code.indexOf("@")>-1) {
				display_code = false;
				code = code.substring(0,code.indexOf("@"))+code.substring(code.indexOf("@")+1);
			}
			if (code.indexOf("#")>-1) {
				code = code.substring(0,code.indexOf("#"))+code.substring(code.indexOf("#")+1);
			}
			input += "<input type='radio' name='radio_"+self.id+"' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' ";
			if (disabled)
				input +="disabled='disabled' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
			}
			if (code!="" && self_code==$('code',resource).text())
				input += " checked ";
			input += ">&nbsp;&nbsp;";
			if (display_code)
				input += code + " ";
			input += "<span  class='sel"+code+"'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span></input>";
			var obj = $(input);
			$(obj).click(function (){
				UIFactory["Get_Resource"].update(this,self,langcode,type);
			});
			$(radio_obj).append(obj);
			$("#"+destid).append(radio_obj);
		}
	}
	//------------------------------------------------------------
	if (type.indexOf('click')>-1) {
		var inputs = "<div class='click'></div>";
		var inputs_obj = $(inputs);
		//----------------- null value to erase
		if (resettable){
			var input = "";
			input += "<div name='click_"+self.id+"' value='' code='' class='click-item";
			if (self_code==code)
				input += " clicked";
			input += "' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"='&nbsp;' ";
			}
			input += "> ";
			input +="<span  class='"+code+"'>&nbsp;</span></div>";
			var input_obj = $(input);
			$(input_obj).click(function (){
				$('.clicked',inputs_obj).removeClass('clicked');
				$(this).addClass('clicked');
				UIFactory["Get_Resource"].update(this,self,langcode,type);
			});
			$(inputs_obj).append(input_obj);
		}
		//-----------------------
		var nodes = $("node",data);
		for ( var i = 0; i < $(nodes).length; ++i) {
			var input = "";
			var resource = null;
			if ($("asmResource",nodes[i]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
			var code = $('code',resource).text();
			var display_code = true;
			if (code.indexOf("@")>-1) {
				display_code = false;
				code =code.substring(0,code.indexOf("@"))+code.substring(code.indexOf("@")+1);
			}
			if (code.indexOf("#")>-1) {
				code = code.substring(0,code.indexOf("#"))+code.substring(code.indexOf("#")+1);
			}
			input += "<div name='click_"+self.id+"' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='click-item";
			if (self_code==$('code',resource).text())
				input += " clicked";
			input += "' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"=\""+$("label[lang='"+languages[j]+"']",resource).text()+"\" ";
			}
			input += "> ";
			if (display_code)
				input += code + " ";
			input +="<span  class='"+code+"'>"+$("label[lang='"+languages[langcode]+"']",resource).text()+"</span></div>";
			var input_obj = $(input);
			$(input_obj).click(function (){
				$('.clicked',inputs_obj).removeClass('clicked');
				$(this).addClass('clicked');
				UIFactory["Get_Resource"].update(this,self,langcode,type);
			});
			$(inputs_obj).append(input_obj);
		}
		$("#"+destid).append(inputs_obj);
		//------------------------------------------------------------
	}

};

//==================================
UIFactory["Get_Resource"].prototype.save = function()
//==================================
{
	if (this.clause=="xsi_type='Get_Resource'") {
		UICom.UpdateResource(this.id,writeSaved);
		if (!this.inline)
			this.refresh();
	}
	else {// Node - Get_Resource {
		UICom.UpdateNode(this.id);
		UICom.structure.ui[this.id].refresh()
	}	
};

//==================================
UIFactory["Get_Resource"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};
	for (dest in this.displayCode) {
		$("#"+dest).html(this.getCode());
	};
	for (dest in this.displayValue) {
		$("#"+dest).html(this.getValue());
	};
};
