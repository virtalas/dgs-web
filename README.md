# dgs-web

Disc Golf Stats web frontend built with ReactJS & TypeScript.

### Installation

1. Install npm packages: `$ npm install`
2. Run the project: `$ npm start`
3. The app will be running at http://localhost:3000/ (https disabled for developmet environment).

### Production

Add a .env file at the root:

```
echo REACT_APP_API_ROOT=api_root_here > .env
```

### Testing

Using GitHub Actions.

Run tests locally:

- Run all unit tests (enzyme): `$ npm test`
- Run integration tests (cypress): `$ npm start` and then `$ npm run cypress`
