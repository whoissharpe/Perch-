# iPhone preview

`frame.html` wraps the web build of the app in an iPhone shell (390 × 844) so
the interface can be walked through at real device size.

```bash
npm run mobile:web        # build the web export
cp apps/mobile/preview/frame.html apps/mobile/dist-web/
# then serve apps/mobile/dist-web and open /frame.html
```

The web build uses MapLibre, because react-native-maps has no web
implementation. On a device the map is Apple/Google Maps with the same pine
styling — see `src/components/MapCanvas.tsx` next to its `.web.tsx` sibling.
