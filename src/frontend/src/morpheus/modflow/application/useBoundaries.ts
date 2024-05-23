import {IError} from '../types';
import {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {IBoundary, IBoundaryType} from "../types/Boundaries.type";
import {useApi} from "../incoming";
import useProjectCommandBus, {Commands} from "./useProjectCommandBus";
import {setBoundaries} from "../infrastructure/modelStore";
import {LineString, Point, Polygon} from "geojson";

const data: IBoundary[] = [
  {
    "id": "53c81efb-a715-4604-9cd5-44907e40a15f",
    "type": "general_head",
    "name": "GHB-East",
    "tags": [],
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          -63.57,
          -31.367
        ],
        [
          -63.57,
          -31.314
        ]
      ]
    },
    "affected_cells": {
      "type": "sparse",
      "shape": [
        40,
        75
      ],
      "data": [
        [
          74,
          0
        ],
        [
          74,
          1
        ],
        [
          74,
          2
        ],
        [
          74,
          3
        ],
        [
          74,
          4
        ],
        [
          74,
          5
        ],
        [
          74,
          6
        ],
        [
          74,
          7
        ],
        [
          74,
          8
        ],
        [
          74,
          9
        ],
        [
          74,
          10
        ],
        [
          74,
          11
        ],
        [
          74,
          12
        ],
        [
          74,
          13
        ],
        [
          74,
          14
        ],
        [
          74,
          15
        ],
        [
          74,
          16
        ],
        [
          74,
          17
        ],
        [
          74,
          18
        ],
        [
          74,
          19
        ],
        [
          74,
          20
        ],
        [
          74,
          21
        ],
        [
          74,
          22
        ],
        [
          74,
          23
        ],
        [
          74,
          24
        ],
        [
          74,
          25
        ],
        [
          74,
          26
        ],
        [
          74,
          27
        ],
        [
          74,
          28
        ],
        [
          74,
          29
        ],
        [
          74,
          30
        ],
        [
          74,
          31
        ],
        [
          74,
          32
        ],
        [
          74,
          33
        ],
        [
          74,
          34
        ],
        [
          74,
          35
        ],
        [
          74,
          36
        ],
        [
          74,
          37
        ],
        [
          74,
          38
        ],
        [
          74,
          39
        ]
      ]
    },
    "affected_layers": [
      "be98fc2b-ba21-4f12-83d1-fefe3b8d9096"
    ],
    "observations": [
      {
        "observation_id": "c0595a35-2ab9-4b6f-94b4-5e238df15587",
        "observation_name": "Gauge Laubegast",
        "geometry": {
          "type": "Point",
          "coordinates": [
            -63.57,
            -31.367
          ]
        },
        "data": [
          {
            "date_time": "2015-01-01T00:00:00",
            "stage": 455,
            "conductance": 200
          },
          {
            "date_time": "2020-12-31T00:00:00",
            "stage": 455,
            "conductance": 200
          }
        ]
      },
      {
        "observation_name": "Gauge Weixdorf",
        "observation_id": "c0595a35-2ab9-4b6f-94b4-5e238df1234327",
        "geometry": {
          "type": "Point",
          "coordinates": [
            -63.57,
            -31.367
          ]
        },
        "data": [
          {
            "date_time": "2015-01-01T00:00:00",
            "stage": 455,
            "conductance": 200
          },
          {
            "date_time": "2020-12-31T00:00:00",
            "stage": 455,
            "conductance": 200
          }
        ]
      }
    ],
    "enabled": true
  },
  {
    "id": "3cd227a0-2549-4a0f-be7b-7b2c10c3a790",
    "type": "general_head",
    "name": "GHB-West",
    "tags": [],
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          -63.687,
          -31.367
        ],
        [
          -63.687,
          -31.314
        ]
      ]
    },
    "affected_cells": {
      "type": "sparse",
      "shape": [
        40,
        75
      ],
      "data": [
        [
          0,
          0
        ],
        [
          0,
          1
        ],
        [
          0,
          2
        ],
        [
          0,
          3
        ],
        [
          0,
          4
        ],
        [
          0,
          5
        ],
        [
          0,
          6
        ],
        [
          0,
          7
        ],
        [
          0,
          8
        ],
        [
          0,
          9
        ],
        [
          0,
          10
        ],
        [
          0,
          11
        ],
        [
          0,
          12
        ],
        [
          0,
          13
        ],
        [
          0,
          14
        ],
        [
          0,
          15
        ],
        [
          0,
          16
        ],
        [
          0,
          17
        ],
        [
          0,
          18
        ],
        [
          0,
          19
        ],
        [
          0,
          20
        ],
        [
          0,
          21
        ],
        [
          0,
          22
        ],
        [
          0,
          23
        ],
        [
          0,
          24
        ],
        [
          0,
          25
        ],
        [
          0,
          26
        ],
        [
          0,
          27
        ],
        [
          0,
          28
        ],
        [
          0,
          29
        ],
        [
          0,
          30
        ],
        [
          0,
          31
        ],
        [
          0,
          32
        ],
        [
          0,
          33
        ],
        [
          0,
          34
        ],
        [
          0,
          35
        ],
        [
          0,
          36
        ],
        [
          0,
          37
        ],
        [
          0,
          38
        ],
        [
          0,
          39
        ]
      ]
    },
    "affected_layers": [
      "be98fc2b-ba21-4f12-83d1-fefe3b8d9096"
    ],
    "observations": [
      {
        "observation_id": "2451554a-16b5-4022-8b86-f1da10bc9a90",
        "observation_name": "Gauge Laubegast 2",
        "geometry": {
          "type": "Point",
          "coordinates": [
            -63.687,
            -31.367
          ]
        },
        "data": [
          {
            "date_time": "2015-01-01T00:00:00",
            "stage": 460,
            "conductance": 200
          },
          {
            "date_time": "2020-12-31T00:00:00",
            "stage": 460,
            "conductance": 200
          }
        ]
      }
    ],
    "enabled": true
  },
  {
    "id": "67adf6bf-7e19-494a-b58a-7e4ded644072",
    "type": "well",
    "name": "Irrigation Well GHB-East Irrigation GHB-East",
    "tags": [],
    "geometry": {
      "type": "Point",
      "coordinates": [
        -63.671125,
        -31.325009
      ]
    },
    "affected_cells": {
      "type": "sparse",
      "shape": [
        40,
        75
      ],
      "data": [
        [
          10,
          8
        ]
      ]
    },
    "affected_layers": [
      "be98fc2b-ba21-4f12-83d1-fefe3b8d9096"
    ],
    "observations": [
      {
        "observation_id": "5c0e6e4d-1e4f-47f6-988e-d9eaea2f63b1",
        "observation_name": "Irrigation Laubegast",
        "geometry": {
          "type": "Point",
          "coordinates": [
            -63.671125,
            -31.325009
          ]
        },
        "data": [
          {
            "date_time": "2015-01-01T00:00:00",
            "pumping_rate": -5000
          },
          {
            "date_time": "2020-12-31T00:00:00",
            "pumping_rate": -5000
          }
        ]
      }
    ],
    "enabled": true
  },
  {
    "id": "3a420a7e-56d1-4c89-8922-e33bff8f1cf2",
    "type": "well",
    "name": "Irrigation Well 2",
    "tags": [],
    "geometry": {
      "type": "Point",
      "coordinates": [
        -63.659952,
        -31.330144
      ]
    },
    "affected_cells": {
      "type": "sparse",
      "shape": [
        40,
        75
      ],
      "data": [
        [
          17,
          12
        ]
      ]
    },
    "affected_layers": [
      "be98fc2b-ba21-4f12-83d1-fefe3b8d9096"
    ],
    "observations": [
      {
        "observation_id": "709cf656-e386-4eb9-81d8-cabbbe9d1fe6",
        "observation_name": "Irrigation Laubegast",
        "geometry": {
          "type": "Point",
          "coordinates": [
            -63.659952,
            -31.330144
          ]
        },
        "data": [
          {
            "date_time": "2015-01-01T00:00:00",
            "pumping_rate": -5000
          },
          {
            "date_time": "2020-12-31T00:00:00",
            "pumping_rate": -5000
          }
        ]
      }
    ],
    "enabled": true
  },
  {
    "id": "a55f1bfa-8d79-404e-b3fa-52af7e190a05",
    "type": "well",
    "name": "Irrigation Well 3",
    "tags": [],
    "geometry": {
      "type": "Point",
      "coordinates": [
        -63.674691,
        -31.342506
      ]
    },
    "affected_cells": {
      "type": "sparse",
      "shape": [
        40,
        75
      ],
      "data": [
        [
          8,
          21
        ]
      ]
    },
    "affected_layers": [
      "be98fc2b-ba21-4f12-83d1-fefe3b8d9096"
    ],
    "observations": [
      {
        "observation_id": "8d4ee687-ecde-4fd3-88bc-5d991e33fc67",
        "observation_name": "Irrigation Laubegast",
        "geometry": {
          "type": "Point",
          "coordinates": [
            -63.674691,
            -31.342506
          ]
        },
        "data": [
          {
            "date_time": "2015-01-01T00:00:00",
            "pumping_rate": -5000
          },
          {
            "date_time": "2020-12-31T00:00:00",
            "pumping_rate": -5000
          }
        ]
      }
    ],
    "enabled": true
  },
  {
    "id": "398b190f-0bdb-4d60-bbf8-dbf6c6546779",
    "type": "well",
    "name": "Irrigation Well 4",
    "tags": [],
    "geometry": {
      "type": "Point",
      "coordinates": [
        -63.637379,
        -31.359613
      ]
    },
    "affected_cells": {
      "type": "sparse",
      "shape": [
        40,
        75
      ],
      "data": [
        [
          31,
          34
        ]
      ]
    },
    "affected_layers": [
      "be98fc2b-ba21-4f12-83d1-fefe3b8d9096"
    ],
    "observations": [
      {
        "observation_id": "51ea7383-a3d9-480e-b9a6-46e8c545dd6d",
        "observation_name": "Irrigation Laubegast",
        "geometry": {
          "type": "Point",
          "coordinates": [
            -63.637379,
            -31.359613
          ]
        },
        "data": [
          {
            "date_time": "2015-01-01T00:00:00",
            "pumping_rate": -5000
          },
          {
            "date_time": "2020-12-31T00:00:00",
            "pumping_rate": -5000
          }
        ]
      }
    ],
    "enabled": true
  },
  {
    "id": "05b1f782-d782-48ee-bb07-7161e6ca4bf9",
    "type": "well",
    "name": "Irrigation Well 5",
    "tags": [],
    "geometry": {
      "type": "Point",
      "coordinates": [
        -63.582069,
        -31.324063
      ]
    },
    "affected_cells": {
      "type": "sparse",
      "shape": [
        40,
        75
      ],
      "data": [
        [
          66,
          7
        ]
      ]
    },
    "affected_layers": [
      "be98fc2b-ba21-4f12-83d1-fefe3b8d9096"
    ],
    "observations": [
      {
        "observation_id": "9371a0ff-2c49-4588-b3db-f22f1326905a",
        "observation_name": "Irrigation Laubegast",
        "geometry": {
          "type": "Point",
          "coordinates": [
            -63.582069,
            -31.324063
          ]
        },
        "data": [
          {
            "date_time": "2015-01-01T00:00:00",
            "pumping_rate": -5000
          },
          {
            "date_time": "2020-12-31T00:00:00",
            "pumping_rate": -5000
          }
        ]
      }
    ],
    "enabled": true
  },
  {
    "id": "3e1c8f0e-8afb-4447-8554-ba04f7d47234",
    "type": "well",
    "name": "Public Well 1",
    "tags": [],
    "geometry": {
      "type": "Point",
      "coordinates": [
        -63.625402,
        -31.329897
      ]
    },
    "affected_cells": {
      "type": "sparse",
      "shape": [
        40,
        75
      ],
      "data": [
        [
          39,
          12
        ]
      ]
    },
    "affected_layers": [
      "be98fc2b-ba21-4f12-83d1-fefe3b8d9096"
    ],
    "observations": [
      {
        "observation_id": "165d0542-7de6-4b1f-bd9e-239911cc8b87",
        "observation_name": "Public Well 1",
        "geometry": {
          "type": "Point",
          "coordinates": [
            -63.625402,
            -31.329897
          ]
        },
        "data": [
          {
            "date_time": "2015-01-01T00:00:00",
            "pumping_rate": -8000
          },
          {
            "date_time": "2020-12-31T00:00:00",
            "pumping_rate": -8000
          }
        ]
      }
    ],
    "enabled": true
  },
  {
    "id": "f13a26b5-920f-4636-917c-34790d297581",
    "type": "well",
    "name": "Public Well 2",
    "tags": [],
    "geometry": {
      "type": "Point",
      "coordinates": [
        -63.623027,
        -31.331184
      ]
    },
    "affected_cells": {
      "type": "sparse",
      "shape": [
        40,
        75
      ],
      "data": [
        [
          40,
          13
        ]
      ]
    },
    "affected_layers": [
      "be98fc2b-ba21-4f12-83d1-fefe3b8d9096"
    ],
    "observations": [
      {
        "observation_id": "b36a67a6-c374-485b-a872-6ec7e2ba163e",
        "observation_name": "Public Well 2",
        "geometry": {
          "type": "Point",
          "coordinates": [
            -63.623027,
            -31.331184
          ]
        },
        "data": [
          {
            "date_time": "2015-01-01T00:00:00",
            "pumping_rate": -8000
          },
          {
            "date_time": "2020-12-31T00:00:00",
            "pumping_rate": -8000
          }
        ]
      }
    ],
    "enabled": true
  },
  {
    "id": "4225d146-c1bc-4070-ab7a-b94f952d9121",
    "type": "recharge",
    "name": "Recharge",
    "tags": [],
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            -63.687336,
            -31.313615
          ],
          [
            -63.687336,
            -31.367449
          ],
          [
            -63.56926,
            -31.367449
          ],
          [
            -63.56926,
            -31.313615
          ],
          [
            -63.687336,
            -31.313615
          ]
        ]
      ]
    },
    "affected_cells": {
      "type": "sparse_inverse",
      "shape": [
        40,
        75
      ],
      "data": []
    },
    "affected_layers": [
      "09d3b6ea-5d97-4661-a78d-532cfa00eadc"
    ],
    "observations": [
      {
        "observation_id": "0d3a13b0-3c47-439b-8346-c6359d87f8fd",
        "observation_name": "Recharge",
        "geometry": {
          "type": "Point",
          "coordinates": [
            -63.628298,
            -31.340532
          ]
        },
        "data": [
          {
            "date_time": "2015-01-01T00:00:00",
            "recharge_rate": 0.00033
          },
          {
            "date_time": "2020-12-31T00:00:00",
            "recharge_rate": 0.00033
          }
        ]
      }
    ],
    "enabled": true
  },
  {
    "id": "7fe5f2ef-7d0f-499d-b168-afab9a0027ce",
    "type": "river",
    "name": "Rio Primero",
    "tags": [],
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          -63.676586151123,
          -31.367415770489
        ],
        [
          -63.673968315125,
          -31.366206539217
        ],
        [
          -63.67280960083,
          -31.364704139298
        ],
        [
          -63.67169380188,
          -31.363788030001
        ],
        [
          -63.670706748962,
          -31.363641451685
        ],
        [
          -63.669762611389,
          -31.364154474791
        ],
        [
          -63.668003082275,
          -31.365070580517
        ],
        [
          -63.666973114014,
          -31.364814071814
        ],
        [
          -63.666501045227,
          -31.363788030001
        ],
        [
          -63.664870262146,
          -31.362248946282
        ],
        [
          -63.662981987,
          -31.360783128836
        ],
        [
          -63.661994934082,
          -31.35942722735
        ],
        [
          -63.66156578064,
          -31.357741484721
        ],
        [
          -63.661437034607,
          -31.355835826222
        ],
        [
          -63.66014957428,
          -31.353123861001
        ],
        [
          -63.658862113953,
          -31.352500830916
        ],
        [
          -63.656415939331,
          -31.352061042488
        ],
        [
          -63.654913902283,
          -31.352354235002
        ],
        [
          -63.653645516024,
          -31.351764794584
        ],
        [
          -63.651242256747,
          -31.349749064959
        ],
        [
          -63.645467759343,
          -31.347546983301
        ],
        [
          -63.64392280695,
          -31.346594055584
        ],
        [
          -63.640060425969,
          -31.342415720095
        ],
        [
          -63.639030457707,
          -31.341096207173
        ],
        [
          -63.637914658757,
          -31.340949593483
        ],
        [
          -63.634138108464,
          -31.341389433866
        ],
        [
          -63.629417420598,
          -31.341242820633
        ],
        [
          -63.627786637517,
          -31.341829272192
        ],
        [
          -63.626585007878,
          -31.343295385094
        ],
        [
          -63.626070023747,
          -31.345347904772
        ],
        [
          -63.625984193059,
          -31.346374147817
        ],
        [
          -63.624610902043,
          -31.346887265141
        ],
        [
          -63.622636796208,
          -31.347327077762
        ],
        [
          -63.621606827946,
          -31.34813339556
        ],
        [
          -63.621349335881,
          -31.349746010418
        ],
        [
          -63.621349335881,
          -31.351285298808
        ],
        [
          -63.620491028996,
          -31.35238477509
        ],
        [
          -63.619375230046,
          -31.352677966594
        ],
        [
          -63.618345261784,
          -31.352824562004
        ],
        [
          -63.616971970769,
          -31.352604668804
        ],
        [
          -63.616285325261,
          -31.351798389339
        ],
        [
          -63.614997864934,
          -31.351358597627
        ],
        [
          -63.612852097722,
          -31.351798389339
        ],
        [
          -63.611049653264,
          -31.351065402009
        ],
        [
          -63.60898971674,
          -31.349086307681
        ],
        [
          -63.607530595036,
          -31.347473681512
        ],
        [
          -63.605556489201,
          -31.346154239536
        ],
        [
          -63.604955674382,
          -31.344028432977
        ],
        [
          -63.60504150507,
          -31.342928859011
        ],
        [
          -63.607530595036,
          -31.341096207173
        ],
        [
          -63.60959053156,
          -31.339190211392
        ],
        [
          -63.608732224675,
          -31.337650725074
        ],
        [
          -63.60787391779,
          -31.336037902868
        ],
        [
          -63.606586457463,
          -31.334864923902
        ],
        [
          -63.60452652094,
          -31.334718300503
        ],
        [
          -63.602552415105,
          -31.335451415212
        ],
        [
          -63.601608277531,
          -31.336917627498
        ],
        [
          -63.600063325139,
          -31.338237199022
        ],
        [
          -63.598260880681,
          -31.338383816938
        ],
        [
          -63.59602928278,
          -31.338677052084
        ],
        [
          -63.595342637273,
          -31.337724034517
        ],
        [
          -63.595771790715,
          -31.336184524211
        ],
        [
          -63.595771790715,
          -31.334864923902
        ],
        [
          -63.595085145207,
          -31.333691930314
        ],
        [
          -63.594226838322,
          -31.332738862259
        ],
        [
          -63.592767716618,
          -31.332518922106
        ],
        [
          -63.591480256291,
          -31.333471992389
        ],
        [
          -63.59096527216,
          -31.334938235515
        ],
        [
          -63.590793610783,
          -31.336477766211
        ],
        [
          -63.590192795964,
          -31.337870653233
        ],
        [
          -63.589162827702,
          -31.338237199022
        ],
        [
          -63.587446213933,
          -31.338603743383
        ],
        [
          -63.585729600163,
          -31.338310508009
        ],
        [
          -63.584098817082,
          -31.337504106016
        ],
        [
          -63.58255386469,
          -31.337504106016
        ],
        [
          -63.580493928166,
          -31.337577415573
        ],
        [
          -63.578691483708,
          -31.336257834797
        ],
        [
          -63.576998711214,
          -31.334611387837
        ],
        [
          -63.575305938721,
          -31.33296491207
        ],
        [
          -63.572559356689,
          -31.332231777991
        ],
        [
          -63.569641113281,
          -31.331205380684
        ]
      ]
    },
    "affected_cells": {
      "type": "sparse",
      "shape": [
        40,
        75
      ],
      "data": [
        [
          6,
          39
        ],
        [
          7,
          39
        ],
        [
          8,
          38
        ],
        [
          8,
          39
        ],
        [
          9,
          37
        ],
        [
          9,
          38
        ],
        [
          10,
          37
        ],
        [
          11,
          37
        ],
        [
          11,
          38
        ],
        [
          12,
          37
        ],
        [
          12,
          38
        ],
        [
          13,
          36
        ],
        [
          13,
          37
        ],
        [
          14,
          35
        ],
        [
          14,
          36
        ],
        [
          15,
          34
        ],
        [
          15,
          35
        ],
        [
          16,
          30
        ],
        [
          16,
          31
        ],
        [
          16,
          32
        ],
        [
          16,
          33
        ],
        [
          16,
          34
        ],
        [
          17,
          28
        ],
        [
          17,
          29
        ],
        [
          17,
          30
        ],
        [
          18,
          28
        ],
        [
          19,
          28
        ],
        [
          20,
          28
        ],
        [
          21,
          27
        ],
        [
          21,
          28
        ],
        [
          22,
          26
        ],
        [
          22,
          27
        ],
        [
          23,
          26
        ],
        [
          24,
          25
        ],
        [
          24,
          26
        ],
        [
          25,
          25
        ],
        [
          26,
          24
        ],
        [
          26,
          25
        ],
        [
          27,
          23
        ],
        [
          27,
          24
        ],
        [
          28,
          22
        ],
        [
          28,
          23
        ],
        [
          29,
          21
        ],
        [
          29,
          22
        ],
        [
          30,
          20
        ],
        [
          30,
          21
        ],
        [
          31,
          20
        ],
        [
          32,
          20
        ],
        [
          33,
          20
        ],
        [
          34,
          20
        ],
        [
          35,
          20
        ],
        [
          36,
          20
        ],
        [
          37,
          20
        ],
        [
          37,
          21
        ],
        [
          38,
          21
        ],
        [
          38,
          22
        ],
        [
          38,
          23
        ],
        [
          38,
          24
        ],
        [
          39,
          24
        ],
        [
          40,
          24
        ],
        [
          40,
          25
        ],
        [
          41,
          25
        ],
        [
          41,
          26
        ],
        [
          41,
          27
        ],
        [
          41,
          28
        ],
        [
          42,
          28
        ],
        [
          43,
          28
        ],
        [
          43,
          29
        ],
        [
          44,
          28
        ],
        [
          44,
          29
        ],
        [
          45,
          28
        ],
        [
          46,
          28
        ],
        [
          47,
          28
        ],
        [
          48,
          27
        ],
        [
          48,
          28
        ],
        [
          49,
          17
        ],
        [
          49,
          18
        ],
        [
          49,
          19
        ],
        [
          49,
          26
        ],
        [
          49,
          27
        ],
        [
          50,
          16
        ],
        [
          50,
          17
        ],
        [
          50,
          19
        ],
        [
          50,
          20
        ],
        [
          50,
          24
        ],
        [
          50,
          25
        ],
        [
          50,
          26
        ],
        [
          51,
          15
        ],
        [
          51,
          16
        ],
        [
          51,
          20
        ],
        [
          51,
          21
        ],
        [
          51,
          24
        ],
        [
          52,
          15
        ],
        [
          52,
          21
        ],
        [
          52,
          22
        ],
        [
          52,
          23
        ],
        [
          52,
          24
        ],
        [
          53,
          15
        ],
        [
          53,
          16
        ],
        [
          54,
          16
        ],
        [
          54,
          17
        ],
        [
          55,
          17
        ],
        [
          55,
          18
        ],
        [
          56,
          18
        ],
        [
          57,
          18
        ],
        [
          58,
          14
        ],
        [
          58,
          15
        ],
        [
          58,
          16
        ],
        [
          58,
          17
        ],
        [
          58,
          18
        ],
        [
          59,
          14
        ],
        [
          60,
          14
        ],
        [
          60,
          15
        ],
        [
          61,
          15
        ],
        [
          61,
          16
        ],
        [
          61,
          17
        ],
        [
          61,
          18
        ],
        [
          62,
          18
        ],
        [
          63,
          18
        ],
        [
          64,
          18
        ],
        [
          65,
          17
        ],
        [
          65,
          18
        ],
        [
          66,
          17
        ],
        [
          67,
          17
        ],
        [
          68,
          16
        ],
        [
          68,
          17
        ],
        [
          69,
          15
        ],
        [
          69,
          16
        ],
        [
          70,
          14
        ],
        [
          70,
          15
        ],
        [
          71,
          14
        ],
        [
          72,
          13
        ],
        [
          72,
          14
        ],
        [
          73,
          13
        ],
        [
          74,
          13
        ]
      ]
    },
    "affected_layers": [
      "09d3b6ea-5d97-4661-a78d-532cfa00eadc"
    ],
    "observations": [
      {
        "observation_id": "a6d04131-5e3b-48eb-b85b-ed02577cb48d",
        "observation_name": "Gauge Laubegast 1",
        "geometry": {
          "type": "Point",
          "coordinates": [
            -63.687,
            -31.367
          ]
        },
        "data": [
          {
            "date_time": "2015-01-01T00:00:00",
            "river_stage": 455,
            "riverbed_bottom": 453,
            "conductance": 200
          },
          {
            "date_time": "2020-12-31T00:00:00",
            "river_stage": 455,
            "riverbed_bottom": 453,
            "conductance": 200
          }
        ]
      }
    ],
    "enabled": true
  }
]

interface IUseBoundaries {
  boundaries: IBoundary[];
  onAddBoundary: (boundary_type: IBoundaryType, geometry: Point | Polygon | LineString) => void;
  onRemoveBoundary: (boundaryId: string) => void;
  loading: boolean;
  error: IError | null;
}

type IGetBoundariesResponse = IBoundary[];

const useBoundaries = (projectId: string): IUseBoundaries => {

  const {model} = useSelector((state: IRootState) => state.project.model);
  const dispatch = useDispatch();

  const isMounted = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const {httpGet} = useApi();
  const {sendCommand} = useProjectCommandBus();

  const fetchBoundaries = async () => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);
    setError(null);
    const result = await httpGet<IGetBoundariesResponse>(`/projects/${projectId}/model/boundaries`);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (result.ok) {
      dispatch(setBoundaries(result.val));
    }

    if (result.err) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }
  };

  useEffect(() => {
    if (!projectId) {
      return;
    }

    fetchBoundaries();

    return (): void => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, [projectId]);

  const onAddBoundary = async (boundary_type: IBoundaryType, geometry: Point | Polygon | LineString) => {
    if (!model || !projectId) {
      return;
    }


    setLoading(true);
    setError(null);


    const addBoundaryResult = await sendCommand<Commands.IAddModelBoundaryCommand>({
      command_name: 'add_model_boundary_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_type: boundary_type,
        boundary_geometry: geometry,
      }
    });

    setLoading(false);

    if (addBoundaryResult.err) {
      setError({
        message: addBoundaryResult.val.message,
        code: addBoundaryResult.val.code,
      });
    }

    await fetchBoundaries();
  }

  const onRemoveBoundary = async (boundaryId: string) => {
    if (!model || !projectId) {
      return;
    }

    setLoading(true);
    setError(null);

    const removeBoundaryResult = await sendCommand<Commands.IRemoveModelBoundaryCommand>({
      command_name: 'remove_model_boundary_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_id: boundaryId,
      }
    });

    setLoading(false);

    if (removeBoundaryResult.err) {
      setError({
        message: removeBoundaryResult.val.message,
        code: removeBoundaryResult.val.code,
      });
    }

    await fetchBoundaries();
  }

  return {
    boundaries: model?.boundaries || [],
    onAddBoundary,
    onRemoveBoundary,
    loading,
    error,
  };
};

export default useBoundaries;
export type {IUseBoundaries};
