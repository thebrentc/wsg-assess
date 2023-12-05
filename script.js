class Generator {
    constructor() {
        this.url = 'https://w3c.github.io/sustyweb/'
        document.getElementById('generate-button').addEventListener(
            "click",
            function () {
                this.generate()
            }.bind(this)
        );
    }

    generate() {
        async function request(self) {
            const response = await fetch(self.url)
            const content = await response.text()
            //console.log(content)
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(content, 'text/html')

            var output = ""
            var br = "\n"
            let sections = htmlDoc.getElementsByTagName('section') 
            /* Get relevant sections */
            let excludes = [ 'introductory', 'informative', 'appendix' ]
            for (let section of sections) {
                if (excludes.includes(section.className)) { continue; }
                /* Get Section heading */
                let h2 = section.querySelector('h2[id^=x]')
                if (h2) {
                    output += h2.innerText + br
                    /* Get Guidelines */
                    let guidelineSections = section.querySelectorAll('section')
                    for (let guidelineSection of guidelineSections) {
                        /* Get Guideline heading */
                        let h3 = guidelineSection.querySelector('h3[id^=x]')
                        if (h3) {
                            output += h3.innerText + br
                            /* Get Guideline impact and effort ratings */
                            let ratings = guidelineSection.querySelectorAll('dd') 
                            let impact = ratings[0]
                            let effort = ratings[1]
                            output += 'Impact: ' + impact.innerText + br
                            output += 'Effort: ' + effort.innerText + br

                        }
                        /* Get Guideline Details: Success criteria */
                        let successCriteria = guidelineSection.querySelectorAll('section')
                        for (let successCriterion of successCriteria) {
                            let h4 = successCriterion.querySelector('h4[id^=success-criterion]')
                            if (h4) {
                                output += h4.innerText + br
                                let prev = h4
                            }
                            let description = successCriterion.querySelector('p')
                        }
                    }
                }
            }
            document.body.innerHTML += '<pre>' + output + '</pre>';
        }
        request(this)
    } 
}

let generator = new Generator()
generator.generate();