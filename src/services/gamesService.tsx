import axios from 'axios'

import { API_ROOT } from '../apiConfig'

const mockGame: Game = {
  id: "123sdfsdf",
  course: {
    id: "fds3ury83ofh",
    name: "Puolarmaari",
    city: 'Helsinki',
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'},
      { id: 'fdfsdg', active: false, name: '2019 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'}
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
  comment: '',
  contestName: null,
}

const mockGames: Game[] = [{
  id: "123sdfsdf",
  course: {
    id: "fds3ury83ofh",
    name: "Puolarmaari",
    city: 'Helsinki',
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'},
      { id: 'fdfsdg', active: false, name: '2019 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'}
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
      strokes: [3, 3, 3, 2, 3, 3, 0, 0, 3, 2, 3, 3, 1, 3, 3, 3, 3, 2],
      obs: [0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
      strokes: [3, 3, 4, 2, 3, 3, 3, 3, 3, 2, 3, 6, 3, 3, 2, 3, 3, 2],
      obs: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 58,
      toPar: -2
    }
  ],
  temperature: 1,
  weatherConditions: ["snow"],
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
    city: 'Helsinki',
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'},
      { id: 'fdfsdg', active: false, name: '2019 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'}
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
      strokes: [3, 3, 3, 2, 3, 0, 0, 0, 3, 2, 3, 3, 3, 3, 3, 3, 3, 2],
      obs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
      strokes: [3, 3, 4, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 6, 3, 3, 3, 2],
      obs: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
    city: 'Helsinki',
    name: "Tali",
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'},
      { id: 'fdfsdg', active: false, name: '2019 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'}
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
    city: 'Helsinki',
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'},
      { id: 'fdfsdg', active: false, name: '2019 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'}
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
    city: 'Helsinki',
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'},
      { id: 'fdfsdg', active: false, name: '2019 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'}
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
      city: 'Helsinki',
      layouts: [
        { id: 'fdg', active: true, name: '2020 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'},
        { id: 'fdfsdg', active: false, name: '2019 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'}
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
      city: 'Helsinki',
      layouts: [
        { id: 'fdg', active: true, name: '2020 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'},
        { id: 'fdfsdg', active: false, name: '2019 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'}
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
    city: 'Helsinki',
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'},
      { id: 'fdfsdg', active: false, name: '2019 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'}
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
    city: 'Helsinki',
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'},
      { id: 'fdfsdg', active: false, name: '2019 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'}
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
      city: 'Helsinki',
      layouts: [
        { id: 'fdg', active: true, name: '2020 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg' },
        { id: 'fdfsdg', active: false, name: '2019 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg' }
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
      city: 'Helsinki',
      layouts: [
        { id: 'fdg', active: true, name: '2020 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg' },
        { id: 'fdfsdg', active: false, name: '2019 layout', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg' }
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
  { year: 2021, months: [4, 5, 7] },
  { year: 2019, months: [6] },
  { year: 2018, months: [5] },
]

const getGames = async (year: number, month: number): Promise<Game[]> => {
  const response = await axios.get(`${API_ROOT}/games`, {
    params: {
      year: year,
      month: month,
    },
  })
  return response.data
}

const getMonthsThatHaveGames = async (): Promise<GameMonths[]> => {
  // TODO: Replace mock data with API call.
  // Note: Years and months should already be ordered (year: desc, month: asc).
  return mockMonthsThatHaveGames
}

const createGame = async (layout: Layout, players: Player[], start_date: string): Promise<{ id: string }> => {
  try {
    const response = await axios.post(`${API_ROOT}/games`, {
      layout_id: layout.id,
      start_date: start_date,
      end_date: start_date, // Initial value.
      comment: '',
      temperature: null,
      player_ids: players.map(player => player.id),
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return response.data
  } catch (e) {
    console.log(e.response.data)
    return Promise.reject()
  }
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
