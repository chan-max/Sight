
// rebuilding

const groupSelectorDelimiter = /\s*,\s*/
const splitSelector = (selector: string): string[] => selector.split(groupSelectorDelimiter)
const joinSelector = (splitedSelector: string[]): string => splitedSelector.join(',')

function mergeSelector(p: string, c: string) {
    var ref = false  // is using & 
    var merged = c.replace('&', () => {
        ref = true
        return p
    })
    return ref ? merged : p + ' ' + c  // default merge
}


/*
    ['header','footer'] , ['h1','h2'] ===> ['header h1' , 'header h2' , 'footer h1' , 'footer h2']
*/
function mergeSplitedSelector(parent: string[], children: string[]): string[] {
    return parent.map((p: string) => {
        return children.map((c: string) => mergeSelector(p, c))
    }).reduce((x, y) => x.concat(y))
}

const mergeSplitedSelectors = (...selectors: string[][]): string[] => selectors.reduce(mergeSplitedSelector)

const mergeSplitedSelectorsAndJoin = (...selectors: string[][]): string => joinSelector(mergeSplitedSelectors(...selectors))


function mergeSelectors(...selectors: string[]) {
    return mergeSplitedSelectors(...selectors.map(splitSelector)).join(',')
}



export {
    splitSelector,
    mergeSplitedSelector,
    mergeSelectors,
    joinSelector,
    mergeSplitedSelectorsAndJoin
}