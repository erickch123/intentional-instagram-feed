**Summary:**
The provided code snippet defines a Next.js page that fetches a user's followers from Instagram using a server-side function `getServerSideProps`. It then displays the list of followers on the page.

### Hint:
To display the list of followers on the page, ensure that the `followers` object passed to the `FollowersPage` component contains the expected structure. Check if the `followers` object has a `data` property which is an array of objects with `id` and `username` properties. Make sure to handle cases where `followers.data` might be `undefined` or empty to avoid runtime errors.