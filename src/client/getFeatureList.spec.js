import chai from 'chai' 
import chaiMatch from 'chai-match'
import sinonChai from 'sinon-chai'
chai.use(chaiMatch)
chai.use(sinonChai)
import sinon from 'sinon'
const expect = chai.expect

import {getFeatureList} from "./getFeatureList.js"

describe("getFeatureList", function() { 
  it("should call sendRequest with method 'get' and resource 'partstudios' and subresource 'features'", async function() {
    const fakeClient = {
      sendRequest: sinon.stub().resolves({data: ['fake data']}),
      getFeatureList,
    }

    const documentId = "document1"
    const versionId = "version1"
    const elementId = "partStudio1"

    const parts = await fakeClient.getFeatureList({documentId, versionId, elementId})
    expect(parts).to.deep.equal(['fake data'])

    expect(fakeClient.sendRequest).has.been.calledWith({
      documentId,
      elementId,
      method: 'get',
      microversionId: undefined,
      query: {
        featureId: undefined,
        linkDocumentId: undefined,
        noSketchGeometry: undefined,
      },
      resource: 'partstudios',
      subresource: 'features',
      versionId,
      workspaceId: undefined,
    })
  });

  it("should pass query params to sendRequest", function() {
    const fakeClient = {
      sendRequest: sinon.stub().resolves({}),
      getFeatureList,
    }

    const documentId = "document1"
    const microversionId = "microversion1"
    const elementId = "partStudio1"

    fakeClient.getFeatureList({documentId, microversionId, elementId, noSketchGeometry: true})

    expect(fakeClient.sendRequest).has.been.calledWith({
      documentId,
      elementId,
      method: 'get',
      microversionId: "microversion1",
      query: {
        featureId: undefined,
        linkDocumentId: undefined,
        noSketchGeometry: true,
      },
      resource: 'partstudios',
      subresource: 'features',
      versionId: undefined,
      workspaceId: undefined,
    })
  });
});
