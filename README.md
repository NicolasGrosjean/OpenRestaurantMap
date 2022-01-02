# OpenRestaurantMap - Deployment

### Building

After building on the *master* branch, run the following commands.

```
rm -rf static
rm -rf src/
rm ./*.ico
rm ./*.json
rm ./*.html
rm ./*.png
rm ./*.txt
mv build/* .
rm -rf build/
```

### Licence

OpenRestaurantMap is released under the [MIT License](http://www.opensource.org/licenses/MIT).

### Useful links

- [How to add ESLint and Prettier to a React TypeScript Project (2021)](https://javascript.plainenglish.io/setting-eslint-and-prettier-on-a-react-typescript-project-2021-22993565edf9)
- [Fix with Prettier 8.0.0](https://github.com/prettier/eslint-config-prettier/blob/main/CHANGELOG.md#version-800-2021-02-21)
- [Opening hours](https://github.com/opening-hours/opening_hours.js)
- [React Leaflet](https://react-leaflet.js.org/)
- [Leaflet colored markers](https://github.com/pointhi/leaflet-color-markers)
- [React Query](https://react-query.tanstack.com/overview)
- [Material UI](https://mui.com/)
- [Use geolocalisation API with React Hooks](https://github.com/NorbertB29/geolocation-api-hook/blob/master/src/hooks/useCurrentLocation.js)
- [Publish website on GitHub pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Build React projects for a custom relative webpage](https://create-react-app.dev/docs/deployment#building-for-relative-paths)
