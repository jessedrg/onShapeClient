export function getFaces({
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
        subresource: `e/${elementId}/partid/${partId}/tessellatedfaces`,
        workspaceId,
    }).then(response => response.data)
}

