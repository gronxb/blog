export const kebabCase = (string : (string | undefined | null)) => {
    if (string)
        return string.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase();
    else return ";"
}
