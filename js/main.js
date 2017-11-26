function makeRenameDialogue(srcDiv, filenames) {
    // width = $( window ).width();
    // height = $( window ).height();
    obj = $("#" + srcDiv).dialog({
        title: "Rename Files",
        width: 'auto',
        height: 'auto',
        modal: false,
        resizable: true,
        autoOpen: false,
        buttons: {
            "OK": function () {
                // if you click OK it will find the file by its original id and update its name and id
                for (i = 0; i < filenames.length; i++) {
                    // if the files folder is open they are not in the expected place
                    console.log(filenames[i])
                    $('#' + filenames[i]).html($('#rename_' + i).val());
                    $('#' + filenames[i] + '_dialogue').attr('id', $('#rename_' + i).val() + '_dialogue');
                    $('#' + filenames[i]).attr('id', $('#rename_' + i).val());

                }
                $(this).empty();
                $(this).dialog('destroy');
            },
            "Close": function () {
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

function makeFolderDialogue(folder, objDiv, contentsDiv) {
    contents = $('#'+contentsDiv).children()

    obj = $("#" + objDiv).dialog({
        title: folder,
        width: 'auto',
        height: 'auto',
        modal: false,
        resizable: true,
        autoOpen: false,
        close: (function() {
            $('#'+contentsDiv).html(contents);
            $(this).empty();
            $(this).dialog('destroy');
        })
    });
    // they aren't draggable when cloned
    $(contents).children().each(function() {
        $(this).draggable({
            drag: function( event, ui ) {
                var snapTolerance = $(this).draggable('option', 'snapTolerance');
                var topRemainder = ui.position.top % 20;
                var leftRemainder = ui.position.left % 20;

                if (topRemainder <= snapTolerance) {
                    ui.position.top = ui.position.top - topRemainder;
                }

                if (leftRemainder <= snapTolerance) {
                    ui.position.left = ui.position.left - leftRemainder;
                }
            },
            containment: 'document'
        });

    })
    obj.html(contents)
    obj.dialog('open')
}

function makeViewerDialogue(filename, dialogueDiv) {
    wwidth = $(window).width()-10;
    wheight = $(window).height();
    iframe = $("<iframe class='ui-iframe' src='../ViewerJS/#../docs/" + filename + "'" + " allowfullscreen webkitallowfullscreen></iframe>")


    obj = $('#'+dialogueDiv).dialog({
        title: filename,
        width: wwidth*.50,
        height: wheight*.90,
        modal: false,
        resizable: true,
        autoOpen: false,
        close: (function() {
            $(this).empty();
            $(this).dialog('destroy');
        }),
        resize: (function() {
            $(iframe).css({width: '125%'});
            $(iframe).css({width: '125%'});
        }),
        open: function (event, ui) {
            $(this).css('overflow', 'hidden'); //this line does the actual hiding
        }
    });
    iframe.appendTo(obj)
    obj.dialog('open')
}

function makeImageDialogue(filename, dialogueDiv) {
    wwidth = $(window).width()-10;
    wheight = $(window).height();
    iframe = $("<iframe class='ui-iframe' " + "src='../img/" + filename + "' " + " allowfullscreen webkitallowfullscreen></iframe>")

    obj = $('#'+dialogueDiv).dialog({
        title: filename,
        width: 512,
        height: 256,
        modal: false,
        resizable: true,
        autoOpen: false,
        close: (function() {
            $(this).empty();
            $(this).dialog('destroy');
        }),
        resize: (function() {
            $(iframe).css({width: '125%'});
            $(iframe).css({width: '125%'});
        }),
        open: function (event, ui) {
            $(this).css('overflow', 'hidden'); //this line does the actual hiding
        }
    });
    iframe.appendTo(obj)
    obj.dialog('open')
}
