export function getBoundingBox({
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
        subresource: `e/${elementId}/partid/${partId}/boundingboxes`,
        workspaceId,
    }).then(response => response.data)
}
