let followers = [{ username: "", full_name: "" }];
let followings = [{ username: "", full_name: "" }];
let dontFollowMeBack = [{ username: "", full_name: "" }];
let iDontFollowBack = [{ username: "", full_name: "" }];

followers = [];
followings = [];
dontFollowMeBack = [];
iDontFollowBack = [];

(async () => {
  try {
    console.log(`Process started! Give it a couple of seconds`);

    // const userQueryRes = await fetch(
    //   "https://www.instagram.com/web/search/topsearch/?query=erickkkk_photos"
    // );

    // console.log(userQueryRes)
    // const userQueryJson = await userQueryRes.json();

    // const userId = userQueryJson.users[0].user.pk;
    const userId= "15164114795"
    let after = null;
    let has_next = true;

    while (has_next) {
      await fetch(
        `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=${encodeURIComponent(JSON.stringify({
          id: userId,
          include_reel: true,
          fetch_mutual: true,
          first: 50,
          after: after,
        }))}`
      )
        .then((res) => res.json())
        .then((res) => {

          // console.log("trytry")
          console.log(res)

          has_next = res.data.user.edge_followed_by.page_info.has_next_page;
          after = res.data.user.edge_followed_by.page_info.end_cursor;
          followers = followers.concat(
            res.data.user.edge_followed_by.edges.map(({ node }) => ({
              username: node.username,
              full_name: node.full_name,
            }))
          );
        });
    }

    console.log({ followers });

    after = null;
    has_next = true;

    while (has_next) {
      await fetch(
        `https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=${encodeURIComponent(JSON.stringify({
          id: userId,
          include_reel: true,
          fetch_mutual: true,
          first: 50,
          after: after,
        }))}`
      )
        .then((res) => res.json())
        .then((res) => {
          console.log("line71")
          console.log(res)
          has_next = res.data.user.edge_follow.page_info.has_next_page;
          after = res.data.user.edge_follow.page_info.end_cursor;
          followings = followings.concat(
            res.data.user.edge_follow.edges.map(({ node }) => ({
              username: node.username,
              full_name: node.full_name,
            }))
          );
        });
    }

    console.log({ followings });

    dontFollowMeBack = followings.filter((following) => {
      return !followers.find(
        (follower) => follower.username === following.username
      );
    });

    console.log({ dontFollowMeBack });

    iDontFollowBack = followers.filter((follower) => {
      return !followings.find(
        (following) => following.username === follower.username
      );
    });

    console.log({ iDontFollowBack });

    console.log(
      'Process is done: Type \'copy(followers)\', \'copy(followings)\', or \'copy(dontFollowBack)\' in the console and paste it into a text editor to take a look at it'
    );
  } catch (err) {
    console.log({ err });
  }
})();