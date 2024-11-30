import axios from 'axios';

describe('User API - Integration Tests', () => {
  const baseURL = 'http://localhost:5000'; // Replace with your actual server URL

  it('GET /users - should return an array of users with detailed response body', async () => {
    const response = await axios.get(`${baseURL}/users`);
    
    // Check status code
    expect(response.status).toBe(200);

    // Check response structure
    const { statusCode, message, data } = response.data;
    
    expect(statusCode).toBe(200);
    expect(message).toBe('Users retrieved successfully');
    expect(Array.isArray(data)).toBe(true);

    // Check the structure of each user object
    data.forEach((user: any) => {
      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('instagramUserID');
      expect(user).toHaveProperty('fullName');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('categories');
    

      // Additional checks for value types or specific values if needed
      expect(typeof user._id).toBe('string');
      expect(typeof user.instagramUserID).toBe('string');
      expect(typeof user.fullName).toBe('string');
      expect(typeof user.username).toBe('string');
      expect(Array.isArray(user.categories)).toBe(true);
    });
  });


  it('POST /register - should register a new user with followings and return the user object', async () => {
    const newUser = {
      instagramUserID: 'test123',
      fullName: 'Test User',
      username: 'testuser',
      followings: [
        {
          instagramUserID: 'follower123',
          username: 'followerUser',
          categories: [],
          description: 'Test description for following',
        },
      ],
    };

    const response = await axios.post(`${baseURL}/register`, newUser);

    expect(response.status).toBe(201);
    const { statusCode, message, data } = response.data;

    expect(statusCode).toBe(201);
    expect(message).toBe('User registered successfully');
    expect(data).toHaveProperty('_id');
    expect(data.instagramUserID).toBe(newUser.instagramUserID);
    expect(data.fullName).toBe(newUser.fullName);
    expect(data.username).toBe(newUser.username);
    expect(Array.isArray(data.followings)).toBe(true);

    // Validate the structure of followings
    expect(data.followings.length).toBe(1);
    const following = data.followings[0];
    expect(following.instagramUserID).toBe('follower123');
    expect(following.username).toBe('followerUser');
    expect(following.categories).toEqual([]);
    expect(following.description).toBe('Test description for following');

    // Clean up by deleting the test user
    await axios.delete(`${baseURL}/${newUser.instagramUserID}`);
  });

  // Test for DELETE /:instagramUserID
//   it('DELETE /:instagramUserID - should delete a user and return success message', async () => {
//     // Create a user to delete
//     const userToDelete = {
//       instagramUserID: 'delete123',
//       fullName: 'Delete Me',
//       username: 'deleteme',
//       followings: [],
//     };

//     await axios.post(`${baseURL}/register`, userToDelete);
//     const response = await axios.delete(`${baseURL}/${userToDelete.instagramUserID}`);

//     expect(response.status).toBe(200);
//     expect(response.data.statusCode).toBe(200);
//     expect(response.data.message).toBe('User deleted successfully');
//   });

//   // Test for DELETE /:instagramUserID when user does not exist
//   it('DELETE /:instagramUserID - should return 404 if user not found', async () => {
//     try {
//       await axios.delete(`${baseURL}/nonexistent123`);
//     } catch (error: any) {
//       expect(error.response.status).toBe(404);
//       expect(error.response.data.message).toBe('User not found');
//     }
//   });
});