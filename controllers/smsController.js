const School = require('../model/School');
const User = require('../model/User');
const axios = require('axios');

const sendSms = async (req, res) => {
  if(
        !req?.body?.data
    )

  return res.status(400).json({'message' : 'All data is required!'});
  const school_details = await User.findOne( {email: req.email}).exec();
  if(!school_details)
      return res.status(400).json( {"message": "school_not found"});

  const school = await School.findOne( {_id: school_details.school_id}).exec();

  if(req.body.data.length >= school.messages.balance)
  return res.status(400).json({"message": "Not enough messages"});

  school.messages.balance -= req.body.data.length;
  school.messages.totalSent += req.body.data.length;
  await school.save();

  req.body.data.map( (messageBody, index) => {

      if(!messageBody.message || !messageBody.number)
      return;

      sendSmsToParent(messageBody.number, messageBody.message);

  });

  res.status(200).json({"message": "messages sent succesfully"});
}


function sendSmsToParent(phone_number, message){
    const postData = 
    {
        "data": [
          {
            "message_bag": {
              "numbers": phone_number,
              "message": message,
              "sender": "MT_OLIVES"
            }
          }
        ]
      }
    axios.post('https://ujumbesms.co.ke/api/messaging', JSON.stringify(postData), {
        headers: {
            'email': 'elohimsms@abzinnovative.com',
            'X-Authorization': 'YzgyNjdmZTZjOWQxODdjNGQ3M2Y3NDJiZjg3YmVj',
            'Content-Type': 'application/json',
            'Cookie': 'XSRF-TOKEN=eyJpdiI6Ik5uQVk5bGp3SE43MllBZGpXdGJPQ3c9PSIsInZhbHVlIjoiXC9QSDZcL2xJVFlxTjg4cXhkSVBEaGQ5ZDdiSkRGY3hcL25maUpnckNPVXY3Qyt4XC92elp0NEhuTmJ1eEFoRVpSYk1lMnp5TUJER0JldyswV1lYSGE5SWV3PT0iLCJtYWMiOiJhMjkwYTYyMTVhMzNmZWI1N2I5MjQ2ZDgxYmZlN2Y0OWEyMTJlNzY5MjJjMjkwYjY0OGI3NjgzNWJmODlkYTdkIn0%3D; ujumbe_session=eyJpdiI6IlgzelMwMHZzcGJ3ZXlxZXMwbldaMUE9PSIsInZhbHVlIjoiK29nRk1LNUxFZ09DWks5RndzQU9IV2hCV25peEdoMTRSZjh2SEJzSkNseEZqODh2eTlFbWUwU2JZQjBJa1U1NisycWo5c0NZUFhUd1ZRTmU1Yys1OXc9PSIsIm1hYyI6IjkzZGIwMzAyNDY2M2NhNzRjMjI2OWJlMjVjZTQxNDUxYTE5NzM3MmZmOTZiMmI4MzZhNDkzOTQ5OWE5ZDcyZGUifQ%3D%3D'
        }
    }).then((response) => {

    });
}

module.exports = {sendSms}; 