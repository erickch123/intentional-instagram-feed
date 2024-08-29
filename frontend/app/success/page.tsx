import { NextPage } from 'next';

const SuccessPage: NextPage = () => {
  const accessToken = typeof window !== 'undefined' && window.sessionStorage.getItem('accessToken');
  const userId = typeof window !== 'undefined' && window.sessionStorage.getItem('userId');

  return (
    <div>
      <h1>Authentication Successful</h1>
      <p>Your access token: {accessToken}</p>
      <p>Your user ID: {userId}</p>
    </div>
  );
};

export default SuccessPage;