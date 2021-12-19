import { formatOutputOfParseResult } from './index'
import { parseAndCheckText } from './parsing'

test('correctly checks some texts that are invalid', () => {
    const text1 = '<B><C> This should be centred and in boldface, but the tags are wrongly nested </B></C>'
    const text2 = '<B>This should be in boldface, but there is an extra closing tag</B></C>'
    const text3 = '<B><C>This should be centred and in boldface, but there is a missing closing tag</C>'
    const parseResult1 = parseAndCheckText(text1)
    const parseResult2 = parseAndCheckText(text2)
    const parseResult3 = parseAndCheckText(text3)
    expect(formatOutputOfParseResult(parseResult1)).toBe('Expected </C> found </B>')
    expect(formatOutputOfParseResult(parseResult2)).toBe('Expected # found </C>')
    expect(formatOutputOfParseResult(parseResult3)).toBe('Expected </B> found #')
})
