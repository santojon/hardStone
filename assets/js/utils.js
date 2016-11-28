/**
 * Hide all but that
 * @param that: the thing to show
 */
hideOthers = (that) => {
    views.forEach((view) => {
        if (view !== that) {
            if (document.getElementById(view) !== null) document.getElementById(view).classList.add('hidden')
        } else {
            document.getElementById(view).classList.remove('hidden')
        }
    })
}

/**
 * Session related functions
 */
saveSession = () => {
    localStorage.setItem('_session', JSON.stringify(_session))
}

getSession = () => {
    return JSON.parse(localStorage.getItem('_session'))
}

cleanSession = () => {
    localStorage.removeItem('_session')
}

/**
 * Add class to item with id
 */
addClass = (item, cls) => {
    if (document.getElementById(item) !== null) {
        document.getElementById(item).classList.add(cls)
        document.getElementById(item).style = ''
    }
}

/**
 * Remove class to item with id
 */
removeClass = (item, cls) => {
    if (document.getElementById(item) !== null) {
        document.getElementById(item).classList.remove(cls)
        document.getElementById(item).style = ''
    }
}


/**
 * All pages need that
 */

hideItem = (item) => {
    addClass(item, 'hidden')
}

showItem = (item) => {
    removeClass(item, 'hidden')
}

selectItem = (item) => {
    addClass(item, 'active')
}

unselectItem = (item) => {
    removeClass(item, 'active')
}

/**
 * Errors related
 */
showError = (msg) => {
    setMessage(msg, 'globalErrorMessage')
    showItem('globalErrorMessage')

    $('#globalErrorMessage').delay(3000).slideUp(200, () => {
        hideItem('globalErrorMessage')
    })
}

showSuccess = (msg) => {
    setMessage(msg, 'globalSuccessMessage')
    showItem('globalSuccessMessage')

    $('#globalSuccessMessage').delay(3000).slideUp(200, () => {
        hideItem('globalSuccessMessage')
    })
}

setMessage = (msg, item) => {
    document.getElementById(item).innerHTML = msg
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}