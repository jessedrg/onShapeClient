import chai from 'chai' 
import chaiMatch from 'chai-match'
import sinonChai from 'sinon-chai'
chai.use(chaiMatch)
chai.use(sinonChai)
import sinon from 'sinon'
const expect = chai.expect

import {getParts} from "./getParts.js"

describe("getParts", function() { 
  it("should call sendRequest with method 'get' and resource 'parts'", async function() {
    const fakeClient = {
      sendRequest: sinon.stub().resolves({data: [{name: 'part1'}]}),
      getParts,
    }

    const documentId = "document1"
    const versionId = "version1"

    const parts = await fakeClient.getParts({documentId, versionId})
    expect(parts).to.deep.equal([{name: 'part1'}])

    expect(fakeClient.sendRequest).has.been.calledWith({
      documentId,
      method: 'get',
      microversionId: undefined,
      query: {
        includeFlatParts: undefined,
        includePropertyDefaults: undefined,
        linkDocumentId: undefined,
        withThumbnails: undefined,
      },
      resource: 'parts',
      versionId,
      workspaceId: undefined,
    })
  });

  it("should pass query params to sendRequest", function() {
    const fakeClient = {
      sendRequest: sinon.stub().resolves({}),
      getParts,
    }

    const documentId = "document1"
    const microversionId = "microversion1"

    fakeClient.getParts({documentId, microversionId, includeFlatParts: true})

    expect(fakeClient.sendRequest).has.been.calledWith({
      documentId,
      method: 'get',
      microversionId: "microversion1",
      query: {
        includeFlatParts: true,
        includePropertyDefaults: undefined,
        linkDocumentId: undefined,
        withThumbnails: undefined,
      },
      resource: 'parts',
      versionId: undefined,
      workspaceId: undefined,
    })
  });
});
