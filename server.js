//jshint esversion:6
require('dotenv').config();

const mysql =  require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const admin = require('firebase-admin');
const serviceAccount = require("./helpers/serviceAccountKey.json");//Firebase NodeJs linking


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://footbooking-959a6.firebaseio.com"
});

//Check if the user exists in firebase and if exists we create a custom token
app.get('/phone/:phoneID',(req,res)=>{

  const phoneID = req.params.phoneID;
  

  admin.auth().getUserByPhoneNumber(phoneID)
  .then(function(userRecord) {
    const uid = userRecord.uid;
    const expiresIn = 3600;
    
    if(uid){ 
      admin.auth().createCustomToken(uid)
        .then(function(customToken) {
          // Send token back to client
          const expirationDate= new Date(new Date().getTime() + expiresIn * 1000);
          const token= customToken;
          res.send({userRecord:userRecord.toJSON(),token:token,expirationDate:expirationDate});
          console.log('Successfully fetched user data:', userRecord.toJSON());
        })
        .catch(function(error){
          console.log('Error creating custom token:', error);
        });
    }

    
  })
  .catch(function(error) {
    console.log('Error fetching user data:', error);
    res.send({userRecord:error});
  });

});

//Update firebase phone of an existing user

app.patch('/phoneUpdate/:uid',(req,res)=>{
admin.auth().updateUser(req.params.uid, {
  phoneNumber: req.body.phoneNumber,
})
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully updated user', userRecord.toJSON());
  })
  .catch(function(error) {
    console.log('Error updating user:', error);
  });

});

//Delete firebase user
app.delete('/userDelete/:uid',(req,res)=>{

  admin.auth().deleteUser(req.params.uid)
  .then(function() {
    console.log('Successfully deleted user');
  })
  .catch(function(error) {
    console.log('Error deleting user:', error);
  });
});

let con = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password: "",
    database:process.env.DATABASE
  });
//  //CONNECT THE DATABASE
// let con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "tahfifa"
// });

  con.connect( err => {
    if (err) {
      console.log(err);
    }
  });

  /**
   * ************************Barber
  */
 /*
    Add New Barber
 */ 
app.post('/barber/addBarber',(req,res)=>{


  con.query('INSERT INTO barber (id,phone,password,sex,wilaya,region,lang,type) VALUES(?,?,?,?,?,?,?,?)',
  [
    req.body.id,
    req.body.phone,
    req.body.password,
    req.body.sex,
    req.body.wilaya,
    req.body.region,
    true,
    "Barber"
  ]
  ,
  (err,result,fields)=>{
      if(err) console.log('Query error',err);
      res.send("success");
  });

});

/*
  Fetch All Barbers
*/
app.get('/barber',(req,res)=>{
   con.query('SELECT * FROM barber',(err,result,fields)=>{
     if(err) console.log('Query error',err);
    res.send(result);
    
   });
});

/*
Fetch one barber according to his id
*/  
app.get('/barber/:id',(req,res)=>{
  
 
con.query('SELECT barber.id as barberid, barber.phone, barber.password, barber.sex, barber.name as barberName, barber.surname, barber.b_name, CAST(barber.age AS char) as age, barber.email, barber.address, barber.image,barber.mark, barber.wilaya, barber.region,barber.lang,barber.type,service.id,service.name,service.price,service.duration,service.barber_id,worktime.id as workingTimeID,worktime.day,SUBSTRING(worktime.debut,1,5) as debut,SUBSTRING(worktime.finish,1,5) as finish,worktime.isworking,worktime.barber_id FROM barber LEFT JOIN service  on barber.id=service.barber_id LEFT JOIN worktime on barber.id=worktime.barber_id WHERE barber.id=?',
[
  req.params.id
],
(err,result,fields)=>{
  if(err) console.log('Query error',err);
  res.send(result);
  
  console.log(result);
});
});


/*
  Update barber password
*/ 
app.patch('/barber/updatePassword/:id',(req,res)=>{
  
  con.query('UPDATE barber SET password = ? WHERE id= ?',
  [
    req.body.password,
    req.params.id
  ],
  (err,result,fields)=>{
    if(err) console.log('Query error',err);
    res.send("success");
  });
});

/*
  Update Barber phone
*/

app.patch('/barber/updatePhone/:barberid',(req,res)=>{
  
con.query(`UPDATE barber SET id=?,phone=? WHERE id= ?`,
[
  req.body.id,
  req.body.phone,
  req.params.barberid
],
(err,result,fields)=>{
  if(err) console.log('Query error',err);
  res.send("success");
});
});



/*
  Update barber
*/ 
app.patch('/barber/updateBarber/:id',(req,res)=>{
  
con.query('UPDATE barber SET name=?,surname=?,b_name=?,age=?,email=?,address=?,wilaya=?,region=?,image=? WHERE id= ?',
[
  req.body.name,
  req.body.surname,
  req.body.b_name,
  req.body.age,
  req.body.email,
  req.body.address,
  req.body.wilaya,
  req.body.region,
  req.body.image,
  req.params.id
],
(err,result,fields)=>{
  if(err) console.log('Query error',err);
  res.send("success");
  
});
});

/*
  Delete barber
*/
app.delete('/barber/deleteBarber/:id',(req,res)=>{

con.query('DELETE FROM barber WHERE id=?',
[
  req.params.id
],
(err,result,fields)=>{
  if(err) console.log('Query error',err);
  res.send("success");
});

});

/**
   * ************************Service
  */
 /*
    Add New Service
 */ 
app.post('/service/addService',(req,res)=>{

  console.log(req.body.name);
  con.query('INSERT INTO service (name,price,duration,barber_id) VALUES(?,?,?,?)',
  [
    req.body.name,
    req.body.price,
    req.body.duration,
    req.body.barber_id
  ]
  ,
  (err,result,fields)=>{
      if(err) console.log('Query error',err);
      res.send(result);
      
  });

});

/*
  Update service
*/ 
app.patch('/service/updateService/:id',(req,res)=>{
  
  con.query('UPDATE service SET name=?, price=?, duration=? WHERE id= ?',
  [
    req.body.name,
    req.body.price,
    req.body.duration,
    req.params.id
  ],
  (err,result,fields)=>{
    if(err) console.log('Query error',err);
    res.send("success");
    
  });
  });
  
  /*
    Delete service
  */
  app.delete('/service/deleteService/:id',(req,res)=>{
  
  con.query('DELETE FROM service WHERE id=?',
  [
    req.params.id
  ],
  (err,result,fields)=>{
    if(err) console.log('Query error',err);
    res.send("success");
  });
  
  });




 /***********************************************************************/
   //Bookings MAnipulations
  /***********************************************************************/
   //Bookings MAnipulations
//GET THE CLIENT'S BOOKINGS Top Display for the Barber

app.get("/barberBookings/:barberId",(req,res)=>{
  // clientbookings
    const barberId = req.params.barberId;

    const query = "SELECT booking.id,booking.amount , booking.id ,CAST(booking.date AS char) as date,CAST(booking.date_booking AS char) as bookingDate,SUBSTRING(booking.start,1,5) as start,SUBSTRING(booking.end,1,5)as end,booking.client_id as clientId,booking.barber_id as barberId , booking.status, booking.duration as bookingDuration , booking.address,booking.region,booking.wilaya,service.name , service.price , service.duration  as serviceDuration from booking INNER JOIN composition on composition.booking_id = booking.id  INNER JOIN service on  service.id = composition.service_id WHERE booking.barber_id = ? "
    
    con.query(query,[barberId],(err,result,fields)=>{
        if(err) res.send(err);
 
     
        res.send(result);
    });

    });

 
//Cancel Manually a Booking throught the booking Detail 
app.patch("/bookings/changebooking",(req,res)=>{
 
    con.query("UPDATE booking SET status = ? WHERE  booking.id= ? ",[req.body.type,req.body.id],
    (err,result,fields)=>{ 
  
    if (err) {
      res.send(err);
    } else {
      res.send("Success");
    }
    
  });
   
  });
  
  //CANCEL EXPIRED BOOKINGS
    
  app.patch("/bookings/expiredbookings",(req,res)=>{
     con.query("UPDATE booking SET status = 'expirée' WHERE  SUBSTRING(date_booking,1,10)  = SUBSTRING(NOW(),1,10) AND booking.barber_id = ? AND status = 'en attente'  AND CURRENT_TIMESTAMP > start OR SUBSTRING(date_booking,1,10)  <  SUBSTRING(NOW(),1,10)  AND booking.barber_id = ? AND status = 'en attente' ",[req.body.clientId,req.body.clientId],
     (err,result,fields)=>{ 
   
     if (err) {
       console.log(err)
       res.send(err);
     } else {
  
       res.send("Success");
     }
     
   });
   
   });





     //GET THE CLIENT'S BOOKING Information
     app.get("/client/clientinfos/:clientId",(req,res)=>{

      const clientId = req.params.clientId;
      
      const query = "SELECT booking.address ,booking.wilaya ,booking.region,client.name,client.surname,client.phone from booking INNER JOIN client on client.id = booking.client_id  WHERE booking.client_id = ? "
      
      con.query(query,[clientId],(err,result,fields)=>{
          if(err) res.send(err);
      
          res.send(result);
      
      });
      
      
      
      });
/***********************************************************************/

  /**
   * ************************Worktime
  */
 /*
    Add New Worktime
 */ 
app.post('/worktime/addWorktime',(req,res)=>{

  let values = [];
 
  values.push(['Samedi',null,null,false,req.body.barber_id],['Dimanche',null,null,false,req.body.barber_id],
              ['Lundi',null,null,false,req.body.barber_id],['Mardi',null,null,false,req.body.barber_id],
              ['Mercredi',null,null,false,req.body.barber_id],['Jeudi',null,null,false,req.body.barber_id],
              ['Vendredi',null,null,false,req.body.barber_id]);
      
  con.query('INSERT INTO worktime (day,debut,finish,isworking,barber_id) VALUES ?',
  [values]
  ,
  (err,result,fields)=>{
      if(err) console.log('Query error',err);
      res.send("success");
  });

});


/*
  Update worktime
*/ 
app.patch('/worktime/updateWorktime/:barber_id',(req,res)=>{
  


con.query("UPDATE worktime SET isworking=(CASE WHEN day='Samedi' then ? WHEN day='Dimanche' then ? WHEN day='Lundi' then ? WHEN day='Mardi' then ? WHEN day='Mercredi' then ? WHEN day='Jeudi' then ? WHEN day='Vendredi' then ? end), debut=(CASE WHEN day='Samedi' then ?  WHEN day='Dimanche' then ? WHEN day='Lundi' then ? WHEN day='Mardi' then ? WHEN day='Mercredi' then ? WHEN day='Jeudi' then ? WHEN day='Vendredi' then ? end), finish=(CASE WHEN day='Samedi' then ?  WHEN day='Dimanche' then ? WHEN day='Lundi' then ? WHEN day='Mardi' then ? WHEN day='Mercredi' then ? WHEN day='Jeudi' then ? WHEN day='Vendredi' then ? end) WHERE barber_id=?",
[
  
  req.body.isworkingSat,
  req.body.isworkingSun,
  req.body.isworkingMon,
  req.body.isworkingTue,
  req.body.isworkingWed,
  req.body.isworkingThu,
  req.body.isworkingFri,
  req.body.debutSat,
  req.body.debutSun,
  req.body.debutMon,
  req.body.debutTue,
  req.body.debutWed,
  req.body.debutThu,
  req.body.debutFri,
  req.body.finishSat,
  req.body.finishSun,
  req.body.finishMon,
  req.body.finishTue,
  req.body.finishWed,
  req.body.finishThu,
  req.body.finishFri,
  req.params.barber_id
  
],(err,result,fields)=>{
    if(err) console.log('Query error',err);
    res.send("success");
    console.log(result);
  });
});
  




// Starting our server.
app.listen(3000, () => {
    console.log('Connected');
   });  