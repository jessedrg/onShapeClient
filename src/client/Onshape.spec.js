import chai from 'chai' 
import chaiMatch from 'chai-match'
import sinonChai from 'sinon-chai'
chai.use(chaiMatch)
chai.use(sinonChai)
import sinon from 'sinon'
const expect = chai.expect

// The thing we're importing still needs axios to be partially applied
import {OnshapeClient} from './Onshape.js'
import * as errors from './errors.js'

describe("Onshape client", function() {
  const accessKey = 'accessKey'
  const baseUrl = 'https://cad.onshape.test'
  const secretKey = 'secretKey'

  describe("constructor", function() {
    it("throws CredentialsFormatError if credentials are malformed", function() {
      expect(() => new OnshapeClient({accessKey:undefined, baseUrl, secretKey})).to.throw();
      expect(() => new OnshapeClient({accessKey, baseUrl: 5, secretKey})).to.throw();
      expect(() => new OnshapeClient({accessKey, baseUrl, secretKey: null})).to.throw();
      expect(() => new OnshapeClient({accessKey, baseUrl, secretKey})).not.to.throw();
    });
  });

  describe("buildHeaders", function() {
    const nonce = 'A7VN4GOIMW4R8423G0D1GBRCD'
    const method = 'get'
    const path = '/api/partstudios/d/1065df1d04193205f143c9af/w/4a7fb57980eac19658e338e9/e/f88aa4b628129027de644a71/features'
    const query = undefined
    const date = new Date('Wed, 30 Dec 2020 21:53:19 GMT')
    const extraHeaders = {'Foo': 'Bar'}

    const client = new OnshapeClient({accessKey, baseUrl, secretKey}) 

    it("builds a signature", function() {
      const headers = client.buildHeaders({
        accessKey,
        date,
        extraHeaders,
        method,
        nonce,
        path,
        query,
        secretKey,
      })
      expect(headers['Authorization']).to.equal(
        "On accessKey:HmacSHA256:IKda0vbbwso3vlUUsh/RBa8Q+pyK1E7QtOMvg3LWzyU=",
      )

      const differentHeaders = client.buildHeaders({
        accessKey,
        date,
        extraHeaders,
        method,
        nonce,
        path,
        query: {i_am: 'different'}, // changes signature
        secretKey,
      })
      expect(differentHeaders['Authorization']).to.not.equal(
        "On accessKey:HmacSHA256:VMddf/jCR5igCzZPduwIP1qsXzS60u/LLvOoCFEP2Uo="
      )
    });

    it("allows overriding Accept", function() {
      const headers = client.buildHeaders({
        accessKey,
        date,
        method,
        path,
        query,
        extraHeaders,
        secretKey,
      })

      expect(headers['Accept']).to.equal('application/vnd.onshape.v1+json')

      const overridden = client.buildHeaders({
        accessKey,
        date,
        method,
        path,
        query,
        extraHeaders: {'Accept': 'foo'},
        secretKey,
      })

      expect(overridden['Accept']).to.equal('foo')
    });

    it("allows overriding Content-Type", function() {
      const headers = client.buildHeaders({
        accessKey,
        date,
        method,
        path,
        query,
        extraHeaders,
        secretKey,
      })

      expect(headers['Content-Type']).to.equal('application/json')

      const overridden = client.buildHeaders({
        accessKey,
        date,
        method,
        path,
        query,
        extraHeaders: {'Content-Type': 'foo'},
        secretKey,
      })

      expect(overridden['Content-Type']).to.equal('foo')
    });
  });

  describe("buildQueryString", function() {
    const client = new OnshapeClient({accessKey, baseUrl, secretKey}) 
    it("returns empty string query is undefined", function() {
      expect(client.buildQueryString(undefined)).to.equal('')
    });

    it("throws InvalidQueryError if query is not an object", function() {
      expect(() => client.buildQueryString()).to.not.throw()
      expect(() => client.buildQueryString({})).to.not.throw()
      expect(() => client.buildQueryString(56)).to.throw(errors.InvalidQueryError)
    });

    it("stringifies the passed query object", function() {
      expect(client.buildQueryString({a: 5, b: [6,7]})).to.equal('a=5&b=6&b=7')
      expect(client.buildQueryString({'7': false})).to.equal('7=false')
    });

    it("omits undefined keys", function() {
      expect(client.buildQueryString({a: undefined, b: 5})).to.equal('b=5')
    });
  });

  describe("buildDWMVEPath", function() {
    const client = new OnshapeClient({accessKey, baseUrl, secretKey}) 
    it("generates a workspace getFeatureList path", function() {
      const result = client.buildDWMVEPath({
        resource: 'partstudios',
        documentId: '1065df1d04193205f143c9af',
        workspaceId: '4a7fb57980eac19658e338e9',
        elementId: 'f88aa4b628129027de644a71',
        subresource: 'features',
      })

      expect(result).to.equal('/api/partstudios/d/1065df1d04193205f143c9af/w/4a7fb57980eac19658e338e9/e/f88aa4b628129027de644a71/features')
    });

    it("generates a version getFeatureList path", function() {
      const result = client.buildDWMVEPath({
        resource: 'partstudios',
        documentId: '1065df1d04193205f143c9af',
        versionId: '4a7fb57980eac19658e338e9',
        elementId: 'f88aa4b628129027de644a71',
        subresource: 'features',
      })

      expect(result).to.equal('/api/partstudios/d/1065df1d04193205f143c9af/v/4a7fb57980eac19658e338e9/e/f88aa4b628129027de644a71/features')
    });

    it("generates a microversion getFeatureList path", function() {
      const result = client.buildDWMVEPath({
        resource: 'partstudios',
        documentId: '1065df1d04193205f143c9af',
        microversionId: '4a7fb57980eac19658e338e9',
        elementId: 'f88aa4b628129027de644a71',
        subresource: 'features',
      })

      expect(result).to.equal('/api/partstudios/d/1065df1d04193205f143c9af/m/4a7fb57980eac19658e338e9/e/f88aa4b628129027de644a71/features')
    });
  });

  describe("createNonce", function() {
    const client = new OnshapeClient({accessKey, baseUrl, secretKey}) 
    it("returns a random string matching /[A-Z0-9]{25}/", function() {
      expect(client.createNonce()).to.match(/[A-Z0-9]{25}/)
      expect(client.createNonce()).to.not.equal(client.createNonce())
    });
  });

  describe("sendRequest", function() {
    const client = new OnshapeClient({accessKey, baseUrl, secretKey}) 

    beforeEach(function() {
      this.clock = sinon.useFakeTimers()
    });

    afterEach(function() {
      this.clock.restore()
    });

    it("invokes axios.request according to its arguments", function() {
      const axiosStub = {
        request: sinon.stub().resolves("I'm a fake response"),
      }

      client.axios = axiosStub
      client.createNonce = () => 'abc123'

      client.sendRequest({
        method: 'get',
        resource: 'parts',
        documentId: 'document1',
        workspaceId: 'workspace1',
      })

      expect(axiosStub.request).to.have.been.calledWith(
        {
          headers: {
            Accept: "application/vnd.onshape.v1+json",
            Authorization: "On accessKey:HmacSHA256:bh5m0v2n287aDQf++ap+WfdkEWnZyOkMmnkgXIMfU8I=",
            'Content-Type': "application/json",
            Date: "Thu, 01 Jan 1970 00:00:00 GMT",
            'On-Nonce': "abc123"
          },
          params: undefined,
          paramsSerializer: client.buildQueryString,
          url: "https://cad.onshape.test/api/parts/d/document1/w/workspace1"
        }
      )

    });
  });
});
