import express, { Request, Response } from 'express';
import User from '../model/User';
import axios from 'axios';

const router = express.Router();
// curl --request GET 
// 	--url 'https://instagram-scraper-api2.p.rapidapi.com/v1/following?username_or_id_or_url=erickkkk_photos&amount=50&pagination_token=HE1lCxspFwdJLAMTCl5NIRI1DhMAFhwQGgUMDUcNbzdXBAcgBy8UBAcxFTUWVQIiczdHI1QkCz4AJzsHHAQfP00DZRcBKQ8MCRERPzoVHzsQP146SjMUJQAtCQEAWgoxK0cuESNmNzZSByohB0ZTEydHNj1bBRQIFDcmNBUmJD8ALyMCI04oTVBGNRoXFzcYBS1VPh4EPEYhQSRRVxYyBiMQIBgKKx9fKUkHSjsHGS1FDxksEQBWCi5NF1ABWkURVC1eBCEQAwQ2BzcbfUhQBgcBC30GFTtbCFoI' 
// 	--header 'x-rapidapi-host: instagram-scraper-api2.p.rapidapi.com' 
// 	--header 'x-rapidapi-key: 926c5358e8mshf538cd9520e13f1p1bb254jsnbe5e9dd39f81'
    // https://rapidapi.com/social-api1-instagram/api/instagram-scraper-api2/playground/apiendpoint_8d0da7e2-4689-4cdb-8182-1bd4650849ad
    



// response is like this


// {

//     data:
//         count:50
//         items[
//             0:
//             full_name:"Lit Nomad"
//             id:"54123794"
//             is_private:false
//             is_verified:false
//             profile_pic_url:"https://scontent-fra3-2.cdninstagram.com/v/t51.2885-19/462238219_545919991450163_429763267218404115_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_ht=scontent-fra3-2.cdninstagram.com&_nc_cat=111&_nc_ohc=mg1uR7u5zygQ7kNvgFNl-Jt&_nc_gid=904c2536b1be41f6b19e0385d9eac174&edm=ANg5bX4BAAAA&ccb=7-5&oh=00_AYCqK9fTMlUJ4hmW5pUSJm21zTcpSOFcRzduqq7ojBW6-g&oe=67639BF9&_nc_sid=0055be"
//             username:"litnomadig"
//             1:
//             2:
//             3:
//            .....
//            49:   
//         ]
//     pagination_token:"asdkflmadflkseafmqweflqwemfkmqwlef"
// }


/**
 * @swagger
 * /followings/{username}:
 *   get:
 *     summary: Get followings of a user
 *     tags: [Followings]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: integer
 *         description: The number of followings to fetch
 *     responses:
 *       200:
 *         description: Followings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       instagramUserID:
 *                         type: string
 *                       fullName:
 *                         type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 */

router.get('/:username', async (req: Request, res: Response) => {
    const { username } = req.params;
    const { amount } = req.query;
    let paginationToken: string | undefined = undefined;
    let allFollowings: any[] = [];
    try {
        const url = `https://instagram-scraper-api2.p.rapidapi.com/v1/following?username_or_id_or_url=${username}&amount=${amount}${paginationToken ? `&pagination_token=${paginationToken}` : ''}`;
        const headers = {
          'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com',
          'x-rapidapi-key': '926c5358e8mshf538cd9520e13f1p1bb254jsnbe5e9dd39f81', 
        };
        let iteration = 0
        while (true){
            console.log("iteration",iteration);
            const response = await axios.get(url, { headers });

            const transformedFollowings = response.data.data.items.map((item: any)  => ({
                username: item.username,
                instagramUserID: item.id,
                fullName: item.full_name,
            }));

           
            allFollowings = allFollowings.concat(transformedFollowings);

            if (paginationToken == response.data.pagination_token) {
                console.log("paginationToken break")
                break;
            }
            // To call the next loop
            paginationToken = response.data.pagination_token;
            console.log("paginationToken",paginationToken)
            iteration+=1;
        }

        const user = await User.findOne({ username });
        if (!user) {
          return res.status(404).json({ statusCode: 404, message: 'User not found' });
        }
    
        for (const following of allFollowings) {
          const existingFollowing = user.followings.find(f => f.instagramUserID === following.instagramUserID);
          if (!existingFollowing) {
            user.followings.push(following);
          }
        }

        await user.save();
    
      
        
      
    
  
      res.status(200).json({
        statusCode: 200,
        message: 'Followings retrieved successfully',
        data: allFollowings,
        // data: allFollowings.slice(0, parseInt(amount as string)),
      });


    } catch (error) {
      console.error('Error retrieving followings:', error);
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        error,
      });
    }
  });
  
  export default router;