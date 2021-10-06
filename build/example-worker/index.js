// This file must have worker types, but not DOM types.
// The global should be that of a dedicated worker.
const helloMessage = {
    hello: 'world',
};
// Both of these should work.
postMessage(helloMessage);
self.postMessage(helloMessage);
