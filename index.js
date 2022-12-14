async function make_groups(){
    $("body").css("cursor", "progress");
    let names = extract_names();
    if (!check_valid(names)){
        $("body").css("cursor", "default");
        return;
    };
    let numbers = await extract_random(1, names.length);
    let groupd = group_names(names, numbers, 6);
    console.log(groupd);
    display_output(groupd);
    $("body").css("cursor", "default");
    return;
}

async function extract_random(min, max){
    //Extract a true random sequence of integer by sending a http request to random.org
    let url = `https://www.random.org/sequences/?min=${min}&max=${max}&col=1&format=plain&rnd=new`;
    let xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("GET", url, false);

    xmlHttpReq.send(null);
    let body = xmlHttpReq.responseText;

    return body.split("\n").map(Number);
}

function extract_names(){
    let raw_text = names.value.trim();
    if(!raw_text){
        return null;
    }
    let text_vec = raw_text.split("\n");
    return text_vec;
}

function group_names(names, numbers){
    let group_num = parseInt($("#group").val());
    let assignd_group = numbers.map(x => x % group_num);

    let output = [...Array(group_num)].map(_x => Array());

    for (let i=0; i < names.length; i++){
        output[assignd_group[i]].push(names[i]);
    }
    
    return output;
}

function display_output(groupd){
    var $space = $("#output");
    $space.empty();

    var group_num = $("#group").val();
	
    var output = "<table style = 'width: 100%'>";
    var current_row = "";
    for(let i=0; i<group_num; i++){
        let name_list = groupd[i];

        current_row = current_row.concat(`<td><div class='name_list'><p style='margin-top:0px; margin-bottom:0px; font-weight: bold'><i class="fa fa-users"></i>&nbsp; Group ${i + 1}:</p><p style="width:100%; margin-left:10px; margin-right:10px; margin-top:0px; margin-bottom:10px">`)
        for(let j=0; j<name_list.length; j++){
            current_row = current_row.concat(`<nobr>${name_list[j]}</nobr> &emsp;`)
        }
        current_row = current_row.concat('</p></div></td>');

        if((i+1) % 3 === 0){
            output = output.concat(`<tr>${current_row}</tr>`);
            current_row = "";
        }
    }
    output = output.concat(`<tr>${current_row}</tr>`);
    $space.append(output);

    $("#save_btn").css("display", "block");

    return;
}

function check_valid(text_vec){
    if(text_vec == null){
        alertModal("<span style='font-weight:bold;font-size:14pt'>Warning: </span> Why bother making groups when there no student in the class?");
        return false;
    }
    let group_num = $("#group").val();
    let name_len = text_vec.length;
    
    var warningInfoHTML="";
    
    if(name_len == 1){
        warningInfoHTML="<span style='font-weight:bold;font-size:14pt'>Warning: </span> Why bother making groups when there's only 1 student in the class?";
    }else if(!group_num.match("^[0-9]+$")){
        warningInfoHTML="<span style='font-weight:bold;font-size:14pt'>Warning: </span> Number of groups must be an positive integer";
    }else if(group_num > name_len){
        warningInfoHTML="<span style='font-weight:bold;font-size:14pt'>Warning: </span> Number of Students cannot be lower than the number of groups";
    }else{
        return true;
    }
    alertModal(warningInfoHTML);
    return false;
}

function reset_output(){
    $("#output").empty();
    $("#save_btn").css("display", "none")
}

function alertModal(alertTxt){
    document.getElementById("modalAlert-P").innerHTML=alertTxt;	
    $("#modalAlert").modal({closeExisting: false});
}

function collapse(id_num){
    var content = $(`#collapsable_content_${id_num}`);
    if(content.css("display") == "none"){
        content.css("display", "block");
    }else{
        content.css("display", "none");
    }
}

function savepdf() {
    // date and time
    let date = new Date();

    // build html element
    let $2pdf = $("#output_space").clone();
    $2pdf.find("#save_btn").remove();
    
    // print pdf
    $2pdf.printThis({
        pageTitle: `StudentGroup_${date.toISOString().substring(10,0)}`, 
        loadCSS: "https://sunsky426.github.io/random_group/css/download.css", 
        importCSS: false,
        header: `<center><h2><b>Student Grouping from ${date.toDateString()}</b></h2></center>`})
}
