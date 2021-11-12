export function getMassStudio({
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
        resource: 'partstudios',
        subresource: `e/${elementId}/partid/${partId}/massproperties`,
        workspaceId,
    }).then(response => response.data)
}
