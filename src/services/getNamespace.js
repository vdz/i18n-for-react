export function getNamespace(path) {
    // get substring from the /src until the .js
    return path.substring(path.indexOf('/src') + 4, path.lastIndexOf('.'));
}

