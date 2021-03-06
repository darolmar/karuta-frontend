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
UIFactory["Get_Proxy"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Get_Proxy';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='Get_Proxy']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='Get_Proxy']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Get_Proxy']",node));
	//--------------------
	this.code_node = $("code",$("asmResource[xsi_type='Get_Proxy']",node));
	this.value_node = $("value",$("asmResource[xsi_type='Get_Proxy']",node));
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Proxy']",node));
		if (this.label_node[i].length==0) {
			if (i==0 && $("label",$("asmResource[xsi_type='Get_Proxy']",node)).length==1) { // for WAD6 imported portfolio
				this.label_node[i] = $("text",$("asmResource[xsi_type='Get_Proxy']",node));
			} else {
				var newelement = createXmlElement("label");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='Get_Proxy']",node)[0].appendChild(newelement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Proxy']",node));
			}
		}
	}
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

//==================================
UIFactory["Get_Proxy"].prototype.getAttributes = function(type,langcode)
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
		result['label'] = this.label_node[langcode].text();
	}
	return result;
}

/// Display
//==================================
UIFactory["Get_Proxy"].prototype.getView = function(dest,type,langcode)
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
	return this.label_node[langcode].text();
};

//==================================
UIFactory["Get_Proxy"].prototype.displayView = function(dest,type,langcode)
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
	$(dest).html(this.label_node[langcode].text());
};


/// Editor
//==================================
UIFactory["Get_Proxy"].update = function(select,itself,lang,type)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	if (lang==null)
		lang = LANG;
	if (type==undefined || type==null)
		type = 'select';
	var value = "";	
	if (type=='select') {
		var option = $(select).find("option:selected");
		value = $(option).attr('value');
	}
	if (type.indexOf('radio')>-1) {
		var name = 'radio_'+itself.id;
		var checked = $('input[name='+name+']').filter(':checked');
		value = $(checked).attr('value');
	}
	var queryattr_value = $("metadata-wad",itself.node).attr('query');
	var p1 = queryattr_value.indexOf('.');
	var code = queryattr_value.substring(0,p1);
	if (code=='self')
		code = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/nodes?portfoliocode=" + code + "&semtag="+value,
		success : function(data) {
			UIFactory["Get_Proxy"].update2(data,itself,lang,type);
		}
	});
};
//==================================
UIFactory["Get_Proxy"].update2 = function(data,itself,lang,type)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	var nodes = $("node",data);
	var resource = null;
	if ($("asmResource",nodes[0]).length==3)
		resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[0]); 
	else
		resource = $("asmResource[xsi_type='nodeRes']",nodes[0]);
	var code = $(nodes[0]).attr("id");
	$(itself.code_node).text(code);
	for (var j=0; j<languages.length;j++){
		var label = $("label[lang='"+languages[j]+"']",resource).text();
		$(itself.label_node[j]).text(label);
	}
	var value = $(nodes[0]).attr("id");
	$(itself.value_node).text(value);
	itself.save();
};
//==================================
UIFactory["Get_Proxy"].prototype.displayEditor = function(destid,type,lang)
//==================================
{
	var queryattr_value = $("metadata-wad",this.node).attr('query');
	if (queryattr_value!=undefined && queryattr_value!='') {
		//------------
		var srce_indx = queryattr_value.lastIndexOf('.');
		var srce = queryattr_value.substring(srce_indx+1);
		var semtag_indx = queryattr_value.substring(0,srce_indx).lastIndexOf('.');
		var semtag = queryattr_value.substring(semtag_indx+1,srce_indx);
		var portfoliocode = queryattr_value.substring(0,semtag_indx);
		var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
		if (portfoliocode.indexOf('.')<0 && portfoliocode!='self')  // There is no project, we add the project of the current portfolio
			portfoliocode = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode;
		if (portfoliocode=='self')
			portfoliocode = selfcode;
		//------------
		var self = this;
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : "../../../"+serverBCK+"/nodes?portfoliocode=" + portfoliocode + "&semtag="+semtag,
			success : function(data) {
				UIFactory["Get_Proxy"].parse(destid,type,lang,data,self);
			}
		});
	}
};

//==================================
UIFactory["Get_Proxy"].parse = function(destid,type,langcode,data,self) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!self.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
	if (type=='select') {
		var select = "<select>";
		select += "<option code='' value='' ";
		for (var j=0; j<languages.length;j++){
			select += "label_"+languages[j]+"='' ";
		}
		select += "</option></select>";
		var obj = $(select);
		var nodes = $("node",data);
		for ( var i = 0; i < $(nodes).length; i++) {
			var option = null;
			var resource = null;
			if ($("asmResource",nodes[i]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
			var code = $('code',resource).text();
			if (code.indexOf('-#')>-1) {
				option = "<optgroup label=\"" + $("label[lang='"+languages[langcode]+"']",resource).text() + "\" >";
			} else {
				option = "<option code='"+$(nodes[i]).attr('id')+"' value='"+code+"' ";
				for (var j=0; j<languages.length;j++){
					option += "label_"+languages[j]+"=\""+$("label[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				if ($(self.value_node).text()==code)
					option += " selected ";
				option += ">"+$("label[lang='"+languages[langcode]+"']",resource).text()+"</option>";
			}
			$(obj).append($(option));
		}
		$(obj).change(function (){
			UIFactory["Get_Proxy"].update(obj,self,langcode);
		});
		$("#"+destid).append(obj);
	}
};

//==================================
UIFactory["Get_Proxy"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,proxy_reload);
	this.refresh();
};

//==================================
function proxy_reload()
//==================================
{
	UIFactory['Node'].reloadUnit();
}
//==================================
UIFactory["Get_Proxy"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
