//========================================================
//========================================================
//===================== Europass Languages ===============
//========================================================
//========================================================

var g_mother_tongueid = "";

var langues_byid = {};
var langues_list = [];

//==================================
UIFactory["EuropassL"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
};

//==================================
UIFactory["EuropassL"].parse = function(data) 
//==================================
{
	g_mother_tongueid = $("asmContext:has(metadata[semantictag='MotherTongue'])", data).attr('id');
	langues_byid = {};
	langues_list = [];
	var items = $("asmUnitStructure:has(metadata[semantictag='europass-language'])",data);
	for ( var i = 0; i < items.length; i++) {
		langues_byid[$(items[i]).attr('id')] = new UIFactory["Langue"](items[i]);
		langues_list[i] = langues_byid[$(items[i]).attr('id')];
	}
};

//==================================
UIFactory["EuropassL"].displayView = function(destid,langcode,type,parentid)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	$("#"+destid).html("");
	var html ="";
	if (type=='detail') {
		var edit =  ($(UICom.structure["ui"][g_mother_tongueid].node).attr('write')=='Y')? true:false;
		//  if databack is true callback(data,param2,param3,param4) else callback(param2,param3,param4)
		var databack = false;
		var callback = "UIFactory['Langue'].reloadparse";
		var param2 = "'"+destid+"'";
		var param3 = "'"+parentid+"'";
		var param4 = edit;
		//----------------------------
		html += "<div class='row'>";
		html += "<div class='col-md-offset-1 col-md-11'>";
		html += "<h5>"+karutaStr[LANG]['mother-tongue']+" : ";
		html += "<span class='langue' id='mother_tongue'>"+UICom.structure["ui"][g_mother_tongueid].resource.getView(null,"span");
		if (edit) {
			html +="<div class='btn-group' style='margin-left:3px;'>";
			html += "<span  onclick=\"UIFactory.Langue.editMothertongue('"+g_mother_tongueid+"','mother_tongue');\" class='button glyphicon glyphicon-pencil' aria-hidden='true'></span>";
			html +="</div>";
		}
		html +="</span>";
		html +="</h5>";
		html += "</div><!--col-->";
		html += "</div><!--row-->";
		//----------------------------
		html += "<div class='row'>";
		html += "<div class='col-md-offset-1 col-md-7'>";
		html += "<h5>"+karutaStr[LANG]['foreign-languages']+"</h5>";
		html += "</div><!--col-->";
		if (edit) {
			html += "<div class='col-md-4'>";
			html +="<div class='btn-group'>";
			html += "<span class='button' onclick=\"javascript:importBranch('"+parentid+"','europass.parts','europass-language',"+databack+","+callback+","+param2+","+param3+","+param4+")\">";
			html += karutaStr[LANG]['add-foreign-language'];
			html += "</span>";
			html += "</div><!--btn-group-->";
			html += "</div><!--col-->";
		}
		html += "</div><!--row-->";
		html += "<div class='row row-resource'>";
		html += "<div class='col-md-offset-1 col-md-10'>";
		html += "<table id='"+destid+"europass_table' class='europass_table'>";
		html += "<tr class='en-tete'><td class='language_edit'></td><td class='bordure' colspan='2'>"+karutaStr[LANG]['understanding']+"</td><td class='bordure' colspan='2'>"+karutaStr[LANG]['speaking']+"</td><td class='bordure'>"+karutaStr[LANG]['writing']+"</td></tr>";
		html += "<tr class='en-tete'><td></td><td class='bordure'>"+karutaStr[LANG]['listening']+"</td><td class='bordure'>"+karutaStr[LANG]['reading']+"</td><td class='bordure'>"+karutaStr[LANG]['spoken-interaction']+"</td><td class='bordure'>"+karutaStr[LANG]['spoken-production']+"</td><td class='bordure'> </td></tr>";
		html += "</table>";
		$("#"+destid).html(html);
		for ( var i = 0; i < langues_list.length; i++) {
				$("#"+destid+"europass_table").append($("<tr id='"+destid+"_"+langues_list[i].id+"'></tr>"));			
				langues_list[i].displayView(destid+"_"+langues_list[i].id,type,langcode,edit);
		}
		html += "</div><!--col-->";
		html += "</div><!--row-->";
		//----------------------------
	}
}


//==================================
UIFactory["Langue"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.semantictag = $("metadata",node).attr('semantictag');
	this.language_nodeid = $("asmContext:has(metadata[semantictag='ForeignLanguage'])",node).attr('id');
	this.listening_nodeid = $("asmContext:has(metadata[semantictag='Listening'])",node).attr('id');
	this.reading_nodeid = $("asmContext:has(metadata[semantictag='Reading'])",node).attr('id');
	this.spokenInteraction_nodeid = $("asmContext:has(metadata[semantictag='SpokenInteraction'])",node).attr('id');
	this.spokenProduction_nodeid = $("asmContext:has(metadata[semantictag='SpokenProduction'])",node).attr('id');
	this.writing_nodeid = $("asmContext:has(metadata[semantictag='Writing'])",node).attr('id');
};

//==================================
UIFactory["Langue"].prototype.displayView = function(destid,type,langcode,edit)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var html = "";
	$("#"+destid).html(html);  // on vide html
	if (type==null || type=='short') {
		html += "<i class='fa fa-angle-right fa-lg'></i>&nbsp;";
		html += "<a  onclick=\"javascript:$('#tabs_histo li:eq(5) a').tab('show')\">";
		html += "<span id='"+destid+"_short_label'>"+UICom.structure["ui"][this.language_nodeid].resource.getView(destid+"_short_label","span")+"</span>";
		html += "</a>";
	}
	if (type=='comp-short') {
		html += "<i class='fa fa-angle-right fa-lg'></i>&nbsp;";
		html += "<a  onclick=\"javascript:$('#tabs_comp li:eq(4) a').tab('show')\">";
		html += "<span id='"+destid+"_short_label'>"+UICom.structure["ui"][this.language_nodeid].resource.getView(destid+"_short_label","span")+"</span>";
		html += "</a>";
	}
	if (type=='detail' || type=='cv' || type=='comp') {
		//---------------------------------------------------------
		html +="<td class='langue' id='"+type+"_language_"+this.id+"'>"+UICom.structure["ui"][this.language_nodeid].resource.getView(type+"_language_"+this.id,"span")+"</td>";
		html +="<td class='bordure' id='"+type+"_listening_"+this.id+"'>"+UICom.structure["ui"][this.listening_nodeid].resource.getCode(type+"_listening_"+this.id)+"</td>";
		html +="<td class='bordure' id='"+type+"_reading_"+this.id+"'>"+UICom.structure["ui"][this.reading_nodeid].resource.getCode(type+"_reading_"+this.id)+"</td>";
		html +="<td class='bordure' id='"+type+"_spokenInteraction_"+this.id+"'>"+UICom.structure["ui"][this.spokenInteraction_nodeid].resource.getCode(type+"_spokenInteraction_"+this.id)+"</td>";
		html +="<td class='bordure' id='"+type+"_spokenProduction_"+this.id+"'>"+UICom.structure["ui"][this.spokenProduction_nodeid].resource.getCode(type+"_spokenProduction_"+this.id)+"</td>";
		html +="<td class='bordure' id='"+type+"_writing_"+this.id+"'>"+UICom.structure["ui"][this.writing_nodeid].resource.getCode(type+"_writing_"+this.id)+"</td>";
		if (edit && type=='detail') {
			html +="<td class='buttons' style='text-align:left'>";
			html +="	<div class='btn-group' style='margin-left:3px;'>";
			html += "		<span onclick=\"langues_byid['"+this.id+"'].displayEditor('"+destid+"');\" class='button glyphicon glyphicon-pencil' aria-hidden='true'></span>";
			html += "		<span onclick=\"confirmDel('"+this.id+"','Langue','"+destid+"','"+type+"',"+edit+")\" class='button glyphicon glyphicon-remove' aria-hidden='true'></span>";
			html +="	</div>";
			html +="</td>";
		}
		//---------------------------------------------------------destid,parentid,type,edit
	}
	var obj = $(html);
	$("#"+destid).append(obj);
};
//==================================
UIFactory["Langue"].prototype.displayEditor = function(destid,type,lang)
//==================================
{
	var html = "";
	$("#"+destid).html(html);  // on vide html
		//---------------------------------------------------------
		html +="<td id='language_edit_"+this.id+"' class='language_edit' width='150px'></td>";
		html +="<td class='bordure'><span id='listening_"+this.id+"_edit'>"+UICom.structure["ui"][this.listening_nodeid].resource.getCode("listening_"+this.id+"_edit")+"</span>";
		html += " <a  class='btn btn-xs' onclick=\"javascript:UIFactory.Langue.editSkill('listening_edit','"+this.listening_nodeid+"','"+karutaStr[LANG]['listening']+"')\" data-title='�diter' rel='tooltip'>";
		html += karutaStr[LANG]['choose'];
		html += "</a>";
		html +="</td>";
		html +="<td class='bordure'><span id='reading_"+this.id+"_edit'>"+UICom.structure["ui"][this.reading_nodeid].resource.getCode("reading_"+this.id+"_edit")+"</span>";
		html += " <a  class='btn btn-xs' onclick=\"javascript:UIFactory.Langue.editSkill('reading_edit','"+this.reading_nodeid+"','"+karutaStr[LANG]['reading']+"')\" data-title='�diter' rel='tooltip'>";
		html += karutaStr[LANG]['choose'];
		html += "</a>";
		html +="</td>";
		html +="<td class='bordure'><span id='spokenInteraction_"+this.id+"_edit'>"+UICom.structure["ui"][this.spokenInteraction_nodeid].resource.getCode("spokenInteraction_"+this.id+"_edit")+"</span>";
		html += " <a  class='btn btn-xs' onclick=\"javascript:UIFactory.Langue.editSkill('spokenInteraction_edit','"+this.spokenInteraction_nodeid+"','"+karutaStr[LANG]['spoken-interaction']+"')\" data-title='�diter' rel='tooltip'>";
		html += karutaStr[LANG]['choose'];
		html += "</a>";
		html +="</td>";
		html +="<td class='bordure'><span id='spokenProduction_"+this.id+"_edit'>"+UICom.structure["ui"][this.spokenProduction_nodeid].resource.getCode("spokenProduction_"+this.id+"_edit")+"</span>";
		html += " <a  class='btn btn-xs' onclick=\"javascript:UIFactory.Langue.editSkill('spokenProduction_edit','"+this.spokenProduction_nodeid+"','"+karutaStr[LANG]['spoken-production']+"')\" data-title='�diter' rel='tooltip'>";
		html += karutaStr[LANG]['choose'];
		html += "</a>";
		html +="</td>";
		html +="<td class='bordure'><span id='writing_"+this.id+"_edit'>"+UICom.structure["ui"][this.writing_nodeid].resource.getCode("writing_"+this.id+"_edit")+"</span>";
		html += " <a  class='btn btn-xs' onclick=\"javascript:UIFactory.Langue.editSkill('writing_edit','"+this.writing_nodeid+"','"+karutaStr[LANG]['writing']+"')\" data-title='�diter' rel='tooltip'>";
		html += karutaStr[LANG]['choose'];
		html += "</a>";
		html +="</td>";
		html +="<td style='text-align:left'>";
		html += "&nbsp;<a  class='btn btn-xs editbutton' onclick=\"javascript:langues_byid['"+this.id+"'].displayView('"+destid+"','detail',lang,true);$('#collapse"+this.id+"').collapse('show');toggleZoom('"+this.id+"')\" data-title='éditer' rel='tooltip'>";
		html += karutaStr[LANG]['quit'];
		html += "</a>";
		html +="</td>";
		//---------------------------------------------------------
	var obj = $(html);
	$("#"+destid).append(obj);
	UICom.structure["ui"][this.language_nodeid].resource.displayEditor("language_edit_"+this.id);
};


//==================================
UIFactory["Langue"].editSkill = function(destid,uuid,title)
//==================================
{
	$("#langue-window-header").html("<h4>"+title+"</h4>");
	$("#langue-window-body").html("<div id='"+destid+"'></div>");
	UICom.structure["ui"][uuid].resource.displayEditor(destid,"radio");
	$("#langue-window").modal("show");
	var js1 = "javascript:$('#langue-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#langue-window-footer").html($(footer));
};

//==================================
UIFactory["Langue"].reloadparse = function(destid,parentid,writenode) 
//==================================
{
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/nodes/node/" + parentid + "?resources=true",
		success : function(data) {
			UICom.parseStructure(data);
			UIFactory["EuropassL"].parse($(":root",data));
			UIFactory["EuropassL"].displayView(destid,null,'detail',parentid,writenode);
		}
	});
};

//==================================
UIFactory["Langue"].refresh = function(parentid,destid) 
//==================================
{
	if (parentid!=null)
		langues_byid[parentid].displayEditor(destid);
	Langues_Display('langues-short_histo','short');
	Langues_Display('langues-detail_histo','detail',parentid,g_mother_tongueid);
	Langues_Display('langues-short_comp','short');
	Langues_Display('langues-detail_comp','comp');
	Langues_Display('langues-detail_cv','cv');
};


//==================================
UIFactory["Langue"].remove = function(uuid,destid,parentid,type,edit)
//==================================
{
	UICom.DeleteNode(uuid);
	$("#"+uuid,g_portfolio_current).remove();
	UIFactory["EuropassL"].parse(g_portfolio_current);
	var parentid = $("asmUnit:has(metadata[semantictag='EuropassL'])", g_portfolio_current).attr('id');
	UIFactory["EuropassL"].displayView(destid,null,type,parentid,edit);
	$("#wait-window").modal('hide');
};

//==================================
UIFactory["Langue"].displayMothertongue = function(uuid,destid,edit)
//==================================
{
	
	$("#"+destid).html("");
	var html = UICom.structure["ui"][uuid].resource.getView("mother_tongue","span");
	if (edit) {
		html +="<div class='btn-group' style='margin-left:3px;'>";
		html += "<span  onclick=\"UIFactory.Langue.editMothertongue('"+g_mother_tongueid+"','mother_tongue');\" class='button glyphicon glyphicon-pencil' aria-hidden='true'></span>";
		html +="</div>";
	}
	$("#"+destid).html(html);
};

//==================================
UIFactory["Langue"].editMothertongue = function(uuid,destid)
//==================================
{
	$("#"+destid).html("");
	UICom.structure["ui"][uuid].resource.displayEditor("mother_tongue");
	var html = "<a  class='btn btn-xs' style='margin-left:5px' onclick=\"UIFactory.Langue.displayMothertongue('"+uuid+"','"+destid+"',true);\">";
	html += karutaStr[LANG]['quit'];
	html += "</a>";
	$("#"+destid).append($(html));
};

//==============================
function LangueBox()
//==============================
{
	var html = "";
	html += "\n<!-- ==================== Edit box ==================== -->";
	html += "\n<div id='langue-window' class='modal fade'>";
	html += "\n		<div class='modal-dialog'>";
	html += "\n		<div class='modal-content'>";
	html += "\n		<div id='langue-window-header' class='modal-header'>";
	html += "\n		</div>";
	html += "\n		<div id='langue-window-body' class='modal-body'></div>";
	html += "\n		<div class='modal-footer' id='langue-window-footer'></div>";
	html += "\n		</div>";
	html += "\n		</div>";
	html += "\n	</div>";
	html += "\n<!-- ============================================== -->";
	return html;
}


