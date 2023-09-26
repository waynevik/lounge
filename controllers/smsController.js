const School = require('../model/School');
const User = require('../model/User');
const axios = require('axios');

const sendSms = async (req, res) => {
 
  try {
    if(
      !req?.body?.data ||  !req?.body?.values
  )
    return res.status(400).json({'message' : 'All data is required!'});
  const school_details = await User.findOne( {email: req.email}).exec();
  if(!school_details)
      return res.status(400).json( {"message": "school_not found"});

  const school = await School.findOne( {_id: school_details.school_id}).exec();

  if(req.body.values > school.messages.balance)
  return res.status(400).json({"message": "Not enough messages"});

  school.messages.balance -= req.body.values;
  school.messages.totalSent += req.body.values;
  await school.save();

  req.body.data.map( (messageBody, index) => {

      if(!messageBody.message || !messageBody.number || !messageBody.tag || !messageBody.tag_id )
      return;
      // sendSmsToParent(messageBody.number, messageBody.message, school.sms);
      // school.messages.sent.push({
      //     message: messageBody.message,
      //     phone_number: messageBody.number,
      //     num: messageBody.num ,
      //     tag: messageBody.tag ,
      //     tag_id: messageBody.tag_id 
      //   });

      });

    school.save();

  res.status(200).json({"message": "messages sent succesfully", tag: "smsSent"});

    } catch (error) {
      res.status(400).json({"message": "An error has occured "});      
    }
}

const getSmsSent = async (req, res) => {

  const school_details = await User.findOne( {email: req.email}).exec();
  if(!school_details)
      return res.status(400).json( {"message": "school_not found"});

  const school = await School.findOne( {_id: school_details.school_id}).exec();
  return res.status(200).json({"message": "Success", "tag": "smsSent", "data": school?.messages?.sent.reverse()});
}


function validateMessages(data, values){

}



function sendSmsToParent(phone_number, message, sender){
    const postData = 
    {
        "data": [
          {
            "message_bag": {
              "numbers": phone_number,
              "message": message,
              "sender": sender
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

module.exports = {sendSms, getSmsSent}; 