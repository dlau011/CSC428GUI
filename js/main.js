var renameCount = 0;
var titles = ['The.Good.Place.S01E01.Everything Is Fine.avi',
    'The.Good.Place.S01E02.Flying.avi',
    'The.Good.Place.S01E03.Tahani Al-Jamil.avi',
    'The.Good.Place.S01E04.Jason Mendoza.avi',
    "The.Walking.Dead.S08E01.Mercy.avi",
    "The.Walking.Dead.S08E02.The Damned.avi"
]

var twd_titles = []

var num_triggers = 0;
function makeRenameDialogue(srcDiv, fileIDs) {
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
                for (i = 0; i < fileIDs.length; i++) {
                    num_triggers++ // 0 for renaming TGP 1 for renaming TWD
                    // if the file's hidden input has not been set to 1, then include it in the dialogue
                    file = $('#'+ fileIDs[i])
                    $('#' + fileIDs[i] + "_text").html($('#rename_' + i).val());
                    $('#' + fileIDs[i] + '_dialogue').attr('id', $('#rename_' + i).val() + '_dialogue');
                    // $('#' + fileIDs[i]).attr('id', $('#rename_' + i).val())


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
    html = 'Windows has detected repetetive actions. Would you like the following file(s) to be renamed automatically?';
    html += ("<table colspan=3 width='100%'>");
    html += "<thead><tr><th width='45%'>Original</th><th width='5%'></th><th width='45%'>New Filename</th><th width='5%'></th></tr></thead>";
    html += "<tbody>";
    count = 0;
    for (i = 0; i < fileIDs.length; i++) {
        // hasn't been renamed yet
        if ($('#'+ fileIDs[i] + '_input').val() == 0) {
            if ( ($('#' + fileIDs[i] + '_input').hasClass('tgp') && num_triggers == 0) ||
                ($('#' + fileIDs[i] + '_input').hasClass('twd') && num_triggers > 0)) {
                html += ("<tr id='row_" + i + "' class='ui-tr" + (count % 2 == 0 ? " odd'>" : "'>"));
                html += ("<td class='ui-td'>" + $('#' + fileIDs[i] + '_text').text() + "</td>");
                html += ("<td class='ui-td'>...</td>");
                html += ("<td class='ui-td'>");
                // this input element's value is going to be hard coded to some degree
                // in order to accommodate the user input, we'll have to have a keystroke listener when for these inputs
                // maybe i'll come up with some scenarios we can limit users to
                // e.g. filename must be split by "." or "-" or "_" and the section of the name the user changes
                // will trigger the listener to update the other inputs automatically
                html += ("<textarea id='rename_" + i + "' class='ui-input' type='text'>" + titles[i] + "</textarea>");
                html += ("</td>");
                html += "<td><img src='img/x_icon.png' style='max-width:16px;max-height:16px' onclick='remove(\"row_" + i + "\")'></td>"
                // html += "<td><img src='img/x_icon.png' style='max-width:16px;max-height:16px' onclick='remove(\"row_" + i + "\"></td>"
                html += ("</tr>");
                count++;
            }
        }
    }
    html +=("</tbody></table>");
    obj.html(html);
    obj.dialog('open');
    addTaskbarItem("Rename Files", srcDiv);
}

/**
 * Replaces the <p> text of a file <div>
 * @param id id of a file to rename.
 * @param folder the id of the folder containing this file
 */
function renameSingleFileDialogue(id) {
    if (renameCount > 1) {
        makeRenameDialogue('renameDialogueDiv', getFileNames($('#'+id).parent().attr('id'), 'vlc'))
        return;
    }
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
                $('#'+id+'_input').val('1') // set its flag to 1 meaning it has already been renamed
                deleteTaskbarItem(id+"_div");
                $('#'+id+'_text').html($('#rename').val());
                $(this).empty();
                $(this).dialog('destroy');
                renameCount++
            },
            "Close": function() {
                deleteTaskbarItem(id+"_div");
                $(this).empty();
                $(this).dialog('destroy');
            }
        }
    });
    $(this).keypress(function(e) {
        if (e.keyCode == $.ui.keyCode.ENTER) {
            $(':button:contains("OK")').click();
        }
    });
    orig = $('#'+id+'_text').text()
    // build the HTML of the dialogue
    html = "<table colspan=2 width='100%' style='table-layout:fixed'>";
    html += "<thead><tr><th width='50%'>Original</th><th width='50%'>New Filename</th></tr></thead>";
    html += "<tbody>";
    html += "<td class='ui-td'>" + orig + "</td>";
    html += "<td class='ui-td'>";
    html +="<textarea id='rename' class='ui-input' type='text'>" + orig + "</textarea>";
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
 * @param folder - div name of a folder containing files
 * @type type of files we want to include in the return. can be null if you want everything in Folder
 * @returns {Array} of fileIDs in the folder
 */
function getFileNames(folder, type) {
    var values = [];
    $("#" + folder).children().each(function() {
        if (type == undefined || $(this).attr("class").indexOf(type) >= 0) {
            values.push($(this).attr('id'));
        }
    })
    return values;
}

function remove(id) {
    $('#'+id).remove()
}
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
    $(contents).children('div').each(function() {
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

function makeNotepadDialogue(dialogueDiv) {

    obj = $('#'+dialogueDiv).dialog({
        title: 'Notepad',
        width: 'auto',//512,
        height: 'auto',//256,
        modal: false,
        resizable: false,
        autoOpen: false,
        close: (function() {
            value = $("#notepad_value").val()
            $(this).empty();
            $(this).dialog('destroy');
            deleteTaskbarItem('notepad_div');
        }),
        open: function (event, ui) {
            $(this).css('overflow', 'hidden'); //this line does the actual hiding
        }
    });
    html = "<textarea id='notepad_value' rows='20' cols='50'></textarea>"
    obj.append(html)
    obj.dialog('open')
    addTaskbarItem('Notepad', 'notepad_div')
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
    iframe = $("<iframe class='ui-iframe' " + "src='img/" + filename + "' " + " allowfullscreen webkitallowfullscreen></iframe>")

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

