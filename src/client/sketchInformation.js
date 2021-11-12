// This is a method of OnshapeClient, see OnshapeClient.js

export function sketchInformation({
  documentId,
  workspaceId,
  versionId,
  microversionId,
  elementId,
  sketchId,
  configuration,
  curvePoints, // boolean
  includeGeometry, // boolean
  linkDocumentId, // string
  output3d, // boolean
}) {
  return this.sendRequest({
    documentId,
    elementId,
    method: 'get',
    microversionId,
    query: {
      configuration,
      curvePoints,
      includeGeometry,
      linkDocumentId,
      output3d,
      sketchId,
    },
    resource: 'partstudios',
    subresource: 'sketches',
    versionId,
    workspaceId,
  }).then(response => response.data)
}
