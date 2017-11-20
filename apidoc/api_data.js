define({ "api": [  {    "type": "delete",    "url": "/albums/:id/artist",    "title": "Remove relationship between specify album and artist.",    "name": "AlbumRemoveArtist",    "group": "Albums",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": ":id",            "description": "<p>Album's id.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Collection of album.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/albums/:id/artist"      }    ],    "version": "0.0.0",    "filename": "src/v1/album.js",    "groupTitle": "Albums"  },  {    "type": "post",    "url": "/albums/:id/artist",    "title": "Create relationship between specify album and artist.",    "name": "AlbumSetArtist",    "group": "Albums",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": ":id",            "description": "<p>Album's id.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "artist",            "description": "<p>Artist's id.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Collection of album.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/albums/:id/artist"      }    ],    "version": "0.0.0",    "filename": "src/v1/album.js",    "groupTitle": "Albums"  },  {    "type": "delete",    "url": "/albums/:albumId/tracks/:trackId",    "title": "Remove relationship between specify album and track.",    "name": "AlbumSetTrack",    "group": "Albums",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": ":albumId",            "description": "<p>Album's id.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": ":trackId",            "description": "<p>Track's id.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Collection of album.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/albums/:albumId/tracks/:trackId"      }    ],    "version": "0.0.0",    "filename": "src/v1/album.js",    "groupTitle": "Albums"  },  {    "type": "post",    "url": "/albums/:id/track",    "title": "Create relationship between specify album and track.",    "name": "AlbumSetTrack",    "group": "Albums",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": ":id",            "description": "<p>Album's id.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "track",            "description": "<p>Track's id.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Collection of album.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/albums/:id/track"      }    ],    "version": "0.0.0",    "filename": "src/v1/album.js",    "groupTitle": "Albums"  },  {    "type": "post",    "url": "/albums/:id/tracks",    "title": "Create relationship between specify album and multiple tracks.",    "name": "AlbumSetTracks",    "group": "Albums",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": ":id",            "description": "<p>Album's id.</p>"          },          {            "group": "Parameter",            "type": "Array",            "optional": false,            "field": "tracks",            "description": "<p>Array of track's id.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Collection of album.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/albums/:id/tracks"      }    ],    "version": "0.0.0",    "filename": "src/v1/album.js",    "groupTitle": "Albums"  },  {    "type": "put",    "url": "/albums/:id/artist",    "title": "Update relationship between specify album and artist.",    "name": "AlbumUpdateArtist",    "group": "Albums",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": ":id",            "description": "<p>Album's id.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "artist",            "description": "<p>Artist's id.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Collection of album.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/albums/:id/artist"      }    ],    "version": "0.0.0",    "filename": "src/v1/album.js",    "groupTitle": "Albums"  },  {    "type": "delete",    "url": "/albums/:id",    "title": "Delete specify album.",    "name": "DeleteAlbum",    "group": "Albums",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": ":id",            "description": "<p>Album's id.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "data",            "description": "<p>Result of album delete.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/albums/:id"      }    ],    "version": "0.0.0",    "filename": "src/v1/album.js",    "groupTitle": "Albums"  },  {    "type": "get",    "url": "/albums/:id",    "title": "Get album matching by given id.",    "name": "GetAlbum",    "group": "Albums",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": ":id",            "description": "<p>Album's id</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Collection Page of album.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/albums/:id"      }    ],    "version": "0.0.0",    "filename": "src/v1/album.js",    "groupTitle": "Albums"  },  {    "type": "get",    "url": "/albums",    "title": "Get page of albums.",    "name": "GetAlbums",    "group": "Albums",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "index",            "defaultValue": "0",            "description": "<p>index Index of pagment.</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "offset",            "defaultValue": "50",            "description": "<p>offset Size of pagment.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Collection Page of albums.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "type",            "description": "<p>Collection.</p>"          },          {            "group": "Success 200",            "type": "Integer",            "optional": false,            "field": "index",            "description": "<p>Index of Page.</p>"          },          {            "group": "Success 200",            "type": "Integer",            "optional": false,            "field": "offset",            "description": "<p>Offset.</p>"          },          {            "group": "Success 200",            "type": "Integer",            "optional": false,            "field": "total",            "description": "<p>Row count of data.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/albums"      }    ],    "version": "0.0.0",    "filename": "src/v1/album.js",    "groupTitle": "Albums"  },  {    "type": "post",    "url": "/albums",    "title": "Create new album.",    "name": "PostAlbum",    "group": "Albums",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>Album's name.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Collection of album.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/albums"      }    ],    "version": "0.0.0",    "filename": "src/v1/album.js",    "groupTitle": "Albums"  },  {    "type": "put",    "url": "/albums/:id",    "title": "Update specify album info.",    "name": "UpdateAlbum",    "group": "Albums",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": ":id",            "description": "<p>Album's id.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "name",            "description": "<p>Album's name.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "images",            "description": "<p>Album's images.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Collection of album.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/albums/:id"      }    ],    "version": "0.0.0",    "filename": "src/v1/album.js",    "groupTitle": "Albums"  },  {    "type": "delete",    "url": "/artists/:id",    "title": "Delete specify artist.",    "name": "DeleteArtist",    "group": "Artists",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>Artist's id.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "data",            "description": "<p>Result of artist delete.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/artists/:id"      }    ],    "version": "0.0.0",    "filename": "src/v1/artist.js",    "groupTitle": "Artists"  },  {    "type": "get",    "url": "/artists/:id",    "title": "Get artist matching by given id.",    "name": "GetArtist",    "group": "Artists",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": ":id",            "description": "<p>Artist's id.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Collection of artist.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/artists/:id"      }    ],    "version": "0.0.0",    "filename": "src/v1/artist.js",    "groupTitle": "Artists"  },  {    "type": "get",    "url": "/artists",    "title": "Get page of artists.",    "name": "GetArtists",    "group": "Artists",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "index",            "defaultValue": "0",            "description": "<p>index Index of pagment.</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "offset",            "defaultValue": "50",            "description": "<p>offset Size of pagment.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Page of artists.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "type",            "description": "<p>Collection.</p>"          },          {            "group": "Success 200",            "type": "Integer",            "optional": false,            "field": "index",            "description": "<p>Index of Page.</p>"          },          {            "group": "Success 200",            "type": "Integer",            "optional": false,            "field": "offset",            "description": "<p>Offset.</p>"          },          {            "group": "Success 200",            "type": "Integer",            "optional": false,            "field": "total",            "description": "<p>Row count of data.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/artists"      }    ],    "version": "0.0.0",    "filename": "src/v1/artist.js",    "groupTitle": "Artists"  },  {    "type": "post",    "url": "/artists",    "title": "Create new artist.",    "name": "PostArtist",    "group": "Artists",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>Artist's name.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Collection of artist.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/artists"      }    ],    "version": "0.0.0",    "filename": "src/v1/artist.js",    "groupTitle": "Artists"  },  {    "type": "put",    "url": "/artists/:id",    "title": "Update specify artist info.",    "name": "UpdateArtist",    "group": "Artists",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": ":id",            "description": "<p>Artist's id.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "name",            "description": "<p>Artist's name.</p>"          },          {            "group": "Parameter",            "type": "Array",            "optional": true,            "field": "albums",            "description": "<p>Array of Album.toSimple().</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Collection of artist.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/artists/:id"      }    ],    "version": "0.0.0",    "filename": "src/v1/artist.js",    "groupTitle": "Artists"  },  {    "type": "delete",    "url": "/tracks/:id",    "title": "Delete specify track.",    "name": "DeleteTrack",    "group": "Tracks",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": ":id",            "description": "<p>Track's id.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "data",            "description": "<p>Result of track delete.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/tracks/:id"      }    ],    "version": "0.0.0",    "filename": "src/v1/track.js",    "groupTitle": "Tracks"  },  {    "type": "get",    "url": "/tracks/:id",    "title": "Get track matching by given id.",    "name": "GetTrack",    "group": "Tracks",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": ":id",            "description": "<p>Track's id</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Collection of track.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/track/:id"      }    ],    "version": "0.0.0",    "filename": "src/v1/track.js",    "groupTitle": "Tracks"  },  {    "type": "get",    "url": "/tracks",    "title": "Get page of tracks.",    "name": "GetTracks",    "group": "Tracks",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "index",            "defaultValue": "0",            "description": "<p>index Index of pagment.</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "offset",            "defaultValue": "50",            "description": "<p>offset Size of pagment.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Collection Page of tracks.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "type",            "description": "<p>Collection.</p>"          },          {            "group": "Success 200",            "type": "Integer",            "optional": false,            "field": "index",            "description": "<p>Index of Page.</p>"          },          {            "group": "Success 200",            "type": "Integer",            "optional": false,            "field": "offset",            "description": "<p>Offset.</p>"          },          {            "group": "Success 200",            "type": "Integer",            "optional": false,            "field": "total",            "description": "<p>Row count of data.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/tracks"      }    ],    "version": "0.0.0",    "filename": "src/v1/track.js",    "groupTitle": "Tracks"  },  {    "type": "post",    "url": "/tracks",    "title": "Create new track.",    "name": "PostTrack",    "group": "Tracks",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>Track's name.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Collection of track.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/tracks"      }    ],    "version": "0.0.0",    "filename": "src/v1/track.js",    "groupTitle": "Tracks"  },  {    "type": "put",    "url": "/tracks/:id",    "title": "Update specify track info.",    "name": "UpdateTrack",    "group": "Tracks",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": ":id",            "description": "<p>Album's id.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "name",            "description": "<p>Track's name.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "trackNumber",            "description": "<p>Sequence number of album.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "lyric",            "description": "<p>Track's lyric.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Collection of track.</p>"          }        ]      }    },    "sampleRequest": [      {        "url": "http://localhost:3000/api/v1/tracks/:id"      }    ],    "version": "0.0.0",    "filename": "src/v1/track.js",    "groupTitle": "Tracks"  }] });
