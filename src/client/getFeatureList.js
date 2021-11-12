// This is a method of OnshapeClient, see OnshapeClient.js

export function getFeatureList({
  documentId,
  elementId,
  workspaceId,
  versionId,
  microversionId,
  featureId,
  linkDocumentId,
  noSketchGeometry,
}) {
  return this.sendRequest({
    documentId,
    elementId,
    method: 'get',
    microversionId,
    query: {
      featureId,
      linkDocumentId,
      noSketchGeometry,
    },
    resource: 'partstudios',
    subresource: 'features',
    versionId,
    workspaceId,
  }).then(response => response.data)
}
