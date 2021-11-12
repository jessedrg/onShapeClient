import chai from 'chai' 
import chaiMatch from 'chai-match'
import sinonChai from 'sinon-chai'
chai.use(chaiMatch)
chai.use(sinonChai)
import sinon from 'sinon'
const expect = chai.expect

import {sketchInformation} from "./sketchInformation.js"

describe("sketchInformation", function() { 
  it("should call sendRequest with method 'get' and resource 'partstudios' and subresource 'sketches'", async function() {
    const fakeClient = {
      sendRequest: sinon.stub().resolves({data: {sketches:[]}}),
      sketchInformation,
    }

    const documentId = "document1"
    const versionId = "version1"
    const elementId = "partstudio1"

    const info = await fakeClient.sketchInformation({documentId, versionId, elementId})
    expect(info).to.deep.equal({sketches:[]})

    expect(fakeClient.sendRequest).has.been.calledWith({
      documentId,
      elementId: 'partstudio1',
      method: 'get',
      microversionId: undefined,
      query: {
        configuration: undefined,
        curvePoints: undefined,
        includeGeometry: undefined,
        linkDocumentId: undefined,
        output3d: undefined,
        sketchId: undefined,
      },
      resource: 'partstudios',
      subresource: 'sketches',
      versionId,
      workspaceId: undefined,
    })
  });

  it("should pass query params to sendRequest", function() {
    const fakeClient = {
      sendRequest: sinon.stub().resolves({}),
      sketchInformation,
    }

    const documentId = "document1"
    const microversionId = "microversion1"
    const elementId = 'partstudio1'

    fakeClient.sketchInformation({
      documentId,
      microversionId,
      elementId,
      includeGeometry: true
    })

    expect(fakeClient.sendRequest).has.been.calledWith({
      documentId,
      elementId: 'partstudio1',
      method: 'get',
      microversionId: "microversion1",
      query: {
        output3d: undefined,
        curvePoints: undefined,
        includeGeometry: true,
        linkDocumentId: undefined,
        configuration: undefined,
        sketchId: undefined,
      },
      resource: 'partstudios',
      subresource: 'sketches',
      versionId: undefined,
      workspaceId: undefined,
    })
  });

  it("accepts a sketchId parameter for a specific sketch feature", function() {
    const fakeClient = {
      sendRequest: sinon.stub().resolves({}),
      sketchInformation,
    }

    const documentId = "document1"
    const microversionId = "microversion1"
    const elementId = 'partstudio1'
    const sketchId = 'sketch1'

    fakeClient.sketchInformation({
      documentId,
      microversionId,
      elementId,
      sketchId,
      includeGeometry: true
    })

    expect(fakeClient.sendRequest).has.been.calledWith({
      documentId,
      elementId: 'partstudio1',
      method: 'get',
      microversionId: "microversion1",
      query: {
        output3d: undefined,
        curvePoints: undefined,
        includeGeometry: true,
        linkDocumentId: undefined,
        configuration: undefined,
        sketchId,
      },
      resource: 'partstudios',
      subresource: 'sketches',
      versionId: undefined,
      workspaceId: undefined,
    })
  });
});
