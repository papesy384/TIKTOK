# Testing the “near bottom” (load more) feature

## What’s under test

The **near-bottom** behavior is implemented in `useNearBottom` and is covered by unit tests that:

1. **Mock `IntersectionObserver`** so we don’t depend on the real browser API and can trigger “intersecting” / “not intersecting” on demand.
2. **Render the hook inside a small wrapper** that mounts both the scroll root and the sentinel element, so the observer is actually created and we get a reference to its callback.
3. **Simulate observer callbacks** by calling the captured callback with `entry.isIntersecting: true | false` and assert that `onNearBottom` is called (or not) and that the observer is set up and torn down correctly.

## Tests added

| Test | What it verifies |
|------|------------------|
| observes the sentinel with root and correct options when mounted | Observer is created with the right `root`, `rootMargin: "200px"`, `threshold: 0`, and `observe()` is called. |
| calls onNearBottom when sentinel intersects | When the mock observer fires with `isIntersecting: true`, `onNearBottom` is called once. |
| does not call onNearBottom when sentinel is not intersecting | When `isIntersecting: false`, `onNearBottom` is not called. |
| does not call onNearBottom when disabled is true | When `disabled` is true, intersecting entries do not trigger the callback; when toggled to false, they do. |
| uses custom rootMargin when provided | Passing `rootMargin: "400px"` results in the observer being created with that option. |
| disconnects observer on unmount | When the wrapper unmounts, the observer’s `disconnect()` is called. |

## How AI was used to write these tests

1. **Behavior list** – From the PRD and the “near bottom” design (sentinel + Intersection Observer), the behaviors to test were listed: observer created with correct options, callback when intersecting, no callback when not intersecting, disabled flag, custom rootMargin, cleanup on unmount.

2. **API mocking** – The tests need to drive `IntersectionObserver` without a real viewport. The approach was to stub `IntersectionObserver` globally, capture the callback passed to the constructor, and later invoke it with synthetic entries (`isIntersecting: true/false`) to assert that `onNearBottom` is called (or not).

3. **Hook-in-component** – The hook needs a real DOM node for the sentinel and a root element. A small wrapper component was introduced that uses `useState` to hold the root (set via a ref callback on a div), renders the sentinel with the ref returned by the hook, and passes the root into `useNearBottom`. That way the observer is created and the same callback reference is used in the tests.

4. **Edge cases** – “Disabled” and “not intersecting” were added so the callback isn’t fired when it shouldn’t be; “disconnect on unmount” was added to ensure no leaks.

Run the tests with: `npm run test:run` (or `npm test` for watch mode).
