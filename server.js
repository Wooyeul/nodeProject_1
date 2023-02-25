const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var db;
MongoClient.connect('mongodb+srv://chowy1:dnduf9468!@cluster0.cmdiweb.mongodb.net/?retryWrites=true&w=majority', {useUnifiedTopology:true}, function(err,client){
    if(err) return console.log(err);
    db = client.db('todoapp');
    app.listen(8080, function(){
        console.log('listening on 8080')
    });
});

app.get('/', function(req, res){
    res.render('index.ejs');
});

app.get('/write', function(req, res) { 
    res.render('write.ejs');
    // res.sendFile(__dirname +'/views/write.ejs');
});

app.post('/add', function(req, res) { 
    res.send('전송완료.');
    console.log(req.body);

    db.collection('counter').findOne({name: '게시물갯수'}, function(err, result){
        console.log(result);
        var totalPostValue = result.totalPost;

        db.collection('post').insertOne({_id: totalPostValue + 1, 제목 : req.body.title, 날짜: req.body.date}, function(err, result){
            console.log('저장완료');

            db.collection('counter').updateOne({name:'게시물갯수'}, {$inc : {totalPost:1}}, function(err, result){
                
            });
        });
    });
});

app.get('/list', function(req, res){
    db.collection('post').find().toArray(function(err, result){
        console.log(result)
        res.render('list.ejs', {posts : result});
    });
});

app.delete('/delete', function(req, res){
    console.log(req.body);
    req.body._id = parseInt(req.body._id);
    
    db.collection('post').deleteOne(req.body, function(err, result){
        console.log('삭제완료');
        res.status(200).send({message : '성공했습니다'});
    });
});

app.get('/detail/:id', function(req, res){
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result){
        console.log('상세페이지')
        res.render('detail.ejs', {data : result});
    });
});