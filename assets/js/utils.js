function hideOthers(that) {
    views.forEach((view) => {
        if (view !== that) {
            if (document.getElementById(view) !== null) document.getElementById(view).classList.add('hidden')
        } else {
            document.getElementById(view).classList.remove('hidden')
        }
    })
}