# Onshape-Axios

This package is a simple axios-based client for the Onshape REST API. (Onshape is an awesome browser-based parametric CAD tool)

This package is not supported by Onshape and is not related to Onshape Inc. in any way.  This code is based on Onshape's own example application at https://github.com/onshape-public/apikey/tree/master/Node/lib

The Onshape REST API documentation is available here: https://onshape-public.github.io/docs/apioverview/

You can create OAUTH credentials at https://dev-portal.onshape.com/keys

# Usage
```js
// Using ES modules
import {OnshapeClient} from 'onshape-axios'

// Enter your own credentials
const credentials = {
  accessKey: '',
  baseUrl:   'https://cad.onshape.com',
  secretKey: '',
}

const client = new OnshapeClient(credentials)

// This is a public tutorial document, also try your own
client.getParts({
  documentId: '576aef66e4b0cc2e7f45753d',
  workspaceId: '8ca023444b1f90992227b068',
}).then(parts => console.log({parts}))

// You can also use versionId or microversionId
client.getParts({
  documentId: '576aef66e4b0cc2e7f45753d',
  versionId: 'your-version-id',
}).then(parts => console.log({parts}))

// Different API endpoints can also take certain optional arguments
client.getParts({
  documentId: '576aef66e4b0cc2e7f45753d',
  workspaceId: '8ca023444b1f90992227b068',
  includeFlatParts: true,
}).then(parts => console.log({parts}))
```
