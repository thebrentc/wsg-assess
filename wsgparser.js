class WSGParser {
    constructor(callback = null) {
        this.url = 'https://w3c.github.io/sustyweb/'		
		this.wsg = null // to store parsed WSG data
		this.callback = callback
		this.parse()
    }

    async parse() {
        async function request(self) {
            const response = await fetch(self.url)
            const content = await response.text()
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(content, 'text/html')

			self.wsg = {
				'sections': {}
			}
            let sections = htmlDoc.getElementsByTagName('section') 
            /* Get relevant sections */
            let excludes = [ 'introductory', 'informative', 'appendix' ]
            for (let section of sections) {
                if (excludes.includes(section.className)) { continue; }
                /* Get Section heading */
                let h2 = section.querySelector('h2[id^=x]')
                if (h2) {
					var sectionId = h2.getAttribute('id')
					self.wsg.sections[sectionId] = {
						'id': sectionId,
						'title': h2.innerText,
						'link': self.url + '#' + sectionId,
						'guidelines': {},
						'impact': null,
						'effort': null
					}
                    /* Get Guidelines */
                    let guidelineSections = section.querySelectorAll('section')
                    for (let guidelineSection of guidelineSections) {
                        /* Get Guideline heading */
                        let h3 = guidelineSection.querySelector('h3[id^=x]')
                        if (h3) {						
							var guidelineId = h3.getAttribute('id')
							self.wsg.sections[sectionId].guidelines[guidelineId] = {
								'id': guidelineId,
								'title': h3.innerText,
								'link': self.url + '#' + guidelineId,
								'successCriteria': {}
							}
                            /* Get Guideline impact and effort ratings */
                            let ratings = guidelineSection.querySelectorAll('dd') 
                            let impact = ratings[0].innerText
                            let effort = ratings[1].innerText
							self.wsg.sections[sectionId].guidelines[guidelineId].impact = impact
							self.wsg.sections[sectionId].guidelines[guidelineId].effort = effort
                        }
                        /* Get Guideline Details: Success criteria */
                        let successCriteria = guidelineSection.querySelectorAll('section')
                        for (let successCriterion of successCriteria) {
                            let h4 = successCriterion.querySelector('h4[id^=success-criterion]')
                            if (h4) {
								let successCriterionId = h4.getAttribute('id')
								let description = successCriterion.querySelector('p').innerText
								self.wsg.sections[sectionId].guidelines[guidelineId].successCriteria[successCriterionId] = {
									'id': successCriterionId,
									'title': h4.innerText,
									'link': self.url + '#' + successCriterionId,
									'description': description
								}
                            }
                        }
                    }
                }
            }
        }
        await request(this)
		if (this.callback) { this.callback() }
    } 

	getJSON() {
		if (!this.wsg) { this.parse() }
		return JSON.stringify(this.wsg, null, 2)
	}

	getCSV() {
		var csv = ""
		csv += '<h1>' + 'WSG Sections and Guidelines and Success criteria' + '</h1>' + "\n"
		var defaultHeadings = 'Title,Link,Impact,Effort,Description'
		var userHeadings = 'Status,Notes'
		csv += defaultHeadings + ',' + userHeadings + "\n"
		for (const sectionId in this.wsg.sections) {
			csv += '<a href="'+ this.wsg.sections[sectionId].link +'">' + '"' + this.wsg.sections[sectionId].title + '"' + '<a/>' 
			csv += ',' + this.wsg.sections[sectionId].link + "\n"
			for (const guidelineId in this.wsg.sections[sectionId].guidelines) {
				var guideline = this.wsg.sections[sectionId].guidelines[guidelineId]
				csv += '<a href="'+ guideline.link +'">' + '"' + guideline.title + '"' + '</a>'
				csv += ',' + guideline.link 
				csv += ',' + guideline.impact + ',' + guideline.effort + "\n"
				for (const successCriterionId in guideline.successCriteria) {
					let successCriterion = guideline.successCriteria[successCriterionId]
					csv += '<a href="'+ successCriterion.link +'">' + '"' + successCriterion.title + '"' + '</a>'
					csv += ',' + successCriterion.link
					csv += ',' + ',,' + '"' + successCriterion.description + '"' + "\n"
				}
			}
		}
		return csv
	}
}
