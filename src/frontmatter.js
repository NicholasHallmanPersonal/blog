

export const frontmatter = (raw) => {
    let parts = raw.split('---\n');
    // handle the no front matter case
    if (!(parts.length > 2)) return {
        content: raw,
        meta: {}
    }
    // parse out the metadata
    let meta = JSON.parse(parts[1]);
    
    let content = parts.reduce((acc, cur, i) => {
        if (i < 2) return acc;
        acc += cur;
        return acc;
    }, "");

    return {
        content,
        meta
    }
}