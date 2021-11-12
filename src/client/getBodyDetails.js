export function getBodyDetails({
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
        subresource: `e/${elementId}/partid/${partId}/bodydetails`,
        workspaceId,
    }).then(response => response.data)
}
