import {URL} from 'url'

import axios from 'axios'
import crypto from 'crypto'
import querystring from 'querystring'

import * as errors from './errors.js'

import { getFeatureList } from './getFeatureList.js'
import { getParts } from './getParts.js'
import {getPartStudios} from './getPartStudios.js'
import {sketchInformation} from './sketchInformation.js'
import {getBoundingBox} from './getBoundingBox.js'
import {getBoundingBoxStudio} from './getBoundingBoxStudio.js'
import {getFaces} from './getFaces.js'
import { getMass } from './getMass.js'
import {getMassStudio} from './getMassStudio.js'
import {getSTL} from './getSTL.js'
export class OnshapeClient {
  constructor({accessKey, baseUrl, secretKey}) {
    if (typeof baseUrl !== 'string' ||
      typeof accessKey !== 'string' ||
      typeof secretKey !== 'string') {
      throw new errors.CredentialsFormatError()
    }

    // We assign axios to the prototype and use this reference because this
    // provides an excellent link seam for testing.
    this.axios = axios

    this.accessKey = accessKey
    this.baseUrl = baseUrl
    this.secretKey = secretKey
  }
  createDocument(data){
    const path = this.baseUrl +'/api/document';
    return this.axios.request({
      url: this.baseUrl + path,
      method:'post',
      data,
      headers: this.buildHeaders({
        method:'post',
        nonce: this.createNonce(),
        date: new Date(),
        path,
      }),

      // we need the query string to match the Authorization header exactly
      paramsSerializer: this.buildQueryString,
    })
    

  }

  buildDWMVEPath({
    resource,
    documentId,
    workspaceId,
    versionId,
    microversionId,
    elementId,
    subresource,
  }) {
    // Build a path for the Onshape REST API.
    //
    // It's not valid to pass more than one of workspaceId, versionId,
    // or microversionId.
    //
    // Examples of valid path patterns:
    //  - /api/[resource]/d/[documentId]/w/[workspaceId]/e/[elementId]/[subresource]
    //  - /api/[resource]/d/[documentId]/w/[workspaceId]/e/[elementId]
    //  - /api/[resource]/d/[documentId]/w/[workspaceId]
    //  - /api/[resource]/d/[documentId]/v/[versionId][...]
    //  - /api/[resource]/d/[documentId]/m/[microversionId][...]
    //  - /api/[resource]/d/[documentId]/m/[elementId][...]
    //  - /api/parts/d/{did}/{wvm}/{wvmid}/e/{eid}/partid/{partid}/tessellatedfaces
    let path = [null, 'api', resource, 'd', documentId]

    // exactly one of these is valid
    if (workspaceId) { path.push('w', workspaceId) }
    else if (versionId) { path.push('v', versionId) }
    else if (microversionId) { path.push('m', microversionId) }

    if (elementId) { path.push('e', elementId) }

    if (subresource) { path.push(subresource) }

    return path.join('/')
  }

  buildHeaders({ extraHeaders, method, nonce, date, path, query }) {
    const headers = {
      'Accept': 'application/vnd.onshape.v1+json',
      'Content-Type': 'application/json',
      ...extraHeaders,
      'Date': date.toUTCString(),
      'On-Nonce': nonce,
    }
    const hmacString = [ // This format defined by Onshape auth
      method,
      headers['On-Nonce'],
      headers['Date'],
      headers['Content-Type'],
      path,
      this.buildQueryString(query),
      null, // we want to join a trailing newline
    ].join('\n').toLowerCase()
    const signature = crypto.createHmac('sha256', this.secretKey)
      .update(hmacString)
      .digest('base64')
    headers['Authorization'] = `On ${this.accessKey}:HmacSHA256:${signature}`

    return headers
  }

  buildQueryString(query) {
    if (typeof(query) == 'undefined') { return '' }
    if (typeof(query) != 'object') { throw new errors.InvalidQueryError }

    // remove undefined properties
    Object.keys(query).forEach(key => query[key] === undefined && delete query[key])
    return querystring.stringify(query)
  }

  createNonce() {
    const chars = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
      'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
      'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0',
      '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ];
    const range = [...Array(25).keys()] // like Python's 'range(25)'
    return range.map(() => sampleArray(chars)).join('')
  }

  sendRequest({
    method,
    documentId,
    elementId,
    microversionId,
    query,
    resource,
    subresource,
    versionId,
    workspaceId,
    extraHeaders,
  }) {
    const path = this.buildDWMVEPath({
      resource,
      documentId,
      workspaceId,
      versionId,
      microversionId,
      elementId,
      subresource,
    })

    return this.axios.request({
      url: this.baseUrl + path,
      headers: this.buildHeaders({
        extraHeaders,
        method,
        nonce: this.createNonce(),
        date: new Date(),
        path,
        query,
      }),

      // we need the query string to match the Authorization header exactly
      params: query,
      paramsSerializer: this.buildQueryString,
    })
  }
}

const sampleArray = arr => arr[Math.floor(Math.random()*arr.length)]

// Attach all of the endpoint specific methods
OnshapeClient.prototype.getFeatureList = getFeatureList;
OnshapeClient.prototype.getParts = getParts;
OnshapeClient.prototype.getPartStudios = getPartStudios;
OnshapeClient.prototype.getFaces = getFaces;
OnshapeClient.prototype.sketchInformation = sketchInformation;
OnshapeClient.prototype.getBoundingBoxStudio = getBoundingBoxStudio;
OnshapeClient.prototype.getMass = getMass;
OnshapeClient.prototype.getMassStudio = getMassStudio;
OnshapeClient.prototype.getSTL = getSTL;




