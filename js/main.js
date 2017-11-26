function makeRenameDialogue(src, filenames) {
    // width = $( window ).width();
    // height = $( window ).height();
    obj = $("#" + src).dialog({
        title: "Rename Files",
        width: 'auto',
        height: 'auto',
        modal: true,
        resizable: true,
        autoOpen: false,
        buttons: {
            "OK": function() {
                // if you click OK it will find the file by its original id and update its name and id
                for (i = 0; i < filenames.length; i++) {
                    $('#'+filenames[i]).html($('#rename_'+i).val());
                    $('#'+filenames[i]).attr('id', $('#rename_'+i).val());

                }
                $(this).empty();
                $(this).dialog('destroy');
            },
            "Close": function() {
                $(this).empty();
                $(this).dialog('destroy');
            }
        }
    });
    // build the HTML of the dialogue
    html = 'Windows has detected repetetive actions. Would you like the following ' + filenames.length + ' file(s) to be renamed automatically?';
    html += ("<table colspan=3 width='100%'>");
    html += "<thead><tr><th width='45%'>Original</th><th width='10%'></th><th width='45%'>New Filename</th></tr></thead>";
    html += "<tbody>";
    count = 0;
    for (i = 0; i < filenames.length; i++) {
        html +=("<tr class='ui-tr" + (count % 2 == 0 ? " odd'>" : "'>"));
            html +=("<td class='ui-td'>" + filenames[i] + "</td>");
            html +=("<td class='ui-td'>...</td>");
            html +=("<td class='ui-td'>");
                // this input element's value is going to be hard coded to some degree
                // in order to accommodate the user input, we'll have to have a keystroke listener when for these inputs
                // maybe i'll come up with some scenarios we can limit users to
                    // e.g. filename must be split by "." or "-" or "_" and the section of the name the user changes
                    // will trigger the listener to update the other inputs automatically
                html +=("<input id='rename_" + i + "' class='ui-input' type='text' value='" + "renamed_" + i + "'>");
            html +=("</td>");
        html +=("</tr>");
        count++;
    }
    html +=("</tbody></table>");
    obj.html(html);
    obj.dialog('open');
}
