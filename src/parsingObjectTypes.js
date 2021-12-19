export class Token {
    constructor (text, position, length) {
        this.text = text
        this.position = position
        this.length = length
    }
}

export class TagToken extends Token {
    constructor (text, position, length, tagName, isOpening) {
        super(text, position, length)
        this.tagName = tagName
        this.isOpening = isOpening ?? false
    }
}

export class ParseIssue {
    constructor (expectedTagName, foundTagName) {
        this.expectedTagName = expectedTagName
        this.foundTagName = foundTagName
    }
}

export class ParseResult {
    constructor (parseIssue) {
        if (!parseIssue) {
            this.parsedSuccessfully = true
        } else {
            this.parseIssue = parseIssue
            this.parsedSuccessfully = false
        }
    }
}
