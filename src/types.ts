type Indexable<T> = {
    [key: string]: T
}

export interface SearchResult extends Indexable<string | Array<string>> {
    author: string,
    breadcrumbs: string,
    compatibility: Array<string>,
    content: string,
    description: string,
    documentation_type: string,
    example: string,
    in_ide_libraries: Array<string>,
    language: string,
    language_pretty: string,
    maintainer: string,
    parameters: string,
    syntax: string,
    title: string,
    types_of_reference: string,
    objectID: string
}