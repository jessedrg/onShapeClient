export function getMass({
    documentId,
    workspaceId,
    elementId,
    partId,
}) {
    return this.sendRequest({
        documentId,
        method: 'get',
        query: {
        },
        resource: 'parts',
        subresource: `e/${elementId}/partid/${partId}/massproperties`,
        workspaceId,
    }).then(response => response.data)
}
