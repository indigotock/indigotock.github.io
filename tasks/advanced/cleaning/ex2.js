// assume this data came from the database
var notes = [
	"This is the first note I've taken!",
	"Now is the time for all good men to come to the aid of their country.",
	"The quick brown fox jumped over the moon."
]

// ### Implementation

let NotesManager = (() => {
	let notes = []
	const events = [
		"add_note",
	]
	const listeners = {}

	return function () {
		this.addListener = function (ev, cb) {
			if (events.indexOf(ev) != -1) {
				if (typeof (listeners[ev]) != 'object') {
					listeners[ev] = []
				}
				listeners[ev].push(cb)
			}
		}
		this.fireEvent = function (type, data) {
			let coll = listeners[type] || []
			coll.forEach(function (element) {
				element(...data)
			}, this)
		}
		this.add = function (note) {
			notes.push(note)
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
})()


// ### Usage

let nm = new NotesManager()

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
})


/*
 * The NotesManager class is an independent version of the original,
 * no longer tied to the DOM. Its DOM interaction is now handled via
 * the events system which currently has only one event (add_note), but
 * can easily be adapted for more
 */