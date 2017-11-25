function makeDialogue(src, filenames) {
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
                $(this).empty();
                $(this).dialog('destroy');
            },
            "Close": function() {
                $(this).empty();
                $(this).dialog('destroy');
            }
        }
    });

    html = ("<table colspan=3><tbody>");
    for (i = 0; i < filenames.length; i++) {
        html +=("<tr>");
            html +=("<td class='dialogueTD'>" + filenames[i] + "</td>");
            html +=("<td class='dialogueTD'>renamed to</td>");
            html +=("<td class='dialogueTD'>");
                html +=("<input type='text' value='" + "renamed_" + i + "'>");
            html +=("</td>");
        html +=("</tr>");
    }
    html +=("</tbody></table>");
    obj.html(html);
    obj.dialog('open');
}
