const express = require('express');
const bodyParser = require('body-parser');
const exec = require("child_process").exec; 

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(bodyParser.raw());
app.post('/parser', (req, res) => {
    var name=req.body.name;
    var var_obj=req.body.var_obj;
    var filename=req.body.filename;
    var codes=req.body.text;
    

    console.log('Got body:', req.body);
    Parser(codes,name,var_obj,filename);
    // res.sendStatus(200);
    cmd = name + ' ' + 'temp'+filename   //command to run script

    exec(cmd, (error, stdout, stderr) => {
        if (stderr) res.send({status:'fail', error:stderr})
        res.send({status:'success', output:stdout})
    })
   
});



var fs = require('fs'); 

function Parser(codes,name,var_obj,filename){
    switch(name)
    {
    case 'node':
        
            // console.log(codes);
        if(codes.includes('require') || codes.includes('import') || codes.includes('export') || codes.includes('process'))
                  throw new Error(' contains invalid statements')
        else
        {   
            console.log('javascript');
            var keys = Object.keys(var_obj);
            var result;
            for (var key of keys) {
                var regex=new RegExp('(\\'+key+'*)','g');
            
                codes = codes.replace(regex, var_obj[key]);
            }
            var imports1=` require('underscore');const { sqrt } = require('mathjs')`;
            fs.writeFile('temp'+filename,imports1+ codes, (err) => {
                if (err) throw err;
                console.log('file saved!');
            });
         }
          
        break;
        
    
    case 'python':
    
            // console.log(codes);
          if(codes.includes('import') || codes.includes('sys')||codes.includes('open')||codes.includes('.read')||codes.includes('.write')||codes.includes('.close')||codes.includes('compile()'||codes.includes('input()'))|| codes.includes('detach()')|| codes.includes('fileno()')|| codes.includes('flush()')|| codes.includes('isatty()')|| codes.includes('readable()')|| codes.includes('readline()')|| codes.includes('readlines()')|| codes.includes('seek')|| codes.includes('seekable')|| codes.includes('tell()')|| codes.includes('truncate()')|| codes.includes('writeable()')|| codes.includes('write')|| codes.includes('writelines()'))
            throw new Error(' contains invalid statements')
        else
            {   
                console.log('python');
                var keys = Object.keys(var_obj);
                var result;
                for (var key of keys) {
                    var regex=new RegExp('(\\'+key+'*)','g');
                
                    codes = codes.replace(regex, var_obj[key]);
                }
                var imports2=`import numpy`+'\n'+'import json'+'\n'+'import datetime'+'\n'+'import math'+'\n'+'import re'
                fs.writeFile('temp'+filename,imports2+ codes, (err) => {
                    if (err) throw err;
                    console.log('file saved!');
                });

             }
              
            break;

    case 'php':
       
                // console.log(codes);
        if(codes.includes('include') || codes.includes('require') || codes.includes('require_once'))
            throw new Error(' contains invalid statements')
        else
            {   
                console.log('php');
                var keys = Object.keys(var_obj);
                var result;
                for (var key of keys) {
                    var regex=new RegExp('(\\'+key+'*)','g');
                
                    codes = codes.replace(regex, var_obj[key]);
                }
                fs.writeFile('temp'+filename, codes, (err) => {
                    if (err) throw err;
                    console.log('file saved!');
                });
             }
              
            break;
    }

        }

function deleteFile(filename){
fs.unlink(filename, function(err) {
  if (err) {
    throw err
  } else {
    console.log("Successfully deleted the file.")
  }
}

// app.use(bodyParser.raw());

app.listen(8080, () => console.log(`Started server at http://localhost:8080`));
