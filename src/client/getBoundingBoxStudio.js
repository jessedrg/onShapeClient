export function getBoundingBoxStudio({
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
        subresource: `e/${elementId}/partid/${partId}/boundingboxes`,
        workspaceId,
    }).then(response => response.data)
}
