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
        close: (function() {
            deleteTaskbarItem(srcDiv);
        }),
        buttons: {
            "OK": function() {
                deleteTaskbarItem(srcDiv);
                // if you click OK it will find the file by its original id and update its name and id
                for (i = 0; i < filenames.length; i++) {
                    // if the files folder is open they are not in the expected place
                    $('#' + filenames[i]).html($('#rename_' + i).val());
                    $('#' + filenames[i] + '_dialogue').attr('id', $('#rename_' + i).val() + '_dialogue');
                    $('#' + filenames[i]).attr('id', $('#rename_' + i).val());

                }
                $(this).empty();
                $(this).dialog('destroy');
            },
            "Close": function() {
                deleteTaskbarItem(srcDiv);
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
    addTaskbarItem("Rename Files", srcDiv);
}

/**
 * Replaces the <p> text of a file <div>
 * @param id id of a file to rename.
 */
function renameSingleFileDialogue(id) {
    obj = $("#"+id+"_div").dialog({
        title: "Rename File",
        width: '30%',
        height: 'auto',
        modal: false,
        resizable: true,
        autoOpen: false,
        close: (function() {
            deleteTaskbarItem(id+'_div'); // vlc divs have a corresponding dialogue div called id_div
        }),
        buttons: {
            "OK": function() {
                deleteTaskbarItem(id+"_div");
                $('#'+id+'_text').html($('#rename').val());
                $(this).empty();
                $(this).dialog('destroy');
            },
            "Close": function() {
                deleteTaskbarItem(id+"_div");
                $(this).empty();
                $(this).dialog('destroy');
            }
        }
    });
    // build the HTML of the dialogue
    html = "<table colspan=2 width='100%'>";
    html += "<thead><tr><th width='45%'>Original</th><th width='45%'>New Filename</th></tr></thead>";
    html += "<tbody>";
    html += "<td class='ui-td'>" + $('#'+id+'_text').text() + "</td>";
    html += "<td class='ui-td'>";
    html +="<input id='rename' class='ui-input' type='text' value='" + $('#'+id+'_text').text()+ "'>";
    html += "</td>";
    html +="</tr>";
    html +="</tbody></table>";
    obj.html(html);
    obj.dialog('open')
    $('#rename').select()
    addTaskbarItem("Rename File", id+"_div");
};

/**
 *
 * @param folder name of the folder you are opening (e.g. "Pictures"
 * @param objDiv div id the dialogue will be injected into
 * @param contentsDiv parent div holding the files to show
 */
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
            deleteTaskbarItem(objDiv);
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
    addTaskbarItem(folder, objDiv);
}

/**
 *
 * @param filename name of file to view
 * @param dialogueDiv div to inject dialogue into
 */
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
            deleteTaskbarItem(dialogueDiv);
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
    addTaskbarItem(filename, dialogueDiv);
}

function makeNotepadDialogue() {

}

// TASKBAR SHOW/HIDE

/**
 * Makes a task on the taskbar
 * @param name the title of the task
 * @param divName the div the dialogue is inserted in (unique to each dialogue)
 */
function addTaskbarItem(name, divName) {
    id = divName + "_task"
    var newItem = "<span id='" + id + "' class='taskbar-item'>"+ name +"</span>";
    $('#taskbar').append(newItem);
}

/**
 * Deletes a task on the taskbar
 * @param divName the name of the div the dialogue is linked to
 */
function deleteTaskbarItem(divName) {
    $('#'+divName+'_task').remove();
}

/**
 *
 * @param filename name of file to open
 * @param dialogueDiv div id the dialogue will be injected into
 */
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
            deleteTaskbarItem(dialogueDiv)
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
// function toggleTaskbarItem() {
//     $('#startMenu').toggle()
// }

// CUSTOM RIGHT CLICK MENU


// If the document is clicked somewhere
$(document).bind("mousedown", function (e) {

    // If the clicked element is not the menu
    if (!$(e.target).parents(".rightclick-menu").length > 0) {

        // Hide it
        $(".rightclick-menu").hide(100);
    }
});

