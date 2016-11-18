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
    if (document.getElementById(item) !== null) document.getElementById(item).classList.add(cls)
}

/**
 * Remove class to item with id
 */
removeClass = (item, cls) => {
    if (document.getElementById(item) !== null) document.getElementById(item).classList.remove(cls)
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