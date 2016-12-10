with (Sgfd.Base) {
    var HomeControler = new Sgfd.Controller({
        metaName: 'HomeControler',
        /**
         * Assert all is clear
         */
        index: () => {
            unselectItem('my-things-click')
            unselectItem('login-click')
            unselectItem('tournament-click')

            HomeControler.getContent()
        },
        /**
         * Get page content and inflate page
         */
        getContent: () => {
            cont = document.getElementById('home-content-dynamic')
            res = []
            side = homeContent.rtl || true

            homeContent.sections.forEach((sec) => {
                res.push('<div class="hs_section col-sm-12 col-md-12 col-lg-12">')
                // image in the right side
                if (side === true) {
                    res.push('<h3 class="home_title">' + __(sec.title) + '</h3>')
                    res.push('<div class="col-sm-12 col-md-6 col-lg-8">')
                    sec.paragraphs.forEach((p) => {
                        res.push('<p class="hs_sec_p_l col-sm-12 col-md-12 col-lg-12">' + __(p) + '</p>')
                    })
                    res.push('</div>')
                    res.push('<img src="' + sec.img +
                        '" alt="Section image" class="hs_sec_img_r col-sm-12 col-md-6 col-lg-4">')
                // image in the left side
                } else {
                    res.push('<h3 class="home_title">' + __(sec.title) + '</h3>')
                    res.push('<img src="' + sec.img +
                        '" alt="Section image" class="hs_sec_img_l col-sm-12 col-md-6 col-lg-4">')
                    res.push('<div class="col-sm-12 col-md-6 col-lg-8">')
                    sec.paragraphs.forEach((p) => {
                        res.push('<p class="hs_sec_p_r col-sm-12 col-md-12 col-lg-12">' + __(p) + '</p>')
                    })
                    res.push('</div>')
                }
                res.push('</div>')

                // invert
                side = !side
            })

            // add signature
            res.push('<img src="' + homeContent.signature +
                '" alt="End of content" class="hs_sign col-sm-12 col-md-12 col-lg-12">')

            // put content into page
            cont.innerHTML = res.join('')
        }
    })
}