const User = require('../model/User');
const Team = require('../model/Team');
const Player = require('../model/Player');
const validator = require('validator');

const handelTeamPlayers =  async (req, res) => {

    const user_details = await User.findOne( {email: req.email}).exec();

    const player = await Player.find({team_id: user_details.team_id});
 
    res.status(200).json({message: "success", data: player, user_details});
}

const handelGetAllPlayers =  async (req, res) => {
    const player = await Player.find(); 
    res.status(200).json({message: "success", data: player});
}

const handelNewPlayer =  async (req, res) => {
    const { firstname, lastname, othername, position, dob, picture, special_role, id_number, id_tag, phonenumber, email, height, weight, team_level } = req.body;
    if( 
        !firstname || !lastname || !othername || !position || !dob || !picture || !special_role 
        || !id_number || !id_tag || !phonenumber || !email || !height || !weight || !team_level
    ) return res.status(400).json({"message" : 'All data is required',  "code": "1"});

    const email_check = await Player.findOne( {email: email}).exec();

    if(email_check) return res.status(400).json( {"message": "Player with email already exist"});

    const id_check = await Player.findOne( {id_number: id_number}).exec();

    if(id_check) return res.status(400).json({"message": "Player with ID is already exists"});

    const user_details = await User.findOne( {email: req.email}).exec();

    if(!user_details.team_id || !user_details.team) res.status(400).json({"message": "No team available"});

    try {
        // create and store new user
        const playerResult = await Player.create({
            firstname, lastname, othername, position, dob, picture, special_role : special_role.name, 
            id_number, id_tag, phonenumber, email, height, weight, 
            team_id: user_details.team_id, team_name: user_details?.team, team_level: team_level.name
        });

      
        res.status(201).json({'success' : `New player ${firstname} created`});

    } catch (err) {
        res.status(500).json({'message error' : "An error ahs occurred"});
    }
}

const handleDeletePlayer = async (req, res) => {

    if(!req?.body?.id ) {
        return res.status(400).json({ 'message' : 'All parameters are required'});
    }

    try {
        const playerFind = await Player.findOne({_id: req?.body?.id}).exec();

        if (!playerFind) {
            return res.status(400).json({ "message": `Player no longer exist` });
        }

        // get team manager details

        const manager_details = await User.findOne({email : req.email});

        if(manager_details.team_id !== playerFind.team_id)
        return res.status(400).json({ "message": "Not authorized"});        
        
        const result = await playerFind.deleteOne({_id: req.body.id});

        res.status(200).json({ 'success' : `Player has been deleted successfully`, manager_details });
        
    } catch (error) {
        return res.status(400).json({ "message": `Player does not exist` , error});
    }

}

const handleEditPlayer =  async (req, res) => {
    const { firstname, lastname, othername, position, dob, picture, special_role, id_number, id_tag, phonenumber, email, height, weight, team_level, _id } = req.body;
    if( 
        !firstname || !lastname || !othername || !position || !dob || !picture || !special_role 
        || !id_number || !id_tag || !phonenumber || !email || !height || !weight || !team_level || !_id
    ) return res.status(400).json({"message" : 'All data is required',  "code": "1"});

    //  check if player still exists
    const player_check = await Player.findOne( {_id: _id}).exec();

    if(!player_check) return res.status(400).json( {"message": "Player does not exist"});

    const email_check = await Player.findOne( {email: email}).exec();

    if(email_check && email_check._id != _id) return res.status(400).json( {"message": "Email has already been registered"});

    const id_check = await Player.findOne( {id_number: id_number}).exec();

    if(id_check && id_check._id !=_id) return res.status(400).json({"message": "Player with ID is already exists"});

    const user_details = await User.findOne( {email: req.email}).exec();

    if(!user_details.team_id || !user_details.team) res.status(400).json({"message": "No team available"});

    try {
        player_check.firstname =  firstname, 
        player_check.lastname = lastname, 
        player_check.othername = othername, 
        player_check.position = position, 
        player_check.dob = dob, 
        player_check.picture = picture, 
        player_check.special_role = special_role.name, 
        player_check.id_number = id_number, 
        player_check.id_tag = id_tag, 
        player_check.phonenumber = phonenumber, 
        player_check.email = email, 
        player_check.height = height, 
        player_check.weight = weight, 
        player_check.team_id = user_details.team_id, 
        player_check.team_name = user_details?.team, 
        player_check.team_level = team_level.name

        player_check.save();

        res.status(201).json({'success' : `Player edited succesfully`});

    } catch (err) {
        res.status(500).json({'message error' : "An error ahs occurred"});
    }
}

module.exports = { handelNewPlayer, handelGetAllPlayers, handelTeamPlayers, handleEditPlayer, handleDeletePlayer };