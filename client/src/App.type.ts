export type ParsedCSV = {
    meta: PaPaParseMetaCSV
    data: Array<object>
}

export type PaPaParseMetaCSV = {
    fields: Array<string>
}