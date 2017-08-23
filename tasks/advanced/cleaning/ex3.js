// assume this data came from the database
var notes = [
    "This is the first note I've taken!",
    "Now is the time for all good men to come to the aid of their country.",
    "The quick brown fox jumped over the moon."
]

// ### Implementation

let NotesManager = function () {
    this.notes = []
    this.events = [
        "add_note",
    ]
    this.listeners = {}
    this.addListener = function (ev, cb) {
        if (this.events.indexOf(ev) != -1) {
            if (typeof (this.listeners[ev]) != 'object') {
                this.listeners[ev] = []
            }
            this.listeners[ev].push(cb)
        }
    }
    this.fireEvent = function (type, data) {
        let coll = this.listeners[type] || []
        coll.forEach(function (element) {
            element(...data)
        }, this)
    }
    this.add = function (note) {
        this.notes.push(note)
        this.fireEvent("add_note", [note])
    }
    this.addBulk = function (notes) {
        notes.forEach(function (e) {
            this.add(e)
        }, this)
    }
    this.init = function (data) {
        this.addBulk(data)
    }
}


function NoteManagerialThing(owner) {
    this.alert = function () {
        alert(`Welcome to ${owner}'s note manager.`)
    }
}
NoteManagerialThing.prototype = new NotesManager()


// ### Usage

let nm = new NoteManagerialThing("Kyle")

nm.addListener('add_note', (note) => {
    $("#notes").prepend(
        $("<a href='#'></a>")
        .addClass("note")
        .text(note)
    )
})
nm.init(notes)



// ### DOM interaction
$(document).ready(() => {
    function addCurrentNote() {
        var current_note = $("#note").val()

        if (current_note) {
            nm.add(current_note)
            $("#note").val("")
        }
    }
    $("#add_note").bind("click", () => addCurrentNote())
    $("#note").bind("keypress", evt => {
        if (evt.which === 13)
            addCurrentNote()
    })


    $(document).bind("click", e => {
        $("#notes").removeClass("active")
        $("#notes").children(".note").removeClass("highlighted")
    })
    $("#open_help").bind("click", evt => {
        if (!$("#help").is(":visible")) {
            evt.preventDefault()
            evt.stopPropagation()

            $("#help").show()

            document.addEventListener("click", function __handler__(evt) {
                evt.preventDefault()
                evt.stopPropagation()
                evt.stopImmediatePropagation()

                document.removeEventListener("click", __handler__, true)

                $("#help").hide()
            }, true)
        }
    })
    $("#notes").on("click", ".note", evt => {
        evt.preventDefault()
        evt.stopPropagation()

        $("#notes").addClass("active")
        $("#notes").children(".note").removeClass("highlighted")
        $(evt.target).addClass("highlighted")
    })
    nm.alert();
})


/*
 * Not having the ability to hide implementation detail via private members
 * is a dangerous 'feature'. Especially in JavaScript where most variables
 * are fair game, they can often be fiddled and meddled with by any code
 * it is accessible by (see my Garage Admin task where I overwrite console.log)
 */