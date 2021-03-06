/**
 * @flow
 * @relayHash 352273471c339a8b853b248e44b37291
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppPage$ref = any;
type Webs$ref = any;
export type pagesQueryVariables = {||};
export type pagesQueryResponse = {|
  +$fragmentRefs: AppPage$ref & Webs$ref
|};
*/


/*
query pagesQuery {
  ...AppPage
  ...Webs
}

fragment AppPage on Query {
  me {
    themeName
    id
  }
}

fragment Webs on Query {
  me {
    webs(orderBy: updatedAt_ASC) {
      id
      ...WebsItem
    }
    id
  }
}

fragment WebsItem on Web {
  name
  updatedAt
  posts(first: 1, orderBy: updatedAt_DESC, where: {name_not: null}) {
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "pagesQuery",
  "id": null,
  "text": "query pagesQuery {\n  ...AppPage\n  ...Webs\n}\n\nfragment AppPage on Query {\n  me {\n    themeName\n    id\n  }\n}\n\nfragment Webs on Query {\n  me {\n    webs(orderBy: updatedAt_ASC) {\n      id\n      ...WebsItem\n    }\n    id\n  }\n}\n\nfragment WebsItem on Web {\n  name\n  updatedAt\n  posts(first: 1, orderBy: updatedAt_DESC, where: {name_not: null}) {\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "pagesQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "FragmentSpread",
        "name": "AppPage",
        "args": null
      },
      {
        "kind": "FragmentSpread",
        "name": "Webs",
        "args": null
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "pagesQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "themeName",
            "args": null,
            "storageKey": null
          },
          v0,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "webs",
            "storageKey": "webs(orderBy:\"updatedAt_ASC\")",
            "args": [
              {
                "kind": "Literal",
                "name": "orderBy",
                "value": "updatedAt_ASC",
                "type": "WebOrderByInput"
              }
            ],
            "concreteType": "Web",
            "plural": true,
            "selections": [
              v0,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "name",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "updatedAt",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "posts",
                "storageKey": "posts(first:1,orderBy:\"updatedAt_DESC\",where:{\"name_not\":null})",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 1,
                    "type": "Int"
                  },
                  {
                    "kind": "Literal",
                    "name": "orderBy",
                    "value": "updatedAt_DESC",
                    "type": "PostOrderByInput"
                  },
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "name_not": null
                    },
                    "type": "PostWhereInput"
                  }
                ],
                "concreteType": "Post",
                "plural": true,
                "selections": [
                  v0
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e8c77c475ac94b334fb2722d32d50b37';
module.exports = node;
