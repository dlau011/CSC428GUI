function makeDialogue(src, filenames) {
    $( "#" + src).dialog({
        draggable: true,
        modal: true,
        resizable: true,
        title: "Repetitive Renaming",
        buttons: [
            {
                text: "OK",
                click: function () {
                    $(this).dialog("close");
                }
            },
            {
                text: "Cancel",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    }).show();
}
