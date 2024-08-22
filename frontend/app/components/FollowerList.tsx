import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userId } = context.params!;
  const res = await fetch(`https://api.instagram.com/v1/users/${userId}/followers?access_token=YOUR_ACCESS_TOKEN`);
  const followers = await res.json();

  return {
    props: {
      followers,
    },
  };
};

interface FollowersPageProps {
  followers: {
    data: { id: string; username: string }[];
  };
}

export default function FollowersPage({ followers }: FollowersPageProps) {
  return (
    <div>
      <h1>Followers</h1>
      <ul>
        {followers.data.map((follower) => (
          <li key={follower.id}>{follower.username}</li>
        ))}
      </ul>
    </div>
  );
}

