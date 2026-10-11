# netprops-viewer

An easy way to view the netprops from any game that sourcemod can dump a netprops.xml file for.

There are 3 games that already are added: L4D2, TF2 and CSGO (not CS2), but you can use your own netprops.xml file as well.

Current demo/live site is: https://jackz.me/netprops, this should have up to date l4d2 data, and some other games.

## Running

Only supports NodeJS 16 or less due to use of Vue 2.

1. `yarn` / `npm i`
2. `yarn serve` / `npm run serve`

### Dumping netprops

For any sm server to dump netprops simply run
`sm_dump_netprops_xml netprops.xml` 

It will be found in the inner game folder (ex: `Left 4 Dead2/left4dead2/netprops.xml`). The file can then be uploaded under the custom page (https://jackz.me/netprops/custom), or on your own instance put in the public/data/ folder and code to be updated to point to it.

## License

[MIT](./LICENSE)
