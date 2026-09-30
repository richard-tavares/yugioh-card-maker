export function keepWholeWordsThatFit(inserted: string, fits: (insertedPart: string) => boolean): string {
    const wordEnds = [...inserted.matchAll(/\S(?=\s|$)/g)].map(match => match.index + 1);
    let fittingWords = 0;
    let candidateWords = wordEnds.length;

    while (fittingWords < candidateWords) {
        const middle = Math.ceil((fittingWords + candidateWords) / 2);
        if (fits(inserted.slice(0, wordEnds[middle - 1]))) fittingWords = middle;
        else candidateWords = middle - 1;
    }

    return fittingWords === 0 ? "" : inserted.slice(0, wordEnds[fittingWords - 1]);
}

export function splitAroundInsertion(previous: string, next: string) {
    let start = 0;
    while (start < previous.length && previous[start] === next[start]) start++;
    let end = 0;
    while (end < previous.length - start && previous[previous.length - 1 - end] === next[next.length - 1 - end]) end++;

    return {
        before: next.slice(0, start),
        inserted: next.slice(start, next.length - end),
        after: next.slice(next.length - end),
        replacedExistingText: previous.length - start - end > 0,
    };
}
