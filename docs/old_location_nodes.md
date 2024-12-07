```js
  {
    id: 'kings_pass',
    name: "King's Pass",
    depends_on: [],
    type: 'Location',
    location: "King's Pass",
    img: new URL('@images/kings_pass.png', import.meta.url).href,
  },
  {
    id: 'dirtmouth',
    name: 'Dirtmouth',
    depends_on: ['kings_pass'],
    type: 'Location',
    location: 'Dirtmouth',
    img: new URL('@images/dirtmouth.png', import.meta.url).href,
  },
  {
    id: 'forgotten_crossroads',
    name: 'Forgotten Crossroads',
    depends_on: ['dirtmouth'],
    type: 'Location',
    location: 'Forgotten Crossroads',
    img: new URL('@images/forgotten_crossroads.png', import.meta.url).href,
  },
```