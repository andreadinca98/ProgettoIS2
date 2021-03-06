//Stefano 
//prova a vedere come si fa il get che ritorna i corsi di INF ORG
const express = require('express');
const usersRoutes = express.Router(); 
const mongoose = require('mongoose');
const Marks = require('../models/mark.js'); 


usersRoutes.get('/', (req,res,next) => {
	Marks
	.find()
	.exec()
	.then(docs => {
		console.log(docs);
		res.status(200).json(docs);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			message: 'Handling GET requests to /marks',
			error: err
		});
	});
});

//Inserisci marks nel DB, andare in body di Postman 
//e aggiungere in linguaggio JSON
usersRoutes.post('/', function (req, res) {	

	const marks = new Marks({
        _id: new mongoose.Types.ObjectId(),
        mark:  req.body.mark,
        studentId:  req.body.studentId,
        teacherId:  req.body.teacherId,
        assignmentId:  req.body.assignmentId				
	});
	
	//.save mette tutto nel DB
	marks
	.save()
	.then(result => {			
		console.log(result);
		res.status(201).json({
			message: 'Handling POST requests to /student',
			createStudent: result
		});
	})
	.catch(err => {
		res.status(500).json({
			message: "Voto non inserito",
			error: err
		});	
	});
});

//Restituisce gli marks con quelli ID
/*usersRoutes.get('/:marksId', (req,res,next) => {	
	const id = req.params.marksId;
	Marks.findById(id)
	.exec()
	.then(doc => {		
		console.log(doc),		
		res.status(200).json(doc)
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			message: "Non è stato trovato il voto",
			error: err
		});
	});
});*/

//average 
usersRoutes.get('/averageM', function (req,res,next){	
	const assignmentid = req.query.assignmentId;
	console.log(assignmentid)
	Marks.find({assignmentId: assignmentid}, function (err, foundMarks) {
		if (err) {
			console.log(err)
			res.status(500).send();
		}
		else {
			var i = 0;
			var avg = 0;
			for(i = 0; i<foundMarks.length; i++){
				avg += foundMarks[i].mark;
			}
			avg = +(avg/i).toFixed(2);
			res.json(avg)
		}
	})
});

//delete
usersRoutes.delete('/:marksId', (req,res,next) => {
	const id = req.params.marksId;
	Marks.remove({_id: id})
	.exec()
	.then(result => {
		res.status(200).json(result);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			message: "Marks rimosso",
			error: err
		})
	});
	
});

//Restituisce gli marks con quelli ID
usersRoutes.get('/:userId', (req,res,next) => {
	console.log('Getting courses for id')
    Marks.find({ $or: [{ studentId: req.params.userId }, { teacherId: req.params.userId }] }, function (err, foundCourses) {
        if (err) {
            console.log(err)
            res.status(500).send();
        }
        else {
			res.status(200).json(foundCourses)

        }
    })
})


module.exports = usersRoutes;
