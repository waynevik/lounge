const User = require('../model/User');
const Team = require('../model/Team');
var mongoose = require('mongoose');

const handelGetTeams =  async (req, res) => {
    const teams = await Team.find();

    const tTeams = teams.map( (team, index) => {
        return {
            name: team.name,
            logo: team.logo,
            teamManager: team.teamManager,
            id: team._id,
            no: index+1,
            tm_name: team.tm_name
        };
    })
 
    res.status(200).json({message: "success", data: tTeams});
}

const handelNewTeam =  async (req, res) => {
    const { name, logo, teamManager } = req.body;

    if( !name || !logo || !teamManager ) return res.status(400).json({"message" : 'All data is required',  "code": "1"});  

    const teamManager_details = await User.findOne( {email: teamManager}).exec();

    if(!teamManager_details) return res.status(400).json( {"message": "team manager not found"});
     
    const team_details = await Team.findOne( {teamManager: teamManager}).exec();

    if(team_details) return res.status(400).json( {"message": "User has already been assigned to another team"});

    const duplicate =  await Team.findOne({ name: name}).exec();
    if(duplicate) return res.sendStatus(409); // conflict

    try {
        // create and store new user
        const teamResult = await Team.create({
             name : name, 
             logo :  logo,
             teamManager: teamManager,
             tm_name:  `${teamManager_details.lastname} ${teamManager_details.firstname}`,
             tm_id: teamManager_details._id
        });

        teamManager_details.team = name;
        teamManager_details.team_id = teamResult._id;
        
        await teamManager_details.save();
      
        res.status(201).json({'success' : `New team ${name} created`});

    } catch (err) {
        res.status(500).json({'message error' : err.message});
    }
}

const handelEditTeam =  async (req, res) => {
    const { name, logo, teamManager, id } = req.body;

    // check if all data is given
    if( !name || !logo || !teamManager || !id ) return res.status(400).json({"message" : 'All data is required',  "code": "1"});  

    //  check if user exists
    const teamManager_details = await User.findOne( {email: teamManager}).exec();

    if(!teamManager_details) return res.status(400).json( {"message": "team manager not found"});

    //  check if user has team manager role
    if(teamManager_details.role !== 1984 ) return res.status(400).json( {"message": "User does not have Team Manager role"});

    var objectId = new mongoose.Types.ObjectId(id);

    //  check if team exists 
    const team_details = await Team.findOne( {_id: objectId}).exec();

    if(!team_details) return res.status(400).json( {"message": "Team no longer exists"});
    
    // check if manager has been assigned to another team
    // const manager_assign = await Team.findOne( {teamManager: teamManager}).exec();
    // if( manager_assign && manager_assign.teamManager !== team_details.teamManager) {

    //     return res.status(400).json( {"message": "Team manager has already been assigned to another team"});
    // }

    try {
        teamManager_details.team = name;
        teamManager_details.team_id = team_details._id;
        
        team_details.name = name;
        team_details.teamManager = teamManager_details.email;
        team_details.tm_name = teamManager_details.firstname +" "+teamManager_details.lastname;
        team_details.tm_id = tea
        await teamManager_details.save();
      
        res.status(201).json({'success' : `Team ${name} edited succesfully`, team_details});

    } catch (err) {
        res.status(500).json({'message error' : err.message});
    }
}

const handleDeleteTeam = async( req, res ) => {

    if(!req?.body?.name ) {
        return res.status(400).json({ 'message' : 'All parameters are required'});
    }

    try {
        const teamFind = await Team.findOne({name: req?.body?.name}).exec();

        if (!teamFind) {
            return res.status(400).json({ "message": `Team no longer exist` });
        }

        const manager_details = await User.findOne({email : teamFind.teamManager});

        manager_details.team = 'none';
        manager_details.team_id = 'none';
        await manager_details.save();
        
        const result = await teamFind.deleteOne({name: req.body.name});

        res.status(200).json({ 'success' : `Team has been deleted successfully` });
        
    } catch (error) {
        return res.status(400).json({ "message": `Team does not exist` , error});
    }

}

module.exports = { handelNewTeam, handelGetTeams, handelEditTeam, handleDeleteTeam };