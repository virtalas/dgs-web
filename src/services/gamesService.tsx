import { dateFrom } from '../utils/DateUtil'

const mockGame: Game = {
  id: "123sdfsdf",
  course: {
    id: "fds3ury83ofh",
    name: "Puolarmaari",
    pars: [3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3],
    total: 60,
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout'},
      { id: 'fdfsdg', active: false, name: '2019 layout'}
    ],
    popularity: 23,
  },
  startDate: null,
  endDate: new Date(2020,7,13,9,22,0),
  scores: [
    {
      player: {
        id: "jf8pf8spö3",
        firstName: "Seppo",
        guest: false,
        admin: false,
      },
      strokes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      obs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 0,
      toPar: 0
    },
    {
      player: {
        id: "fh83p98slhs",
        firstName: "Teppo",
        guest: false,
        admin: false,
      },
      strokes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      obs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 0,
      toPar: 0
    }
  ],
  temperature: null,
  weatherConditions: [],
  conditions: [],
  highScorers: [],
  illegalScorers: [],
  comment: null,
  contestName: null,
}

const mockGames: Game[] = [{
  id: "123sdfsdf",
  course: {
    id: "fds3ury83ofh",
    name: "Puolarmaari",
    pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3],
    total: 61,
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout'},
      { id: 'fdfsdg', active: false, name: '2019 layout'}
    ],
    popularity: 23,
  },
  startDate: null,
  endDate: new Date(2020, 7, 13, 9, 22, 0),
  scores: [
    {
      player: {
        id: "jf8pf8spö3",
        firstName: "Seppo",
        guest: false,
        admin: false,
      },
      strokes: [3, 3, 3, 2, 3, 3, 0, 0, 3, 2, 3, 3, 1, 3, 3, 3, 3, 2, 3, 3],
      obs: [0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 55,
      toPar: 0
    },
    {
      player: {
        id: "fh83p98slhs",
        firstName: "Teppo",
        guest: false,
        admin: false,
      },
      strokes: [3, 3, 4, 2, 3, 3, 3, 3, 3, 2, 3, 6, 3, 3, 2, 3, 3, 2, 2, 2],
      obs: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 58,
      toPar: -2
    }
  ],
  temperature: 1,
  weatherConditions: ["snow", "rain"],
  conditions: ["LED"],
  highScorers: ["Teppo"],
  illegalScorers: ["Teppo"],
  comment: "Fun :D",
  contestName: null,
}, {
  id: "124fefs3r3gs",
  course: {
    id: "uflshf8sls",
    name: "Puolarmaari",
    pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    total: 60,
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout'},
      { id: 'fdfsdg', active: false, name: '2019 layout'}
    ],
    popularity: 23,
  },
    startDate: new Date(2020, 7, 11, 7, 22, 0),
    endDate: new Date(2020, 7, 11, 9, 22, 0),
  scores: [
    {
      player: {
        id: "fnslh3f8l3ifslf",
        firstName: "Seppomoinen",
        guest: false,
        admin: false,
      },
      strokes: [3, 3, 3, 2, 3, 0, 0, 0, 3, 2, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3],
      obs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 48,
      toPar: -3
    },
    {
      player: {
        id: "jfispo3uf9slefi",
        firstName: "Teppo",
        guest: false,
        admin: false,
      },
      strokes: [3, 3, 4, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 6, 3, 3, 3, 2, 3, 3],
      obs: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 61,
      toPar: 1
    }
  ],
  temperature: 1,
  weatherConditions: ["rain", "snow", "dark", "windy"],
  conditions: ["LED", "variant layout"],
  highScorers: ["Teppo"],
  illegalScorers: [],
  comment: "Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros. Fun :D Erittäin antoisa kierros.",
  contestName: null,
}, {
  id: "1253rffsfsesfe",
  course: {
    id: "j8fslof8sl3",
    name: "Tali",
    pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    total: 60,
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout'},
      { id: 'fdfsdg', active: false, name: '2019 layout'}
    ],
    popularity: 556,
  },
    startDate: new Date(2020, 7, 10, 23, 44, 0),
    endDate: new Date(2020, 7, 11, 1, 22, 0),
  scores: [
    {
      player: {
        id: "ja38ofus8los",
        firstName: "Seppo",
        guest: false,
        admin: false,
      },
      strokes: [3, 3, 3, 2, 3, 0, 0, 0, 3, 2, 3, 3, 3, 3, 3, 2, 3, 3],
      obs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 48,
      toPar: -3
    },
    {
      player: {
        id: "jfl38suf8sofls",
        firstName: "Teppo",
        guest: false,
        admin: false,
      },
      strokes: [3, 3, 4, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 2, 3, 3],
      obs: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 61,
      toPar: 1
    }
  ],
  temperature: null,
  weatherConditions: ["snow", "rain"],
  conditions: ["LED"],
  highScorers: ["Teppo"],
  illegalScorers: [],
  comment: "Fun :D",
  contestName: null,
}, {
  id: "1263fs9kföi39öps",
  course: {
    id: "jfs9ö3fus9ljfsi",
    name: "Shorty",
    pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    total: 60,
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout'},
      { id: 'fdfsdg', active: false, name: '2019 layout'}
    ],
    popularity: 1,
  },
  startDate: null,
    endDate: new Date(2020, 7, 9, 9, 22, 0),
  scores: [
    {
      player: {
        id: "jfiljfseo9fjls3f",
        firstName: "Seppo",
        guest: false,
        admin: false,
      },
      strokes: [3, 3, 3, 2, 3, 0, 0, 3, 3, 3, 3, 2, 3, 3],
      obs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 48,
      toPar: -3
    },
    {
      player: {
        id: "fi3sofjlls8ifjsilf",
        firstName: "Teppo",
        guest: false,
        admin: false,
      },
      strokes: [3, 3, 4, 2, 3, 3, 3, 6, 3, 3, 3, 2, 3, 3],
      obs: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 61,
      toPar: 1
    }
  ],
  temperature: 1,
  weatherConditions: ["snow"],
  conditions: ["LED"],
  highScorers: ["Teppo"],
  illegalScorers: [],
  comment: "Fun :D",
  contestName: null,
}, {
  id: "fsefsef4f127",
  course: {
    id: "flsul8lsejiflse",
    name: "Puolarmaari",
    pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    total: 60,
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout'},
      { id: 'fdfsdg', active: false, name: '2019 layout'}
    ],
    popularity: 23,
  },
  startDate: null,
    endDate: new Date(2020, 7, 8, 9, 22, 0),
  scores: [
    {
      player: {
        id: "nfsiefhjiflsji",
        firstName: "Seppo",
        guest: false,
        admin: false,
      },
      strokes: [3, 3, 3, 2, 3, 0, 0, 0, 3, 2, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3],
      obs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 48,
      toPar: -3
    },
    {
      player: {
        id: "fslf3i8o398ufslf",
        firstName: "Teppo",
        guest: false,
        admin: false,
      },
      strokes: [3, 3, 4, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 6, 3, 3, 3, 2, 3, 3],
      obs: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 61,
      toPar: 1
    }
  ],
  temperature: 1,
  weatherConditions: ["snow", "rain"],
  conditions: ["LED"],
  highScorers: ["Teppo"],
  illegalScorers: [],
  comment: "Fun :D",
  contestName: null,
  }, {
    id: "d3f3fg128",
    course: {
      id: "nfuslefh8lsje",
      name: "Kivikko",
      pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      total: 60,
      layouts: [
        { id: 'fdg', active: true, name: '2020 layout'},
        { id: 'fdfsdg', active: false, name: '2019 layout'}
      ],
      popularity: 447,
    },
    startDate: null,
    endDate: new Date(2020, 5, 13, 9, 22, 0),
    scores: [
      {
        player: {
          id: "jfisöuf9sl3fij",
          firstName: "Seppo",
          guest: false,
          admin: false,
        },
        strokes: [3, 3, 3, 2, 3, 0, 0, 0, 3, 2, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3],
        obs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total: 48,
        toPar: -3
      },
      {
        player: {
          id: "fnuslfu48ljsr",
          firstName: "Teppo",
          guest: false,
          admin: false,
        },
        strokes: [3, 3, 4, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 6, 3, 3, 3, 2, 3, 3],
        obs: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total: 61,
        toPar: 1
      }
    ],
    temperature: 1,
    weatherConditions: ["snow", "rain"],
    conditions: ["LED"],
    highScorers: ["Teppo"],
    illegalScorers: [],
    comment: "Fun :D",
    contestName: null,
  }, {
    id: "fj3ifolsu8lfu448ls",
    course: {
      id: "j9göu8rlgudlig",
      name: "Tali",
      pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      total: 60,
      layouts: [
        { id: 'fdg', active: true, name: '2020 layout'},
        { id: 'fdfsdg', active: false, name: '2019 layout'}
      ],
      popularity: 556,
    },
    startDate: null,
    endDate: new Date(2020, 4, 13, 9, 22, 0),
    scores: [
      {
        player: {
          id: "hgfsu4pu83slofj",
          firstName: "Seppo",
          guest: false,
          admin: false,
        },
        strokes: [3, 3, 3, 2, 3, 0, 0, 0, 3, 2, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3],
        obs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total: 48,
        toPar: -3
      },
      {
        player: {
          id: "jfs83oju8soög",
          firstName: "Teppo",
          guest: false,
          admin: false,
        },
        strokes: [3, 3, 4, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 6, 3, 3, 3, 2, 3, 3],
        obs: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total: 61,
        toPar: 1
      }
    ],
    temperature: null,
    weatherConditions: [],
    conditions: [],
    highScorers: [],
    illegalScorers: [],
    comment: "",
    contestName: null,
  }, {
  id: "d3f3f3g128",
  course: {
    id: "nfuslefh8lsje",
    name: "Puolarmaari",
    pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    total: 60,
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout'},
      { id: 'fdfsdg', active: false, name: '2019 layout'}
    ],
    popularity: 23,
  },
  startDate: null,
    endDate: new Date(2020, 4, 13, 9, 22, 0),
  scores: [
    {
      player: {
        id: "jfisöuf9sl3fij",
        firstName: "Seppo",
        guest: false,
        admin: false,
      },
      strokes: [3, 3, 3, 2, 3, 0, 0, 0, 3, 2, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3],
      obs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 48,
      toPar: -3
    },
    {
      player: {
        id: "fnuslfu48ljsr",
        firstName: "Teppo",
        guest: false,
        admin: false,
      },
      strokes: [3, 3, 4, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 6, 3, 3, 3, 2, 3, 3],
      obs: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 61,
      toPar: 1
    }
  ],
  temperature: 1,
  weatherConditions: ["snow", "rain"],
  conditions: ["LED"],
  highScorers: ["Teppo"],
  illegalScorers: [],
  comment: "Fun :D",
  contestName: null,
}, {
  id: "fj3ifolsu8lfu48ls",
  course: {
    id: "j9göu8rlgudlig",
    name: "Puolarmaari",
    pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    total: 60,
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout'},
      { id: 'fdfsdg', active: false, name: '2019 layout'}
    ],
    popularity: 23,
  },
  startDate: null,
    endDate: new Date(2020, 4, 13, 9, 22, 0),
  scores: [
    {
      player: {
        id: "hgfsu4pu83slofj",
        firstName: "Seppo",
        guest: false,
        admin: false,
      },
      strokes: [3, 3, 3, 2, 3, 0, 0, 0, 3, 2, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3],
      obs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 48,
      toPar: -3
    },
    {
      player: {
        id: "jfs83oju8soög",
        firstName: "Teppo",
        guest: false,
        admin: false,
      },
      strokes: [3, 3, 4, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 6, 3, 3, 3, 2, 3, 3],
      obs: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 61,
      toPar: 1
    }
  ],
  temperature: null,
  weatherConditions: [],
  conditions: [],
  highScorers: [],
  illegalScorers: [],
  comment: "",
  contestName: null,
  }, {
    id: "fj3ifolsu8lfu4gfd8ls",
    course: {
      id: "j9göu8rlgudlig",
      name: "Puolarmaari",
      pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      total: 60,
      layouts: [
        { id: 'fdg', active: true, name: '2020 layout' },
        { id: 'fdfsdg', active: false, name: '2019 layout' }
      ],
      popularity: 23,
    },
    startDate: null,
    endDate: new Date(2020, 4, 13, 9, 22, 0),
    scores: [
      {
        player: {
          id: "hgfsu4pu83slofj",
          firstName: "Seppo",
          guest: false,
          admin: false,
        },
        strokes: [3, 3, 3, 2, 3, 0, 0, 0, 3, 2, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3],
        obs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total: 48,
        toPar: -3
      },
      {
        player: {
          id: "jfs83oju8soög",
          firstName: "Teppo",
          guest: false,
          admin: false,
        },
        strokes: [3, 3, 4, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 6, 3, 3, 3, 2, 3, 3],
        obs: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total: 61,
        toPar: 1
      }
    ],
    temperature: null,
    weatherConditions: [],
    conditions: [],
    highScorers: [],
    illegalScorers: [],
    comment: "",
    contestName: null,
  }, {
    id: "fj3ifolsu8lfrt4u48ls",
    course: {
      id: "j9göu8rlgudlig",
      name: "Puolarmaari",
      pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      total: 60,
      layouts: [
        { id: 'fdg', active: true, name: '2020 layout' },
        { id: 'fdfsdg', active: false, name: '2019 layout' }
      ],
      popularity: 23,
    },
    startDate: null,
    endDate: new Date(2020, 4, 13, 9, 22, 0),
    scores: [
      {
        player: {
          id: "hgfsu4pu83slofj",
          firstName: "Seppo",
          guest: false,
          admin: false,
        },
        strokes: [3, 3, 3, 2, 3, 0, 0, 0, 3, 2, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3],
        obs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total: 48,
        toPar: -3
      },
      {
        player: {
          id: "jfs83oju8soög",
          firstName: "Teppo",
          guest: false,
          admin: false,
        },
        strokes: [3, 3, 4, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 6, 3, 3, 3, 2, 3, 3],
        obs: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total: 61,
        toPar: 1
      }
    ],
    temperature: null,
    weatherConditions: [],
    conditions: [],
    highScorers: [],
    illegalScorers: [],
    comment: "",
    contestName: null,
  }]

// Matches mock games above.
const mockMonthsThatHaveGames: GameMonths[] = [ // 0=January
  { year: 2020, months: [4, 5, 7] },
  { year: 2019, months: [6] },
  { year: 2018, months: [5] },
]

const getGames = async (year: number, month: number): Promise<Game[]> => {
  // TODO: Replace mock data with API call.
  return mockGames.filter(game => game.endDate.getMonth() === month
      && game.endDate.getFullYear() === year)
}

const getMonthsThatHaveGames = async (): Promise<GameMonths[]> => {
  // TODO: Replace mock data with API call.
  // Note: Years and months should already be ordered (year: desc, month: asc).
  return mockMonthsThatHaveGames
}

const createGame = async (course: Course, layout: Layout, players: Player[]): Promise<Game> => {
  // TODO: Replace mock data with API call.
  // Note: If the layout is not active, the active layout should be updated to be the chosen layout.
  return mockGame
}

const getGame = async (id: string): Promise<Game> => {
  // TODO: Replace mock data with API call.
  return mockGame
}

const updateGame = async (game: Game): Promise<Game> => {
  // TODO: Replace mock data with API call.
  return mockGame
}

const getAvailableWeatherConditions = async (): Promise<Condition[]> => {
  return ['rain', 'wet (no rain)', 'windy', 'dark', 'snow']
}

const getAvailableConditions = async (): Promise<Condition[]> => {
  return ['LED', 'variant layout', 'doubles']
}

export default {
  getGames,
  getMonthsThatHaveGames,
  createGame,
  getGame,
  updateGame,
  getAvailableWeatherConditions,
  getAvailableConditions,
}
