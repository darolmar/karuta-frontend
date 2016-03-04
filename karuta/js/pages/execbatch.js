
//==============================
function show_exec_batch()
//==============================
{
	changeCss("body", "background-color:whitesmoke;");
	changeCss("a.navbar-icon .glyphicon", "color:"+navbar_icon_color+";");
	var navbar_html = getNavBar('list',null);
	$("#navigation-bar").html(navbar_html);
	$("#refresh").attr("onclick","fill_exec_batch()");
	$("#refresh").show();
	$("#main-list").hide();
	$("#main-page").hide();
	$("#main-user").hide();
	$("#main-exec-batch").show();
	$("#main-exec-report").hide();
}

//==============================
function fill_exec_batch()
//==============================
{
	var html = "";
	html += "<h2 id='batch' class='line'>KARUTA - <span id='batch-title-page'></span></h2>";
	html += "<h4 class='line'><span class='badge'>1</span> <span id='batch-title-1'></span></h4>";
	html += "<div id='batch-csv_file_upload' style='margin-left:20px'></div>";
	html += "<div style='margin-left:20px'> <span id='batch-title-3'></span>&nbsp;<input  id='batch-model_code' type='text'></input>&nbsp;<button onclick='javascript:processCode()'>ok</button></div>";
	html += "<div id='batch-model_description' style='margin-left:20px'></div>";
	html += "<div id='batch-csv_file_upload2' style='margin-left:20px'></div>";
	html += "<h4 class='line'><span class='badge'>2</span> <span id='batch-title-2'></span></h4>";
	html += "<div id='batch-process_button' style='margin-left:20px'></div>";
	html += "<div id='batch-log' style='margin-left:20px;margin-top:20px'></div>";
	$("#main-exec-batch").html(html);

	var model_code = "";
	var url = "../../../"+serverFIL+"/csv";
	var html ="";
	html +=" <div id='batch-divfileupload'>";
	html +=" <input id='batch-fileupload' type='file' name='uploadfile' data-url='"+url+"'>";
	html += "</div>";
	html +=" <div id='batch-progress'><div class='bar' style='width: 0%;'></div></div>";
	$("#batch-csv_file_upload").append($(html));
	//------------------------------
	$("#batch-fileupload").fileupload({
		progressall: function (e, data) {
			$("#batch-progress").css('border','1px solid lightgrey');
			$("#batch-divfileupload").html("<img src='../../karuta/img/ajax-loader.gif'>");
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#batch-progress .bar').css('width',progress + '%');
		},
		done: function (e, data,uuid) {
			$("#batch-divfileupload").html("Loaded");
			g_json = data.result;
			model_code =g_json.model_code;
			getModelAndProcess(model_code);
		}
    });
	//------------------------------
	$("#batch-title-head").html("KARUTA - "+karutaStr[LANG]['batch']);
	$("#batch-title-page").html(karutaStr[LANG]['batch']);
	$("#batch-title-1").html(karutaStr[LANG]['upload_csv_or_code']);
	$("#batch-title-2").html(karutaStr[LANG]['process_csv']);
	$("#batch-title-3").html(karutaStr[LANG]['model_code']);
	//------------------------------
	demo = false; //to avoid reload
}

//==============================
function display_exec_batch()
//==============================
{
	if ($("#batch").length) {
		show_exec_batch();
	} else {
		fill_exec_batch();
		show_exec_batch();
	}
}